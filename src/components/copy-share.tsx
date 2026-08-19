"use client";

import { useState } from "react";

function CopyButton({
  label,
  copiedLabel,
  getText,
  primary = false,
}: {
  label: string;
  copiedLabel: string;
  getText: () => string;
  primary?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const text = getText();
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for browsers/contexts without the async clipboard API.
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  const base =
    "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors";
  const style = primary
    ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/40"
    : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700";

  return (
    <button type="button" onClick={handleCopy} className={`${base} ${style}`}>
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        {copied ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m11.25 4.125a2.25 2.25 0 00-2.25-2.25H15a1.125 1.125 0 01-1.125-1.125V4.125A2.25 2.25 0 0011.625 1.875"
          />
        )}
      </svg>
      {copied ? copiedLabel : label}
    </button>
  );
}

/**
 * Share toolbar for the list page.
 * - "Copy text list" copies the SMS/email/social plain-text version (passed in).
 * - "Copy page link" copies the current URL so the page itself can be shared.
 */
export default function CopyShare({ textList }: { textList: string }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <CopyButton
        label="Copy text list"
        copiedLabel="Copied!"
        getText={() => textList}
        primary
      />
      <CopyButton
        label="Copy page link"
        copiedLabel="Link copied!"
        getText={() => (typeof window !== "undefined" ? window.location.href : "")}
      />
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 print:hidden"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-9.75c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5z" />
        </svg>
        Print / Save PDF
      </button>
    </div>
  );
}
