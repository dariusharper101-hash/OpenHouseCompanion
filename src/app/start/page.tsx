import ContactHop from "@/components/contact-hop";
import InquiryForm from "./inquiry-form";
import { leadsEnabled } from "@/lib/site-mode";

// Public-only until lead storage is configured: show direct contact options.
export default function StartPage() {
  return leadsEnabled ? <InquiryForm /> : <ContactHop />;
}
