import { NextRequest, NextResponse } from "next/server"
import { validateLicenseKey } from "@/lib/lemonsqueezy-license"
import { getUsageCount, PAID_TIERS } from "@/lib/redis"
import { getErrorMessage } from "@/lib/utils"

/**
 * POST /api/verify-license
 *
 * Verifies a license key using LemonSqueezy's API.
 * Returns tier, validity, and remaining generations.
 *
 * Request body:
 * - licenseKey: string
 *
 * Response:
 * - isValid: boolean
 * - tier: "basic" | "lifetime" | null
 * - remaining: number
 * - email?: string
 * - error?: string
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse request body
    let body: { licenseKey?: string }
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { isValid: false, error: "Invalid JSON in request body" },
        { status: 400 }
      )
    }

    const { licenseKey } = body

    if (!licenseKey || typeof licenseKey !== "string") {
      return NextResponse.json(
        { isValid: false, error: "License key is required" },
        { status: 400 }
      )
    }

    const trimmedKey = licenseKey.trim()

    // Validate with LemonSqueezy API
    const validation = await validateLicenseKey(trimmedKey)

    if (!validation.isValid) {
      return NextResponse.json(
        {
          isValid: false,
          error: validation.error || "Invalid license key",
        },
        { status: 400 }
      )
    }

    // Check if license is in a usable state
    const invalidStatuses = ["expired", "disabled", "revoked"]

    if (invalidStatuses.includes(validation.status.toLowerCase())) {
      return NextResponse.json(
        {
          isValid: false,
          error: `License is ${validation.status}`,
        },
        { status: 400 }
      )
    }

    // In production, only allow active licenses (reject test mode keys)
    // Test mode keys have status "inactive" and testMode: true
    if (validation.status === "inactive" && !validation.testMode) {
      return NextResponse.json(
        {
          isValid: false,
          error: "License is inactive",
        },
        { status: 400 }
      )
    }

    // Optionally: Block test mode keys in production
    // Uncomment this when you go live:
    // if (validation.testMode && process.env.NODE_ENV === "production") {
    //   return NextResponse.json(
    //     {
    //       isValid: false,
    //       error: "Test licenses are not valid in production",
    //     },
    //     { status: 400 }
    //   );
    // }

    // Calculate remaining generations
    let remaining = 999 // Default for lifetime

    if (validation.tier === "basic") {
      // Get usage count from Redis
      const used = await getUsageCount(trimmedKey)
      const maxGenerations = PAID_TIERS.basic.generations
      remaining = Math.max(0, maxGenerations - used)
    }

    // Return success response
    return NextResponse.json(
      {
        isValid: true,
        tier: validation.tier,
        remaining,
        email: validation.email,
      },
      {
        headers: {
          // Cache for 1 minute to reduce API calls
          "Cache-Control": "private, max-age=60",
        },
      }
    )
  } catch (error) {
    console.error("License verification error:", getErrorMessage(error))
    return NextResponse.json(
      { isValid: false, error: "Verification failed" },
      { status: 500 }
    )
  }
}

/**
 * Handle unsupported methods.
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { isValid: false, error: "Method not allowed. Use POST." },
    { status: 405 }
  )
}
