import { BarChart3 } from "lucide-react";
import Link from "next/link";

export function AppSidebar() {
  return (
    <aside className="sticky top-0 z-40 w-full shrink-0 border-b border-zinc-200 bg-white sm:w-56 sm:self-start sm:border-b-0 sm:border-r">
      <nav className="flex flex-col gap-1 p-3 sm:p-4">
        <div className="px-3 pb-1 pt-0.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
          Profit Coach
        </div>
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[15px] font-semibold leading-snug tracking-[-0.02em] text-zinc-900 transition hover:bg-zinc-100 active:bg-zinc-100/80"
        >
          <BarChart3
            className="h-5 w-5 shrink-0 text-blue-700"
            aria-hidden
          />
          <span>Funnel Analyzer</span>
        </Link>
      </nav>
    </aside>
  );
}
