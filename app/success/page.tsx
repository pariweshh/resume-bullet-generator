"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import {
  Button,
  Card,
  Badge,
  CheckIcon,
  CopyIcon,
  KeyIcon,
  SparklesIcon,
  ChevronRightIcon,
} from "@/components/ui"
import { Header, Footer } from "@/components"
import { cn } from "@/lib/utils"

/**
 * Success page content component.
 * Separated to use useSearchParams inside Suspense boundary.
 */
function SuccessContent() {
  const searchParams = useSearchParams()

  // Get order ID from URL (passed by LemonSqueezy redirect)
  const orderId = searchParams.get("order_id")

  // State
  const [licenseKey, setLicenseKey] = useState<string | null>(null)
  const [tier, setTier] = useState<"basic" | "lifetime" | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Fetch license key by order ID with retry logic.
   * Webhook might take a few seconds to process.
   */
  useEffect(() => {
    if (!orderId) {
      setIsLoading(false)
      setError(
        "No order ID found. Please check your email for your license key."
      )
      return
    }

    let attempts = 0
    const maxAttempts = 10
    const retryDelay = 2000 // 2 seconds between retries

    const fetchLicense = async () => {
      try {
        const response = await fetch(`/api/license/${orderId}`)
        const data = await response.json()

        if (response.ok && data.found) {
          // License found!
          setLicenseKey(data.licenseKey)
          setTier(data.tier)
          setIsLoading(false)

          // Auto-save to localStorage
          localStorage.setItem("license_key", data.licenseKey)
          return true
        }

        return false
      } catch (err) {
        console.error("Error fetching license:", err)
        return false
      }
    }

    const attemptFetch = async () => {
      attempts++

      const found = await fetchLicense()

      if (!found && attempts < maxAttempts) {
        // Retry after delay
        setTimeout(attemptFetch, retryDelay)
      } else if (!found) {
        // Max attempts reached
        setIsLoading(false)
        setError(
          "Your license is being processed. Please check your email or refresh this page in a minute."
        )
      }
    }

    // Start fetching after a short initial delay (give webhook time to process)
    setTimeout(attemptFetch, 1500)
  }, [orderId])

  /**
   * Copy license key to clipboard.
   */
  const handleCopy = useCallback(async () => {
    if (!licenseKey) return

    try {
      await navigator.clipboard.writeText(licenseKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }, [licenseKey])

  /**
   * Save license key to localStorage and redirect to home.
   */
  const handleActivate = useCallback(() => {
    if (licenseKey) {
      localStorage.setItem("license_key", licenseKey)
    }
    window.location.href = "/"
  }, [licenseKey])

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-lg mx-auto">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div
            className={cn(
              "inline-flex items-center justify-center",
              "w-20 h-20 rounded-full",
              "bg-green-100 dark:bg-green-900/30",
              "mb-4"
            )}
          >
            <CheckIcon
              size={40}
              className="text-green-600 dark:text-green-400"
            />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Thank You!
          </h1>

          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Your purchase was successful.
          </p>
        </div>

        {/* License Key Card */}
        <Card className="mb-6">
          {isLoading ? (
            <div className="flex flex-col items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Retrieving your license key...
              </p>
            </div>
          ) : licenseKey ? (
            <>
              {/* Tier badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <KeyIcon
                    size={20}
                    className="text-gray-500 dark:text-gray-400"
                  />
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    Your License Key
                  </span>
                </div>
                {tier && (
                  <Badge variant={tier === "lifetime" ? "success" : "primary"}>
                    {tier === "lifetime" ? "✨ Lifetime" : "Basic"}
                  </Badge>
                )}
              </div>

              {/* License key display */}
              <div
                className={cn(
                  "flex items-center gap-3 p-4 rounded-lg",
                  "bg-gray-50 dark:bg-gray-800/50",
                  "border border-gray-200 dark:border-gray-700"
                )}
              >
                <code className="flex-1 font-mono text-lg tracking-wider text-gray-900 dark:text-gray-100">
                  {licenseKey}
                </code>

                <button
                  onClick={handleCopy}
                  className={cn(
                    "p-2 rounded-md",
                    "text-gray-500 hover:text-gray-700",
                    "dark:text-gray-400 dark:hover:text-gray-200",
                    "hover:bg-gray-200 dark:hover:bg-gray-700",
                    "transition-colors"
                  )}
                  title={copied ? "Copied!" : "Copy to clipboard"}
                >
                  {copied ? (
                    <CheckIcon size={20} className="text-green-600" />
                  ) : (
                    <CopyIcon size={20} />
                  )}
                </button>
              </div>

              {/* Instructions */}
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Save this key somewhere safe. You&apos;ll need it to unlock your
                generations on new devices or browsers.
              </p>

              {/* Activate button */}
              <Button
                fullWidth
                size="lg"
                className="mt-6"
                onClick={handleActivate}
              >
                <SparklesIcon size={20} />
                Start Generating
                <ChevronRightIcon size={20} />
              </Button>
            </>
          ) : (
            <>
              {/* Error/Instructions state */}
              <div className="text-center py-4">
                <KeyIcon
                  size={32}
                  className="mx-auto mb-4 text-gray-400 dark:text-gray-500"
                />

                <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>

                <div className="space-y-3">
                  <Button
                    fullWidth
                    variant="outline"
                    onClick={() => (window.location.href = "/")}
                  >
                    Go to Generator
                    <ChevronRightIcon size={18} />
                  </Button>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    You can enter your license key on the main page
                  </p>
                </div>
              </div>
            </>
          )}
        </Card>

        {/* Order info */}
        {orderId && (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Order ID: {orderId}
          </p>
        )}

        {/* Help link */}
        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Having trouble?{" "}
          <a
            href="mailto:support@example.com"
            className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 underline"
          >
            Contact support
          </a>
        </p>
      </div>
    </div>
  )
}

/**
 * Loading fallback for Suspense.
 */
function SuccessLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-lg mx-auto">
        <div className="flex flex-col items-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    </div>
  )
}

/**
 * Success page shown after successful purchase.
 * Displays the license key and instructions.
 */
export default function SuccessPage() {
  return (
    <>
      <Header />

      <main className="min-h-[60vh]">
        <Suspense fallback={<SuccessLoading />}>
          <SuccessContent />
        </Suspense>
      </main>

      <Footer />
    </>
  )
}
