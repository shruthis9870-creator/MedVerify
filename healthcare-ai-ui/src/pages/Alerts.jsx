import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Eye, FileText, RefreshCcw } from "lucide-react";
import { useLiveAlerts } from "../hooks/useLiveAlerts";
import { routePatientId } from "../services/api";

export default function Alerts() {
  const navigate = useNavigate();
  const { alerts, patients, isLoading, error, lastUpdated, refresh, acknowledge } = useLiveAlerts(4000);
  const [selectedAlertId, setSelectedAlertId] = useState(null);

  const selectedAlert = useMemo(
    () => alerts.find((alert) => alert.alertId === selectedAlertId) || alerts[0] || null,
    [alerts, selectedAlertId]
  );

  const selectedPatient = selectedAlert
    ? patients.find((patient) => patient.id === selectedAlert.patientId)
    : null;

  return (
    <div className="space-y-8">
      <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-red-500">Urgent alerts</p>
            <h1 className="mt-2 text-4xl font-semibold text-slate-900">Live WhatsApp Alerts</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-500">
              Active emergency alerts generated from patient WhatsApp messages and symptom workflow red flags.
            </p>
            <p className="mt-2 text-xs font-semibold text-slate-400">
              {lastUpdated ? `Last synced ${lastUpdated.toLocaleTimeString()}` : "Connecting to /alerts/active..."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="rounded-3xl bg-red-50 px-5 py-3 text-sm font-semibold text-red-700">
              {isLoading ? "Loading" : `${alerts.length} active alerts`}
            </div>
            <button
              onClick={refresh}
              className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <RefreshCcw size={16} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-[28px] bg-red-50 px-5 py-4 text-sm font-semibold text-red-700 ring-1 ring-red-200">
          Backend connection issue: {error}
        </div>
      )}

      <div className="grid gap-8 xl:grid-cols-[2fr_1fr]">
        <div className="overflow-x-auto rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <table className="w-full min-w-[900px] border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-sm uppercase tracking-[0.22em] text-slate-500">
                <th className="pb-3 font-semibold">Time</th>
                <th className="pb-3 font-semibold">Patient</th>
                <th className="pb-3 font-semibold">Message / Issue</th>
                <th className="pb-3 font-semibold">Severity</th>
                <th className="pb-3 font-semibold">Reports</th>
                <th className="pb-3 text-center font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert) => (
                <tr
                  key={alert.alertId}
                  onClick={() => setSelectedAlertId(alert.alertId)}
                  className={`cursor-pointer rounded-[28px] text-sm transition ${
                    selectedAlert?.alertId === alert.alertId
                      ? "bg-red-50 text-slate-800 ring-1 ring-red-200"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <td className="py-4 font-semibold text-slate-600">{alert.createdLabel}</td>
                  <td className="py-4">
                    <p className="font-semibold text-slate-900">{alert.patient}</p>
                    <p className="mt-1 text-xs text-slate-500">{alert.phone || alert.patientId}</p>
                  </td>
                  <td className="py-4 max-w-[320px]">
                    <p className="line-clamp-2">{alert.issue}</p>
                    <p className="mt-1 text-xs text-slate-500">{alert.reason}</p>
                  </td>
                  <td className="py-4">
                    <span className={`rounded-full px-4 py-2 text-xs font-semibold ${
                      alert.severity === "Critical"
                        ? "bg-red-100 text-red-700"
                        : alert.severity === "Moderate"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}>
                      {alert.severity}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">
                      <FileText size={14} />
                      {alert.reports.length}
                    </span>
                  </td>
                  <td className="py-4 text-center">
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        acknowledge(alert.alertId);
                      }}
                      className="inline-flex items-center gap-2 rounded-3xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                    >
                      <CheckCircle size={16} />
                      Ack
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!isLoading && alerts.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-lg font-semibold text-slate-900">No active alerts</p>
              <p className="mt-2 text-sm text-slate-500">
                New red-flag WhatsApp messages will populate this table automatically.
              </p>
            </div>
          )}
        </div>

        <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
          {selectedAlert && selectedPatient ? (
            <div className="space-y-6">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Patient detail</p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-900">{selectedPatient.name}</h2>
                <p className="mt-2 text-sm text-slate-500">{selectedPatient.phone || selectedPatient.id}</p>
              </div>

              <div className="rounded-3xl bg-red-50 p-5 ring-1 ring-red-200">
                <p className="text-sm font-semibold text-red-700">Recommended action</p>
                <p className="mt-2 text-sm text-slate-700">{selectedAlert.action}</p>
              </div>

              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-center justify-between rounded-3xl bg-slate-50 px-4 py-3">
                  <span>Severity</span>
                  <span className="font-semibold text-slate-900">{selectedPatient.severity}</span>
                </div>
                <div className="flex items-center justify-between rounded-3xl bg-slate-50 px-4 py-3">
                  <span>Organ system</span>
                  <span className="font-semibold text-slate-900">{selectedPatient.organ}</span>
                </div>
                <div className="flex items-center justify-between rounded-3xl bg-slate-50 px-4 py-3">
                  <span>Reports</span>
                  <span className="font-semibold text-slate-900">{selectedPatient.reports.length}</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900">Latest messages</h3>
                <div className="mt-3 space-y-3">
                  {selectedPatient.history.map((item) => (
                    <div key={item} className="rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate(`/patients/${routePatientId(selectedPatient.id)}`)}
                  className="inline-flex items-center gap-2 rounded-3xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  <Eye size={16} />
                  View profile
                </button>
                <button
                  onClick={() => navigate(`/reports/${routePatientId(selectedPatient.id)}`)}
                  className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                >
                  <FileText size={16} />
                  Reports
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl bg-slate-50 p-6 text-sm text-slate-600">
              Select a live alert to see patient details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
