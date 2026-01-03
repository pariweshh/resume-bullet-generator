"use client"

import { useState, useTransition } from "react"
import { Button, Badge, KeyIcon, CheckIcon, XIcon } from "@/components/ui"
import { cn } from "@/lib/utils"

/**
 * Props for the LicenseKeyInput component.
 */
export interface LicenseKeyInputProps {
  /** Callback when license is verified successfully */
  onVerified: (
    licenseKey: string,
    tier: "basic" | "lifetime",
    remaining: number
  ) => void
  /** Callback when license is cleared */
  onClear: () => void
  /** Currently stored license key */
  currentLicenseKey?: string
  /** Current tier if license is active */
  currentTier?: "basic" | "lifetime" | null
}

/**
 * License key input with verification.
 * Allows users to enter and verify their license key.
 */
export function LicenseKeyInput({
  onVerified,
  onClear,
  currentLicenseKey,
  currentTier,
}: LicenseKeyInputProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [licenseKey, setLicenseKey] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  /**
   * Formats license key input with dashes.
   * Converts: "ABCD1234EFGH5678" → "ABCD-1234-EFGH-5678"
   */
  const formatLicenseKey = (value: string): string => {
    // Remove all non-alphanumeric characters and convert to uppercase
    const cleaned = value.replace(/[^A-Za-z0-9]/g, "").toUpperCase()

    // Split into groups of 4 and join with dashes
    const groups = cleaned.match(/.{1,4}/g) || []
    return groups.slice(0, 4).join("-")
  }

  /**
   * Handles input change with formatting.
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatLicenseKey(e.target.value)
    setLicenseKey(formatted)
    setError(null)
  }

  /**
   * Verifies the license key with the API.
   */
  const handleVerify = () => {
    if (licenseKey.length < 19) {
      setError("Please enter a valid license key")
      return
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/verify-license", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ licenseKey }),
        })

        const data = await response.json()

        if (!response.ok || !data.isValid) {
          setError("Invalid or expired license key")
          return
        }

        // Success - notify parent and store in localStorage
        localStorage.setItem("license_key", licenseKey)
        onVerified(licenseKey, data.tier, data.remaining)
        setIsExpanded(false)
        setLicenseKey("")
      } catch (err) {
        console.error("License verification error:", err)
        setError("Failed to verify. Please try again.")
      }
    })
  }

  /**
   * Clears the current license.
   */
  const handleClear = () => {
    localStorage.removeItem("license_key")
    onClear()
    setIsExpanded(false)
    setLicenseKey("")
    setError(null)
  }

  // If user has an active license, show status
  if (currentLicenseKey && currentTier) {
    return (
      <div
        className={cn(
          "flex items-center justify-between gap-3 p-3 rounded-lg",
          "bg-green-50 dark:bg-green-900/20",
          "border border-green-200 dark:border-green-800"
        )}
      >
        <div className="flex items-center gap-2">
          <CheckIcon size={18} className="text-green-600 dark:text-green-400" />
          <span className="text-sm font-medium text-green-800 dark:text-green-200">
            {currentTier === "lifetime" ? "Lifetime" : "Basic"} License Active
          </span>
          <Badge variant="success" size="sm">
            {currentTier === "lifetime" ? "Unlimited" : "Pro"}
          </Badge>
        </div>

        <button
          onClick={handleClear}
          className={cn(
            "p-1.5 rounded-md",
            "text-green-600 hover:text-green-800",
            "dark:text-green-400 dark:hover:text-green-200",
            "hover:bg-green-100 dark:hover:bg-green-900/40",
            "transition-colors"
          )}
          title="Remove license"
          aria-label="Remove license key"
        >
          <XIcon size={16} />
        </button>
      </div>
    )
  }

  // Collapsed state - show button to expand
  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className={cn(
          "flex items-center gap-2 text-sm",
          "text-gray-500 hover:text-gray-700",
          "dark:text-gray-400 dark:hover:text-gray-200",
          "transition-colors"
        )}
      >
        <KeyIcon size={16} />
        Have a license key?
      </button>
    )
  }

  // Expanded state - show input form
  return (
    <div
      className={cn(
        "p-4 rounded-lg",
        "bg-gray-50 dark:bg-gray-800/50",
        "border border-gray-200 dark:border-gray-700"
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <KeyIcon size={18} className="text-gray-500" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Enter License Key
        </span>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={licenseKey}
          onChange={handleInputChange}
          placeholder="XXXX-XXXX-XXXX-XXXX"
          maxLength={19}
          className={cn(
            "flex-1 px-3 py-2 rounded-md",
            "text-sm font-mono uppercase tracking-wider",
            "border border-gray-300 dark:border-gray-600",
            "bg-white dark:bg-gray-900",
            "text-gray-900 dark:text-gray-100",
            "placeholder-gray-400 dark:placeholder-gray-500",
            "focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500",
            error && "border-red-500 focus:ring-red-500/20 focus:border-red-500"
          )}
          disabled={isPending}
        />

        <Button
          size="sm"
          onClick={handleVerify}
          isLoading={isPending}
          disabled={licenseKey.length < 19}
        >
          Verify
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setIsExpanded(false)
            setLicenseKey("")
            setError(null)
          }}
          disabled={isPending}
        >
          Cancel
        </Button>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}
