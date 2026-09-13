import { useLocation, Link } from "react-router-dom";
import { Menu, Search, Sparkles, Activity, Compass, Bell } from "lucide-react";
import { NAV_GROUPS } from "../../constants/navigation";
import UserMenu from "./UserMenu";
import NotificationMenu from "./NotificationMenu";
import Breadcrumbs from "./Breadcrumbs";

function currentTitle(pathname) {
  for (const group of NAV_GROUPS) {
    const hit = group.items.find((i) => pathname === i.to || (!i.end && pathname.startsWith(`${i.to}/`)));
    if (hit) return hit.label;
  }
  return "Pragati AI";
}

export default function Navbar({ onOpenMobileNav }) {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-white/[0.06] bg-[#111318]/90 px-4 backdrop-blur-xl sm:px-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.4)]">
      <button
        type="button"
        onClick={onOpenMobileNav}
        className="-ml-1 rounded-lg p-2 text-slate-400 hover:bg-white/[0.06] hover:text-ink lg:hidden transition-colors"
        aria-label="Open navigation"
      >
        <Menu size={19} />
      </button>

      {/* Page Title & Breadcrumbs */}
      <div className="min-w-0 flex items-center gap-3">
        <div>
          <h1 className="truncate text-[14.5px] font-bold text-ink tracking-tight flex items-center gap-2">
            {currentTitle(pathname)}
          </h1>
          <Breadcrumbs className="hidden sm:flex" />
        </div>
      </div>

      {/* Live Mission Telemetry Pill */}
      <div className="hidden xl:flex items-center gap-2 ml-6 rounded-full bg-white/[0.04] border border-white/[0.06] px-3.5 py-1 text-[11px] font-medium text-muted">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="font-semibold text-slate-300">MoSPI Live Feed</span>
        <span className="text-muted">|</span>
        <span className="text-muted font-mono text-[10.5px]">XGBoost v2.5 Engine</span>
      </div>

      {/* Right Controls */}
      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        {/* Quick Search Bar */}
        <Link
          to="/projects"
          className="hidden md:flex items-center gap-2.5 rounded-lg border border-slate-200/80 bg-slate-50/70 px-3 py-1.5 text-xs text-slate-500 hover:border-slate-300 hover:bg-white hover:text-slate-800 transition-all shadow-sm"
        >
          <Search size={14} className="text-slate-400" />
          <span className="text-[12px]">Search projects, risks, agencies...</span>
          <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-slate-400 shadow-xs">
            ⌘K
          </kbd>
        </Link>

        {/* Quick Action: AI Assistant */}
        <Link
          to="/assistant"
          className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 px-3 py-1.5 text-[12px] font-semibold text-amber-900 hover:bg-amber-500/15 hover:border-amber-500/50 transition-all shadow-xs"
          title="Open AI Engineering Assistant"
        >
          <Sparkles size={14} className="text-amber-600 animate-pulse" />
          <span className="hidden sm:inline">AI Copilot</span>
        </Link>

        {/* Quick Action: CAD Studio */}
        <Link
          to="/blueprint"
          className="hidden lg:flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[12px] font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-xs"
          title="Open AI CAD Blueprint Studio"
        >
          <Compass size={14} className="text-cyan-600" />
          <span>CAD Studio</span>
        </Link>

        <div className="h-5 w-px bg-slate-200" aria-hidden="true" />

        <NotificationMenu />
        <UserMenu />
      </div>
    </header>
  );
}
