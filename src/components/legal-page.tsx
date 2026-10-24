import Nav from "@/components/nav";
import Footer from "@/components/footer";
import { Status } from "@/components/ui";

// Shared shell for the Privacy Policy and SMS Terms pages. Both are DRAFTS
// until the broker (and counsel, if the broker wants) approves the wording.
export default function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return <><Nav/><main id="main-content" tabIndex={-1} className="hop-wrap hop-guide"><header className="hop-guide-intro"><Status>Draft for broker review</Status><h1 className="hop-title">{title}</h1><p className="hop-note mt-4">Last updated {updated}</p></header><div className="hop-guide-body max-w-3xl [&_a]:underline [&_a]:underline-offset-4">{children}</div></main><Footer/></>;
}
