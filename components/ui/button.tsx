import { forwardRef, type ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

/**
 * Button variant styles.
 */
const variants = {
  primary: [
    "bg-brand-600 text-white",
    "hover:bg-brand-700",
    "focus-visible:ring-brand-500",
    "disabled:bg-brand-300",
  ].join(" "),

  secondary: [
    "bg-gray-100 text-gray-900",
    "hover:bg-gray-200",
    "focus-visible:ring-gray-500",
    "disabled:bg-gray-100 disabled:text-gray-400",
    "dark:bg-gray-800 dark:text-gray-100",
    "dark:hover:bg-gray-700",
  ].join(" "),

  outline: [
    "border-2 border-gray-300 bg-transparent text-gray-700",
    "hover:bg-gray-50 hover:border-gray-400",
    "focus-visible:ring-gray-500",
    "disabled:border-gray-200 disabled:text-gray-400",
    "dark:border-gray-600 dark:text-gray-300",
    "dark:hover:bg-gray-800 dark:hover:border-gray-500",
  ].join(" "),

  ghost: [
    "bg-transparent text-gray-700",
    "hover:bg-gray-100",
    "focus-visible:ring-gray-500",
    "disabled:text-gray-400",
    "dark:text-gray-300",
    "dark:hover:bg-gray-800",
  ].join(" "),

  success: [
    "bg-success-600 text-white",
    "hover:bg-success-500",
    "focus-visible:ring-success-500",
    "disabled:bg-success-600/50",
  ].join(" "),
} as const

/**
 * Button size styles.
 */
const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
  xl: "px-8 py-4 text-xl",
} as const

/**
 * Loading spinner component.
 */
function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin", className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

/**
 * Button component props.
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: keyof typeof variants
  /** Size of the button */
  size?: keyof typeof sizes
  /** Show loading spinner and disable button */
  isLoading?: boolean
  /** Text to show while loading (defaults to children) */
  loadingText?: string
  /** Make button full width */
  fullWidth?: boolean
}

/**
 * Button component with multiple variants, sizes, and loading state.
 *
 * @example
 * // Primary button
 * <Button variant="primary">Click me</Button>
 *
 * @example
 * // Loading state
 * <Button isLoading loadingText="Generating...">Generate</Button>
 *
 * @example
 * // Full width with large size
 * <Button size="lg" fullWidth>Submit</Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      loadingText,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center gap-2",
          "font-medium rounded-lg",
          "transition-colors duration-150",
          "cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed",
          // Variant styles
          variants[variant],
          // Size styles
          sizes[size],
          // Full width
          fullWidth && "w-full",
          // Custom classes
          className
        )}
        {...props}
      >
        {isLoading && (
          <LoadingSpinner
            className={cn(
              size === "sm" && "h-3 w-3",
              size === "md" && "h-4 w-4",
              size === "lg" && "h-5 w-5",
              size === "xl" && "h-6 w-6"
            )}
          />
        )}
        {isLoading && loadingText ? loadingText : children}
      </button>
    )
  }
)

Button.displayName = "Button"
