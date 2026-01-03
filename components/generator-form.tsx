"use client"

import { useState, useCallback, useTransition } from "react"
import { Button, Textarea, SparklesIcon } from "@/components/ui"
import {
  JOB_DESCRIPTION_PLACEHOLDER,
  EXPERIENCE_PLACEHOLDER,
} from "@/lib/prompts"
import { cn } from "@/lib/utils"

/**
 * Props for the GeneratorForm component.
 */
export interface GeneratorFormProps {
  /** Callback when generation is successful */
  onGenerate: (bullets: string[]) => void
  /** Callback when an error occurs */
  onError: (error: string, code?: string) => void
  /** Current license key (if any) */
  licenseKey?: string
  /** Remaining generations */
  remaining: number
  /** Current tier */
  tier: "free" | "basic" | "lifetime"
  /** Whether the user is at their limit */
  isAtLimit: boolean
}

/**
 * Input character limits.
 */
const LIMITS = {
  jobDescription: {
    min: 50,
    max: 8000,
  },
  experience: {
    min: 20,
    max: 4000,
  },
} as const

/**
 * Main form for generating resume bullet points.
 * Handles input validation, API calls, and loading states.
 */
export function GeneratorForm({
  onGenerate,
  onError,
  licenseKey,
  remaining,
  tier,
  isAtLimit,
}: GeneratorFormProps) {
  // Form state
  const [jobDescription, setJobDescription] = useState("")
  const [experience, setExperience] = useState("")

  // Validation state
  const [errors, setErrors] = useState<{
    jobDescription?: string
    experience?: string
  }>({})

  // Loading state using React 19 useTransition for better UX
  const [isPending, startTransition] = useTransition()

  /**
   * Validates the form inputs.
   * Returns true if valid, false otherwise.
   */
  const validateForm = useCallback((): boolean => {
    const newErrors: typeof errors = {}

    // Validate job description
    if (jobDescription.trim().length < LIMITS.jobDescription.min) {
      newErrors.jobDescription = `Job description must be at least ${LIMITS.jobDescription.min} characters`
    } else if (jobDescription.length > LIMITS.jobDescription.max) {
      newErrors.jobDescription = `Job description must be less than ${LIMITS.jobDescription.max.toLocaleString()} characters`
    }

    // Validate experience
    if (experience.trim().length < LIMITS.experience.min) {
      newErrors.experience = `Experience must be at least ${LIMITS.experience.min} characters`
    } else if (experience.length > LIMITS.experience.max) {
      newErrors.experience = `Experience must be less than ${LIMITS.experience.max.toLocaleString()} characters`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [jobDescription, experience])

  /**
   * Handles form submission.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Don't submit if at limit
    if (isAtLimit) {
      onError(
        "You've reached your generation limit. Please upgrade to continue.",
        "LIMIT_REACHED"
      )
      return
    }

    // Validate form
    if (!validateForm()) {
      return
    }

    // Clear previous errors
    setErrors({})

    // Use transition for better loading UX
    startTransition(async () => {
      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jobDescription: jobDescription.trim(),
            experience: experience.trim(),
            ...(licenseKey && { licenseKey }),
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          // Handle specific error codes
          const errorCode = data.code || "UNKNOWN_ERROR"
          const errorMessage =
            data.message || "An error occurred. Please try again."
          onError(errorMessage, errorCode)
          return
        }

        // Success - pass bullets to parent
        if (data.bullets && Array.isArray(data.bullets)) {
          onGenerate(data.bullets)
        } else {
          onError("Invalid response from server. Please try again.")
        }
      } catch (error) {
        console.error("Generation error:", error)
        onError("Network error. Please check your connection and try again.")
      }
    })
  }

  /**
   * Clears the form.
   */
  const handleClear = () => {
    setJobDescription("")
    setExperience("")
    setErrors({})
  }

  // Calculate if inputs are valid for enabling submit
  const isJobDescValid =
    jobDescription.trim().length >= LIMITS.jobDescription.min &&
    jobDescription.length <= LIMITS.jobDescription.max
  const isExpValid =
    experience.trim().length >= LIMITS.experience.min &&
    experience.length <= LIMITS.experience.max
  const canSubmit = isJobDescValid && isExpValid && !isAtLimit && !isPending

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Job Description Input */}
      <Textarea
        label="Job Description"
        placeholder={JOB_DESCRIPTION_PLACEHOLDER}
        value={jobDescription}
        onChange={(e) => {
          setJobDescription(e.target.value)
          // Clear error when user starts typing
          if (errors.jobDescription) {
            setErrors((prev) => ({ ...prev, jobDescription: undefined }))
          }
        }}
        error={errors.jobDescription}
        maxLength={LIMITS.jobDescription.max}
        showCount
        currentLength={jobDescription.length}
        helperText="Paste the full job posting or key requirements"
        className="min-h-[180px]"
        disabled={isPending}
      />

      {/* Experience Input */}
      <Textarea
        label="Your Experience"
        placeholder={EXPERIENCE_PLACEHOLDER}
        value={experience}
        onChange={(e) => {
          setExperience(e.target.value)
          // Clear error when user starts typing
          if (errors.experience) {
            setErrors((prev) => ({ ...prev, experience: undefined }))
          }
        }}
        error={errors.experience}
        maxLength={LIMITS.experience.max}
        showCount
        currentLength={experience.length}
        helperText="Describe your relevant skills, projects, and achievements"
        className="min-h-[150px]"
        disabled={isPending}
      />

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          type="submit"
          size="lg"
          disabled={!canSubmit}
          isLoading={isPending}
          loadingText="Generating..."
          className="flex-1"
        >
          <SparklesIcon size={20} />
          Generate Bullet Points
        </Button>

        {(jobDescription || experience) && !isPending && (
          <Button type="button" variant="ghost" size="lg" onClick={handleClear}>
            Clear
          </Button>
        )}
      </div>

      {/* Remaining generations indicator */}
      <div
        className={cn(
          "text-sm text-center",
          isAtLimit
            ? "text-red-600 dark:text-red-400"
            : "text-gray-500 dark:text-gray-400"
        )}
      >
        {isAtLimit ? (
          <span>
            You&apos;ve used all {tier === "free" ? "3 free" : ""} generations.{" "}
            <span className="font-medium">Upgrade to continue.</span>
          </span>
        ) : tier === "lifetime" ? (
          <span>Unlimited generations with Lifetime access ✨</span>
        ) : (
          <span>
            {remaining} generation{remaining !== 1 ? "s" : ""} remaining
            {tier === "free" && " today"}
          </span>
        )}
      </div>
    </form>
  )
}
