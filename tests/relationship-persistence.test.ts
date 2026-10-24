import test from "node:test";
import assert from "node:assert/strict";
import {persistDemo} from "../src/lib/relationship-persistence";
import {INITIAL_DEMO} from "../src/lib/relationship-demo";
test("storage failure never overwrites or reports a successful relationship save",()=>{
 let stored=JSON.stringify(INITIAL_DEMO);let writes=0;
 const storage={getItem:()=>stored,setItem:()=>{writes++;throw Error("quota");}};
 const changed=structuredClone(INITIAL_DEMO);changed.clients[0].name="Changed";
 assert.throws(()=>persistDemo(storage,changed),/could not save/);assert.equal(stored,JSON.stringify(INITIAL_DEMO));
 stored="unreadable";assert.throws(()=>persistDemo(storage,changed),/unreadable/);assert.equal(writes,1);assert.equal(stored,"unreadable");
 assert.throws(()=>persistDemo({getItem:()=>{throw Error("denied");},setItem:()=>assert.fail("must not write")},changed),/cannot access/);
});
