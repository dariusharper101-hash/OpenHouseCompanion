import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/legal-page";
import { AGENT } from "@/config/agent";

// DRAFT: broker review required before this page is linked from any ad or post.
export const metadata: Metadata = {
  title: `Privacy Policy (Draft) | ${AGENT.appName}`,
  robots: { index: false, follow: false },
};

const tel = AGENT.phone ? AGENT.phone.replace(/[^0-9+]/g, "") : "";

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="October 23, 2026">
      <section>
        <h2>Who we are</h2>
        <p>
          {AGENT.appName} is the marketing name {AGENT.name} uses as a sales agent sponsored by{" "}
          {AGENT.brokerage}. This policy covers information you share on this website.
        </p>
      </section>

      <section>
        <h2>What we collect</h2>
        <ul>
          <li>What you type into a form: for example your name, phone number, email, move timing, budget range and the areas you&apos;re considering.</li>
          <li>If you opt in to texts: the consent wording you agreed to, the date and time, and the IP address and browser you used, kept as a record of your consent.</li>
          <li>We use your IP address briefly to block spam; it isn&apos;t kept unless you opt in to texts.</li>
          <li>Basic, anonymous usage statistics (pages viewed) to see whether the site is useful.</li>
        </ul>
        <p className="mt-3">
          We don&apos;t ask about your household, children, pets, income source, disability, religion,
          national origin or credit on these forms.
        </p>
      </section>

      <section>
        <h2>How we use it</h2>
        <ul>
          <li>To send you the guide or information you asked for.</li>
          <li>To contact you about your search, by text or call only if you opted in.</li>
          <li>To keep a record of your request and your consent choices.</li>
        </ul>
      </section>

      <section>
        <h2>Who we share it with</h2>
        <p>
          We don&apos;t sell your information. We share it only with the services that run this site
          (hosting, database, email alerts and a private spreadsheet the agent uses to follow up), and
          with {AGENT.brokerage} as required for supervision and record keeping. We don&apos;t share your
          phone number or text opt-in with third parties for their marketing.
        </p>
      </section>

      <section>
        <h2>Your choices</h2>
        <ul>
          <li>Reply STOP to any text to stop texts. See the <Link href="/sms-terms">SMS Terms</Link>.</li>
          <li>
            Ask us to correct or delete your information
            {AGENT.phone ? <> by calling or texting <a href={`tel:${tel}`}>{AGENT.phone}</a></> : null}
            {AGENT.email ? <> or emailing <a href={`mailto:${AGENT.email}`}>{AGENT.email}</a></> : null}.
          </li>
        </ul>
      </section>

      <section>
        <h2>Changes</h2>
        <p>If this policy changes, we&apos;ll update the date at the top of this page.</p>
      </section>
    </LegalPage>
  );
}
