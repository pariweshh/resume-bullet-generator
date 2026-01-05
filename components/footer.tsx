import { cn } from "@/lib/utils"
import Link from "next/link"

/**
 * Current year for copyright.
 * Using a constant to avoid hydration mismatch with new Date() in client components.
 * Update this annually or use a build-time environment variable.
 */
const CURRENT_YEAR = 2025

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
        <div className="flex flex-col gap-6">
          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link
              href="#how-it-works"
              className={cn(
                "text-sm text-gray-500 hover:text-gray-700",
                "dark:text-gray-400 dark:hover:text-gray-200",
                "transition-colors"
              )}
            >
              How It Works
            </Link>
            <Link
              href="#pricing"
              className={cn(
                "text-sm text-gray-500 hover:text-gray-700",
                "dark:text-gray-400 dark:hover:text-gray-200",
                "transition-colors"
              )}
            >
              Pricing
            </Link>
            <Link
              href="/privacy-policy"
              className={cn(
                "text-sm text-gray-500 hover:text-gray-700",
                "dark:text-gray-400 dark:hover:text-gray-200",
                "transition-colors"
              )}
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className={cn(
                "text-sm text-gray-500 hover:text-gray-700",
                "dark:text-gray-400 dark:hover:text-gray-200",
                "transition-colors"
              )}
            >
              Terms of Service
            </Link>
            <Link
              href="/refund-policy"
              className={cn(
                "text-sm text-gray-500 hover:text-gray-700",
                "dark:text-gray-400 dark:hover:text-gray-200",
                "transition-colors"
              )}
            >
              Refund Policy
            </Link>
            <a
              href="mailto:pariweshhtamrakar@gmail.com"
              className={cn(
                "text-sm text-gray-500 hover:text-gray-700",
                "dark:text-gray-400 dark:hover:text-gray-200",
                "transition-colors"
              )}
            >
              Contact
            </a>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            © {CURRENT_YEAR} Resume Bullet Generator. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
