import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
const root=process.cwd(), errors=[];
const expected={"hop-icon.png":"28efb9bcc7941c783815b5c78fe58c70adc724918034186d844b9c273c17a9b7","hop-wordmark.png":"1303f9f4c7c6450f78586c6baa2e13314f154f3ca1265e466f3f760d08536a39"};
const apps=[resolve(root,"public/brand"),resolve(root,"../hop-open-house/public/brand"),resolve(root,"../hop-home-list/standalone/brand")];
const source=readFileSync(apps[0]+"/tokens.css","utf8");
for(const app of apps){for(const [name,hash] of Object.entries(expected)){const actual=createHash("sha256").update(readFileSync(app+"/"+name)).digest("hex");if(actual!==hash)errors.push(`${app}/${name}: original artwork changed`);}for(const name of ["tokens.css","system.css"]){if(readFileSync(app+"/"+name,"utf8")!==readFileSync(apps[0]+"/"+name,"utf8"))errors.push(`${app}/${name}: shared source diverged`);}}
const manifest=JSON.parse(readFileSync(root+"/design-system/tokens.json","utf8"));for(const [name,value] of Object.entries(manifest.resolvedDeclarations)){if(!source.includes(name+": "+value+";")&&!source.includes(name+":"+value+";"))errors.push(`Manifest drift: ${name}`);}
for(const file of ["src/components/ui.tsx","src/components/system-states.tsx","src/app/design-system/page.tsx","design-system/components.yaml","design-system/design-eye-spec.md","design-system/coverage.json"]){if(!existsSync(root+"/"+file))errors.push(`Missing infrastructure: ${file}`);}
console.log(JSON.stringify({result:errors.length?"needs-refinement":"pass",scope:"artwork preservation, shared-token transmission and infrastructure; visual approval excluded",errors},null,2));process.exitCode=errors.length?1:0;
