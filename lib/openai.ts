import OpenAI from "openai"

/**
 * OpenAI client instance configured with API key from environment.
 * Uses GPT-4o-mini for cost-effective, high-quality generation.
 *
 * Pricing (as of 2025):
 * - GPT-4o-mini: $0.15/1M input tokens, $0.60/1M output tokens
 * - Estimated cost per generation: ~$0.001 (less than 1 cent)
 */
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * Default model for all generations.
 * GPT-4o-mini provides excellent quality at very low cost.
 */
export const DEFAULT_MODEL = "gpt-4o-mini" as const

/**
 * Configuration for resume bullet generation.
 */
export const GENERATION_CONFIG = {
  model: DEFAULT_MODEL,
  temperature: 0.7, // Balance between creativity and consistency
  maxTokens: 1500, // Enough for 10 detailed bullets
  presencePenalty: 0.1, // Slight penalty to avoid repetition
  frequencyPenalty: 0.1, // Slight penalty for repeated phrases
} as const

/**
 * Type for OpenAI chat message roles.
 */
export type MessageRole = "system" | "user" | "assistant"

/**
 * Type for a chat message.
 */
export interface ChatMessage {
  role: MessageRole
  content: string
}

/**
 * Generates a chat completion with error handling.
 * Returns the assistant's message content or throws a descriptive error.
 *
 * @param messages - Array of chat messages
 * @param options - Optional overrides for generation config
 * @returns The generated text content
 */
export async function generateCompletion(
  messages: ChatMessage[],
  options?: Partial<typeof GENERATION_CONFIG>
): Promise<string> {
  const config = { ...GENERATION_CONFIG, ...options }

  try {
    const completion = await openai.chat.completions.create({
      model: config.model,
      messages,
      temperature: config.temperature,
      max_tokens: config.maxTokens,
      presence_penalty: config.presencePenalty,
      frequency_penalty: config.frequencyPenalty,
    })

    const content = completion.choices[0]?.message?.content

    if (!content) {
      throw new Error("No content generated from OpenAI")
    }

    return content.trim()
  } catch (error) {
    // Handle specific OpenAI errors
    if (error instanceof OpenAI.APIError) {
      switch (error.status) {
        case 401:
          throw new Error(
            "Invalid OpenAI API key. Please check your configuration."
          )
        case 429:
          throw new Error("Rate limit exceeded. Please try again in a moment.")
        case 500:
        case 502:
        case 503:
          throw new Error(
            "OpenAI service is temporarily unavailable. Please try again."
          )
        default:
          throw new Error(`OpenAI API error: ${error.message}`)
      }
    }

    // Re-throw unknown errors
    throw error
  }
}

/**
 * Estimates the token count for a string.
 * Rough estimate: ~4 characters per token for English text.
 * Use for client-side estimation only — not for billing.
 *
 * @param text - The text to estimate
 * @returns Estimated token count
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

/**
 * Checks if the input is within reasonable limits.
 * Prevents excessive API costs from very large inputs.
 *
 * @param jobDescription - The job description text
 * @param experience - The user's experience text
 * @returns Object with isValid flag and optional error message
 */
export function validateInput(
  jobDescription: string,
  experience: string
): { isValid: boolean; error?: string } {
  const MAX_JOB_DESC_LENGTH = 8000 // ~2000 tokens
  const MAX_EXPERIENCE_LENGTH = 4000 // ~1000 tokens
  const MIN_JOB_DESC_LENGTH = 50 // Minimum meaningful input
  const MIN_EXPERIENCE_LENGTH = 20

  if (jobDescription.length < MIN_JOB_DESC_LENGTH) {
    return {
      isValid: false,
      error: "Job description is too short. Please provide more details.",
    }
  }

  if (experience.length < MIN_EXPERIENCE_LENGTH) {
    return {
      isValid: false,
      error: "Experience is too short. Please provide more context.",
    }
  }

  if (jobDescription.length > MAX_JOB_DESC_LENGTH) {
    return {
      isValid: false,
      error: `Job description is too long (${jobDescription.length} characters). Maximum is ${MAX_JOB_DESC_LENGTH}.`,
    }
  }

  if (experience.length > MAX_EXPERIENCE_LENGTH) {
    return {
      isValid: false,
      error: `Experience is too long (${experience.length} characters). Maximum is ${MAX_EXPERIENCE_LENGTH}.`,
    }
  }

  return { isValid: true }
}
