import { forwardRef, type TextareaHTMLAttributes, useId } from "react"
import { cn } from "@/lib/utils"

/**
 * Textarea component props.
 */
export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Label text displayed above the textarea */
  label?: string
  /** Helper text displayed below the textarea */
  helperText?: string
  /** Error message - shows error styling when present */
  error?: string
  /** Show character count (requires maxLength to be set) */
  showCount?: boolean
  /** Current character count (if controlled externally) */
  currentLength?: number
}

/**
 * Textarea component with label, error handling, and character count.
 *
 * @example
 * // Basic usage
 * <Textarea
 *   label="Job Description"
 *   placeholder="Paste the job description here..."
 * />
 *
 * @example
 * // With error
 * <Textarea
 *   label="Experience"
 *   error="Experience is required"
 * />
 *
 * @example
 * // With character count
 * <Textarea
 *   label="Description"
 *   maxLength={8000}
 *   showCount
 * />
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      showCount = false,
      currentLength,
      maxLength,
      id: providedId,
      ...props
    },
    ref
  ) => {
    // Generate a unique ID if not provided
    const generatedId = useId()
    const id = providedId ?? generatedId

    const hasError = Boolean(error)
    const showCharCount = showCount && maxLength !== undefined

    // Calculate character count
    const charCount = currentLength ?? 0
    const isNearLimit = maxLength ? charCount > maxLength * 0.9 : false
    const isOverLimit = maxLength ? charCount > maxLength : false

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "block text-sm font-medium mb-1.5",
              hasError
                ? "text-red-600 dark:text-red-400"
                : "text-gray-700 dark:text-gray-300"
            )}
          >
            {label}
          </label>
        )}

        {/* Textarea */}
        <textarea
          ref={ref}
          id={id}
          maxLength={maxLength}
          aria-invalid={hasError}
          aria-describedby={
            [error && `${id}-error`, helperText && `${id}-helper`]
              .filter(Boolean)
              .join(" ") || undefined
          }
          className={cn(
            // Base styles
            "block w-full rounded-lg border px-4 py-3",
            "text-base text-gray-900 placeholder-gray-500",
            "transition-colors duration-150",
            "resize-y min-h-30",
            // Focus styles
            "focus:outline-none focus:ring-2 focus:ring-offset-0",
            // Dark mode
            "dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400",
            // Default border
            !hasError && [
              "border-gray-300 dark:border-gray-600",
              "focus:border-brand-500 focus:ring-brand-500/20",
              "dark:focus:border-brand-400",
            ],
            // Error border
            hasError && [
              "border-red-500 dark:border-red-400",
              "focus:border-red-500 focus:ring-red-500/20",
            ],
            // Disabled
            "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
            "dark:disabled:bg-gray-800 dark:disabled:text-gray-500",
            // Custom classes
            className
          )}
          {...props}
        />

        {/* Bottom row: helper/error text and character count */}
        <div className="mt-1.5 flex justify-between gap-4">
          {/* Error or helper text */}
          <div className="flex-1">
            {error && (
              <p
                id={`${id}-error`}
                className="text-sm text-red-600 dark:text-red-400"
                role="alert"
              >
                {error}
              </p>
            )}
            {!error && helperText && (
              <p
                id={`${id}-helper`}
                className="text-sm text-gray-500 dark:text-gray-400"
              >
                {helperText}
              </p>
            )}
          </div>

          {/* Character count */}
          {showCharCount && (
            <p
              className={cn(
                "text-sm tabular-nums",
                isOverLimit
                  ? "text-red-600 dark:text-red-400 font-medium"
                  : isNearLimit
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-gray-500 dark:text-gray-400"
              )}
            >
              {charCount.toLocaleString()}/{maxLength.toLocaleString()}
            </p>
          )}
        </div>
      </div>
    )
  }
)

Textarea.displayName = "Textarea"
