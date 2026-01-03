"use client"

import { useEffect, useCallback } from "react"
import {
  Button,
  Card,
  Badge,
  ZapIcon,
  CheckIcon,
  XIcon,
  CrownIcon,
} from "@/components/ui"
import { CHECKOUT_URLS } from "@/lib/lemonsqueezy"
import { cn } from "@/lib/utils"

/**
 * Props for the PaywallModal component.
 */
export interface PaywallModalProps {
  /** Whether the modal is open */
  isOpen: boolean
  /** Callback to close the modal */
  onClose: () => void
  /** Optional message to display */
  message?: string
}

/**
 * Pricing tier configuration.
 */
const TIERS = [
  {
    id: "basic",
    name: "Basic",
    price: 9,
    description: "Perfect for a single job search",
    features: [
      "50 bullet generations",
      "All job industries supported",
      "STAR format optimization",
      "ATS-friendly output",
    ],
    popular: false,
    checkoutUrl: CHECKOUT_URLS.basic,
  },
  {
    id: "lifetime",
    name: "Lifetime",
    price: 19,
    description: "Unlimited access forever",
    features: [
      "Unlimited generations",
      "All job industries supported",
      "STAR format optimization",
      "ATS-friendly output",
      "Priority support",
      "Future updates included",
    ],
    popular: true,
    checkoutUrl: CHECKOUT_URLS.lifetime,
  },
] as const

/**
 * Paywall modal shown when user hits their free generation limit.
 * Displays pricing options and handles checkout redirection.
 */
export function PaywallModal({ isOpen, onClose, message }: PaywallModalProps) {
  /**
   * Handle escape key to close modal.
   */
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    },
    [onClose]
  )

  /**
   * Set up escape key listener and body scroll lock.
   */
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [isOpen, handleEscape])

  if (!isOpen) {
    return null
  }

  /**
   * Handle checkout button click.
   */
  const handleCheckout = (checkoutUrl: string) => {
    // Open checkout in new tab
    window.open(checkoutUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="paywall-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal content */}
      <div
        className={cn(
          "relative w-full max-w-2xl max-h-[90vh] overflow-y-auto",
          "bg-white dark:bg-gray-900 rounded-2xl shadow-2xl",
          "animate-[slide-up_0.3s_ease-out]"
        )}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className={cn(
            "absolute right-4 top-4 p-2 rounded-full",
            "text-gray-400 hover:text-gray-600",
            "dark:text-gray-500 dark:hover:text-gray-300",
            "hover:bg-gray-100 dark:hover:bg-gray-800",
            "transition-colors"
          )}
          aria-label="Close modal"
        >
          <XIcon size={20} />
        </button>

        {/* Header */}
        <div className="p-6 pb-0 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-100 dark:bg-brand-900/30 mb-4">
            <ZapIcon size={32} className="text-brand-600 dark:text-brand-400" />
          </div>

          <h2
            id="paywall-title"
            className="text-2xl font-bold text-gray-900 dark:text-gray-100"
          >
            Upgrade to Continue
          </h2>

          <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            {message ||
              "You've used all your free generations. Upgrade to unlock more powerful resume bullets."}
          </p>
        </div>

        {/* Pricing cards */}
        <div className="p-6 grid gap-4 sm:grid-cols-2">
          {TIERS.map((tier) => (
            <Card
              key={tier.id}
              padded
              className={cn(
                "relative",
                tier.popular && "ring-2 ring-brand-500 dark:ring-brand-400"
              )}
            >
              {/* Popular badge */}
              {tier.popular && (
                <Badge
                  variant="primary"
                  size="sm"
                  className="absolute -top-2.5 left-1/2 -translate-x-1/2"
                >
                  <CrownIcon size={12} className="mr-1" />
                  Best Value
                </Badge>
              )}

              {/* Tier info */}
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {tier.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {tier.description}
                </p>
              </div>

              {/* Price */}
              <div className="text-center mb-4">
                <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                  ${tier.price}
                </span>
                <span className="text-gray-500 dark:text-gray-400 ml-1">
                  one-time
                </span>
              </div>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                {tier.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                  >
                    <CheckIcon
                      size={16}
                      className="flex-shrink-0 mt-0.5 text-green-500"
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA button */}
              <Button
                variant={tier.popular ? "primary" : "outline"}
                fullWidth
                onClick={() => handleCheckout(tier.checkoutUrl)}
              >
                Get {tier.name}
              </Button>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Secure payment via LemonSqueezy. 30-day money-back guarantee.
          </p>
        </div>
      </div>
    </div>
  )
}
