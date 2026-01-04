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
  const orderId = searchParams.get("order_id")

  // State
  const [licenseKey, setLicenseKey] = useState<string | null>(null)
  const [tier, setTier] = useState<"basic" | "lifetime" | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // License key input state
  const [inputKey, setInputKey] = useState("")

  // Check if we already have a valid license in localStorage on mount
  useEffect(() => {
    const checkExistingLicense = async () => {
      const storedLicense = localStorage.getItem("license_key")
      if (!storedLicense) return

      setIsLoading(true)
      try {
        const response = await fetch("/api/verify-license", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ licenseKey: storedLicense }),
        })

        const data = await response.json()

        if (response.ok && data.isValid) {
          setLicenseKey(storedLicense)
          setTier(data.tier)
        } else {
          localStorage.removeItem("license_key")
        }
      } catch (err) {
        console.error("Error verifying stored license:", err)
      } finally {
        setIsLoading(false)
      }
    }

    checkExistingLicense()
  }, [])

  /**
   * Format license key input with dashes.
   */
  const formatLicenseKey = (value: string): string => {
    // Remove all non-alphanumeric characters except dashes and convert to uppercase
    const cleaned = value.replace(/[^A-Za-z0-9-]/g, "").toUpperCase()
    return cleaned
  }

  /**
   * Handle license key input change.
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputKey(formatLicenseKey(e.target.value))
    setError(null)
  }

  /**
   * Verify and activate the entered license key.
   */
  const handleVerifyLicense = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputKey.trim()) {
      setError("Please enter your license key")
      return
    }

    setIsVerifying(true)
    setError(null)

    try {
      const response = await fetch("/api/verify-license", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseKey: inputKey.trim() }),
      })

      const data = await response.json()

      if (response.ok && data.isValid) {
        setLicenseKey(inputKey.trim())
        setTier(data.tier)
        localStorage.setItem("license_key", inputKey.trim())
      } else {
        setError(
          data.error || "Invalid license key. Please check and try again."
        )
      }
    } catch (err) {
      console.error("Error verifying license:", err)
      setError("Something went wrong. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

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
   * Navigate to home page to start generating.
   */
  const handleStartGenerating = useCallback(() => {
    window.location.href = "/"
  }, [])

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
                Checking your license...
              </p>
            </div>
          ) : licenseKey ? (
            <>
              {/* License verified */}
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
                <code className="flex-1 font-mono text-sm sm:text-lg tracking-wider text-gray-900 dark:text-gray-100 break-all">
                  {licenseKey}
                </code>

                <button
                  onClick={handleCopy}
                  className={cn(
                    "p-2 rounded-md flex-shrink-0",
                    "text-gray-500 hover:text-gray-700",
                    "dark:text-gray-400 dark:hover:text-gray-200",
                    "hover:bg-gray-200 dark:hover:bg-gray-700",
                    "transition-colors cursor-pointer"
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
                Your license key is saved. You can start generating resume
                bullets now!
              </p>

              {/* Start button */}
              <Button
                fullWidth
                size="lg"
                className="mt-6"
                onClick={handleStartGenerating}
              >
                <SparklesIcon size={20} />
                Start Generating
                <ChevronRightIcon size={20} />
              </Button>
            </>
          ) : (
            <>
              {/* License key entry form */}
              <div className="text-center mb-6">
                <KeyIcon
                  size={32}
                  className="mx-auto mb-4 text-brand-500 dark:text-brand-400"
                />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Enter Your License Key
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Check your email for your license key from LemonSqueezy.
                </p>
              </div>

              <form onSubmit={handleVerifyLicense} className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={inputKey}
                    onChange={handleInputChange}
                    placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
                    className={cn(
                      "w-full px-4 py-3 rounded-lg",
                      "border border-gray-300 dark:border-gray-600",
                      "bg-white dark:bg-gray-800",
                      "text-gray-900 dark:text-gray-100",
                      "placeholder-gray-400 dark:placeholder-gray-500",
                      "font-mono text-sm",
                      "focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500",
                      error && "border-red-500"
                    )}
                    disabled={isVerifying}
                  />
                  {error && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {error}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  isLoading={isVerifying}
                  loadingText="Verifying..."
                >
                  Activate License
                </Button>
              </form>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Can&apos;t find your license key?</strong>
                  <br />
                  Check your email inbox (and spam folder) for an email from
                  LemonSqueezy with your license key.
                </p>
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
 * Customer enters their license key from the email.
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
