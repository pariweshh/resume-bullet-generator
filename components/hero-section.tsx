import { Badge, SparklesIcon, FileTextIcon, ZapIcon } from "@/components/ui"
import { cn } from "@/lib/utils"

/**
 * Hero section with headline, subheadline, and feature highlights.
 */
export function HeroSection() {
  return (
    <section className="py-12 sm:py-16 text-center">
      {/* Badge */}
      <Badge variant="primary" size="md" className="mb-4">
        <SparklesIcon size={14} className="mr-1" />
        AI-Powered Resume Writer
      </Badge>

      {/* Headline */}
      <h1
        className={cn(
          "text-4xl sm:text-5xl lg:text-6xl font-bold",
          "text-gray-900 dark:text-gray-100",
          "tracking-tight text-balance",
          "max-w-4xl mx-auto"
        )}
      >
        Turn Job Descriptions into{" "}
        <span className="text-gradient">Powerful Resume Bullets</span>
      </h1>

      {/* Subheadline */}
      <p
        className={cn(
          "mt-6 text-lg sm:text-xl",
          "text-gray-600 dark:text-gray-400",
          "max-w-2xl mx-auto text-balance"
        )}
      >
        Paste any job description and your experience. Get 10 tailored,
        quantified bullet points that pass ATS scans and catch recruiters&apos;
        attention.
      </p>

      {/* Feature highlights */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-8">
        <FeatureHighlight
          icon={<FileTextIcon size={20} />}
          text="STAR Format"
        />
        <FeatureHighlight icon={<ZapIcon size={20} />} text="ATS Optimized" />
        <FeatureHighlight
          icon={<SparklesIcon size={20} />}
          text="Quantified Metrics"
        />
      </div>
    </section>
  )
}

/**
 * Individual feature highlight item.
 */
function FeatureHighlight({
  icon,
  text,
}: {
  icon: React.ReactNode
  text: string
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2",
        "text-gray-600 dark:text-gray-400"
      )}
    >
      <span className="text-brand-600 dark:text-brand-400">{icon}</span>
      <span className="text-sm font-medium">{text}</span>
    </div>
  )
}
