import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { LogOut, Settings2, User } from "lucide-react";
import Avatar from "../common/Avatar";
import { useAuth } from "../../hooks/useAuth";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => !ref.current?.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-haspopup="menu" aria-expanded={open} className="rounded-full" aria-label="Account menu">
        <Avatar name={user?.name ?? user?.email} size={32} />
      </button>

      {open && (
        <div role="menu" className="absolute right-0 z-40 mt-2 w-56 overflow-hidden rounded-xl border border-white/[0.08] bg-[#1A1B25] shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
          <div className="border-b border-white/[0.06] px-4 py-3">
            <p className="truncate text-[13px] font-semibold text-ink">{user?.name ?? "Signed in"}</p>
            <p className="truncate text-[11.5px] text-muted">{user?.email ?? ""}</p>
          </div>
          <Link to="/settings" role="menuitem" onClick={() => setOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-muted hover:bg-white/[0.05] hover:text-ink transition-colors">
            <User size={15} /> Profile
          </Link>
          <Link to="/settings" role="menuitem" onClick={() => setOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-muted hover:bg-white/[0.05] hover:text-ink transition-colors">
            <Settings2 size={15} /> Settings
          </Link>
          <button type="button" role="menuitem" onClick={logout} className="flex w-full items-center gap-2.5 border-t border-white/[0.06] px-4 py-2.5 text-left text-[13px] text-red-400 hover:bg-red-500/[0.06] hover:text-red-300 transition-colors">
            <LogOut size={15} /> Log out
          </button>
        </div>
      )}
    </div>
  );
}
