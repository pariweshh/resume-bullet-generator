import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { generateCompletion, validateInput } from "@/lib/openai"
import {
  SYSTEM_PROMPT,
  createUserPrompt,
  parseBulletPoints,
} from "@/lib/prompts"
import {
  getUsageCount,
  incrementUsage,
  trackDailyGeneration,
  FREE_TIER,
  PAID_TIERS,
} from "@/lib/redis"
import { validateLicenseKey } from "@/lib/lemonsqueezy-license"
import {
  validateRequest,
  generateRequestSchema,
  createErrorResponse,
  ERRORS,
  type GenerateResponse,
} from "@/lib/validation"
import { getErrorMessage } from "@/lib/utils"

/**
 * Rate limiting: Track requests per IP to prevent abuse.
 * Simple in-memory store (resets on server restart).
 * For production scale, use Redis-based rate limiting.
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = {
  maxRequests: 10, // Max requests per window
  windowMs: 60 * 1000, // 1 minute window
}

/**
 * Checks if the request should be rate limited.
 */
function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT.windowMs })
    return false
  }

  if (record.count >= RATE_LIMIT.maxRequests) {
    return true
  }

  record.count++
  return false
}

/**
 * Gets client IP address from request headers.
 */
async function getClientIp(): Promise<string> {
  const headersList = await headers()

  // Check common proxy headers
  const forwardedFor = headersList.get("x-forwarded-for")
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs; take the first one
    return forwardedFor.split(",")[0]?.trim() ?? "unknown"
  }

  const realIp = headersList.get("x-real-ip")
  if (realIp) {
    return realIp
  }

  // Vercel-specific header
  const vercelForwardedFor = headersList.get("x-vercel-forwarded-for")
  if (vercelForwardedFor) {
    return vercelForwardedFor
  }

  return "unknown"
}

/**
 * POST /api/generate
 *
 * Generates resume bullet points based on job description and experience.
 *
 * Request body:
 * - jobDescription: string (50-8000 chars)
 * - experience: string (20-4000 chars)
 * - licenseKey?: string (optional, for paid users)
 *
 * Response:
 * - 200: { bullets: string[], remaining: number, tier: string }
 * - 400: Validation error
 * - 402: Payment required (limit reached)
 * - 429: Rate limited
 * - 500: Server error
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Get client IP for rate limiting and usage tracking
    const clientIp = await getClientIp()

    // Check rate limit
    if (isRateLimited(clientIp)) {
      return NextResponse.json(ERRORS.RATE_LIMITED, { status: 429 })
    }

    // Parse and validate request body
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        createErrorResponse("VALIDATION_ERROR", "Invalid JSON in request body"),
        { status: 400 }
      )
    }

    const validation = validateRequest(generateRequestSchema, body)
    if (!validation.success || !validation.data) {
      return NextResponse.json(
        createErrorResponse(
          "VALIDATION_ERROR",
          validation.error ?? "Invalid request"
        ),
        { status: 400 }
      )
    }

    const { jobDescription, experience, licenseKey } = validation.data

    // Additional input validation (length checks beyond Zod)
    const inputValidation = validateInput(jobDescription, experience)
    if (!inputValidation.isValid) {
      return NextResponse.json(
        createErrorResponse(
          "VALIDATION_ERROR",
          inputValidation.error ?? "Invalid input"
        ),
        { status: 400 }
      )
    }

    // Determine user tier and check limits
    let tier: "free" | "basic" | "lifetime" = "free"
    let remaining: number
    let identifier = clientIp

    if (licenseKey) {
      // Paid user: validate license with LemonSqueezy
      const licenseStatus = await validateLicenseKey(licenseKey)

      if (!licenseStatus.isValid || !licenseStatus.tier) {
        return NextResponse.json(ERRORS.INVALID_LICENSE, { status: 402 })
      }

      // Check if license is in a usable state
      const invalidStatuses = ["expired", "disabled", "revoked"]
      if (invalidStatuses.includes(licenseStatus.status.toLowerCase())) {
        return NextResponse.json(
          createErrorResponse(
            "INVALID_LICENSE",
            `License is ${licenseStatus.status}`
          ),
          { status: 402 }
        )
      }

      tier = licenseStatus.tier
      identifier = licenseKey

      // Get usage from Redis for basic tier
      if (tier === "basic") {
        const used = await getUsageCount(licenseKey)
        const maxGenerations = PAID_TIERS.basic.generations
        remaining = Math.max(0, maxGenerations - used)

        if (remaining <= 0) {
          return NextResponse.json(
            createErrorResponse(
              "LIMIT_REACHED",
              "You've used all 50 generations. Upgrade to Lifetime for unlimited access."
            ),
            { status: 402 }
          )
        }
      } else {
        remaining = 999 // Lifetime
      }
    } else {
      // Free user: check usage limit
      const usageCount = await getUsageCount(clientIp)

      if (usageCount >= FREE_TIER.maxGenerations) {
        return NextResponse.json(ERRORS.LIMIT_REACHED, { status: 402 })
      }

      remaining = FREE_TIER.maxGenerations - usageCount - 1 // -1 for current request
    }

    // Generate bullet points using OpenAI
    const messages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      {
        role: "user" as const,
        content: createUserPrompt(jobDescription, experience),
      },
    ]

    let generatedContent: string
    try {
      generatedContent = await generateCompletion(messages)
    } catch (error) {
      console.error("OpenAI generation error:", getErrorMessage(error))
      return NextResponse.json(ERRORS.GENERATION_FAILED, { status: 500 })
    }

    // Parse the generated content into bullet points
    const bullets = parseBulletPoints(generatedContent)

    if (bullets.length === 0) {
      console.error("No bullets parsed from response:", generatedContent)
      return NextResponse.json(ERRORS.GENERATION_FAILED, { status: 500 })
    }

    // Update usage tracking
    if (licenseKey && tier !== "free") {
      // For paid users, track by license key
      await incrementUsage(licenseKey, true) // true = no expiry
      // Recalculate remaining for paid users
      if (tier === "lifetime") {
        remaining = 999
      } else {
        remaining = Math.max(0, remaining - 1)
      }
    } else {
      // For free users, track by IP
      await incrementUsage(identifier, false)
    }

    // Track daily stats (fire and forget)
    trackDailyGeneration().catch(console.error)

    // Build response
    const response: GenerateResponse = {
      bullets,
      remaining: tier === "lifetime" ? 999 : remaining, // Use 999 for "unlimited" in JSON
      tier,
    }

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Cache-Control": "no-store", // Never cache generation responses
      },
    })
  } catch (error) {
    console.error("Unexpected error in /api/generate:", getErrorMessage(error))
    return NextResponse.json(ERRORS.INTERNAL_ERROR, { status: 500 })
  }
}

/**
 * Handle unsupported methods.
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    createErrorResponse("VALIDATION_ERROR", "Method not allowed. Use POST."),
    { status: 405 }
  )
}
