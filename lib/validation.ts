import { z } from "zod"

/**
 * Schema for the resume bullet generation request.
 * Validates both job description and experience inputs.
 */
export const generateRequestSchema = z.object({
  jobDescription: z
    .string()
    .min(50, "Job description must be at least 50 characters")
    .max(8000, "Job description must be less than 8,000 characters")
    .transform((val) => val.trim()),

  experience: z
    .string()
    .min(20, "Experience must be at least 20 characters")
    .max(4000, "Experience must be less than 4,000 characters")
    .transform((val) => val.trim()),

  licenseKey: z
    .string()
    .optional()
    .transform((val) => val?.trim() || undefined),
})

/**
 * Inferred type for generation request.
 */
export type GenerateRequest = z.infer<typeof generateRequestSchema>

/**
 * Schema for the generation response.
 */
export const generateResponseSchema = z.object({
  bullets: z.array(z.string()).min(1).max(10),
  remaining: z.number().int().min(0),
  tier: z.enum(["free", "basic", "lifetime"]),
})

/**
 * Inferred type for generation response.
 */
export type GenerateResponse = z.infer<typeof generateResponseSchema>

/**
 * Schema for error responses.
 */
export const errorResponseSchema = z.object({
  error: z.string(),
  code: z.enum([
    "VALIDATION_ERROR",
    "LIMIT_REACHED",
    "INVALID_LICENSE",
    "GENERATION_FAILED",
    "RATE_LIMITED",
    "INTERNAL_ERROR",
  ]),
  message: z.string(),
})

/**
 * Inferred type for error response.
 */
export type ErrorResponse = z.infer<typeof errorResponseSchema>

/**
 * Schema for license verification request.
 */
export const verifyLicenseSchema = z.object({
  licenseKey: z
    .string()
    .min(1, "License key is required")
    .transform((val) => val.trim()),
})

/**
 * Inferred type for license verification request.
 */
export type VerifyLicenseRequest = z.infer<typeof verifyLicenseSchema>

/**
 * Schema for license verification response.
 */
export const licenseStatusSchema = z.object({
  isValid: z.boolean(),
  tier: z.enum(["basic", "lifetime"]).nullable(),
  remaining: z.number().int().min(0),
  email: z.string().email().optional(),
})

/**
 * Inferred type for license status.
 */
export type LicenseStatus = z.infer<typeof licenseStatusSchema>

/**
 * Schema for webhook payload validation (subset of fields we need).
 */
export const webhookMetaSchema = z.object({
  event_name: z.enum([
    "order_created",
    "order_refunded",
    "subscription_created",
    "subscription_updated",
    "subscription_cancelled",
    "license_key_created",
  ]),
  custom_data: z
    .object({
      license_key: z.string().optional(),
    })
    .optional(),
})

/**
 * Validates and parses request data with Zod.
 * Returns either the parsed data or a formatted error.
 *
 * @param schema - Zod schema to validate against
 * @param data - Raw data to validate
 * @returns Object with success status, data, and optional error
 */
export function validateRequest<T extends z.ZodSchema>(
  schema: T,
  data: unknown
): {
  success: boolean
  data?: z.infer<T>
  error?: string
} {
  const result = schema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  // Format Zod errors into a readable message
  const errorMessages = result.error.issues
    .map((issue) => {
      const path = issue.path.join(".")
      return path ? `${path}: ${issue.message}` : issue.message
    })
    .join("; ")

  return { success: false, error: errorMessages }
}

/**
 * Type guard for checking if a response is an error response.
 *
 * @param response - Response object to check
 * @returns Whether the response is an error
 */
export function isErrorResponse(response: unknown): response is ErrorResponse {
  return (
    typeof response === "object" &&
    response !== null &&
    "error" in response &&
    "code" in response
  )
}

/**
 * Creates a standardized error response.
 *
 * @param code - Error code
 * @param message - Human-readable error message
 * @returns Formatted error response
 */
export function createErrorResponse(
  code: ErrorResponse["code"],
  message: string
): ErrorResponse {
  return {
    error: code,
    code,
    message,
  }
}

/**
 * Common error responses for reuse.
 */
export const ERRORS = {
  LIMIT_REACHED: createErrorResponse(
    "LIMIT_REACHED",
    "You've reached your free generation limit. Upgrade to continue."
  ),
  INVALID_LICENSE: createErrorResponse(
    "INVALID_LICENSE",
    "Invalid or expired license key."
  ),
  GENERATION_FAILED: createErrorResponse(
    "GENERATION_FAILED",
    "Failed to generate bullet points. Please try again."
  ),
  RATE_LIMITED: createErrorResponse(
    "RATE_LIMITED",
    "Too many requests. Please wait a moment and try again."
  ),
  INTERNAL_ERROR: createErrorResponse(
    "INTERNAL_ERROR",
    "An unexpected error occurred. Please try again."
  ),
} as const
