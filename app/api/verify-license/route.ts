import { NextRequest, NextResponse } from "next/server"
import { checkLicenseValidity, getLicense } from "@/lib/redis"
import {
  validateRequest,
  verifyLicenseSchema,
  createErrorResponse,
  type LicenseStatus,
} from "@/lib/validation"
import { getErrorMessage } from "@/lib/utils"

/**
 * POST /api/verify-license
 *
 * Verifies a license key and returns its status.
 * Used by the frontend to check if a stored license is still valid.
 *
 * Request body:
 * - licenseKey: string
 *
 * Response:
 * - 200: { isValid: boolean, tier: string | null, remaining: number, email?: string }
 * - 400: Validation error
 * - 500: Server error
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
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

    const validation = validateRequest(verifyLicenseSchema, body)
    if (!validation.success || !validation.data) {
      return NextResponse.json(
        createErrorResponse(
          "VALIDATION_ERROR",
          validation.error ?? "Invalid request"
        ),
        { status: 400 }
      )
    }

    const { licenseKey } = validation.data

    // Check license validity
    const validity = await checkLicenseValidity(licenseKey)

    // Get additional license info if valid
    let email: string | undefined
    if (validity.isValid) {
      const license = await getLicense(licenseKey)
      email = license?.email
    }

    // Build response
    const response: LicenseStatus = {
      isValid: validity.isValid,
      tier: validity.tier,
      remaining: validity.remaining,
      ...(email && { email }),
    }

    return NextResponse.json(response, {
      status: 200,
      headers: {
        // Cache for 1 minute to reduce Redis calls on repeated checks
        "Cache-Control": "private, max-age=60",
      },
    })
  } catch (error) {
    console.error("License verification error:", getErrorMessage(error))
    return NextResponse.json(
      createErrorResponse("INTERNAL_ERROR", "Failed to verify license"),
      { status: 500 }
    )
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
