import { type HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

/**
 * Skeleton component props.
 */
export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Width of the skeleton (CSS value) */
  width?: string | number
  /** Height of the skeleton (CSS value) */
  height?: string | number
  /** Make the skeleton circular */
  circle?: boolean
}

/**
 * Skeleton loading placeholder component.
 *
 * @example
 * // Text line
 * <Skeleton width="80%" height={20} />
 *
 * @example
 * // Avatar circle
 * <Skeleton circle width={40} height={40} />
 *
 * @example
 * // Full width block
 * <Skeleton height={100} />
 */
export function Skeleton({
  className,
  width,
  height,
  circle = false,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        // Base skeleton animation (defined in globals.css)
        "skeleton",
        // Default shape
        circle ? "rounded-full" : "rounded-md",
        className
      )}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        ...style,
      }}
      aria-hidden="true"
      {...props}
    />
  )
}

/**
 * Skeleton for text lines.
 */
export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number
  className?: string
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={16}
          width={i === lines - 1 ? "60%" : "100%"}
        />
      ))}
    </div>
  )
}

/**
 * Skeleton for a bullet point result.
 */
export function SkeletonBullet({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700",
        className
      )}
    >
      <Skeleton circle width={24} height={24} />
      <div className="flex-1 space-y-2">
        <Skeleton height={16} width="95%" />
        <Skeleton height={16} width="70%" />
      </div>
    </div>
  )
}

/**
 * Skeleton for multiple bullet results.
 */
export function SkeletonBulletList({
  count = 5,
  className,
}: {
  count?: number
  className?: string
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonBullet key={i} />
      ))}
    </div>
  )
}
