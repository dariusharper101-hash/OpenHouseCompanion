"use client";
import { useState } from "react";
import { Button, ActionLink } from "@/components/ui";
const QUESTIONS: Record<string, string[]> = {
 process: ["What is the next useful step for my situation?", "Who handles each step, and what do I need to prepare?", "What should I confirm before arranging a tour?"],
 programs: ["Which loan options should I ask a lender to compare?", "How do upfront costs, monthly costs and restrictions differ?", "What information does the lender need through their secure process?"],
 taxes: ["Which property-specific tax assumptions should I verify?", "How could an exemption change the estimate?", "How does this affect the monthly cost I’m comparing?"],
 insurance: ["What coverage and exclusions should I compare?", "What is the deductible for each type of claim?", "Who can provide a property-specific quote?"],
 warranties: ["What does this warranty cover and exclude?", "What service fees and claim limits apply?", "How does it differ from insurance?"],
 inspections: ["Which inspections should I discuss for this property?", "How do findings affect my next decision?", "Who arranges the inspection and confirms the timing?"],
 contracts: ["What am I being asked to sign, and with whom?", "Which dates and responsibilities need confirmation?", "Who should explain the transaction-specific terms?"],
 selling: ["What should I prepare before we discuss selling?", "How will we compare pricing and preparation options?", "Who handles the next action, and when?"],
};
export default function GuideQuestionPlan({topic,title}:{topic:string;title:string}){
 const [selected,setSelected]=useState<string[]>([]);const [status,setStatus]=useState("");const [showCopy,setShowCopy]=useState(false);
 const questions=QUESTIONS[topic]||QUESTIONS.process;
 const brief=`Questions from Hop’s ${title}\n\n${selected.map(q=>"• "+q).join("\n")}\n\nPlease help me identify what to verify, who handles the next action and what I should prepare. This is a question plan, not approval, a booking or a signed agreement.`;
 async function copy(){setShowCopy(true);try{await navigator.clipboard.writeText(brief);setStatus("Questions copied. Nothing has been sent.");}catch{setStatus("Select and copy the questions below. Nothing has been sent.");}}
 return <section className="hop-question-plan" aria-labelledby="question-plan-title"><div><p className="hop-eyebrow">Learn it. Put it to work.</p><h2 id="question-plan-title">Leave with better questions.</h2><p>Choose what you want to discuss. Take the questions to Hop, the relevant provider, or the AI you already use.</p><p className="hop-note">No signup or contact details. These choices stay on this page until you leave.</p></div><div><div className="hop-question-choices">{questions.map(q=><button key={q} type="button" className={`hop-question-choice ${selected.includes(q)?"is-selected":""}`} aria-pressed={selected.includes(q)} onClick={()=>{setSelected(s=>s.includes(q)?s.filter(x=>x!==q):[...s,q]);setStatus("");}}><span aria-hidden="true">{selected.includes(q)?"✓":"+"}</span>{q}</button>)}</div><div className="hop-question-actions"><Button disabled={!selected.length} onClick={copy}>{selected.length ? `Copy my ${selected.length} ${selected.length===1?"question":"questions"}` : "Choose a question to copy"}</Button><ActionLink href={topic==="selling"?"/start?role=selling&src=guide":"/buy?src=guide"} variant="quiet">{topic==="selling"?"Start a selling conversation":"Shape my home search"}</ActionLink></div><p role="status" className="hop-note mt-3">{status||`${selected.length} selected · nothing is sent`}</p>{showCopy&&<label className="hop-label mt-4">Your question plan<textarea className="hop-field" readOnly rows={6} value={brief}/></label>}</div></section>;
}
