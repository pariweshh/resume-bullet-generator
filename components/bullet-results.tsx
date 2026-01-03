"use client"

import { useState, useCallback } from "react"
import {
  Button,
  Card,
  Badge,
  CopyIcon,
  CheckIcon,
  DownloadIcon,
} from "@/components/ui"
import { cn } from "@/lib/utils"

/**
 * Props for the BulletResults component.
 */
export interface BulletResultsProps {
  /** Array of generated bullet points */
  bullets: string[]
  /** Callback to generate new bullets */
  onGenerateNew: () => void
}

/**
 * Props for individual bullet item.
 */
interface BulletItemProps {
  bullet: string
  index: number
}

/**
 * Individual bullet point with copy functionality.
 */
function BulletItem({ bullet, index }: BulletItemProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(bullet)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }, [bullet])

  return (
    <div
      className={cn(
        "group relative flex items-start gap-3 p-4 rounded-lg",
        "border border-gray-200 dark:border-gray-700",
        "bg-white dark:bg-gray-900",
        "hover:border-brand-300 dark:hover:border-brand-700",
        "transition-colors duration-150"
      )}
    >
      {/* Bullet number */}
      <span
        className={cn(
          "flex-shrink-0 flex items-center justify-center",
          "w-6 h-6 rounded-full text-xs font-medium",
          "bg-brand-100 text-brand-700",
          "dark:bg-brand-900/30 dark:text-brand-300"
        )}
      >
        {index + 1}
      </span>

      {/* Bullet text */}
      <p className="flex-1 text-gray-700 dark:text-gray-300 leading-relaxed pr-10">
        {bullet}
      </p>

      {/* Copy button */}
      <button
        onClick={handleCopy}
        className={cn(
          "absolute right-3 top-3",
          "p-2 rounded-md",
          "text-gray-400 hover:text-gray-600",
          "dark:text-gray-500 dark:hover:text-gray-300",
          "hover:bg-gray-100 dark:hover:bg-gray-800",
          "opacity-0 group-hover:opacity-100 focus:opacity-100",
          "transition-all duration-150",
          copied && "text-green-600 dark:text-green-400"
        )}
        title={copied ? "Copied!" : "Copy to clipboard"}
        aria-label={copied ? "Copied to clipboard" : "Copy bullet point"}
      >
        {copied ? <CheckIcon size={18} /> : <CopyIcon size={18} />}
      </button>
    </div>
  )
}

/**
 * Displays generated bullet points with copy and export functionality.
 */
export function BulletResults({ bullets, onGenerateNew }: BulletResultsProps) {
  const [allCopied, setAllCopied] = useState(false)

  /**
   * Copies all bullets to clipboard as a formatted list.
   */
  const handleCopyAll = useCallback(async () => {
    try {
      const formattedBullets = bullets.map((b) => `• ${b}`).join("\n\n")
      await navigator.clipboard.writeText(formattedBullets)
      setAllCopied(true)
      setTimeout(() => setAllCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy all:", error)
    }
  }, [bullets])

  /**
   * Downloads bullets as a text file.
   */
  const handleDownload = useCallback(() => {
    const formattedBullets = bullets.map((b) => `• ${b}`).join("\n\n")
    const blob = new Blob([formattedBullets], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "resume-bullets.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [bullets])

  if (bullets.length === 0) {
    return null
  }

  return (
    <Card padded={false} className="overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Generated Bullets
          </h2>
          <Badge variant="success" size="sm">
            {bullets.length} results
          </Badge>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyAll}
            className="hidden sm:inline-flex"
          >
            {allCopied ? (
              <>
                <CheckIcon size={16} />
                Copied!
              </>
            ) : (
              <>
                <CopyIcon size={16} />
                Copy All
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="hidden sm:inline-flex"
          >
            <DownloadIcon size={16} />
            Download
          </Button>
        </div>
      </div>

      {/* Bullets list */}
      <div className="p-4 space-y-3">
        {bullets.map((bullet, index) => (
          <BulletItem key={index} bullet={bullet} index={index} />
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Mobile action buttons */}
          <div className="flex items-center gap-2 sm:hidden w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyAll}
              className="flex-1"
            >
              {allCopied ? (
                <>
                  <CheckIcon size={16} />
                  Copied!
                </>
              ) : (
                <>
                  <CopyIcon size={16} />
                  Copy All
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="flex-1"
            >
              <DownloadIcon size={16} />
              Download
            </Button>
          </div>

          {/* Tips */}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            💡 Tip: Customize these bullets with your specific metrics and
            achievements
          </p>

          {/* Generate new button */}
          <Button variant="secondary" size="sm" onClick={onGenerateNew}>
            Generate New
          </Button>
        </div>
      </div>
    </Card>
  )
}
