import { NavLink } from "react-router-dom";
import { ChevronLeft, LogOut, X, Shield, Cpu, Activity } from "lucide-react";
import { NAV_GROUPS } from "../../constants/navigation";
import { useAuth } from "../../hooks/useAuth";
import Avatar from "../common/Avatar";
import { useTheme } from "../../context/ThemeContext";

function Brand({ collapsed }) {
  return (
    <div className="flex items-center gap-3 px-4 py-4 border-b border-white/[0.06]">
      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#E85418] via-[#B83D0E] to-[#0C0D12] p-[1px] shadow-orange-sm">
        <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#0C0D12]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-[#E85418]">
            <path d="M2 20h20" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M4 20L12 4l8 16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 4v16" strokeWidth="1.5" strokeDasharray="2 2" stroke="#E85418" />
            <path d="M7 14h10" strokeWidth="1.8" stroke="#E85418" />
          </svg>
        </div>
      </div>

      {!collapsed && (
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="block text-[15px] font-extrabold tracking-tight text-white font-sans">
              Pragati AI
            </span>
            <span className="rounded bg-orange/15 border border-orange/30 px-1 py-0.5 text-[9px] font-mono font-bold text-orange">
              v2.5
            </span>
          </div>
          <span className="block text-[10px] uppercase font-semibold tracking-wider text-slate-400 truncate">
            Infra Intelligence
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
      "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-[12.5px] font-medium transition-all duration-200",
      isActive
        ? "bg-orange/[0.12] text-white font-semibold before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-1.5 before:rounded-r before:bg-orange before:shadow-[0_0_8px_rgba(232,84,24,0.6)]"
        : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-100 hover:translate-x-0.5",
    ].join(" ");

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-md lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-[264px] flex-col bg-[#0A0F1C] border-r border-slate-800/80 transition-[width,transform] duration-200 shadow-2xl",
          collapsed ? "lg:w-[68px]" : "lg:w-[240px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
        aria-label="Primary"
      >
        <div className="flex items-center justify-between">
          <Brand collapsed={collapsed} />
          <button
            type="button"
            onClick={onCloseMobile}
            className="mr-3 rounded-md p-2 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              {!collapsed && (
                <p className="px-3 pb-1.5 text-[9.5px] font-bold uppercase tracking-[0.16em] text-slate-500 flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-slate-600" />
                  {group.label}
                </p>
              )}
              <ul className="space-y-0.5">
                {group.items.map(({ to, label, icon: Icon, end }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      end={end}
                      className={link}
                      onClick={onCloseMobile}
                      title={collapsed ? label : undefined}
                    >
                      <Icon
                        size={16}
                        className="shrink-0 transition-transform duration-200 group-hover:scale-110 group-hover:text-orange"
                        aria-hidden="true"
                      />
                      {!collapsed && <span className="truncate">{label}</span>}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Live System Telemetry Status Widget (When Expanded) */}
        {!collapsed && (
          <div className="mx-3 mb-2 rounded-xl bg-slate-950/70 border border-slate-800/90 p-2.5 text-[11px] shadow-inner">
            <div className="flex items-center justify-between text-[10px] font-mono font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
                LIVE PIPELINE
              </span>
              <span className="text-amber-400 font-bold">6 MONITORED</span>
            </div>
            <div className="mt-1.5 flex justify-between text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5">
              <span>Model Inferences</span>
              <span className="font-mono text-emerald-400 font-semibold">Online (99.8%)</span>
            </div>
          </div>
        )}

        <div className="border-t border-white/[0.08] p-3 bg-slate-950/60">
          <div className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-white/[0.04] transition-colors">
            <Avatar name={user?.name ?? user?.email} size={32} className="bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30" />
            {!collapsed && (
              <>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12.5px] font-medium text-slate-100">
                    {user?.name ?? user?.email ?? "Signed in"}
                  </span>
                  <span className="block truncate text-[10.5px] font-mono text-slate-400">
                    {user?.role ?? "Officer in Charge"}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/20 hover:text-rose-300 transition-colors"
                  aria-label="Log out"
                  title="Sign out of Pragati AI"
                >
                  <LogOut size={16} />
                </button>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={onToggle}
            className="mt-2 hidden w-full items-center gap-3 rounded-lg px-3 py-1.5 text-[12px] text-slate-400 hover:bg-white/[0.06] hover:text-slate-100 transition-colors lg:flex"
          >
            <ChevronLeft size={15} className={collapsed ? "rotate-180" : ""} />
            {!collapsed && "Collapse Sidebar"}
          </button>
        </div>
      </aside>
    </>
  );
}
