"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 rounded-xl border border-slate-600 text-slate-300 text-sm font-medium hover:bg-slate-700/50 transition-all"
    >
      Sign Out
    </button>
  );
}
