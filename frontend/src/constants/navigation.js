import {
  LayoutDashboard, FolderKanban, Activity, Brain, ShieldAlert,
  Siren, ClipboardCheck, PieChart, TrendingUp, Scale, Sparkles, Settings2,
} from "lucide-react";

export const NAV_GROUPS = [
  {
    label: "Main",
    items: [
      { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
      { to: "/projects", label: "Projects", icon: FolderKanban },
      { to: "/performance", label: "Performance", icon: Activity },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { to: "/predictions", label: "Predictions", icon: Brain, end: true },
      { to: "/risk", label: "Risk Intelligence", icon: ShieldAlert },
    ],
  },
  {
    label: "Operations",
    items: [
      { to: "/warnings", label: "Early Warnings", icon: Siren },
      { to: "/interventions", label: "Interventions", icon: ClipboardCheck },
    ],
  },
  {
    label: "Analytics",
    items: [
      { to: "/analytics", label: "Portfolio Analytics", icon: PieChart, end: true },
      { to: "/analytics/cost", label: "Cost Escalation", icon: TrendingUp },
      { to: "/analytics/benchmark", label: "Benchmarking", icon: Scale },
    ],
  },
  { label: "AI", items: [{ to: "/assistant", label: "Pragati AI Assistant", icon: Sparkles }] },
  { label: "System", items: [{ to: "/settings", label: "Settings", icon: Settings2 }] },
];

export const MOBILE_ITEMS = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/warnings", label: "Alerts", icon: Siren },
  { to: "/assistant", label: "AI", icon: Sparkles },
];
