"use client";

import { BarChart3, MessageSquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function navClass(active: boolean) {
  return [
    "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[15px] font-semibold leading-snug tracking-[-0.02em] transition",
    active
      ? "bg-zinc-200 text-zinc-950"
      : "text-zinc-900 hover:bg-zinc-200/80 active:bg-zinc-200",
  ].join(" ");
}

export function AppSidebar() {
  const pathname = usePathname();
  const funnelActive = pathname === "/";
  const messageGenActive = pathname === "/message-generator";

  return (
    <aside className="sticky top-0 z-40 w-full shrink-0 border-b border-zinc-200 bg-zinc-100 sm:w-56 sm:border-b-0 sm:border-r">
      <nav className="flex flex-col gap-1 p-3 sm:p-4">
        <div className="px-3 pb-1 pt-0.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
          Profit Coach
        </div>
        <Link
          href="/"
          className={navClass(funnelActive)}
          aria-current={funnelActive ? "page" : undefined}
        >
          <BarChart3
            className="h-5 w-5 shrink-0 text-blue-700"
            aria-hidden
          />
          <span>Funnel Analyzer</span>
        </Link>
        <Link
          href="/message-generator"
          className={navClass(messageGenActive)}
          aria-current={messageGenActive ? "page" : undefined}
        >
          <MessageSquare
            className="h-5 w-5 shrink-0 text-blue-700"
            aria-hidden
          />
          <span>Message Generator</span>
        </Link>
      </nav>
    </aside>
  );
}
