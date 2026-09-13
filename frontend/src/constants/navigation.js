import {
  LayoutDashboard, FolderKanban, Activity, Brain, ShieldAlert,
  Siren, ClipboardCheck, PieChart, TrendingUp, Scale, Sparkles,
  Settings2, Award, Compass, IndianRupee, FileBarChart2,
} from "lucide-react";

export const NAV_GROUPS = [
  {
    label: "Main",
    items: [
      { to: "/dashboard",   label: "Overview",      icon: LayoutDashboard, end: true },
      { to: "/projects",    label: "Projects",       icon: FolderKanban },
      { to: "/performance", label: "Performance",    icon: Activity },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { to: "/predictions", label: "Predictive Analytics", icon: Brain, end: true },
      { to: "/risk",        label: "Risk Assessment",       icon: ShieldAlert },
      { to: "/blueprint",   label: "AI Blueprint Studio",   icon: Compass },
    ],
  },
  {
    label: "Operations",
    items: [
      { to: "/budget",        label: "Budget Intelligence",     icon: IndianRupee },
      { to: "/warnings",      label: "Early Warnings",          icon: Siren },
      { to: "/interventions", label: "Interventions",           icon: ClipboardCheck },
      { to: "/contractors",   label: "Contractor Registry",     icon: Award },
    ],
  },
  {
    label: "Analytics",
    items: [
      { to: "/analytics",           label: "Portfolio Analytics", icon: PieChart, end: true },
      { to: "/analytics/cost",      label: "Cost Escalation",     icon: TrendingUp },
      { to: "/analytics/benchmark", label: "Benchmarking",        icon: Scale },
    ],
  },
  {
    label: "AI",
    items: [{ to: "/assistant", label: "Pragati AI Assistant", icon: Sparkles }],
  },
  {
    label: "System",
    items: [
      { to: "/reports",  label: "Reports",  icon: FileBarChart2 },
      { to: "/settings", label: "Settings", icon: Settings2 },
    ],
  },
];

export const MOBILE_ITEMS = [
  { to: "/dashboard", label: "Home",     icon: LayoutDashboard },
  { to: "/projects",  label: "Projects", icon: FolderKanban },
  { to: "/budget",    label: "Budget",   icon: IndianRupee },
  { to: "/warnings",  label: "Alerts",   icon: Siren },
  { to: "/assistant", label: "AI",       icon: Sparkles },
];
