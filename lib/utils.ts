import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges Tailwind CSS classes with proper precedence handling.
 * Combines clsx for conditional classes with tailwind-merge to resolve conflicts.

 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number as currency (USD by default).
 *
 * @example
 * formatCurrency(9.99) // "$9.99"
 * formatCurrency(19.99) // "$19.99"
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Truncates text to a maximum length with ellipsis.
 *
 * @example
 * truncate("Hello World", 5) // "Hello..."
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + "..."
}

/**
 * Delays execution for a specified duration.
 * Useful for debouncing or artificial delays in dev.
 *
 * @example
 * await sleep(1000) // Wait 1 second
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Safely parses JSON with a fallback value.
 * Returns the fallback if parsing fails.
 *
 * @example
 * safeJsonParse('{"a":1}', {}) // { a: 1 }
 * safeJsonParse('invalid', {}) // {}
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T
  } catch {
    return fallback
  }
}

/**
 * Generates a random ID with optional prefix.
 * Uses crypto for better randomness than Math.random().
 *
 * @example
 * generateId() // "x7k9m2p4"
 * generateId("user") // "user_x7k9m2p4"
 */
export function generateId(prefix?: string): string {
  const id =
    crypto.randomUUID().split("-")[0] ?? crypto.randomUUID().slice(0, 8)
  return prefix ? `${prefix}_${id}` : id
}

/**
 * Extracts error message from unknown error type.
 * Handles Error objects, strings, and unknown types safely.
 *
 * @example
 * getErrorMessage(new Error("Failed")) // "Failed"
 * getErrorMessage("Something went wrong") // "Something went wrong"
 * getErrorMessage({ code: 500 }) // "An unexpected error occurred"
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === "string") return error
  return "An unexpected error occurred"
}

/**
 * Checks if code is running on the server.
 */
export const isServer = typeof window === "undefined"

/**
 * Checks if code is running on the client.
 */
export const isClient = typeof window !== "undefined"

/**
 * Environment helpers with type safety.
 */
export const env = {
  isDev: process.env.NODE_ENV === "development",
  isProd: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
} as const
