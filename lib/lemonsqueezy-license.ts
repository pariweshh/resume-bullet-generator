/**
 * LemonSqueezy License Validation
 *
 * This module handles license key validation using LemonSqueezy's API.
 * LemonSqueezy generates and manages the license keys.
 *
 * @see https://docs.lemonsqueezy.com/api/license-keys
 */

import { getErrorMessage } from "@/lib/utils"

/**
 * LemonSqueezy API base URL
 */
const LEMONSQUEEZY_API_URL = "https://api.lemonsqueezy.com/v1"

/**
 * License validation response from LemonSqueezy
 */
export interface LicenseValidationResponse {
  valid: boolean
  error?: string
  licenseKey?: {
    id: number
    status: string
    key: string
    activationLimit: number
    activationUsage: number
    createdAt: string
    expiresAt: string | null
    testMode: boolean
  }
  instance?: {
    id: string
    name: string
    createdAt: string
  }
  meta?: {
    storeId: number
    orderId: number
    orderItemId: number
    productId: number
    productName: string
    variantId: number
    variantName: string
    customerId: number
    customerName: string
    customerEmail: string
  }
}

/**
 * Our normalized license data
 */
export interface LicenseData {
  isValid: boolean
  tier: "basic" | "lifetime" | null
  email: string | null
  activationsUsed: number
  activationLimit: number
  status: string
  testMode: boolean
  error?: string
}

/**
 * Get tier from variant ID
 */
function getTierFromVariantId(variantId: number): "basic" | "lifetime" | null {
  const basicVariantId = process.env.LEMONSQUEEZY_VARIANT_BASIC
  const lifetimeVariantId = process.env.LEMONSQUEEZY_VARIANT_LIFETIME

  if (basicVariantId && variantId === parseInt(basicVariantId, 10)) {
    return "basic"
  }
  if (lifetimeVariantId && variantId === parseInt(lifetimeVariantId, 10)) {
    return "lifetime"
  }
  return null
}

/**
 * Validates a license key with LemonSqueezy's API.
 *
 * @param licenseKey - The license key to validate
 * @param instanceName - Optional instance identifier (e.g., user's browser/device)
 * @returns License validation result
 */
export async function validateLicenseKey(
  licenseKey: string,
  instanceName?: string
): Promise<LicenseData> {
  try {
    // Use the license validation endpoint
    const response = await fetch(
      "https://api.lemonsqueezy.com/v1/licenses/validate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          license_key: licenseKey,
          instance_name: instanceName || "web-app",
        }),
      }
    )

    const data = await response.json()

    // Debug logging
    console.log(
      "LemonSqueezy validation response:",
      JSON.stringify(data, null, 2)
    )

    // Handle invalid license
    if (!data.valid) {
      return {
        isValid: false,
        tier: null,
        email: null,
        activationsUsed: 0,
        activationLimit: 0,
        status: data.license_key?.status || "invalid",
        testMode: data.license_key?.test_mode || false,
        error: data.error || "Invalid license key",
      }
    }

    // Extract tier from variant ID
    const variantId = data.meta?.variant_id
    const tier = getTierFromVariantId(variantId)

    // Get the license status
    const status = data.license_key?.status || "active"
    const testMode = data.license_key?.test_mode || false

    return {
      isValid: true,
      tier,
      email: data.meta?.customer_email || null,
      activationsUsed: data.license_key?.activation_usage || 0,
      activationLimit: data.license_key?.activation_limit || 0,
      status,
      testMode,
    }
  } catch (error) {
    console.error("License validation error:", getErrorMessage(error))
    return {
      isValid: false,
      tier: null,
      email: null,
      activationsUsed: 0,
      activationLimit: 0,
      status: "error",
      testMode: false,
      error: "Failed to validate license. Please try again.",
    }
  }
}

/**
 * Activates a license key with LemonSqueezy's API.
 * This is called when user first enters their license key.
 *
 * @param licenseKey - The license key to activate
 * @param instanceName - Instance identifier (e.g., browser fingerprint)
 * @returns Activation result
 */
export async function activateLicenseKey(
  licenseKey: string,
  instanceName: string
): Promise<LicenseData & { instanceId?: string }> {
  try {
    const response = await fetch(
      "https://api.lemonsqueezy.com/v1/licenses/activate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          license_key: licenseKey,
          instance_name: instanceName,
        }),
      }
    )

    const data = await response.json()

    // Handle activation failure
    if (!data.activated && !data.valid) {
      return {
        isValid: false,
        tier: null,
        email: null,
        activationsUsed: 0,
        activationLimit: 0,
        status: data.license_key?.status || "invalid",
        testMode: data.license_key?.test_mode || false,
        error: data.error || "Failed to activate license",
      }
    }

    // Extract tier from variant ID
    const variantId = data.meta?.variant_id
    const tier = getTierFromVariantId(variantId)

    return {
      isValid: true,
      tier,
      email: data.meta?.customer_email || null,
      activationsUsed: data.license_key?.activation_usage || 0,
      activationLimit: data.license_key?.activation_limit || 0,
      status: data.license_key?.status || "active",
      testMode: data.license_key?.test_mode || false,
      instanceId: data.instance?.id,
    }
  } catch (error) {
    console.error("License activation error:", getErrorMessage(error))
    return {
      isValid: false,
      tier: null,
      email: null,
      activationsUsed: 0,
      activationLimit: 0,
      status: "error",
      testMode: false,
      error: "Failed to activate license. Please try again.",
    }
  }
}

/**
 * Deactivates a license instance.
 *
 * @param licenseKey - The license key
 * @param instanceId - The instance ID to deactivate
 * @returns Success boolean
 */
export async function deactivateLicenseKey(
  licenseKey: string,
  instanceId: string
): Promise<boolean> {
  try {
    const response = await fetch(
      "https://api.lemonsqueezy.com/v1/licenses/deactivate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          license_key: licenseKey,
          instance_id: instanceId,
        }),
      }
    )

    const data = await response.json()
    return data.deactivated === true
  } catch (error) {
    console.error("License deactivation error:", getErrorMessage(error))
    return false
  }
}
