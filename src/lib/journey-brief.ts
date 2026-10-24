export const JOURNEY_PLAN_KEY = "hop-journey-brief-v1";
export type JourneyKind = "renting" | "selling" | "investing" | "relocating";
export type JourneyContext = {priorities:string;timing:string;action:string;owner:string;date:string;housing:"buying"|"renting"};
export type JourneyBrief = { kind: JourneyKind; text: string; context?:JourneyContext };
export function parseJourneyBrief(raw:string|null):JourneyBrief|null{
 try{const p=JSON.parse(raw||"null");if(!p||!["renting","selling","investing","relocating"].includes(p.kind)||typeof p.text!=="string"||p.text.length===0||p.text.length>4000)return null;
 const result:JourneyBrief={kind:p.kind,text:p.text};
 if(p.context){const c=p.context;if(typeof c!=="object"||["priorities","timing","action","owner","date"].some(k=>typeof c[k]!=="string"||c[k].length>1000)||!["buying","renting"].includes(c.housing)||!c.action.trim()||!c.owner.trim()||(c.date&&!/^\d{4}-\d{2}-\d{2}$/.test(c.date)))return null;result.context={priorities:c.priorities,timing:c.timing,action:c.action,owner:c.owner,date:c.date,housing:c.housing};}
 return result;
 }catch{return null;}
}

import type { LeadFormData } from "@/types/lead";
export function journeyToInquiry(p:JourneyBrief):Partial<LeadFormData>{
 const result:Partial<LeadFormData>={notes:p.text};
 const c=p.context;if(!c)return result;
 result.role=p.kind==="selling"?"selling":p.kind==="renting"?"renting":p.kind==="relocating"?c.housing:"buying";
 if(p.kind==="investing"){result.clientType="investor";result.purchasePurpose="investment";}
 if(p.kind==="relocating")result.clientType="relocating";
 result.timeline=c.timing==="One to three months"?"1-3-months":"to-confirm";
 if(p.kind==="selling")result.sellerTimeline=c.timing||"To discuss";
 return result;
}
