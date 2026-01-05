import { Header, Footer } from "@/components"
import { Card } from "@/components/ui"

export const metadata = {
  title: "Refund Policy | Resume Bullet Generator",
  description: "Refund Policy for Resume Bullet Generator",
}

export default function RefundPolicyPage() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-12">
        <Card className="max-w-4xl mx-auto prose prose-gray dark:prose-invert">
          <h1>Refund Policy</h1>
          <p className="text-sm text-gray-500">Last updated: January 2025</p>

          <p>
            This Refund Policy applies to purchases made through Resume Bullet
            Generator, operated by Pariwesh Tamrakar from New South Wales,
            Australia.
          </p>

          <p>
            We want you to be satisfied with your purchase. If the Service does
            not work as described, we&apos;re here to help.
          </p>

          <h2>1. Refund Eligibility</h2>

          <h3>1.1 Refund Window</h3>
          <p>
            Refund requests must be submitted within <strong>7 days</strong> of
            your original purchase date. Requests made after this period will
            not be eligible for a refund.
          </p>

          <h3>1.2 Valid Reasons for Refund</h3>
          <p>We will issue a refund if:</p>
          <ul>
            <li>
              <strong>Technical Issues:</strong> The Service does not work as
              described and we are unable to resolve the issue after reasonable
              troubleshooting efforts.
            </li>
            <li>
              <strong>Service Unavailability:</strong> The Service is
              unavailable for an extended period (more than 48 hours) and we
              cannot provide a resolution.
            </li>
            <li>
              <strong>License Delivery Failure:</strong> You did not receive
              your license key and we are unable to deliver it after multiple
              attempts.
            </li>
            <li>
              <strong>Duplicate Purchase:</strong> You accidentally purchased
              the same product twice. We will refund the duplicate purchase.
            </li>
          </ul>

          <h3>1.3 Non-Refundable Situations</h3>
          <p>Refunds will generally not be provided for:</p>
          <ul>
            <li>
              <strong>Change of Mind:</strong> Deciding you no longer need the
              Service after purchase.
            </li>
            <li>
              <strong>Dissatisfaction with AI Output:</strong> Not liking the
              style or content of generated bullet points (as AI output varies
              and is subjective). However, we encourage you to contact us with
              feedback, and we&apos;ll try to help.
            </li>
            <li>
              <strong>Failure to Read Terms:</strong> Not understanding what the
              Service provides before purchase (please review our website and
              free tier before purchasing).
            </li>
            <li>
              <strong>Used Generations:</strong> For Basic licenses where a
              significant portion of generations have been used (more than 10 of
              50 generations).
            </li>
            <li>
              <strong>Violation of Terms:</strong> If your access was terminated
              due to a violation of our Terms of Service.
            </li>
          </ul>

          <h2>2. How to Request a Refund</h2>

          <h3>2.1 Contact Us</h3>
          <p>
            To request a refund, email us at{" "}
            <a href="mailto:pariweshhtamrakar@gmail.com">
              pariweshhtamrakar@gmail.com
            </a>{" "}
            with the following information:
          </p>
          <ul>
            <li>
              Your order number or transaction ID (from your LemonSqueezy
              receipt)
            </li>
            <li>The email address used for the purchase</li>
            <li>A description of the issue you experienced</li>
            <li>Any relevant screenshots or error messages</li>
          </ul>

          <h3>2.2 Response Time</h3>
          <p>
            We aim to respond to all refund requests within{" "}
            <strong>2 business days</strong>. We may ask follow-up questions or
            request additional information to help resolve your issue.
          </p>

          <h3>2.3 Resolution Process</h3>
          <p>Before issuing a refund, we may:</p>
          <ul>
            <li>Attempt to troubleshoot and resolve technical issues</li>
            <li>Offer alternative solutions or workarounds</li>
            <li>Provide guidance on using the Service effectively</li>
          </ul>
          <p>
            If we cannot resolve your issue to your satisfaction, we will
            process your refund.
          </p>

          <h2>3. Refund Process</h2>

          <h3>3.1 Processing Time</h3>
          <p>
            Once approved, refunds are typically processed within{" "}
            <strong>5-10 business days</strong>. The refund will be issued to
            the original payment method used for the purchase.
          </p>

          <h3>3.2 Payment Processor</h3>
          <p>
            Refunds are processed through LemonSqueezy, our payment processor.
            Depending on your bank or card issuer, it may take additional time
            for the refund to appear in your account.
          </p>

          <h3>3.3 License Revocation</h3>
          <p>
            Upon refund approval, your license key will be deactivated and you
            will no longer have access to paid features of the Service. You may
            continue to use the free tier.
          </p>

          <h2>4. Partial Refunds</h2>
          <p>
            In some cases, we may offer a partial refund at our discretion. This
            may apply when:
          </p>
          <ul>
            <li>
              <strong>Basic License:</strong> You have used a portion of your 50
              generations. We may refund a prorated amount based on unused
              generations.
            </li>
            <li>
              <strong>Service Issues:</strong> The Service was partially
              functional or available intermittently.
            </li>
          </ul>

          <h2>5. Free Tier</h2>
          <p>
            The free tier (3 generations per day) is provided at no cost and
            therefore is not subject to refunds. We encourage you to use the
            free tier to evaluate the Service before making a purchase.
          </p>

          <h2>6. Australian Consumer Law</h2>
          <p>
            This Refund Policy does not limit any rights you may have under the
            Australian Consumer Law. If goods or services you purchase have a
            major problem, you are entitled to a refund or replacement. You are
            also entitled to compensation for any other reasonably foreseeable
            loss or damage. If the problem is minor, we may choose to give you a
            free repair instead of a replacement or refund.
          </p>
          <p>
            Our goods and services come with guarantees that cannot be excluded
            under the Australian Consumer Law. For major failures with the
            service, you are entitled to cancel your service contract with us
            and to a refund for the unused portion.
          </p>

          <h2>7. Chargebacks</h2>
          <p>
            We kindly request that you contact us before initiating a chargeback
            with your bank or credit card company. Chargebacks incur fees and
            administrative burden. If you have a legitimate concern, we are
            committed to resolving it directly and fairly.
          </p>
          <p>
            If you initiate a chargeback without first attempting to resolve the
            issue with us, we reserve the right to dispute the chargeback and/or
            terminate your account.
          </p>

          <h2>8. Changes to This Policy</h2>
          <p>
            We may update this Refund Policy from time to time. Changes will be
            posted on this page with an updated &quot;Last updated&quot; date.
            The policy in effect at the time of your purchase will apply to that
            transaction.
          </p>

          <h2>9. Contact Us</h2>
          <p>
            If you have any questions about this Refund Policy or need to
            request a refund, please contact us:
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
        </Card>
      </main>
      <Footer />
    </>
  )
}
