"use client";
import { useSyncExternalStore } from "react";
import {persistDemo} from "./relationship-persistence";
import { DEMO_KEY, INITIAL_DEMO, parseDemo, withIntentFixtures, type DemoData, type Relationship } from "./relationship-demo";
let lastRaw:string|null|undefined;let cached:DemoData=INITIAL_DEMO;
function snapshot(){if(typeof window==="undefined")return null;try{const raw=localStorage.getItem(DEMO_KEY);if(raw!==lastRaw){lastRaw=raw;cached=raw?withIntentFixtures(parseDemo(raw)||INITIAL_DEMO):INITIAL_DEMO;}return cached;}catch{return INITIAL_DEMO;}}
function subscribe(cb:()=>void){window.addEventListener("storage",cb);window.addEventListener("hop-demo-change",cb);return()=>{window.removeEventListener("storage",cb);window.removeEventListener("hop-demo-change",cb);};}
const serverSnapshot=()=>null;
export function useRelationships(){return useSyncExternalStore(subscribe,snapshot,serverSnapshot);}
function save(data:DemoData){if(typeof window==="undefined")throw Error("Wait for this browser to be ready.");persistDemo(localStorage,data);window.dispatchEvent(new Event("hop-demo-change"));}
export function updateRelationship(id:string,update:(c:Relationship)=>Relationship){const data=snapshot();if(!data)throw Error("The demo is not ready.");const client=data.clients.find(c=>c.id===id);if(!client)throw Error("This demo client was not found.");save({...data,clients:data.clients.map(c=>c.id===id?update(c):c)});}
export function addRelationship(c:Relationship){const data=snapshot();if(!data)throw Error("The demo is not ready.");if(data.clients.length>=50)throw Error("This local demo is full.");save({...data,clients:[c,...data.clients]});}
