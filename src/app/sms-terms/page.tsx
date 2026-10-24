import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/legal-page";
import { AGENT } from "@/config/agent";

// DRAFT: broker (and counsel, if the broker wants) to review before launch.
export const metadata: Metadata = {
  title: `SMS Terms (Draft) | ${AGENT.appName}`,
  robots: { index: false, follow: false },
};

export default function SmsTermsPage() {
  return (
    <LegalPage title="SMS Terms" updated="October 23, 2026">
      <section>
        <h2>What you&apos;re signing up for</h2>
        <p>
          If you check the text-consent box on a form on this site, {AGENT.name} with {AGENT.brokerage}{" "}
          may text and call you at the number you entered about apartment specials and your move.
          Consent is optional. It is never a condition of getting a guide or any other service.
        </p>
      </section>

      <section>
        <h2>How often</h2>
        <p>Message frequency varies with your search. Messages are sent by a real person, not a bulk list.</p>
      </section>

      <section>
        <h2>Cost</h2>
        <p>Message and data rates may apply, depending on your mobile plan.</p>
      </section>

      <section>
        <h2>Opting out and help</h2>
        <ul>
          <li>Reply <strong>STOP</strong> at any time to stop texts. You&apos;ll get one confirmation and nothing after.</li>
          <li>Reply <strong>HELP</strong> for help{AGENT.phone ? <>, or call {AGENT.phone}</> : null}.</li>
        </ul>
      </section>

      <section>
        <h2>Privacy</h2>
        <p>
          Your phone number and opt-in are never sold or shared with third parties for their marketing.
          See the <Link href="/privacy">Privacy Policy</Link>.
        </p>
      </section>

      <section>
        <h2>Carriers</h2>
        <p>Carriers are not liable for delayed or undelivered messages.</p>
      </section>
    </LegalPage>
  );
}
