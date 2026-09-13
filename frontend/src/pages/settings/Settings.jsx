import { useState } from "react";
import {
  User,
  Bell,
  Palette,
  Shield,
  Save,
  LogOut,
  CheckCircle2,
} from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";

export default function Settings() {
  const [saved, setSaved] = useState(false);

  const [notifications, setNotifications] = useState({
    critical: true,
    high: true,
    medium: false,
    weekly: true,
  });

  const [appearance, setAppearance] = useState("system");

  const saveSettings = () => {
    localStorage.setItem(
      "pragati-settings",
      JSON.stringify({ notifications, appearance })
    );

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Profile, notifications, appearance and security."
      />

      <div className="space-y-5">

        {/* Profile */}
        <Card>
          <div className="border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-2">
              <User size={17} />
              <div>
                <h3 className="text-[14px] font-medium text-slate-900">
                  Profile
                </h3>
                <p className="text-[12px] text-muted">
                  Manage your account information.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-5 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[11px] uppercase text-muted">
                Name
              </label>
              <input
                defaultValue="Raghav Agrawal"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-[13px] outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] uppercase text-muted">
                Email
              </label>
              <input
                defaultValue="raghav@test.com"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-[13px] outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] uppercase text-muted">
                Role
              </label>
              <input
                defaultValue="Project Monitoring Officer"
                disabled
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[13px] text-slate-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] uppercase text-muted">
                Organisation
              </label>
              <input
                defaultValue="Pragati AI Monitoring Cell"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-[13px] outline-none focus:border-slate-400"
              />
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card>
          <div className="border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-2">
              <Bell size={17} />
              <div>
                <h3 className="text-[14px] font-medium text-slate-900">
                  Notifications
                </h3>
                <p className="text-[12px] text-muted">
                  Choose which monitoring signals you receive.
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {[
              ["critical", "Critical risk alerts", "Immediate intervention required"],
              ["high", "High risk alerts", "Priority project monitoring"],
              ["medium", "Medium risk alerts", "Projects requiring closer monitoring"],
              ["weekly", "Weekly portfolio summary", "Performance and risk summary"],
            ].map(([key, title, description]) => (
              <label
                key={key}
                className="flex cursor-pointer items-center justify-between px-5 py-4"
              >
                <div>
                  <p className="text-[13px] font-medium text-slate-800">
                    {title}
                  </p>
                  <p className="text-[12px] text-muted">{description}</p>
                </div>

                <input
                  type="checkbox"
                  checked={notifications[key]}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      [key]: e.target.checked,
                    })
                  }
                  className="h-4 w-4"
                />
              </label>
            ))}
          </div>
        </Card>

        {/* Appearance */}
        <Card>
          <div className="border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-2">
              <Palette size={17} />
              <div>
                <h3 className="text-[14px] font-medium text-slate-900">
                  Appearance
                </h3>
                <p className="text-[12px] text-muted">
                  Choose your preferred interface appearance.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 p-5 md:grid-cols-3">
            {[
              ["system", "System", "Follow device settings"],
              ["light", "Light", "Bright interface"],
              ["dark", "Dark", "Dark interface"],
            ].map(([value, title, description]) => (
              <button
                key={value}
                onClick={() => setAppearance(value)}
                className={`rounded-lg border p-4 text-left transition ${
                  appearance === value
                    ? "border-slate-800 bg-slate-50"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <p className="text-[13px] font-medium text-slate-900">
                  {title}
                </p>
                <p className="mt-1 text-[11px] text-muted">
                  {description}
                </p>
              </button>
            ))}
          </div>
        </Card>

        {/* Security */}
        <Card>
          <div className="border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-2">
              <Shield size={17} />
              <div>
                <h3 className="text-[14px] font-medium text-slate-900">
                  Security
                </h3>
                <p className="text-[12px] text-muted">
                  Account and session controls.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 p-5">
            <div>
              <p className="text-[13px] font-medium text-slate-800">
                Password
              </p>
              <p className="text-[12px] text-muted">
                Last updated recently
              </p>
            </div>

            <button className="rounded-lg border border-slate-200 px-4 py-2 text-[12px] hover:bg-slate-50">
              Change Password
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 p-5">
            <div>
              <p className="text-[13px] font-medium text-slate-800">
                Current session
              </p>
              <p className="text-[12px] text-muted">
                This device · Active now
              </p>
            </div>

            <button className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-[12px] text-red-600 hover:bg-red-50">
              <LogOut size={14} />
              Log out
            </button>
          </div>
        </Card>

        {/* Save */}
        <div className="flex justify-end">
          <button
            onClick={saveSettings}
            className="flex items-center gap-2 rounded-lg bg-slate-800 px-5 py-2.5 text-[12px] font-medium text-white hover:bg-slate-700"
          >
            {saved ? (
              <>
                <CheckCircle2 size={15} />
                Settings Saved
              </>
            ) : (
              <>
                <Save size={15} />
                Save Settings
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}