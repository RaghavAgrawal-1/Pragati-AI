import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MobileNavigation from "./MobileNavigation";
import ToastViewport from "../feedback/Toast";

const STORAGE_KEY = "pragati.sidebar-collapsed";

export default function AppShell() {
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(STORAGE_KEY) === "1");
  const [mobileOpen, setMobileOpen] = useState(false);

  function toggle() {
    setCollapsed((c) => {
      localStorage.setItem(STORAGE_KEY, c ? "0" : "1");
      return !c;
    });
  }

  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar collapsed={collapsed} onToggle={toggle} mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />

      <div className={collapsed ? "lg:pl-[68px]" : "lg:pl-[240px]"}>
        <Navbar onOpenMobileNav={() => setMobileOpen(true)} />
        <main className="mx-auto max-w-[1440px] px-4 pb-24 pt-6 sm:px-6 lg:pb-10">
          <Outlet />
        </main>
      </div>

      <MobileNavigation />
      <ToastViewport />
    </div>
  );
}
