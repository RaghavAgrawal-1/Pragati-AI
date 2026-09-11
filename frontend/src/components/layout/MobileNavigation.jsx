import { NavLink } from "react-router-dom";
import { MOBILE_ITEMS } from "../../constants/navigation";

export default function MobileNavigation() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden" aria-label="Primary mobile">
      {MOBILE_ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to} to={to}
          className={({ isActive }) =>
            ["flex min-h-[56px] flex-col items-center justify-center gap-1 text-[11px] transition-colors", isActive ? "text-navy" : "text-slate-500"].join(" ")
          }
        >
          <Icon size={19} aria-hidden="true" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
