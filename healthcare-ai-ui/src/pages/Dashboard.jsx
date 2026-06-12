import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import StatsCards from "../components/dashboard/StatsCards";
import AnalyticsChart from "../components/dashboard/AnalyticsChart";
import RecentCases from "../components/dashboard/RecentCases";
import PatientSummary from "../components/dashboard/PatientSummary";
import { useLiveAlerts } from "../hooks/useLiveAlerts";
import { routePatientId } from "../services/api";

export default function Dashboard() {
  const [showAssigned, setShowAssigned] = useState(false);
  const [acceptedPatients, setAcceptedPatients] = useState([]);
  const [exportStatus, setExportStatus] = useState("");
  const navigate = useNavigate();
  const { alerts, patients, reportPatients, isLoading, error, lastUpdated, acknowledge } = useLiveAlerts();

  const assignedPatients = patients.filter(
    (patient) => !acceptedPatients.includes(patient.id)
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Overview</p>
          <h1 className="mt-2 text-4xl font-semibold text-slate-900">Doctor Dashboard</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-500">
            Live WhatsApp triage messages, report uploads, and AI alert activity in one place.
          </p>
          <p className="mt-2 text-xs font-semibold text-slate-400">
            {lastUpdated ? `Last synced ${lastUpdated.toLocaleTimeString()}` : "Connecting to backend alerts..."}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">

          <Link to="/emergency">
  <button className="rounded-3xl bg-gradient-to-r from-red-500 to-orange-400 px-5 py-3 text-sm font-semibold text-white shadow-xl transition hover:scale-105">
    Emergency Action
  </button>
</Link>
          <button
            onClick={() => setShowAssigned((current) => !current)}
            className="rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            New patient entry
          </button>
          <button
            onClick={() => {
              setExportStatus("Summary export queued and ready for download.");
              window.setTimeout(() => setExportStatus(""), 3000);
            }}
            className="rounded-3xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Export summary
          </button>
        </div>
      </div>

      {exportStatus && (
        <div className="rounded-[28px] bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200">
          {exportStatus}
        </div>
      )}

      {error && (
        <div className="rounded-[28px] bg-red-50 px-5 py-4 text-sm font-semibold text-red-700 ring-1 ring-red-200">
          Backend connection issue: {error}
        </div>
      )}

      {showAssigned && (
        <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Assigned patients</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900">Accept new patient entries</h2>
              <p className="mt-3 max-w-2xl text-sm text-slate-500">
                Review patients assigned to you and accept them into your caseload.
              </p>
            </div>
            <button
              onClick={() => setShowAssigned(false)}
              className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Close panel
            </button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {assignedPatients.length > 0 ? (
              assignedPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="rounded-[32px] border border-slate-200 bg-slate-50 p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{patient.id}</p>
                      <h3 className="mt-2 text-2xl font-semibold text-slate-900">{patient.name}</h3>
                      <p className="mt-2 text-sm text-slate-600">{patient.disease}</p>
                    </div>
                    <span
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${
                        patient.severity === "Critical"
                          ? "bg-red-100 text-red-700"
                          : patient.severity === "Moderate"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {patient.severity}
                    </span>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      onClick={() => setAcceptedPatients((current) => [...current, patient.id])}
                      className="rounded-3xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
                    >
                      Accept patient
                    </button>
                    <button
                      onClick={() => navigate(`/patients/${routePatientId(patient.id)}`)}
                      className="rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                    >
                      View profile
                    </button>
                    <button
                      onClick={() => navigate("/patient-history", { state: { selectedPatient: patient } })}
                      className="rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                    >
                      View history
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[32px] bg-slate-50 p-10 text-center text-slate-600">
                {isLoading ? "Loading live patient entries..." : "No new live patient entries are waiting."}
              </div>
            )}
          </div>
        </div>
      )}

      <StatsCards patients={patients} alerts={alerts} reportPatients={reportPatients} />

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[2fr_1fr]">
        <div className="space-y-8 min-w-0">
          <div className="w-full min-w-0">
            <AnalyticsChart />
          </div>

          <RecentCases patients={patients} isLoading={isLoading} />
        </div>

        <div className="space-y-8">
          <PatientSummary
            alerts={alerts}
            patients={patients}
            isLoading={isLoading}
            onAcknowledge={acknowledge}
          />
        </div>
      </div>

    </div>
  );
}
