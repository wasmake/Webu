import type { ReactNode } from "react";

import { ContextPanel } from "@/components/ContextPanel";
import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      <Sidebar />
      <main className="flex min-h-screen flex-1 flex-col bg-slate-50/80">{children}</main>
      <ContextPanel />
    </div>
  );
}
