import { cn } from "@/lib/utils"

/**
 * Current year for copyright.
 * Using a constant to avoid hydration mismatch with new Date() in client components.
 * Update this annually or use a build-time environment variable.
 */
const CURRENT_YEAR = new Date().getFullYear()

/**
 * Footer component with links and copyright.
 */
export function Footer() {
  return (
    <footer
      className={cn(
        "border-t border-gray-200 dark:border-gray-800",
        "bg-gray-50 dark:bg-gray-900/50"
      )}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {CURRENT_YEAR} Resume Bullet Generator. All rights reserved.
          </p>

          {/* Links */}
          <nav className="flex items-center gap-6">
            <a
              href="#how-it-works"
              className={cn(
                "text-sm text-gray-500 hover:text-gray-700",
                "dark:text-gray-400 dark:hover:text-gray-200",
                "transition-colors"
              )}
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className={cn(
                "text-sm text-gray-500 hover:text-gray-700",
                "dark:text-gray-400 dark:hover:text-gray-200",
                "transition-colors"
              )}
            >
              Pricing
            </a>
            <a
              href="mailto:support@example.com"
              className={cn(
                "text-sm text-gray-500 hover:text-gray-700",
                "dark:text-gray-400 dark:hover:text-gray-200",
                "transition-colors"
              )}
            >
              Support
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
