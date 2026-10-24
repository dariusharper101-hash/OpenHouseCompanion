import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import assert from 'node:assert/strict';
const env={...process.env,ADMIN_USER:'synthetic-review',ADMIN_PASSWORD:randomBytes(24).toString('hex')};
for(const key of ['SUPABASE_URL','SUPABASE_SERVICE_ROLE_KEY','LEAD_STORAGE','RESEND_API_KEY','NOTIFY_EMAIL']) delete env[key];
const server=spawn('npm',['run','start','--','--port','4371'],{cwd:process.cwd(),env,stdio:['ignore','pipe','pipe'],detached:true});
let output=''; server.stdout.on('data',b=>output+=b);server.stderr.on('data',b=>output+=b);
const base='http://localhost:4371';
const auth={authorization:'Basic '+Buffer.from(env.ADMIN_USER+':'+env.ADMIN_PASSWORD).toString('base64')};
try {
 let ready=false; for(let i=0;i<80;i++){try{const r=await fetch(base);if(r.status===200){ready=true;break}}catch{}await new Promise(r=>setTimeout(r,250));}
 assert.ok(ready,'local server did not start');
 for(const path of ['/admin','/api/admin/leads','/api/admin/export','/api/admin/health']) assert.equal((await fetch(base+path)).status,401,path);
 assert.equal((await fetch(base+'/api/admin/health',{headers:auth})).status,503);
 assert.equal((await fetch(base+'/api/admin/leads/synthetic',{method:'DELETE',headers:{...auth,origin:'https://outside.example'}})).status,403);
 assert.equal((await fetch(base+'/api/admin/leads/synthetic',{method:'PATCH',headers:{...auth,origin:base,'content-type':'application/json'},body:JSON.stringify({status:'invalid'})})).status,400);
 const submit=await fetch(base+'/api/leads',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({firstName:'Synthetic',lastName:'Review',email:'review@example.com',phone:'5550100',role:'buying',iabsAcknowledged:true})});
 assert.equal(submit.status,503);assert.equal('detail' in await submit.json(),false);
 const thanks=await fetch(base+'/thank-you?name=private-canary&credit=private-credit&veteran=true');
 const html=await thanks.text(); assert.equal(thanks.status,200);assert.ok(!html.includes('private-canary'));assert.ok(!html.includes('private-credit'));
 assert.ok((await fetch(base+'/admin',{headers:auth})).headers.get('cache-control')?.includes('no-store'));
 console.log('PASS: built-server auth, mutation origin, readiness failure, safe submission failure, privacy acknowledgement and cache checks (synthetic only).');
} finally {process.kill(-server.pid,'SIGTERM');}
