import { Header, Footer } from "@/components"
import { Card } from "@/components/ui"

export const metadata = {
  title: "Privacy Policy | Resume Bullet Generator",
  description: "Privacy Policy for Resume Bullet Generator",
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-12">
        <Card className="max-w-4xl mx-auto prose prose-gray dark:prose-invert">
          <h1>Privacy Policy</h1>
          <p className="text-sm text-gray-500">Last updated: January 2025</p>

          <p>
            Resume Bullet Generator (&quot;we&quot;, &quot;our&quot;, or
            &quot;us&quot;) is operated by Pariwesh Tamrakar from New South
            Wales, Australia. This Privacy Policy explains how we collect, use,
            disclose, and safeguard your information when you use our website
            and services.
          </p>

          <p>
            By using Resume Bullet Generator, you agree to the collection and
            use of information in accordance with this policy.
          </p>

          <h2>1. Information We Collect</h2>

          <h3>1.1 Information You Provide</h3>
          <ul>
            <li>
              <strong>Job Descriptions and Experience:</strong> When you use our
              service, you input job descriptions and your professional
              experience. This content is processed by our AI system to generate
              resume bullet points but is{" "}
              <strong>not permanently stored</strong> on our servers. The data
              is transmitted, processed, and immediately discarded after
              generating your results.
            </li>
            <li>
              <strong>Payment Information:</strong> When you purchase a license,
              your payment is processed by LemonSqueezy, our third-party payment
              processor. We receive your email address and license key
              information but do not have access to your full payment card
              details. Please refer to{" "}
              <a
                href="https://www.lemonsqueezy.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                LemonSqueezy&apos;s Privacy Policy
              </a>{" "}
              for details on how they handle payment information.
            </li>
          </ul>

          <h3>1.2 Information Collected Automatically</h3>
          <ul>
            <li>
              <strong>IP Address:</strong> We collect your IP address to manage
              free tier usage limits (3 generations per day). IP addresses are
              stored temporarily and used solely for rate limiting purposes.
            </li>
            <li>
              <strong>License Key Usage:</strong> For paid users, we track the
              number of generations used against your license key to enforce
              usage limits (for Basic tier) and to provide you with remaining
              generation counts.
            </li>
          </ul>

          <h3>1.3 Local Storage</h3>
          <p>
            We store your license key in your browser&apos;s local storage to
            keep you logged in across sessions. This data remains on your device
            and is not transmitted to our servers except when validating your
            license.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide and maintain our service</li>
            <li>
              Process your job descriptions and generate resume bullet points
            </li>
            <li>Process payments and deliver license keys</li>
            <li>Enforce usage limits and prevent abuse</li>
            <li>Respond to customer support inquiries</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2>3. Third-Party Services</h2>
          <p>
            We use the following third-party services that may collect
            information:
          </p>

          <h3>3.1 OpenAI</h3>
          <p>
            We use OpenAI&apos;s GPT technology to generate resume bullet
            points. When you submit a job description and experience, this text
            is sent to OpenAI&apos;s API for processing. OpenAI processes this
            data according to their{" "}
            <a
              href="https://openai.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
            . As of our implementation, OpenAI does not use API data to train
            their models.
          </p>

          <h3>3.2 LemonSqueezy</h3>
          <p>
            Our payment processing is handled by LemonSqueezy. When you make a
            purchase, LemonSqueezy collects payment information and acts as the
            Merchant of Record. See{" "}
            <a
              href="https://www.lemonsqueezy.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              LemonSqueezy&apos;s Privacy Policy
            </a>
            .
          </p>

          <h3>3.3 Upstash</h3>
          <p>
            We use Upstash Redis for temporary data storage (usage tracking).
            Data stored includes IP addresses (hashed) and license key usage
            counts.
          </p>

          <h3>3.4 Vercel</h3>
          <p>
            Our website is hosted on Vercel. Vercel may collect standard server
            logs including IP addresses and request metadata. See{" "}
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Vercel&apos;s Privacy Policy
            </a>
            .
          </p>

          <h2>4. Data Retention</h2>
          <ul>
            <li>
              <strong>Job Descriptions & Experience:</strong> Not stored.
              Processed in real-time and immediately discarded.
            </li>
            <li>
              <strong>IP Addresses (Free Tier):</strong> Retained for 24 hours
              for rate limiting, then automatically deleted.
            </li>
            <li>
              <strong>License Usage Data:</strong> Retained for the lifetime of
              your license to track generation counts.
            </li>
            <li>
              <strong>Payment Records:</strong> Retained by LemonSqueezy
              according to their policies and legal requirements.
            </li>
          </ul>

          <h2>5. Data Security</h2>
          <p>
            We implement appropriate technical and organisational security
            measures to protect your information, including:
          </p>
          <ul>
            <li>HTTPS encryption for all data transmission</li>
            <li>Secure API authentication</li>
            <li>Limited data retention periods</li>
            <li>Access controls on our systems</li>
          </ul>
          <p>
            However, no method of transmission over the Internet or electronic
            storage is 100% secure. While we strive to use commercially
            acceptable means to protect your information, we cannot guarantee
            absolute security.
          </p>

          <h2>6. Your Rights</h2>
          <p>
            Under Australian Privacy Law and other applicable laws, you have the
            right to:
          </p>
          <ul>
            <li>
              <strong>Access:</strong> Request access to personal information we
              hold about you
            </li>
            <li>
              <strong>Correction:</strong> Request correction of inaccurate
              information
            </li>
            <li>
              <strong>Deletion:</strong> Request deletion of your personal
              information (note: we retain minimal data, and job descriptions
              are not stored)
            </li>
            <li>
              <strong>Data Portability:</strong> Request a copy of your data in
              a structured format
            </li>
          </ul>
          <p>
            To exercise these rights, please contact us at{" "}
            <a href="mailto:pariweshhtamrakar@gmail.com">
              pariweshhtamrakar@gmail.com
            </a>
            .
          </p>

          <h2>7. Children&apos;s Privacy</h2>
          <p>
            Our service is not intended for individuals under 16 years of age.
            We do not knowingly collect personal information from children under
            16. If we become aware that we have collected personal information
            from a child under 16, we will take steps to delete that
            information.
          </p>

          <h2>8. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries
            other than Australia, including the United States (where our
            third-party service providers are located). These countries may have
            different data protection laws. By using our service, you consent to
            the transfer of your information to these countries.
          </p>

          <h2>9. Cookies and Tracking</h2>
          <p>
            We do not use cookies for tracking or advertising purposes. We use
            browser local storage solely to store your license key for
            authentication purposes. This is essential for the service to
            function and cannot be disabled while using our service.
          </p>

          <h2>10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the &quot;Last updated&quot; date. You are advised to
            review this Privacy Policy periodically for any changes.
          </p>

          <h2>11. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or our data
            practices, please contact us:
          </p>
          <ul>
            <li>
              <strong>Email:</strong>{" "}
              <a href="mailto:pariweshhtamrakar@gmail.com">
                pariweshhtamrakar@gmail.com
              </a>
            </li>
            <li>
              <strong>Location:</strong> New South Wales, Australia
            </li>
          </ul>

          <h2>12. Complaints</h2>
          <p>
            If you believe we have breached the Australian Privacy Principles
            and wish to make a complaint, please contact us at the email address
            above. We will investigate your complaint and respond within 30
            days. If you are not satisfied with our response, you may lodge a
            complaint with the Office of the Australian Information Commissioner
            (OAIC) at{" "}
            <a
              href="https://www.oaic.gov.au"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.oaic.gov.au
            </a>
            .
          </p>
        </Card>
      </main>
      <Footer />
    </>
  )
}
