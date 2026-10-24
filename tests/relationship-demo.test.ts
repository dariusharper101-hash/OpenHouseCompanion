import test from "node:test";
import assert from "node:assert/strict";
import {INITIAL_DEMO,publishShortlist,submitFeedback,proposeNextAction,agreeNextAction,completeNextAction,clientView,parseDemo,relationshipFromPlan} from "../src/lib/relationship-demo";
test("relationship retains separate draft, response and mutually agreed next action",()=>{const c=structuredClone(INITIAL_DEMO.clients[0]);const shared=publishShortlist(c);shared.draft[0].reason="A new private draft reason";assert.notEqual(shared.published?.homes[0].reason,shared.draft[0].reason);const response=submitFeedback({...shared,feedback:{picks:{"home-a":"interested",unshared:"interested"},question:"Can we check the commute?"}});assert.deepEqual(response.response?.picks,{"home-a":"interested"});assert.equal(response.response?.revision,1);const proposed=proposeNextAction(response,{action:"Check commute and availability",owner:"Hop",date:"2026-10-12",status:"done"});assert.equal(proposed.nextAction?.status,"proposed");assert.throws(()=>completeNextAction(proposed));const agreed=agreeNextAction(proposed);assert.equal(completeNextAction(agreed).nextAction?.status,"done");assert.equal(agreed.response?.question,"Can we check the commute?");});
test("client projection excludes private notes, unpublished edits and agent activity",()=>{const c=structuredClone(INITIAL_DEMO.clients[0]);c.privateNote="Private preparation";const view=clientView(c);assert.equal("privateNote" in view,false);assert.equal("draft" in view,false);assert.equal("activity" in view,false);assert.equal(view.published,null);});
test("stored relationships validate shape and explorer preferences do not imply eligibility",()=>{assert.deepEqual(parseDemo(JSON.stringify(INITIAL_DEMO)),INITIAL_DEMO);assert.equal(parseDemo('{"version":1,"clients":[{}]}'),null);assert.equal(parseDemo("not json"),null);const c=relationshipFromPlan({areas:"Near work",budget:"Still open",bedrooms:"3",mustHaves:"A yard",readiness:"approval-in-hand",origin:"website"},"test-plan");assert.equal(c.areas,"Near work");assert.equal(c.mustHaves,"3 bedrooms · A yard");assert.match(c.readiness,/self-reported/);assert.equal(c.published,null);assert.throws(()=>publishShortlist(c));});

test("removed homes cannot produce an empty submitted response",()=>{const c=publishShortlist(structuredClone(INITIAL_DEMO.clients[0]));assert.throws(()=>submitFeedback({...c,feedback:{picks:{removed:"interested"},question:""}}));});

import {relationshipFromJourney,suggestedOptions,experience,withIntentFixtures} from '../src/lib/relationship-demo';
import {parseJourneyBrief,journeyToInquiry} from '../src/lib/journey-brief';
test('each intent retains supplied context and uses relevant recommendations without implying transactions',()=>{
 for(const kind of ['renting','selling','investing','relocating'] as const){
  const context={priorities:'Keep my original goal and tradeoffs',timing:'One to three months',action:'My requested next action',owner:'Hop and me',date:'2026-10-12',housing:'renting' as const};
  const c=relationshipFromJourney(kind,context,'case-'+kind);
  assert.equal(c.mustHaves,context.priorities);assert.equal(c.nextAction?.action,context.action);assert.equal(c.nextAction?.date,context.date);assert.equal(c.nextAction?.status,'proposed');
  const published=publishShortlist({...c,draft:suggestedOptions(c.kind)});
  const options=published.published!.homes;assert.ok(options.length>1);
  if(kind==='renting')assert.ok(options.every(o=>o.mode==='rental'&&o.price>0));
  else assert.ok(options.every(o=>o.mode!=='rental'&&o.price===0&&o.details));
  const responded=submitFeedback({...published,feedback:{picks:{[options[0].id]:'interested'},question:'A provider question to confirm'}});
  const agreed=agreeNextAction(responded);assert.equal(agreed.response?.question,'A provider question to confirm');assert.equal(agreed.nextAction?.status,'agreed');
  assert.ok(experience(c.kind).check);assert.ok(parseDemo(JSON.stringify({version:1,clients:[agreed]})));
 }
});
test('adding intent fixtures never replaces an existing client or private draft',()=>{const existing=structuredClone(INITIAL_DEMO.clients[0]);existing.name='Keep this existing client';existing.privateNote='Keep this working note';const data=withIntentFixtures({version:1,clients:[existing]});assert.equal(data.clients[0],existing);assert.equal(data.clients.filter(c=>c.id===existing.id).length,1);assert.equal(data.clients[0].privateNote,'Keep this working note');});
test('explicit structured handoff carries intent and timing without inferred financial approval',()=>{
 const p=parseJourneyBrief(JSON.stringify({kind:'investing',text:'Original brief',context:{priorities:'Check use restrictions',timing:'One to three months',action:'Verify costs',owner:'Hop',date:'',housing:'buying',isPreApproved:true},isPreApproved:true}));assert.ok(p);assert.equal('isPreApproved' in p.context!,false);const patch=journeyToInquiry(p);assert.equal(patch.clientType,'investor');assert.equal(patch.purchasePurpose,'investment');assert.equal(patch.timeline,'1-3-months');assert.equal('isPreApproved' in patch,false);
 const selling={...p,kind:'selling' as const,context:{...p.context!,timing:'Within a month'}};assert.equal(journeyToInquiry(selling).sellerTimeline,'Within a month');assert.equal(journeyToInquiry(selling).timeline,'to-confirm');
});
