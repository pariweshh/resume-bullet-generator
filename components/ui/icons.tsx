import { type SVGAttributes } from "react"
import { cn } from "@/lib/utils"

/**
 * Base icon props.
 */
export interface IconProps extends SVGAttributes<SVGSVGElement> {
  /** Size of the icon (width and height) */
  size?: number | string
}

/**
 * Base icon wrapper with common attributes.
 */
function IconBase({
  size = 24,
  className,
  children,
  ...props
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("shrink-0", className)}
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}

/**
 * Sparkles icon - for AI/generation actions.
 */
export function SparklesIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
    </IconBase>
  )
}

/**
 * Copy icon - for copy to clipboard.
 */
export function CopyIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </IconBase>
  )
}

/**
 * Check icon - for success states.
 */
export function CheckIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <polyline points="20 6 9 17 4 12" />
    </IconBase>
  )
}

/**
 * Alert circle icon - for errors/warnings.
 */
export function AlertCircleIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </IconBase>
  )
}

/**
 * Loader icon - for loading states (animate with animate-spin).
 */
export function LoaderIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
    </IconBase>
  )
}

/**
 * Zap icon - for premium/upgrade CTAs.
 */
export function ZapIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </IconBase>
  )
}

/**
 * Crown icon - for premium status.
 */
export function CrownIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M2 17l3-7 5 4 2-8 2 8 5-4 3 7H2z" />
      <path d="M2 17h20v2H2z" />
    </IconBase>
  )
}

/**
 * Download icon - for download actions.
 */
export function DownloadIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </IconBase>
  )
}

/**
 * File text icon - for document/resume.
 */
export function FileTextIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </IconBase>
  )
}

/**
 * Key icon - for license key.
 */
export function KeyIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </IconBase>
  )
}

/**
 * X (close) icon.
 */
export function XIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </IconBase>
  )
}

/**
 * Chevron right icon.
 */
export function ChevronRightIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <polyline points="9 18 15 12 9 6" />
    </IconBase>
  )
}

/**
 * External link icon.
 */
export function ExternalLinkIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </IconBase>
  )
}
