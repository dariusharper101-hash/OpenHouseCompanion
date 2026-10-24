import { headers } from "next/headers";
import { isAdmin } from "@/lib/admin-auth";
import Dashboard from "./dashboard";
export default async function AdminPage() {
  if (!isAdmin(await headers())) return <main>Authentication required.</main>;
  return <Dashboard />;
}
