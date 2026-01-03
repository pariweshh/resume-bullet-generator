"use client"

import { AlertCircleIcon, XIcon } from "@/components/ui"
import { cn } from "@/lib/utils"

/**
 * Props for the ErrorAlert component.
 */
export interface ErrorAlertProps {
  /** Error message to display */
  message: string
  /** Optional error code */
  code?: string
  /** Callback to dismiss the alert */
  onDismiss?: () => void
  /** Whether to show upgrade CTA */
  showUpgrade?: boolean
  /** Callback for upgrade button */
  onUpgrade?: () => void
}

/**
 * Error alert component for displaying error messages.
 */
export function ErrorAlert({
  message,
  code,
  onDismiss,
  showUpgrade = false,
  onUpgrade,
}: ErrorAlertProps) {
  const isLimitError = code === "LIMIT_REACHED"

  return (
    <div
      role="alert"
      className={cn(
        "relative flex items-start gap-3 p-4 rounded-lg",
        "border",
        isLimitError
          ? "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800"
          : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
      )}
    >
      {/* Icon */}
      <AlertCircleIcon
        size={20}
        className={cn(
          "shrink-0 mt-0.5",
          isLimitError
            ? "text-amber-600 dark:text-amber-400"
            : "text-red-600 dark:text-red-400"
        )}
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-medium",
            isLimitError
              ? "text-amber-800 dark:text-amber-200"
              : "text-red-800 dark:text-red-200"
          )}
        >
          {message}
        </p>

        {/* Upgrade button for limit errors */}
        {showUpgrade && isLimitError && onUpgrade && (
          <button
            onClick={onUpgrade}
            className={cn(
              "mt-2 text-sm font-medium underline underline-offset-2",
              "text-amber-700 hover:text-amber-900",
              "dark:text-amber-300 dark:hover:text-amber-100",
              "transition-colors"
            )}
          >
            Upgrade to continue →
          </button>
        )}
      </div>

      {/* Dismiss button */}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className={cn(
            "shrink-0 p-1 rounded-md",
            "transition-colors",
            isLimitError
              ? "text-amber-500 hover:text-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/40"
              : "text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/40"
          )}
          aria-label="Dismiss error"
        >
          <XIcon size={16} />
        </button>
      )}
    </div>
  )
}
