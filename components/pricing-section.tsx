import { Button, Card, Badge, CheckIcon, CrownIcon } from "@/components/ui"
import { CHECKOUT_URLS } from "@/lib/lemonsqueezy"
import { cn } from "@/lib/utils"

/**
 * Pricing tier configuration.
 */
const TIERS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    description: "Try it out",
    features: [
      "3 generations per day",
      "All job industries",
      "STAR format optimization",
      "ATS-friendly output",
    ],
    limitations: ["Resets every 24 hours"],
    cta: "Current Plan",
    checkoutUrl: null,
    popular: false,
  },
  {
    id: "basic",
    name: "Basic",
    price: 9.99,
    description: "For a single job search",
    features: [
      "50 bullet generations",
      "All job industries",
      "STAR format optimization",
      "ATS-friendly output",
      "Never expires",
    ],
    limitations: [],
    cta: "Get Basic",
    checkoutUrl: CHECKOUT_URLS.basic,
    popular: false,
  },
  {
    id: "lifetime",
    name: "Lifetime",
    price: 19.99,
    description: "Unlimited forever",
    features: [
      "Unlimited generations",
      "All job industries",
      "STAR format optimization",
      "ATS-friendly output",
      "Priority support",
      "Future updates included",
    ],
    limitations: [],
    cta: "Get Lifetime",
    checkoutUrl: CHECKOUT_URLS.lifetime,
    popular: true,
  },
] as const

/**
 * Props for the PricingSection component.
 */
export interface PricingSectionProps {
  /** Current user tier */
  currentTier?: "free" | "basic" | "lifetime"
}

/**
 * Pricing section with tier comparison cards.
 */
export function PricingSection({ currentTier = "free" }: PricingSectionProps) {
  /**
   * Handle checkout button click.
   */
  const handleCheckout = (checkoutUrl: string | null) => {
    if (checkoutUrl) {
      window.open(checkoutUrl, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <section id="pricing" className="py-12 sm:py-16">
      <div className="text-center mb-10">
        <h2
          className={cn(
            "text-2xl sm:text-3xl font-bold",
            "text-gray-900 dark:text-gray-100"
          )}
        >
          Simple Pricing
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          One-time payment. No subscriptions. No hidden fees.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3 max-w-4xl mx-auto">
        {TIERS.map((tier) => {
          const isCurrentTier = currentTier === tier.id
          const isUpgrade =
            (currentTier === "free" && tier.id !== "free") ||
            (currentTier === "basic" && tier.id === "lifetime")

          return (
            <Card
              key={tier.id}
              padded
              className={cn(
                "relative flex flex-col",
                tier.popular && "ring-2 ring-brand-500 dark:ring-brand-400",
                isCurrentTier && "bg-gray-50 dark:bg-gray-800/50"
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
              <div className="text-center mb-6">
                <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                  {tier.price === 0 ? "Free" : `$${tier.price}`}
                </span>
                {tier.price > 0 && (
                  <span className="text-gray-500 dark:text-gray-400 ml-1">
                    one-time
                  </span>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-2 mb-6 flex-1">
                {tier.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                  >
                    <CheckIcon
                      size={16}
                      className="shrink-0 mt-0.5 text-green-500"
                    />
                    {feature}
                  </li>
                ))}
                {tier.limitations.map((limitation, index) => (
                  <li
                    key={`limitation-${index}`}
                    className="flex items-start gap-2 text-sm text-gray-400 dark:text-gray-500"
                  >
                    <span className="shrink-0 mt-0.5 w-4 text-center">•</span>
                    {limitation}
                  </li>
                ))}
              </ul>

              {/* CTA button */}
              <Button
                variant={
                  isCurrentTier
                    ? "secondary"
                    : tier.popular
                    ? "primary"
                    : "outline"
                }
                fullWidth
                disabled={
                  isCurrentTier || (!isUpgrade && currentTier !== "free")
                }
                onClick={() => handleCheckout(tier.checkoutUrl)}
              >
                {isCurrentTier ? "Current Plan" : tier.cta}
              </Button>
            </Card>
          )
        })}
      </div>

      {/* Trust badges */}
      <div className="mt-10 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          🔒 Secure payment via LemonSqueezy • 30-day money-back guarantee • No
          account required
        </p>
      </div>
    </section>
  )
}
