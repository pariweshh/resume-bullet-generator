import { NextRequest, NextResponse } from "next/server"
import { verifyWebhookSignature, parseWebhookPayload } from "@/lib/lemonsqueezy"
import { trackDailyGeneration } from "@/lib/redis"
import { getErrorMessage } from "@/lib/utils"

/**
 * POST /api/webhook
 *
 * Handles incoming webhooks from LemonSqueezy.
 *
 * Since we're using LemonSqueezy's built-in license key generation,
 * this webhook is mainly for:
 * - Logging purchases for analytics
 * - Handling refunds (future: invalidate license)
 *
 * Webhook setup in LemonSqueezy:
 * 1. Go to Settings → Webhooks
 * 2. Add endpoint: https://yourdomain.com/api/webhook
 * 3. Select events: order_created, order_refunded
 * 4. Copy the signing secret to LEMONSQUEEZY_WEBHOOK_SECRET
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Get the raw body for signature verification
    const rawBody = await request.text()

    // Get the signature header
    const signature = request.headers.get("x-signature")

    if (!signature) {
      console.error("Webhook received without signature")
      return NextResponse.json({ error: "Missing signature" }, { status: 401 })
    }

    // Verify the webhook signature
    if (!verifyWebhookSignature(rawBody, signature)) {
      console.error("Webhook signature verification failed")
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    // Parse the webhook payload
    const payload = parseWebhookPayload(rawBody)

    if (!payload) {
      console.error("Failed to parse webhook payload")
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    const { meta, data } = payload
    const eventName = meta.event_name

    console.log(`Processing webhook event: ${eventName}`, {
      orderId: data.id,
      email: data.attributes.user_email,
    })

    // Handle different event types
    switch (eventName) {
      case "order_created":
        await handleOrderCreated(data)
        break

      case "order_refunded":
        await handleOrderRefunded(data)
        break

      default:
        console.log(`Unhandled webhook event: ${eventName}`)
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error("Webhook processing error:", getErrorMessage(error))

    // Return 500 so LemonSqueezy retries
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * Handles the order_created event.
 * Logs the purchase for analytics.
 *
 * LemonSqueezy handles license key generation and emailing to customer.
 */
async function handleOrderCreated(
  data: NonNullable<ReturnType<typeof parseWebhookPayload>>["data"]
): Promise<void> {
  const { attributes } = data

  // Only process paid orders
  if (attributes.status !== "paid") {
    console.log(`Skipping order ${data.id} with status: ${attributes.status}`)
    return
  }

  console.log(`✅ New purchase:`, {
    orderId: data.id,
    email: attributes.user_email,
    total: attributes.total,
    variantId: attributes.first_order_item.variant_id,
  })

  // Track for analytics (optional)
  await trackDailyGeneration().catch(console.error)
}

/**
 * Handles the order_refunded event.
 * Logs the refund for manual review.
 *
 * Future: Could call LemonSqueezy API to revoke the license key.
 */
async function handleOrderRefunded(
  data: NonNullable<ReturnType<typeof parseWebhookPayload>>["data"]
): Promise<void> {
  console.log(`⚠️ Order refunded: ${data.id}`, {
    email: data.attributes.user_email,
    total: data.attributes.total,
  })

  // For MVP, refunds are handled manually via LemonSqueezy dashboard
  // The license can be disabled in LemonSqueezy's interface
}

/**
 * Handle unsupported methods.
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
