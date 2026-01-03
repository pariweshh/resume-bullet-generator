import crypto from "crypto"

/**
 * LemonSqueezy configuration.
 * Set these in your environment variables.
 */
export const LEMONSQUEEZY_CONFIG = {
  /** Webhook signing secret for verifying webhook authenticity */
  webhookSecret: process.env.LEMONSQUEEZY_WEBHOOK_SECRET!,

  /** Store ID for API calls */
  storeId: process.env.LEMONSQUEEZY_STORE_ID!,

  /** API key for server-side API calls (optional, for future use) */
  apiKey: process.env.LEMONSQUEEZY_API_KEY,
} as const

/**
 * Product variant IDs from LemonSqueezy.
 * You'll get these after creating products in your LemonSqueezy dashboard.
 *
 * To find variant IDs:
 * 1. Go to LemonSqueezy Dashboard → Products
 * 2. Click on your product
 * 3. The variant ID is in the URL or shown in the variant settings
 */
export const PRODUCT_VARIANTS = {
  basic: process.env.LEMONSQUEEZY_VARIANT_BASIC!,
  lifetime: process.env.LEMONSQUEEZY_VARIANT_LIFETIME!,
} as const

/**
 * Checkout URLs for each product tier.
 * These are the direct checkout links from LemonSqueezy.
 *
 * Format: https://[store].lemonsqueezy.com/buy/[product-slug]
 */
export const CHECKOUT_URLS = {
  basic: process.env.NEXT_PUBLIC_CHECKOUT_URL_BASIC!,
  lifetime: process.env.NEXT_PUBLIC_CHECKOUT_URL_LIFETIME!,
} as const

/**
 * LemonSqueezy webhook event types we handle.
 */
export type WebhookEventType =
  | "order_created"
  | "order_refunded"
  | "subscription_created"
  | "subscription_updated"
  | "subscription_cancelled"
  | "license_key_created"

/**
 * Relevant fields from LemonSqueezy order webhook payload.
 */
export interface LemonSqueezyOrderData {
  id: string
  attributes: {
    store_id: number
    customer_id: number
    identifier: string
    order_number: number
    user_name: string
    user_email: string
    currency: string
    currency_rate: string
    subtotal: number
    discount_total: number
    tax: number
    total: number
    subtotal_usd: number
    discount_total_usd: number
    tax_usd: number
    total_usd: number
    tax_name: string
    status: "pending" | "failed" | "paid" | "refunded"
    receipt_url: string
    refunded: boolean
    refunded_at: string | null
    first_order_item: {
      id: number
      order_id: number
      product_id: number
      variant_id: number
      product_name: string
      variant_name: string
      price: number
      quantity: number
    }
    created_at: string
    updated_at: string
  }
}

/**
 * Full webhook payload structure from LemonSqueezy.
 */
export interface LemonSqueezyWebhookPayload {
  meta: {
    event_name: WebhookEventType
    custom_data?: {
      license_key?: string
      [key: string]: unknown
    }
  }
  data: LemonSqueezyOrderData
}

/**
 * Verifies the webhook signature from LemonSqueezy.
 * This ensures the webhook came from LemonSqueezy and wasn't tampered with.
 *
 * @param payload - Raw request body as string
 * @param signature - X-Signature header value
 * @returns Whether the signature is valid
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string
): boolean {
  if (!LEMONSQUEEZY_CONFIG.webhookSecret) {
    console.error("LEMONSQUEEZY_WEBHOOK_SECRET is not configured")
    return false
  }

  try {
    const hmac = crypto.createHmac("sha256", LEMONSQUEEZY_CONFIG.webhookSecret)
    const digest = hmac.update(payload).digest("hex")

    // Use timing-safe comparison to prevent timing attacks
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))
  } catch (error) {
    console.error("Webhook signature verification failed:", error)
    return false
  }
}

/**
 * Determines the tier from a variant ID.
 *
 * @param variantId - The variant ID from the order
 * @returns The tier key or null if not found
 */
export function getTierFromVariant(
  variantId: number | string
): "basic" | "lifetime" | null {
  const variantStr = String(variantId)

  if (variantStr === PRODUCT_VARIANTS.basic) {
    return "basic"
  }

  if (variantStr === PRODUCT_VARIANTS.lifetime) {
    return "lifetime"
  }

  return null
}

/**
 * Parses and validates webhook payload.
 *
 * @param rawBody - Raw request body string
 * @returns Parsed payload or null if invalid
 */
export function parseWebhookPayload(
  rawBody: string
): LemonSqueezyWebhookPayload | null {
  try {
    const payload = JSON.parse(rawBody) as LemonSqueezyWebhookPayload

    // Basic validation
    if (!payload.meta?.event_name || !payload.data?.id) {
      console.error("Invalid webhook payload structure")
      return null
    }

    return payload
  } catch (error) {
    console.error("Failed to parse webhook payload:", error)
    return null
  }
}

/**
 * Generates a checkout URL with optional pre-filled email.
 *
 * @param tier - The product tier
 * @param email - Optional email to pre-fill
 * @returns Full checkout URL
 */
export function getCheckoutUrl(
  tier: "basic" | "lifetime",
  email?: string
): string {
  const baseUrl = CHECKOUT_URLS[tier]

  if (!baseUrl) {
    throw new Error(`Checkout URL not configured for tier: ${tier}`)
  }

  if (email) {
    const url = new URL(baseUrl)
    url.searchParams.set("checkout[email]", email)
    return url.toString()
  }

  return baseUrl
}

/**
 * Formats price for display.
 *
 * @param cents - Price in cents
 * @param currency - Currency code (default: USD)
 * @returns Formatted price string
 */
export function formatPrice(cents: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100)
}
