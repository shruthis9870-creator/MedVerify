import PageShell from "../components/layout/PageShell";
import { useLiveAlerts } from "../hooks/useLiveAlerts";

export default function DailyStats() {
  const { patients, isLoading } = useLiveAlerts();
  const totalPatients = patients.length;
  const criticalCases = patients.filter((patient) => patient.severity === "Critical").length;
  const reportsUploaded = patients.reduce((total, patient) => total + patient.reports.length, 0);

  const metrics = [
    { label: "Total patients", value: totalPatients, accent: "text-slate-900" },
    { label: "Critical cases", value: criticalCases, accent: "text-red-600" },
    { label: "Reports uploaded", value: reportsUploaded, accent: "text-slate-900" },
    { label: "AI accuracy", value: "96%", accent: "text-emerald-600" },
  ];

  return (
    <PageShell
      title="Daily statistics"
      subtitle="Quick access to daily patient and performance metrics across the dashboard."
      status="Daily insights"
      footer={
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-slate-900">Data refresh</p>
            <p className="mt-2 text-sm text-slate-600">
              {isLoading ? "Loading live alert feed." : "Updated from active backend alerts."}
            </p>
          </div>
          <div className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-slate-900">Performance snapshot</p>
            <p className="mt-2 text-sm text-slate-600">Compare today’s figures with historical averages.</p>
          </div>
        </div>
      }
    >
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-sm uppercase tracking-[0.24em] text-slate-500">{metric.label}</h2>
            <p className={`mt-4 text-4xl font-semibold ${metric.accent}`}>{metric.value}</p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
