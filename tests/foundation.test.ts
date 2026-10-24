import test, { afterEach } from "node:test";
import assert from "node:assert/strict";
import { isAdmin, adminGuard } from "../src/lib/admin-auth";
import { storageMode } from "../src/lib/storage-config";
import { GET as list } from "../src/app/api/admin/leads/route";
import { GET as csv } from "../src/app/api/admin/export/route";
import { GET as health } from "../src/app/api/admin/health/route";
import { PATCH, DELETE } from "../src/app/api/admin/leads/[id]/route";
import { NextRequest } from "next/server";

const original = { ...process.env };
afterEach(() => { for (const key of Object.keys(process.env)) if (!(key in original)) delete process.env[key]; Object.assign(process.env, original); });
function reset() {
  for (const key of ["ADMIN_USER", "ADMIN_PASSWORD", "SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "LEAD_STORAGE", "VERCEL", "VERCEL_ENV"]) delete process.env[key];
}
function credentials() { process.env.ADMIN_USER = "reviewer"; process.env.ADMIN_PASSWORD = "synthetic-only-secret-123"; }
function auth(user = "reviewer", pass = "synthetic-only-secret-123") { return { authorization: `Basic ${Buffer.from(`${user}:${pass}`).toString("base64")}` }; }

test("admin fails closed with missing credentials or public defaults", () => {
  reset(); assert.equal(isAdmin(new Headers(auth("admin", "openhouse"))), false);
  process.env.ADMIN_USER = "admin"; process.env.ADMIN_PASSWORD = "openhouse";
  assert.equal(isAdmin(new Headers(auth("admin", "openhouse"))), false);
  process.env.ADMIN_PASSWORD = "change-me"; assert.equal(isAdmin(new Headers(auth("admin", "change-me"))), false);
});
test("admin accepts configured credentials and rejects malformed or mismatched headers", () => {
  reset(); credentials(); assert.equal(isAdmin(new Headers(auth())), true);
  for (const value of ["Basic !!!", "Bearer abc", "Basic " + Buffer.from("missing-colon").toString("base64"), auth("wrong").authorization, auth("reviewer", "wrong").authorization]) {
    assert.equal(isAdmin(new Headers({ authorization: value })), false);
  }
});
test("admin mutations require same-origin browser intent", () => {
  reset(); credentials();
  for (const origin of [undefined, "https://attacker.example", "null"]) {
    const headers = new Headers(auth()); if (origin) headers.set("origin", origin);
    assert.equal(adminGuard(new Request("https://hop.example/api/admin/leads/x", { method: "DELETE", headers }))?.status, 403);
  }
  assert.equal(adminGuard(new Request("https://hop.example/api/admin/leads/x", { method: "PATCH", headers: { ...auth(), origin: "https://hop.example" } })), null);
});
test("all admin API handlers independently deny access without proxy", async () => {
  reset(); credentials();
  for (const handler of [list, csv, health]) assert.equal((await handler(new Request("https://hop.example/api/admin/leads"))).status, 401);
  const ctx = { params: Promise.resolve({ id: "synthetic" }) };
  for (const handler of [PATCH, DELETE]) assert.equal((await handler(new NextRequest("https://hop.example/api/admin/leads/synthetic", { method: "DELETE" }), ctx)).status, 401);
});
test("no implicit file storage in any runtime", () => {
  reset(); for (const mode of ["development", "test", "production"]) { Object.assign(process.env, { NODE_ENV: mode }); assert.throws(storageMode); }
});
test("local opt-in works only in local development, never hosted or production", () => {
  reset(); Object.assign(process.env, { NODE_ENV: "development", LEAD_STORAGE: "local" }); assert.equal(storageMode(), "local");
  process.env.VERCEL = "1"; assert.throws(storageMode); delete process.env.VERCEL;
  process.env.VERCEL_ENV = "preview"; assert.throws(storageMode); delete process.env.VERCEL_ENV;
  Object.assign(process.env, { NODE_ENV: "production" }); assert.throws(storageMode);
});
test("partial or malformed database config never falls back to local", () => {
  reset(); Object.assign(process.env, { NODE_ENV: "development", LEAD_STORAGE: "local", SUPABASE_URL: "https://db.example" }); assert.throws(storageMode);
  process.env.SUPABASE_SERVICE_ROLE_KEY = "synthetic"; assert.equal(storageMode(), "supabase");
  process.env.SUPABASE_URL = "not-a-url"; assert.throws(storageMode);
  process.env.SUPABASE_URL = "http://db.example"; assert.throws(storageMode);
});
test("authorized readiness check reports unavailable without leaking config", async () => {
  reset(); credentials(); const response = await health(new Request("https://hop.example/api/admin/health", { headers: auth() }));
  assert.equal(response.status, 503); assert.deepEqual(await response.json(), { ready: false });
});

test("public submission fails safely without storage and returns no implementation detail", async () => {
  reset();
  const { POST } = await import("../src/app/api/leads/route");
  const response = await POST(new NextRequest("https://hop.example/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ firstName: "Synthetic", lastName: "Review", email: "review@example.com", phone: "5550100", role: "buying", iabsAcknowledged: true }) }));
  assert.equal(response.status, 503);
  const body = await response.json(); assert.equal("detail" in body, false); assert.equal(typeof body.error, "string");
});

test("readiness performs a real client query against a synthetic transport without returning rows", async () => {
  reset(); credentials(); process.env.SUPABASE_URL = "https://synthetic.supabase.co"; process.env.SUPABASE_SERVICE_ROLE_KEY = "synthetic-server-key";
  const originalFetch = globalThis.fetch;
  let queried = false;
  globalThis.fetch = async (input, init) => {
    const url = new URL(String(input));
    assert.equal(url.pathname, "/rest/v1/leads"); assert.equal(url.searchParams.get("select"), "id"); assert.equal(url.searchParams.get("limit"), "1");
    assert.equal(new Headers(init?.headers).get("apikey"), "synthetic-server-key"); queried = true;
    return Response.json([{ id: "synthetic-row" }]);
  };
  try {
    const response = await health(new Request("https://hop.example/api/admin/health", { headers: auth() }));
    assert.equal(response.status, 200); assert.equal(queried, true); assert.deepEqual(await response.json(), { ready: true });
  } finally { globalThis.fetch = originalFetch; }
});
