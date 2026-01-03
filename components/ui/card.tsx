import { type HTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

/**
 * Card component props.
 */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Add padding to the card */
  padded?: boolean
  /** Add hover effect */
  hoverable?: boolean
}

/**
 * Card container component.
 *
 * @example
 * <Card padded>
 *   <h2>Title</h2>
 *   <p>Content here</p>
 * </Card>
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { className, padded = true, hoverable = false, children, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          "rounded-xl border bg-white",
          "border-gray-200 dark:border-gray-800",
          "dark:bg-gray-900",
          // Shadow
          "shadow-sm",
          // Padding
          padded && "p-6",
          // Hover effect
          hoverable && ["transition-shadow duration-200", "hover:shadow-md"],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = "Card"

/**
 * Card header section.
 */
export const CardHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("mb-4", className)} {...props} />
))

CardHeader.displayName = "CardHeader"

/**
 * Card title.
 */
export const CardTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold text-gray-900 dark:text-gray-100",
      className
    )}
    {...props}
  />
))

CardTitle.displayName = "CardTitle"

/**
 * Card description.
 */
export const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-600 dark:text-gray-400 mt-1", className)}
    {...props}
  />
))

CardDescription.displayName = "CardDescription"

/**
 * Card content section.
 */
export const CardContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
))

CardContent.displayName = "CardContent"

/**
 * Card footer section.
 */
export const CardFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mt-4 flex items-center gap-3", className)}
    {...props}
  />
))

CardFooter.displayName = "CardFooter"
