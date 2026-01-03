import { Badge, SparklesIcon } from "@/components/ui"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

/**
 * Props for the Header component.
 */
export interface HeaderProps {
  /** Current user tier */
  tier?: "free" | "basic" | "lifetime"
}

/**
 * Header component with logo and tier badge.
 */
export function Header({ tier = "free" }: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40",
        "border-b border-gray-200 dark:border-gray-800",
        "bg-white/80 dark:bg-gray-950/80",
        "backdrop-blur-md"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-900 dark:text-gray-100"
          >
            <Image
              src={"/logo.png"}
              width={500}
              height={500}
              alt="Logo"
              className="w-auto h-16"
            />

            <span className="font-semibold text-lg sm:hidden">BulletGen</span>
          </Link>

          {/* Tier badge */}
          <div className="flex items-center gap-3">
            {tier === "free" && (
              <Badge variant="default" size="sm">
                Free
              </Badge>
            )}
            {tier === "basic" && (
              <Badge variant="primary" size="sm">
                Basic
              </Badge>
            )}
            {tier === "lifetime" && (
              <Badge variant="success" size="sm">
                ✨ Lifetime
              </Badge>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
