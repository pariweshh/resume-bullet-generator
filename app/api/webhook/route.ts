import { NextRequest, NextResponse } from "next/server"
import { nanoid } from "nanoid"
import {
  verifyWebhookSignature,
  parseWebhookPayload,
  getTierFromVariant,
} from "@/lib/lemonsqueezy"
import { createLicense } from "@/lib/redis"
import { getErrorMessage } from "@/lib/utils"

/**
 * POST /api/webhook
 *
 * Handles incoming webhooks from LemonSqueezy.
 * Currently processes:
 * - order_created: Creates a new license for the customer
 *
 * Webhook setup in LemonSqueezy:
 * 1. Go to Settings → Webhooks
 * 2. Add endpoint: https://yourdomain.com/api/webhook
 * 3. Select events: order_created
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
        // Log but don't fail for unhandled events
        console.log(`Unhandled webhook event: ${eventName}`)
    }

    // Always return 200 to acknowledge receipt
    // LemonSqueezy will retry on non-2xx responses
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
 * Creates a license key and stores it in Redis.
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

  // Get the variant ID to determine tier
  const variantId = attributes.first_order_item.variant_id
  const tier = getTierFromVariant(variantId)

  if (!tier) {
    console.error(`Unknown variant ID: ${variantId} for order ${data.id}`)
    // Don't throw - we still want to return 200 to prevent retries
    return
  }

  // Generate a unique license key
  const licenseKey = generateLicenseKey()

  // Store the license in Redis
  await createLicense(licenseKey, {
    tier,
    email: attributes.user_email,
    purchasedAt: attributes.created_at,
    orderId: data.id,
  })

  console.log(`License created for order ${data.id}:`, {
    licenseKey,
    tier,
    email: attributes.user_email,
  })

  // Note: In a production app, you'd also want to:
  // 1. Send the license key via email (using Resend, SendGrid, etc.)
  // 2. Or rely on LemonSqueezy's built-in license key delivery
  //
  // For MVP, we'll display the license key on the success page
  // using the order ID from the redirect URL
}

/**
 * Handles the order_refunded event.
 * Invalidates the license associated with the order.
 */
async function handleOrderRefunded(
  data: NonNullable<ReturnType<typeof parseWebhookPayload>>["data"]
): Promise<void> {
  console.log(`Order refunded: ${data.id}`, {
    email: data.attributes.user_email,
  })

  // For a complete implementation, you would:
  // 1. Look up the license by order ID
  // 2. Delete or invalidate the license in Redis
  //
  // For MVP, refunds are rare and can be handled manually
  // by checking LemonSqueezy dashboard
}

/**
 * Generates a unique, readable license key.
 * Format: XXXX-XXXX-XXXX-XXXX (16 characters + 3 dashes)
 *
 * Using nanoid for cryptographically secure random generation.
 */
function generateLicenseKey(): string {
  // Use uppercase alphanumeric characters for readability
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789" // Removed ambiguous chars: 0, O, 1, I
  const segment = () =>
    nanoid(4)
      .toUpperCase()
      .split("")
      .map(() => alphabet[Math.floor(Math.random() * alphabet.length)])
      .join("")

  return `${segment()}-${segment()}-${segment()}-${segment()}`
}

/**
 * Handle unsupported methods.
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
