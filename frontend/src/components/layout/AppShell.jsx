import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MobileNavigation from "./MobileNavigation";
import ToastViewport from "../feedback/Toast";
import { ThemeProvider } from "../../context/ThemeContext";

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
    <ThemeProvider>
      <div className="relative min-h-screen bg-[#F8FAFC] infra-grid text-ink selection:bg-amber-500/20 selection:text-amber-900">
        {/* Subtle Ambient Radial Lighting Blobs */}
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden z-0">
          <div className="absolute -top-40 right-10 h-[500px] w-[500px] rounded-full bg-amber-400/[0.04] blur-[120px]" />
          <div className="absolute top-[40%] -left-20 h-[450px] w-[450px] rounded-full bg-cyan-400/[0.04] blur-[120px]" />
          <div className="absolute bottom-10 right-1/4 h-[400px] w-[400px] rounded-full bg-indigo-400/[0.03] blur-[120px]" />
        </div>

        <Sidebar
          collapsed={collapsed}
          onToggle={toggle}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />

        <div className={`relative z-10 ${collapsed ? "lg:pl-[68px]" : "lg:pl-[240px]"} transition-[padding] duration-200`}>
          <Navbar onOpenMobileNav={() => setMobileOpen(true)} />
          <main className="mx-auto max-w-[1440px] px-4 pb-24 pt-6 sm:px-6 lg:pb-12">
            <Outlet />
          </main>
        </div>

        <MobileNavigation />
        <ToastViewport />
      </div>
    </ThemeProvider>
  );
}
