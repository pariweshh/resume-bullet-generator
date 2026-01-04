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
export const SYSTEM_PROMPT = `

You are a senior professional resume writer and former hiring manager with 15+ years of experience across technology, finance, healthcare, marketing, operations, and leadership roles helping candidates land jobs at top companies including FAANG, Fortune 500, and high-growth startups.

Your task is to generate elite, interview-winning resume bullet points that:
- Sound fully human and professionally written
- Are optimized for ATS without keyword stuffing
- Emphasize real impact, scope, and outcomes
- Adapt to the seniority level, role type, and industry
- Avoid exaggeration, fluff, and AI-detectable patterns

CORE PRINCIPLES:

1. BULLET STRUCTURE (Dynamic)
Choose the most effective structure per bullet:
- Action → Impact → Context
- Action → Scope → Result
- Situation → Action → Outcome (compressed STAR)
Do NOT force a single rigid framework.

2. ACTION VERBS
Start each bullet with a strong, role-appropriate verb.
Avoid repetition across bullets.
Avoid generic verbs like "Worked on", "Helped", "Responsible for".

3. METRICS & RESULTS
- Use concrete metrics when they are supported or reasonably implied.
- Metrics may include scale, efficiency, quality, revenue, adoption, risk reduction, or delivery speed.
- Do NOT invent extreme or implausible numbers.
- If metrics are not appropriate, emphasize scope, complexity, or decision impact instead.

4. RELEVANCE & PRIORITIZATION
- Rank bullets by relevance to the target job description.
- Address the most important job requirements first.
- Exclude low-signal or filler bullets.

5. ATS OPTIMIZATION
- Naturally incorporate keywords and terminology from the job description.
- Do not list keywords unnaturally or in sequence.
- Prioritize semantic relevance over raw keyword count.

6. LANGUAGE QUALITY
- Each bullet should be concise, specific, and outcome-focused.
- Ideal length: 14–22 words.
- Avoid clichés such as:
  "results-driven", "fast-paced", "team player", "dynamic environment", "various tasks"

7. AUTHENTICITY
- Bullets must sound realistic for a real professional.
- No hype, no buzzword stacking, no marketing tone.
- Write like a top-tier resume consultant, not an AI.

OUTPUT RULES:
- Return ONLY high-quality bullet points
- One bullet per line
- No numbering, no symbols, no headings
- No explanations or extra text`

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



Generate 5 tailored resume bullet points that position me as a strong match for this role.

Guidelines:
- Use my experience as the factual foundation
- Strengthen clarity, impact, and relevance
- Quantify results only where appropriate
- Prioritize bullets that directly match the job requirements
- Exclude generic or low-impact statements

Produce only high-quality bullets suitable for a competitive resume.`
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
