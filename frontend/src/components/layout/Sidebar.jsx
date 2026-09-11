import { NavLink } from "react-router-dom";
import { ChevronLeft, LogOut, X } from "lucide-react";
import { NAV_GROUPS } from "../../constants/navigation";
import { useAuth } from "../../hooks/useAuth";
import Avatar from "../common/Avatar";

function Brand({ collapsed }) {
  return (
    <div className="flex items-center gap-3 px-5 py-5">
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true" className="shrink-0">
        <circle cx="13" cy="13" r="12" stroke="#7C8BB5" strokeWidth="1" opacity=".4" />
        <path d="M13 3a10 10 0 0 1 0 20" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M13 7a6 6 0 0 0 0 12" stroke="#8C99CF" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="13" cy="13" r="2" fill="#fff" />
      </svg>
      {!collapsed && (
        <span className="block leading-tight">
          <span className="block text-[15px] font-semibold tracking-[0.14em] text-white">PRAGATI AI</span>
          <span className="mt-0.5 block text-[10.5px] text-slate-400">Infrastructure Intelligence</span>
        </span>
      )}
    </div>
  );
}

export default function Sidebar({ collapsed, onToggle, mobileOpen, onCloseMobile }) {
  const { user, logout } = useAuth();

  const link = ({ isActive }) =>
    [
      "group flex items-center gap-3 rounded-md px-3 py-2 text-[13px] transition-colors",
      isActive ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/[0.06] hover:text-slate-100",
    ].join(" ");

  return (
    <>
      {mobileOpen && <div className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden" onClick={onCloseMobile} aria-hidden="true" />}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-[264px] flex-col bg-slateink transition-[width,transform] duration-200",
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

        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="mb-5">
              {!collapsed && (
                <p className="px-3 pb-2 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">{group.label}</p>
              )}
              <ul className="space-y-0.5">
                {group.items.map(({ to, label, icon: Icon, end }) => (
                  <li key={to}>
                    <NavLink to={to} end={end} className={link} onClick={onCloseMobile} title={collapsed ? label : undefined}>
                      <Icon size={17} className="shrink-0" aria-hidden="true" />
                      {!collapsed && <span className="truncate">{label}</span>}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3">
          <div className="flex items-center gap-3 rounded-md px-2 py-2">
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
