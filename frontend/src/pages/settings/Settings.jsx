import { useState } from "react";
import {
  User, Bell, Palette, Shield, Save, LogOut, CheckCircle2,
  Database, Globe, Users, Key, Download, Cpu,
} from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import { useAuth } from "../../hooks/useAuth";

function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="border-b border-white/[0.06] px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange/10 border border-orange/20">
          <Icon size={15} className="text-orange" />
        </div>
        <div>
          <h3 className="text-[13.5px] font-semibold text-ink">{title}</h3>
          {subtitle && <p className="text-[11.5px] text-muted">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ label, description, value, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors">
      <div>
        <p className="text-[13px] font-medium text-ink">{label}</p>
        <p className="text-[11.5px] text-muted">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${value ? "bg-orange" : "bg-white/[0.1]"}`}
      >
        <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${value ? "translate-x-4" : "translate-x-0.5"}`} />
      </button>
    </label>
  );
}

function InputField({ label, ...props }) {
  return (
    <div>
      <label className="mb-1.5 block text-[10.5px] uppercase tracking-widest font-bold text-muted">{label}</label>
      <input className="input-dark w-full" {...props} />
    </div>
  );
}

export default function Settings() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  const [notifications, setNotifications] = useState({
    critical: true, high: true, medium: false, weekly: true,
    sms: false, email: true,
  });

  const [appearance, setAppearance] = useState("dark");
  const [apiConfig, setApiConfig] = useState({
    backendUrl: import.meta.env.VITE_API_URL || "https://pragati-ai-backend-5y8a.onrender.com",
    modelVersion: "v2.5",
    inferenceBatchSize: 10,
  });

  const [profile, setProfile] = useState({
    name:   user?.name  ?? "Raghav Agrawal",
    email:  user?.email ?? "raghav@pragati.ai",
    org:    "Pragati AI Monitoring Cell",
  });

  function saveAll() {
    localStorage.setItem("pragati-settings", JSON.stringify({ notifications, appearance, apiConfig, profile }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const THEMES = [
    { value: "dark",   label: "Dark Mode",   description: "Deep dark interface (default)" },
    { value: "system", label: "System",       description: "Follow device settings" },
    { value: "light",  label: "Light Mode",   description: "Bright interface" },
  ];

  const TEAM_MEMBERS = [
    { name: "Admin Officer", email: "admin@pragati.ai",         role: "Administrator" },
    { name: "Field Officer",  email: "officer@pragati.gov.in",  role: "Project Officer" },
  ];

  return (
    <div className="space-y-6 animate-slideUp">
      <PageHeader title="Settings" subtitle="Profile, notifications, appearance, API configuration and security." />

      {/* Profile */}
      <div className="rounded-2xl border border-white/[0.06] bg-surface-card overflow-hidden">
        <SectionHeader icon={User} title="Profile" subtitle="Manage your account information." />
        <div className="grid gap-4 p-5 md:grid-cols-2">
          <InputField label="Name" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
          <InputField label="Email" value={profile.email} type="email" onChange={e => setProfile({ ...profile, email: e.target.value })} />
          <InputField label="Role" value={user?.role ?? "Project Monitoring Officer"} disabled />
          <InputField label="Organisation" value={profile.org} onChange={e => setProfile({ ...profile, org: e.target.value })} />
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-2xl border border-white/[0.06] bg-surface-card overflow-hidden">
        <SectionHeader icon={Bell} title="Notifications" subtitle="Choose which monitoring signals you receive." />
        <div className="divide-y divide-white/[0.04]">
          <ToggleRow label="Critical Risk Alerts"     description="Immediate intervention required"         value={notifications.critical} onChange={v => setNotifications({ ...notifications, critical: v })} />
          <ToggleRow label="High Risk Alerts"         description="Priority project monitoring"              value={notifications.high}     onChange={v => setNotifications({ ...notifications, high: v })} />
          <ToggleRow label="Medium Risk Alerts"       description="Projects requiring closer monitoring"     value={notifications.medium}   onChange={v => setNotifications({ ...notifications, medium: v })} />
          <ToggleRow label="Weekly Portfolio Summary" description="Performance and risk digest every Monday" value={notifications.weekly}   onChange={v => setNotifications({ ...notifications, weekly: v })} />
          <ToggleRow label="Email Notifications"      description="Send alerts to your registered email"     value={notifications.email}    onChange={v => setNotifications({ ...notifications, email: v })} />
          <ToggleRow label="SMS Alerts (Critical)"    description="SMS for critical-only threshold breaches" value={notifications.sms}      onChange={v => setNotifications({ ...notifications, sms: v })} />
        </div>
      </div>

      {/* Appearance */}
      <div className="rounded-2xl border border-white/[0.06] bg-surface-card overflow-hidden">
        <SectionHeader icon={Palette} title="Appearance" subtitle="Choose your preferred interface style." />
        <div className="grid gap-3 p-5 md:grid-cols-3">
          {THEMES.map(t => (
            <button
              key={t.value}
              onClick={() => setAppearance(t.value)}
              className={`rounded-xl border p-4 text-left transition-all duration-150 ${
                appearance === t.value
                  ? "border-orange/40 bg-orange/10"
                  : "border-white/[0.06] bg-surface-raised hover:border-white/[0.1]"
              }`}
            >
              <p className={`text-[13px] font-semibold ${appearance === t.value ? "text-orange" : "text-ink"}`}>{t.label}</p>
              <p className="mt-1 text-[11px] text-muted">{t.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* API Configuration */}
      <div className="rounded-2xl border border-white/[0.06] bg-surface-card overflow-hidden">
        <SectionHeader icon={Cpu} title="API & Model Configuration" subtitle="Backend connectivity and ML model settings." />
        <div className="grid gap-4 p-5 md:grid-cols-2">
          <InputField
            label="Backend API URL"
            value={apiConfig.backendUrl}
            onChange={e => setApiConfig({ ...apiConfig, backendUrl: e.target.value })}
          />
          <InputField
            label="Model Version"
            value={apiConfig.modelVersion}
            onChange={e => setApiConfig({ ...apiConfig, modelVersion: e.target.value })}
          />
          <div>
            <label className="mb-1.5 block text-[10.5px] uppercase tracking-widest font-bold text-muted">Inference Batch Size</label>
            <input
              type="number"
              className="input-dark w-full"
              value={apiConfig.inferenceBatchSize}
              min={1} max={50}
              onChange={e => setApiConfig({ ...apiConfig, inferenceBatchSize: Number(e.target.value) })}
            />
          </div>
          <div className="flex items-end">
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05] px-4 py-3 w-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[12px] font-medium text-emerald-400">ML Pipeline Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div className="rounded-2xl border border-white/[0.06] bg-surface-card overflow-hidden">
        <SectionHeader icon={Users} title="Team Members" subtitle="Authorized users with access to Pragati AI." />
        <div className="divide-y divide-white/[0.04]">
          {TEAM_MEMBERS.map(m => (
            <div key={m.email} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-[13px] font-medium text-ink">{m.name}</p>
                <p className="text-[11.5px] font-mono text-muted">{m.email}</p>
              </div>
              <span className={`rounded-md border px-2.5 py-1 text-[10.5px] font-semibold ${
                m.role === "Administrator"
                  ? "border-orange/30 bg-orange/10 text-orange"
                  : "border-white/[0.08] bg-white/[0.04] text-muted"
              }`}>
                {m.role}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Data Export */}
      <div className="rounded-2xl border border-white/[0.06] bg-surface-card overflow-hidden">
        <SectionHeader icon={Database} title="Data Export" subtitle="Export your settings and session data." />
        <div className="flex flex-wrap items-center gap-3 p-5">
          <button
            onClick={() => {
              const settings = { profile, notifications, appearance, apiConfig };
              const blob = new Blob([JSON.stringify(settings, null, 2)], { type: "application/json" });
              const url  = URL.createObjectURL(blob);
              const a    = document.createElement("a"); a.href = url; a.download = "pragati_settings.json"; a.click();
              URL.revokeObjectURL(url);
            }}
            className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-[12.5px] font-medium text-ink hover:bg-white/[0.08] transition-colors"
          >
            <Download size={14} className="text-muted" />
            Export Settings
          </button>
          <p className="text-[11.5px] text-muted">Download your preferences as a JSON backup file.</p>
        </div>
      </div>

      {/* Security */}
      <div className="rounded-2xl border border-white/[0.06] bg-surface-card overflow-hidden">
        <SectionHeader icon={Shield} title="Security" subtitle="Account and session controls." />
        <div className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <p className="text-[13px] font-medium text-ink">Password</p>
            <p className="text-[11.5px] text-muted">Last updated recently</p>
          </div>
          <button className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-[12.5px] font-medium text-ink hover:bg-white/[0.08] transition-colors">
            Change Password
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.04] p-5">
          <div>
            <p className="text-[13px] font-medium text-ink">Current Session</p>
            <p className="text-[11.5px] text-muted">This device · Active now</p>
          </div>
          <button className="flex items-center gap-2 rounded-xl border border-red-500/25 bg-red-500/[0.06] px-4 py-2 text-[12.5px] font-medium text-red-400 hover:bg-red-500/[0.12] transition-colors">
            <LogOut size={14} />
            Log Out
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pb-2">
        <button
          onClick={saveAll}
          className="flex items-center gap-2 rounded-xl bg-orange px-6 py-2.5 text-[13px] font-semibold text-white shadow-submit hover:bg-orange-light transition-all duration-150"
        >
          {saved ? (
            <><CheckCircle2 size={15} /> Settings Saved!</>
          ) : (
            <><Save size={15} /> Save All Settings</>
          )}
        </button>
      </div>
    </div>
  );
}