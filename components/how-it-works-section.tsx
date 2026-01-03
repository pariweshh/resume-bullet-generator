import { cn } from "@/lib/utils"

/**
 * Step data for how it works section.
 */
const STEPS = [
  {
    number: 1,
    title: "Paste Job Description",
    description:
      "Copy the job posting you're applying for. Include requirements, responsibilities, and key skills.",
  },
  {
    number: 2,
    title: "Add Your Experience",
    description:
      "Describe your relevant background, projects, and achievements. Don't worry about perfect formatting.",
  },
  {
    number: 3,
    title: "Get Tailored Bullets",
    description:
      "Receive 10 powerful, quantified bullet points optimized for the specific role. Copy directly to your resume.",
  },
] as const

/**
 * How it works section with 3-step process.
 */
export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-12 sm:py-16">
      <div className="text-center mb-10">
        <h2
          className={cn(
            "text-2xl sm:text-3xl font-bold",
            "text-gray-900 dark:text-gray-100"
          )}
        >
          How It Works
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Three simple steps to better resume bullets
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-3">
        {STEPS.map((step, index) => (
          <div key={step.number} className="relative">
            {/* Connector line (hidden on mobile and for last item) */}
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "hidden sm:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)]",
                  "h-0.5 bg-gray-200 dark:bg-gray-700"
                )}
                aria-hidden="true"
              />
            )}

            {/* Step content */}
            <div className="relative flex flex-col items-center text-center">
              {/* Step number */}
              <div
                className={cn(
                  "flex items-center justify-center",
                  "w-16 h-16 rounded-full",
                  "bg-brand-100 dark:bg-brand-900/30",
                  "text-brand-700 dark:text-brand-300",
                  "text-2xl font-bold",
                  "mb-4"
                )}
              >
                {step.number}
              </div>

              {/* Title */}
              <h3
                className={cn(
                  "text-lg font-semibold",
                  "text-gray-900 dark:text-gray-100",
                  "mb-2"
                )}
              >
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
