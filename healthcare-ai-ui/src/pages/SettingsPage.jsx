import { useState } from "react";
import PageShell from "../components/layout/PageShell";

export default function SettingsPage() {
  const [notifPref, setNotifPref] = useState("All Notifications");
  const [language, setLanguage] = useState("English");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState("Preferences saved");

  const handleSaveSettings = () => {
    setSaveStatus("Preferences saved successfully");
  };

  return (
    <PageShell
      title="Settings"
      subtitle="Manage workflow preferences, notification routing, and preferred language settings."
      status="System preferences"
      footer={
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-slate-900">{saveStatus}</p>
            <p className="mt-2 text-sm text-slate-600">Changes are applied instantly and synced across the dashboard.</p>
          </div>
          <div className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-slate-900">Hospital policy</p>
            <p className="mt-2 text-sm text-slate-600">Review your security, alert, and report visibility settings here.</p>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <section className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Account</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Account preferences</h2>
              <p className="mt-2 text-sm text-slate-500">Control notifications, language, and the dashboard experience.</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">Synced</span>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[28px] bg-slate-50 p-5">
              <label className="block text-sm font-semibold text-slate-900">
                Notification Preferences
              </label>
              <select
                value={notifPref}
                onChange={(event) => setNotifPref(event.target.value)}
                className="mt-3 w-full rounded-3xl border border-slate-200 px-4 py-3 text-sm text-slate-700"
              >
                <option>All Notifications</option>
                <option>Critical Only</option>
                <option>Mute all</option>
              </select>
            </div>

            <div className="rounded-[28px] bg-slate-50 p-5">
              <label className="block text-sm font-semibold text-slate-900">
                Language
              </label>
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                className="mt-3 w-full rounded-3xl border border-slate-200 px-4 py-3 text-sm text-slate-700"
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Kannada</option>
              </select>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Notifications</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Alert delivery</h2>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Live</span>
          </div>

          <div className="mt-6 rounded-[28px] bg-slate-50 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">Email Alerts</p>
                <p className="mt-1 text-sm text-slate-600">Receive critical updates and summary alerts by email.</p>
              </div>
              <button
                type="button"
                onClick={() => setEmailAlerts((current) => !current)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${emailAlerts ? "bg-slate-900" : "bg-slate-300"}`}
                aria-pressed={emailAlerts}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${emailAlerts ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Appearance</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Workspace theme</h2>
            </div>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">Preview</span>
          </div>

          <div className="mt-6 rounded-[28px] bg-slate-50 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">Dark Mode</p>
                <p className="mt-1 text-sm text-slate-600">Switch the interface into dark mode for low-light reviews.</p>
              </div>
              <button
                type="button"
                onClick={() => setDarkMode((current) => !current)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${darkMode ? "bg-slate-900" : "bg-slate-300"}`}
                aria-pressed={darkMode}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${darkMode ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
            </div>
          </div>
        </section>

        <div className="flex items-center justify-between rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div>
            <p className="text-sm font-semibold text-slate-900">Save your preferences</p>
            <p className="mt-1 text-sm text-slate-600">Changes are stored locally in the dashboard session.</p>
          </div>
          <button
            type="button"
            onClick={handleSaveSettings}
            className="rounded-3xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Save Settings
          </button>
        </div>
      </div>
    </PageShell>
  );
}