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
      <div className="relative min-h-screen bg-canvas infra-grid text-ink selection:bg-orange-muted selection:text-orange">
        {/* Dark Ambient Radial Lighting Blobs */}
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden z-0">
          <div className="absolute -top-40 right-10 h-[600px] w-[600px] rounded-full bg-orange/[0.06] blur-[130px]" />
          <div className="absolute top-[40%] -left-20 h-[500px] w-[500px] rounded-full bg-purple-600/[0.04] blur-[130px]" />
          <div className="absolute bottom-10 right-1/4 h-[450px] w-[450px] rounded-full bg-orange/[0.04] blur-[130px]" />
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
