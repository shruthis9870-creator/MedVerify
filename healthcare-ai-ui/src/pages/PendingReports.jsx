import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";
import PageShell from "../components/layout/PageShell";
import { useLiveAlerts } from "../hooks/useLiveAlerts";
import { routePatientId } from "../services/api";

export default function PendingReports() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { reportPatients, isLoading, error } = useLiveAlerts();

  const filteredPatients = reportPatients.filter((patient) => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return true;

    return `${patient.name} ${patient.id}`.toLowerCase().includes(term);
  });

  return (
    <PageShell
      title="Pending Reports"
      subtitle="Review patient report submissions that are still awaiting review or upload confirmation."
      status="Report backlog"
      footer={
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-slate-900">Backlog summary</p>
            <p className="mt-2 text-sm text-slate-600">
              {isLoading ? "Loading live report uploads..." : `${filteredPatients.length} patient entries match the current search.`}
            </p>
          </div>
          <div className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-slate-900">Review workflow</p>
            <p className="mt-2 text-sm text-slate-600">Open each report to confirm details and clinical readiness.</p>
          </div>
        </div>
      }
    >
      {error && (
        <div className="rounded-[28px] bg-red-50 px-5 py-4 text-sm font-semibold text-red-700 ring-1 ring-red-200">
          Backend connection issue: {error}
        </div>
      )}

      <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Search workspace</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Filter pending reports</h2>
          </div>
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by patient name or ID"
              className="w-full bg-transparent outline-none placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filteredPatients.map((patient) => (
          <div key={patient.id} className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">{patient.name}</h2>
                <p className="mt-1 text-sm text-slate-500">{patient.id}</p>
              </div>
              <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700">
                {patient.reports.length} reports
              </span>
            </div>
            <div className="space-y-3">
              {patient.reports.map((report, index) => (
                <div key={index} className="flex items-center justify-between gap-4 rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-slate-500" />
                    <div>
                      <p className="font-semibold text-slate-900">{report.name}</p>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-yellow-700">Pending</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/reports/${routePatientId(patient.id)}`)}
                    className="rounded-3xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Open
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {!isLoading && filteredPatients.length === 0 && (
        <div className="rounded-[32px] bg-white p-10 text-center text-sm text-slate-600 shadow-sm ring-1 ring-slate-200">
          No report uploads from WhatsApp are pending right now.
        </div>
      )}
    </PageShell>
  );
}
