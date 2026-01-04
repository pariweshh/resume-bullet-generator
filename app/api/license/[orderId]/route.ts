import { NextRequest, NextResponse } from "next/server"
import { getLicenseByOrderId, getLicense } from "@/lib/redis"
import { getErrorMessage } from "@/lib/utils"

/**
 * GET /api/license/[orderId]
 *
 * Retrieves license key and details by order ID.
 * Used by the success page to display the license after purchase.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
): Promise<NextResponse> {
  try {
    const { orderId } = await params

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      )
    }

    // Look up license key by order ID
    const licenseKey = await getLicenseByOrderId(orderId)

    if (!licenseKey) {
      return NextResponse.json(
        { error: "License not found", found: false },
        { status: 404 }
      )
    }

    // Get full license details
    const license = await getLicense(licenseKey)

    if (!license) {
      return NextResponse.json(
        { error: "License data not found", found: false },
        { status: 404 }
      )
    }

    return NextResponse.json({
      found: true,
      licenseKey,
      tier: license.tier,
      email: license.email,
    })
  } catch (error) {
    console.error("Error fetching license by order:", getErrorMessage(error))
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
