"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui"
import {
  Header,
  Footer,
  HeroSection,
  HowItWorksSection,
  PricingSection,
  GeneratorForm,
  BulletResults,
  PaywallModal,
  LicenseKeyInput,
  ErrorAlert,
} from "@/components"
import { FREE_TIER } from "@/lib/redis"

/**
 * User state interface.
 */
interface UserState {
  tier: "free" | "basic" | "lifetime"
  remaining: number
  licenseKey?: string
}

/**
 * Error state interface.
 */
interface ErrorState {
  message: string
  code?: string
}

/**
 * Initial user state for free tier.
 */
const INITIAL_USER_STATE: UserState = {
  tier: "free",
  remaining: FREE_TIER.maxGenerations,
  licenseKey: undefined,
}

/**
 * Main page component.
 * Manages state for generation, results, errors, and user tier.
 */
export default function HomePage() {
  // User state
  const [user, setUser] = useState<UserState>(INITIAL_USER_STATE)

  // Generated bullets
  const [bullets, setBullets] = useState<string[]>([])

  // Error state
  const [error, setError] = useState<ErrorState | null>(null)

  // Paywall modal state
  const [showPaywall, setShowPaywall] = useState(false)

  // Loading state for initial license check
  const [isInitializing, setIsInitializing] = useState(true)

  /**
   * Check for stored license key on mount.
   */
  useEffect(() => {
    const checkStoredLicense = async () => {
      try {
        const storedLicenseKey = localStorage.getItem("license_key")

        if (storedLicenseKey) {
          // Verify the license is still valid
          const response = await fetch("/api/verify-license", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ licenseKey: storedLicenseKey }),
          })

          const data = await response.json()

          if (response.ok && data.isValid) {
            setUser({
              tier: data.tier,
              remaining: data.remaining,
              licenseKey: storedLicenseKey,
            })
          } else {
            // License invalid - clear it
            localStorage.removeItem("license_key")
          }
        }
      } catch (err) {
        console.error("Failed to verify stored license:", err)
      } finally {
        setIsInitializing(false)
      }
    }

    checkStoredLicense()
  }, [])

  /**
   * Handle successful generation.
   */
  const handleGenerate = useCallback((newBullets: string[]) => {
    setBullets(newBullets)
    setError(null)

    // Update remaining count
    setUser((prev) => ({
      ...prev,
      remaining:
        prev.tier === "lifetime" ? 999 : Math.max(0, prev.remaining - 1),
    }))

    // Scroll to results
    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }, [])

  /**
   * Handle generation error.
   */
  const handleError = useCallback((message: string, code?: string) => {
    setError({ message, code })

    // Show paywall for limit errors
    if (code === "LIMIT_REACHED") {
      setShowPaywall(true)
    }
  }, [])

  /**
   * Handle license verification success.
   */
  const handleLicenseVerified = useCallback(
    (licenseKey: string, tier: "basic" | "lifetime", remaining: number) => {
      setUser({
        tier,
        remaining,
        licenseKey,
      })
      setError(null)
      setShowPaywall(false)
    },
    []
  )

  /**
   * Handle license clear.
   */
  const handleLicenseClear = useCallback(() => {
    setUser(INITIAL_USER_STATE)
  }, [])

  /**
   * Handle generate new (clear results).
   */
  const handleGenerateNew = useCallback(() => {
    setBullets([])
    setError(null)

    // Scroll to form
    document.getElementById("generator")?.scrollIntoView({ behavior: "smooth" })
  }, [])

  /**
   * Dismiss error alert.
   */
  const handleDismissError = useCallback(() => {
    setError(null)
  }, [])

  // Calculate if user is at their limit
  const isAtLimit =
    user.tier === "free" && user.remaining <= 0 && bullets.length === 0

  return (
    <>
      <Header tier={user.tier} />

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <HeroSection />

        {/* Main Generator Card */}
        <section id="generator" className="py-8 scroll-mt-20">
          <Card className="max-w-3xl mx-auto">
            {/* License Key Input */}
            <div className="mb-6">
              <LicenseKeyInput
                onVerified={handleLicenseVerified}
                onClear={handleLicenseClear}
                currentLicenseKey={user.licenseKey}
                currentTier={user.tier === "free" ? null : user.tier}
              />
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6">
                <ErrorAlert
                  message={error.message}
                  code={error.code}
                  onDismiss={handleDismissError}
                  showUpgrade={error.code === "LIMIT_REACHED"}
                  onUpgrade={() => setShowPaywall(true)}
                />
              </div>
            )}

            {/* Generator Form */}
            {!isInitializing && (
              <GeneratorForm
                onGenerate={handleGenerate}
                onError={handleError}
                licenseKey={user.licenseKey}
                remaining={user.remaining}
                tier={user.tier}
                isAtLimit={isAtLimit}
              />
            )}

            {/* Loading state during initialization */}
            {isInitializing && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600" />
              </div>
            )}
          </Card>
        </section>

        {/* Results Section */}
        {bullets.length > 0 && (
          <section id="results" className="py-8 scroll-mt-20">
            <div className="max-w-3xl mx-auto">
              <BulletResults
                bullets={bullets}
                onGenerateNew={handleGenerateNew}
              />
            </div>
          </section>
        )}

        {/* How It Works Section */}
        <HowItWorksSection />

        {/* Pricing Section */}
        <PricingSection currentTier={user.tier} />
      </div>

      <Footer />

      {/* Paywall Modal */}
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        message={
          user.tier === "free"
            ? "You've used all 3 free generations today. Upgrade to continue creating powerful resume bullets."
            : undefined
        }
      />
    </>
  )
}
