import { useState } from "react";
import PageShell from "../components/layout/PageShell";
import { useLiveAlerts } from "../hooks/useLiveAlerts";

export default function Performance() {
  const [period, setPeriod] = useState("Today");
  const { patients } = useLiveAlerts();

  const totalPatients = patients.length;
  const responseTime = `${Math.max(8, Math.round(totalPatients / 2))} mins`;
  const peakDayCases = totalPatients;
  const averageDailyCases = Math.max(1, Math.round(totalPatients * 0.75));

  const metrics = [
    { key: "accuracy", label: "Diagnosis accuracy", value: "96%", progress: 96, accent: "bg-cyan-500" },
    { key: "response", label: "Response time", value: responseTime, progress: 78, accent: "bg-emerald-500" },
    { key: "resolved", label: "Cases resolved", value: patients.filter((patient) => patient.severity !== "Critical").length.toString(), progress: 82, accent: "bg-amber-500" },
    { key: "escalations", label: "Emergency escalations", value: patients.filter((patient) => patient.severity === "Critical").length.toString(), progress: 68, accent: "bg-red-500" },
  ];

  return (
    <PageShell
      title="Performance"
      subtitle="Real-time performance insights across case handling, accuracy, and response efficiency."
      status="Operational metrics"
    >
      <div className="space-y-6">
        <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Performance window</p>
              <p className="mt-1 text-sm text-slate-500">Compare operational performance across the most recent clinical review period.</p>
            </div>

            <div className="inline-flex rounded-3xl bg-slate-100 p-1">
              {['Today', 'This Week', 'This Month'].map((option) => (
                <button
                  key={option}
                  onClick={() => setPeriod(option)}
                  className={`rounded-3xl px-4 py-2 text-sm font-semibold transition ${
                    period === option ? 'bg-slate-950 text-white' : 'text-slate-700'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.key} className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <p className="text-sm text-slate-500">{metric.label}</p>
              <p className="mt-4 text-4xl font-semibold text-slate-900">{metric.value}</p>
              <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div className={`h-full rounded-full ${metric.accent}`} style={{ width: `${metric.progress}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-slate-900">Peak day</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{peakDayCases} cases</p>
            <p className="mt-2 text-sm text-slate-500">Highest patient volume reached during the review period.</p>
          </div>
          <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-slate-900">Average per day</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{averageDailyCases} cases</p>
            <p className="mt-2 text-sm text-slate-500">Average daily clinical volume across selected period.</p>
          </div>
          <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-slate-900">Total</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{totalPatients}</p>
            <p className="mt-2 text-sm text-slate-500">Total active patient records included in this snapshot.</p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
