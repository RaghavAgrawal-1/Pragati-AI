import { useLocation } from "react-router-dom";
import { Menu, Search } from "lucide-react";
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
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-white/90 px-4 backdrop-blur-md sm:px-6 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
      <button type="button" onClick={onOpenMobileNav} className="-ml-1 rounded-md p-2 text-slate-600 hover:bg-slate-100 lg:hidden" aria-label="Open navigation">
        <Menu size={19} />
      </button>

      <div className="min-w-0 flex items-center gap-3">
        <div>
          <h1 className="truncate text-[14.5px] font-bold text-ink tracking-tight flex items-center gap-2">
            {currentTitle(pathname)}
          </h1>
          <Breadcrumbs className="hidden sm:flex" />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2.5">
        <button type="button" className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-ink" aria-label="Search">
          <Search size={17} />
        </button>
        <NotificationMenu />
        <UserMenu />
      </div>
    </header>
  );
}
