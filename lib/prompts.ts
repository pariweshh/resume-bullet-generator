/**
 * System prompt that defines the AI's role and output rules.
 * This is the "personality" and instruction set for the model.
 *
 * Key principles:
 * 1. STAR format (Situation, Task, Action, Result) compressed into one line
 * 2. Strong action verbs at the start
 * 3. Quantified results with metrics
 * 4. Keyword optimization for ATS (Applicant Tracking Systems)
 * 5. Concise but impactful language
 */
export const SYSTEM_PROMPT = `You are an expert resume writer with 15+ years of experience helping candidates land jobs at top companies including FAANG, Fortune 500, and high-growth startups.

Your specialty is crafting powerful, quantified resume bullet points that:
- Pass ATS (Applicant Tracking System) scans
- Catch recruiters' attention in the 6-second resume scan
- Demonstrate impact through concrete metrics

RULES FOR EVERY BULLET POINT:

1. FORMAT: Use the STAR method compressed into a single line
   - Start with a strong ACTION VERB (Led, Spearheaded, Architected, Drove, Optimized)
   - Include the CONTEXT briefly
   - Describe the specific ACTION taken
   - End with QUANTIFIED RESULTS

2. METRICS: Every bullet MUST include at least one metric. If the user doesn't provide exact numbers, create realistic estimates based on typical outcomes:
   - Percentages: "increased by 40%", "reduced by 25%"
   - Numbers: "managed team of 8", "processed 10,000+ records"
   - Money: "saved $50K annually", "generated $2M pipeline"
   - Time: "cut processing time from 2 days to 4 hours"
   - Scale: "served 100K+ users", "across 12 markets"

3. ACTION VERBS: Start each bullet with a powerful, varied verb:
   - Leadership: Spearheaded, Directed, Orchestrated, Championed, Mobilized
   - Achievement: Achieved, Exceeded, Surpassed, Attained, Delivered
   - Creation: Designed, Developed, Built, Launched, Established
   - Improvement: Optimized, Streamlined, Enhanced, Transformed, Revamped
   - Analysis: Analyzed, Identified, Assessed, Evaluated, Diagnosed

4. LENGTH: Each bullet should be 15-25 words. Concise but complete.

5. KEYWORDS: Naturally incorporate relevant keywords from the job description to optimize for ATS matching.

6. VARIETY: Use different action verbs and sentence structures across the 10 bullets. No repetition.

7. RELEVANCE: Prioritize bullets that directly address the job requirements. The most relevant bullets should come first.

OUTPUT FORMAT:
- Return EXACTLY 10 bullet points
- One bullet per line
- No numbering, no bullet characters, no extra formatting
- Just the plain text of each bullet, separated by newlines`

/**
 * Generates the user prompt with job description and experience.
 * This is the specific request for each generation.
 *
 * @param jobDescription - The full job posting or key requirements
 * @param experience - User's relevant experience, skills, or accomplishments
 * @returns Formatted user prompt string
 */
export function createUserPrompt(
  jobDescription: string,
  experience: string
): string {
  return `TARGET JOB DESCRIPTION:
"""
${jobDescription.trim()}
"""

MY EXPERIENCE AND BACKGROUND:
"""
${experience.trim()}
"""

Based on the job description above, generate 10 tailored resume bullet points that position me as the ideal candidate. Use my experience as the foundation, but enhance and quantify the achievements to maximize impact. Prioritize bullets that directly address the key requirements in the job posting.`
}

/**
 * Parses the AI response into individual bullet points.
 * Handles various edge cases in the output.
 *
 * @param response - Raw response from OpenAI
 * @returns Array of bullet point strings
 */
export function parseBulletPoints(response: string): string[] {
  return response
    .split("\n")
    .map((line) => line.trim())
    .map((line) => {
      // Remove common prefixes that the model might add despite instructions
      return line
        .replace(/^[\d]+[.)]\s*/, "") // Remove "1. " or "1) "
        .replace(/^[-•*]\s*/, "") // Remove "- " or "• " or "* "
        .replace(/^bullet\s*:?\s*/i, "") // Remove "Bullet: "
        .trim()
    })
    .filter((line) => {
      // Filter out empty lines and meta-commentary
      if (!line) return false
      if (line.toLowerCase().startsWith("here are")) return false
      if (line.toLowerCase().startsWith("based on")) return false
      if (line.toLowerCase().includes("bullet point")) return false
      return line.length >= 20 // Minimum reasonable bullet length
    })
    .slice(0, 10) // Ensure max 10 bullets
}

/**
 * Example bullets for UI placeholder/demo purposes.
 * These show users what good output looks like.
 */
export const EXAMPLE_BULLETS = [
  "Spearheaded migration of legacy monolith to microservices architecture, reducing deployment time by 75% and enabling 3x faster feature releases across 8 product teams",
  "Architected real-time data pipeline processing 2M+ events daily using Kafka and Spark, improving analytics latency from 24 hours to under 15 minutes",
  "Led cross-functional team of 12 engineers to deliver flagship mobile app 2 weeks ahead of schedule, achieving 4.8-star rating with 500K+ downloads in first quarter",
  "Optimized database queries and implemented caching layer, reducing API response times by 60% and saving $40K annually in infrastructure costs",
  "Mentored 5 junior developers through structured code reviews and pair programming sessions, resulting in 40% reduction in production bugs",
]

/**
 * Placeholder text for the job description input.
 */
export const JOB_DESCRIPTION_PLACEHOLDER = `Paste the job description here...

Example:
We're looking for a Senior Software Engineer to join our platform team. You'll be responsible for designing and building scalable backend services, mentoring junior engineers, and collaborating with product teams to deliver new features.

Requirements:
- 5+ years of experience with Python or Node.js
- Experience with cloud platforms (AWS/GCP)
- Strong understanding of distributed systems
- Excellent communication skills`

/**
 * Placeholder text for the experience input.
 */
export const EXPERIENCE_PLACEHOLDER = `Describe your relevant experience...

Example:
- 6 years as a backend engineer, mostly Python and Node.js
- Built APIs that handle millions of requests
- Led a team of 4 developers on a payment integration project
- Worked at a fintech startup and a large e-commerce company
- Reduced server costs by optimizing database queries
- Mentored 2 interns who got converted to full-time`
