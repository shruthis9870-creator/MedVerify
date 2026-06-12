import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HeartPulse, FileText, Filter } from "lucide-react";
import { useLiveAlerts } from "../hooks/useLiveAlerts";
import { routePatientId } from "../services/api";

export default function ActiveCases() {
  const navigate = useNavigate();
  const location = useLocation();
  const incomingPatient = location.state?.selectedPatient;
  const { activePatients, isLoading, error } = useLiveAlerts();

  const [selectedPatient, setSelectedPatient] = useState(
    incomingPatient || activePatients[0] || null
  );
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    if (!selectedPatient && activePatients.length > 0) {
      setSelectedPatient(incomingPatient || activePatients[0]);
    }
  }, [activePatients, incomingPatient, selectedPatient]);

  // Filter by organ/disease
  const filteredPatients = activePatients.filter((patient) => {
    if (filterType === "all") return true;
    if (filterType === "critical") return patient.severity === "Critical";
    if (filterType === "cardiac") return patient.organ === "Cardiac" || patient.disease.toLowerCase().includes("cardiac") || patient.disease.toLowerCase().includes("heart");
    if (filterType === "pending") return patient.severity === "Moderate";
    return true;
  });

  const cardiacPatients = activePatients.filter((p) => p.organ === "Cardiac" || p.disease.toLowerCase().includes("cardiac") || p.disease.toLowerCase().includes("heart") || p.disease.toLowerCase().includes("hypertensive"));
  const criticalPatients = activePatients.filter((p) => p.severity === "Critical");

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Active care</p>
          <h1 className="mt-2 text-4xl font-semibold text-slate-900">Active Cases</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-500">
            Monitor live high-risk WhatsApp triage cases and review their latest clinical updates.
          </p>
        </div>

        <button
          onClick={() => navigate("/patients")}
          className="rounded-3xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          View all patients
        </button>
      </div>

      {error && (
        <div className="rounded-[28px] bg-red-50 px-5 py-4 text-sm font-semibold text-red-700 ring-1 ring-red-200">
          Backend connection issue: {error}
        </div>
      )}

      {/* CASE SUMMARY */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[28px] bg-red-50 p-6 shadow-sm ring-1 ring-red-200">
          <p className="text-sm uppercase tracking-[0.24em] text-red-600 font-semibold">Critical Cases</p>
          <p className="mt-2 text-4xl font-bold text-red-700">{criticalPatients.length}</p>
          <p className="mt-1 text-xs text-red-600">Requires immediate attention</p>
        </div>
        <div className="rounded-[28px] bg-cyan-50 p-6 shadow-sm ring-1 ring-cyan-200">
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-600 font-semibold">Cardiac Cases</p>
          <p className="mt-2 text-4xl font-bold text-cyan-700">{cardiacPatients.length}</p>
          <p className="mt-1 text-xs text-cyan-600">Cardiology specialty</p>
        </div>
        <div className="rounded-[28px] bg-blue-50 p-6 shadow-sm ring-1 ring-blue-200">
          <p className="text-sm uppercase tracking-[0.24em] text-blue-600 font-semibold">Total Active</p>
          <p className="mt-2 text-4xl font-bold text-blue-700">{activePatients.length}</p>
          <p className="mt-1 text-xs text-blue-600">Admitted patients</p>
        </div>
      </div>

      {/* FILTER BUTTONS */}
      <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-slate-600" />
          <h3 className="text-sm font-semibold text-slate-900">Filter cases</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setFilterType("all")}
            className={`rounded-3xl px-5 py-3 text-sm font-semibold transition ${
              filterType === "all"
                ? "bg-slate-950 text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            All Cases ({activePatients.length})
          </button>
          <button
            onClick={() => setFilterType("critical")}
            className={`rounded-3xl px-5 py-3 text-sm font-semibold transition ${
              filterType === "critical"
                ? "bg-red-600 text-white"
                : "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
            }`}
          >
            Critical ({criticalPatients.length})
          </button>
          <button
            onClick={() => setFilterType("cardiac")}
            className={`rounded-3xl px-5 py-3 text-sm font-semibold transition ${
              filterType === "cardiac"
                ? "bg-cyan-600 text-white"
                : "border border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-100"
            }`}
          >
            Cardiac Cases ({cardiacPatients.length})
          </button>
          <button
            onClick={() => setFilterType("pending")}
            className={`rounded-3xl px-5 py-3 text-sm font-semibold transition ${
              filterType === "pending"
                ? "bg-amber-600 text-white"
                : "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
            }`}
          >
            Moderate
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {filteredPatients.map((patient) => {
              const isCardiac = patient.organ === "Cardiac" || patient.disease.toLowerCase().includes("cardiac") || patient.disease.toLowerCase().includes("heart") || patient.disease.toLowerCase().includes("hypertensive");
              return (
                <div
                  key={patient.id}
                  className={`rounded-[32px] p-6 shadow-sm ring-1 transition cursor-pointer ${
                    isCardiac
                      ? "bg-cyan-50 ring-cyan-200 hover:shadow-md"
                      : patient.severity === "Critical"
                      ? "bg-red-50 ring-red-200 hover:shadow-md"
                      : "bg-white ring-slate-200 hover:shadow-md"
                  }`}
                  onClick={() => setSelectedPatient(patient)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <HeartPulse className="h-5 w-5" />
                        <span className="text-sm uppercase tracking-[0.24em]">
                          {isCardiac ? "Cardiac Patient" : "Active Patient"}
                        </span>
                      </div>
                      <h2 className="mt-4 text-2xl font-semibold text-slate-900">{patient.name}</h2>
                      <p className="mt-2 text-sm text-slate-500">{patient.id}</p>
                    </div>
                    <span
                      className={`rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap ${
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

                  <div className="mt-6 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                    <div className="rounded-3xl bg-white bg-opacity-60 p-4">
                      <div className="font-semibold text-slate-900">Disease</div>
                      <div className="mt-2">{patient.disease}</div>
                    </div>
                    <div className="rounded-3xl bg-white bg-opacity-60 p-4">
                      <div className="font-semibold text-slate-900">Organ</div>
                      <div className="mt-2">{patient.organ}</div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/patient-history", { state: { selectedPatient: patient } });
                      }}
                      className="rounded-3xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      View history
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/patients/${routePatientId(patient.id)}`);
                      }}
                      className="rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                    >
                      View profile
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {selectedPatient ? (
          <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Selected patient</p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-900">{selectedPatient.name}</h2>
                <p className="text-sm text-slate-500">Patient ID: {selectedPatient.id}</p>
              </div>
              <span className={`rounded-3xl px-4 py-2 text-sm font-semibold text-white ${
                selectedPatient.severity === "Critical"
                  ? "bg-red-600"
                  : selectedPatient.severity === "Moderate"
                  ? "bg-amber-600"
                  : "bg-emerald-600"
              }`}>
                {selectedPatient.severity}
              </span>
            </div>

            <div className="mt-8 space-y-6">
              <div className="rounded-3xl bg-slate-50 p-6">
                <h3 className="text-xl font-semibold text-slate-900">Overview</h3>
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <div className="flex items-center justify-between rounded-3xl bg-white px-4 py-3">
                    <span>Organ system</span>
                    <span className="font-semibold text-slate-900">{selectedPatient.organ}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-3xl bg-white px-4 py-3">
                    <span>Age</span>
                    <span className="font-semibold text-slate-900">{selectedPatient.age}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-3xl bg-white px-4 py-3">
                    <span>Reports</span>
                    <span className="font-semibold text-slate-900">{selectedPatient.reports.length}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-slate-50 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-slate-900">Uploaded Reports</h3>
                  <span className="text-sm text-slate-500">{selectedPatient.reports.length} files</span>
                </div>
                <div className="space-y-3">
                  {selectedPatient.reports.length > 0 ? (
                    selectedPatient.reports.map((report, index) => (
                      <button
                        key={index}
                        onClick={() => navigate(`/reports/${routePatientId(selectedPatient.id)}`)}
                        className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-left text-sm text-slate-800 transition hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-slate-500" />
                          <span>{report.name}</span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-slate-600 rounded-3xl bg-white px-4 py-3">No reports uploaded</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <p className="text-slate-500">
              {isLoading ? "Loading active cases..." : "No active high-risk cases are open right now."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
