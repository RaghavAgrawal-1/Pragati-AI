import { NavLink } from "react-router-dom";
import { ChevronLeft, LogOut, X, HardHat, Compass, ShieldCheck } from "lucide-react";
import { NAV_GROUPS } from "../../constants/navigation";
import { useAuth } from "../../hooks/useAuth";
import Avatar from "../common/Avatar";
import { useTheme } from "../../context/ThemeContext";

function Brand({ collapsed }) {
  return (
    <div className="flex items-center gap-3 px-4 py-4 border-b border-white/[0.08]">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-md">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white">
          <path d="M2 20h20" strokeWidth="2" strokeLinecap="round" />
          <path d="M4 20L12 4l8 16" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 4v16" strokeWidth="1.5" strokeDasharray="2 2" stroke="var(--infra-primary)" />
          <path d="M7 14h10" strokeWidth="1.5" stroke="var(--infra-primary)" />
        </svg>
      </div>

      {!collapsed && (
        <div className="min-w-0 flex-1">
          <span className="block text-[15px] font-bold tracking-tight text-white">
            Pragati AI
          </span>
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ collapsed, onToggle, mobileOpen, onCloseMobile }) {
  const { user, logout } = useAuth();
  const { currentTheme } = useTheme();

  const link = ({ isActive }) =>
    [
      "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-[12.5px] font-medium transition-all",
      isActive
        ? "bg-white/[0.12] text-white font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-1 before:rounded-r before:bg-[var(--infra-primary)]"
        : "text-slate-400 hover:bg-white/[0.06] hover:text-slate-100",
    ].join(" ");

  return (
    <>
      {mobileOpen && <div className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden" onClick={onCloseMobile} aria-hidden="true" />}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-[264px] flex-col bg-[#0C1322] border-r border-slate-800/80 transition-[width,transform] duration-200 shadow-2xl",
          collapsed ? "lg:w-[68px]" : "lg:w-[240px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
        aria-label="Primary"
      >
        <div className="flex items-center justify-between">
          <Brand collapsed={collapsed} />
          <button type="button" onClick={onCloseMobile} className="mr-3 rounded-md p-2 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden" aria-label="Close navigation">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              {!collapsed && (
                <p className="px-3 pb-1.5 text-[9.5px] font-bold uppercase tracking-[0.16em] text-slate-500/90 flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-slate-600" />
                  {group.label}
                </p>
              )}
              <ul className="space-y-0.5">
                {group.items.map(({ to, label, icon: Icon, end }) => (
                  <li key={to}>
                    <NavLink to={to} end={end} className={link} onClick={onCloseMobile} title={collapsed ? label : undefined}>
                      <Icon size={16} className="shrink-0 transition-transform group-hover:scale-110" aria-hidden="true" />
                      {!collapsed && <span className="truncate">{label}</span>}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/[0.08] p-3 bg-slate-950/40">
          <div className="flex items-center gap-3 rounded-md px-2 py-1.5">
            <Avatar name={user?.name ?? user?.email} size={32} className="bg-white/10" />
            {!collapsed && (
              <>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12.5px] text-slate-100">{user?.name ?? user?.email ?? "Signed in"}</span>
                  <span className="block truncate text-[11px] text-slate-500">{user?.role ?? "Officer"}</span>
                </span>
                <button type="button" onClick={logout} className="rounded-md p-1.5 text-slate-400 hover:bg-white/10 hover:text-white" aria-label="Log out">
                  <LogOut size={16} />
                </button>
              </>
            )}
          </div>

          <button type="button" onClick={onToggle} className="mt-2 hidden w-full items-center gap-3 rounded-md px-3 py-2 text-[12.5px] text-slate-400 hover:bg-white/[0.06] hover:text-slate-100 lg:flex">
            <ChevronLeft size={16} className={collapsed ? "rotate-180" : ""} />
            {!collapsed && "Collapse"}
          </button>
        </div>
      </aside>
    </>
  );
}
