import {DEMO_KEY,parseDemo,type DemoData} from "./relationship-demo";
type DemoStorage=Pick<Storage,"getItem"|"setItem">;
export function persistDemo(storage:DemoStorage,data:DemoData){
 let existing:string|null;
 try{existing=storage.getItem(DEMO_KEY);}catch{throw Error("This browser cannot access demo storage. No change was saved.");}
 if(existing&&!parseDemo(existing))throw Error("This browser has an unreadable demo record. Existing stored data was kept; use another local review origin to start a separate demo.");
 try{storage.setItem(DEMO_KEY,JSON.stringify(data));}catch{throw Error("This browser could not save the change. Your existing saved record was not replaced. Try again before leaving this page.");}
}
