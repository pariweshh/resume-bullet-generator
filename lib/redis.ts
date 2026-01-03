import { Redis } from "@upstash/redis"

/**
 * Upstash Redis client for serverless usage.
 * Configured via environment variables:
 * - UPSTASH_REDIS_REST_URL
 * - UPSTASH_REDIS_REST_TOKEN
 *
 * Free tier: 10,000 requests/day — plenty for an MVP
 */
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

/**
 * Redis key prefixes for organization and easy querying.
 */
export const REDIS_KEYS = {
  /** Usage count by identifier (IP or license key) */
  usage: (identifier: string) => `usage:${identifier}`,

  /** License key lookup - stores tier info */
  license: (licenseKey: string) => `license:${licenseKey}`,

  /** Email to license mapping for customer lookup */
  emailLicense: (email: string) => `email:${email}`,

  /** Daily generation count for analytics */
  dailyStats: (date: string) => `stats:daily:${date}`,
} as const

/**
 * Free tier configuration.
 */
export const FREE_TIER = {
  /** Number of free generations allowed */
  maxGenerations: 3,

  /** TTL for free tier usage tracking (24 hours in seconds) */
  ttlSeconds: 86400,
} as const

/**
 * Paid tier configuration.
 */
export const PAID_TIERS = {
  basic: {
    name: "Basic",
    price: 9,
    generations: 50,
    ttlSeconds: null, // Never expires
  },
  lifetime: {
    name: "Lifetime",
    price: 19,
    generations: Infinity,
    ttlSeconds: null,
  },
} as const

export type PaidTierKey = keyof typeof PAID_TIERS

/**
 * License data stored in Redis.
 */
export interface LicenseData {
  tier: PaidTierKey
  email: string
  purchasedAt: string
  generationsUsed: number
  orderId: string
}

/**
 * Gets the current usage count for an identifier.
 *
 * @param identifier - IP address or license key
 * @returns Current usage count (0 if not found)
 */
export async function getUsageCount(identifier: string): Promise<number> {
  const count = await redis.get<number>(REDIS_KEYS.usage(identifier))
  return count ?? 0
}

/**
 * Increments usage count and sets TTL for free tier.
 *
 * @param identifier - IP address or license key
 * @param isPaid - Whether this is a paid user (no TTL for paid)
 * @returns New usage count
 */
export async function incrementUsage(
  identifier: string,
  isPaid: boolean = false
): Promise<number> {
  const key = REDIS_KEYS.usage(identifier)
  const newCount = await redis.incr(key)

  // Set TTL only for free tier (resets daily)
  if (!isPaid && newCount === 1) {
    await redis.expire(key, FREE_TIER.ttlSeconds)
  }

  return newCount
}

/**
 * Gets license data for a license key.
 *
 * @param licenseKey - The license key to look up
 * @returns License data or null if not found
 */
export async function getLicense(
  licenseKey: string
): Promise<LicenseData | null> {
  return redis.get<LicenseData>(REDIS_KEYS.license(licenseKey))
}

/**
 * Creates a new license after successful payment.
 *
 * @param licenseKey - Unique license key
 * @param data - License data to store
 */
export async function createLicense(
  licenseKey: string,
  data: Omit<LicenseData, "generationsUsed">
): Promise<void> {
  const licenseData: LicenseData = {
    ...data,
    generationsUsed: 0,
  }

  // Store license data
  await redis.set(REDIS_KEYS.license(licenseKey), licenseData)

  // Create email -> license mapping for customer support lookups
  await redis.set(REDIS_KEYS.emailLicense(data.email), licenseKey)
}

/**
 * Updates generation count for a paid license.
 *
 * @param licenseKey - The license key
 * @returns Updated license data or null if not found
 */
export async function incrementLicenseUsage(
  licenseKey: string
): Promise<LicenseData | null> {
  const license = await getLicense(licenseKey)

  if (!license) {
    return null
  }

  const updatedLicense: LicenseData = {
    ...license,
    generationsUsed: license.generationsUsed + 1,
  }

  await redis.set(REDIS_KEYS.license(licenseKey), updatedLicense)

  return updatedLicense
}

/**
 * Checks if a license has remaining generations.
 *
 * @param licenseKey - The license key to check
 * @returns Object with validity status and remaining count
 */
export async function checkLicenseValidity(licenseKey: string): Promise<{
  isValid: boolean
  remaining: number
  tier: PaidTierKey | null
}> {
  const license = await getLicense(licenseKey)

  if (!license) {
    return { isValid: false, remaining: 0, tier: null }
  }

  const tierConfig = PAID_TIERS[license.tier]
  const remaining = tierConfig.generations - license.generationsUsed

  return {
    isValid: remaining > 0,
    remaining: Math.max(0, remaining),
    tier: license.tier,
  }
}

/**
 * Gets license key by email (for customer support).
 *
 * @param email - Customer email
 * @returns License key or null
 */
export async function getLicenseByEmail(email: string): Promise<string | null> {
  return redis.get<string>(REDIS_KEYS.emailLicense(email))
}

/**
 * Tracks daily generation statistics for analytics.
 *
 * @param date - Date string in YYYY-MM-DD format
 */
export async function trackDailyGeneration(
  date: string = new Date().toISOString().split("T")[0]!
): Promise<void> {
  const key = REDIS_KEYS.dailyStats(date)
  await redis.incr(key)
  // Keep stats for 90 days
  await redis.expire(key, 86400 * 90)
}
