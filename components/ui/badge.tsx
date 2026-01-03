import { type HTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

/**
 * Badge variant styles.
 */
const variants = {
  default: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  primary: "bg-brand-100 text-brand-700 dark:bg-brand-600 dark:text-white",
  success: "bg-green-100 text-green-700 dark:bg-green-600 dark:text-white",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-600 dark:text-white",
  error: "bg-red-100 text-red-700 dark:bg-red-600 dark:text-white",
} as const

/**
 * Badge size styles.
 */
const sizes = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
  lg: "px-3 py-1.5 text-base",
} as const

/**
 * Badge component props.
 */
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Visual style variant */
  variant?: keyof typeof variants
  /** Size of the badge */
  size?: keyof typeof sizes
}

/**
 * Badge component for status indicators and labels.
 *
 * @example
 * <Badge variant="success">Active</Badge>
 * <Badge variant="warning" size="sm">Beta</Badge>
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          // Base styles
          "inline-flex items-center font-medium rounded-full",
          // Variant
          variants[variant],
          // Size
          sizes[size],
          className
        )}
        {...props}
      />
    )
  }
)

Badge.displayName = "Badge"
