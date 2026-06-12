import { useState } from "react";
import PageShell from "../components/layout/PageShell";

export default function ExportData() {
  const [exportStatus, setExportStatus] = useState({
    records: null,
    reports: null,
    analytics: null,
  });

  const handleExport = (key) => {
    setExportStatus((current) => ({ ...current, [key]: "loading" }));

    window.setTimeout(() => {
      setExportStatus((current) => ({ ...current, [key]: "done" }));
    }, 1500);
  };

  return (
    <PageShell
      title="Export Data"
      subtitle="Export patient records, report summaries, and analytics packages for secure delivery."
      status="Data exports"
      footer={
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-slate-900">File formats</p>
            <p className="mt-2 text-sm text-slate-600">Download data in CSV or PDF format for reporting.</p>
          </div>
          <div className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-slate-900">Secure export</p>
            <p className="mt-2 text-sm text-slate-600">Export files with built-in auditing and access controls.</p>
          </div>
        </div>
      }
    >
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-[32px] bg-slate-950 px-6 py-6 text-left text-white transition">
          <p className="text-lg font-semibold">Export Patient Records</p>
          <p className="mt-2 text-sm text-slate-200">Download the latest medical summaries and admission history.</p>
          <button
            onClick={() => handleExport("records")}
            disabled={exportStatus.records === "loading"}
            className="mt-5 rounded-3xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {exportStatus.records === "loading" ? "Preparing export..." : "Export Records"}
          </button>
          <p className="mt-3 text-sm text-slate-200">
            {exportStatus.records === "loading" && "Preparing download..."}
            {exportStatus.records === "done" && "✓ Export ready!"}
          </p>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white px-6 py-6 text-left text-slate-900 transition">
          <p className="text-lg font-semibold">Export Reports</p>
          <p className="mt-2 text-sm text-slate-500">Archive pending and completed reports for compliance review.</p>
          <button
            onClick={() => handleExport("reports")}
            disabled={exportStatus.reports === "loading"}
            className="mt-5 rounded-3xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {exportStatus.reports === "loading" ? "Preparing export..." : "Export Reports"}
          </button>
          <p className="mt-3 text-sm text-slate-600">
            {exportStatus.reports === "loading" && "Preparing download..."}
            {exportStatus.reports === "done" && "✓ Export ready!"}
          </p>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white px-6 py-6 text-left text-slate-900 transition">
          <p className="text-lg font-semibold">Export Analytics</p>
          <p className="mt-2 text-sm text-slate-500">Generate performance and outcome dashboards for executive review.</p>
          <button
            onClick={() => handleExport("analytics")}
            disabled={exportStatus.analytics === "loading"}
            className="mt-5 rounded-3xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {exportStatus.analytics === "loading" ? "Preparing export..." : "Export Analytics"}
          </button>
          <p className="mt-3 text-sm text-slate-600">
            {exportStatus.analytics === "loading" && "Preparing download..."}
            {exportStatus.analytics === "done" && "✓ Export ready!"}
          </p>
        </div>
      </div>
    </PageShell>
  );
}