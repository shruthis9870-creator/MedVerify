import { useEffect, useMemo, useState } from "react";
import PageShell from "../components/layout/PageShell";
import { useLiveAlerts } from "../hooks/useLiveAlerts";

const legendItems = [
  { color: "#3b82f6", label: "Admission" },
  { color: "#f59e0b", label: "AI Alert" },
  { color: "#22c55e", label: "Report Upload" },
  { color: "#ef4444", label: "Escalation" },
];

const getEventStyle = (entry) => {
  const normalized = entry.toLowerCase();

  if (/(admitted|reported)/.test(normalized)) {
    return {
      color: "#3b82f6",
      label: "Admission",
      badgeClass: "bg-blue-50 text-blue-700 ring-blue-200",
    };
  }

  if (/(ai|risk|alert|urgency)/.test(normalized)) {
    return {
      color: "#f59e0b",
      label: "AI Alert",
      badgeClass: "bg-amber-50 text-amber-700 ring-amber-200",
    };
  }

  if (/(uploaded|report)/.test(normalized)) {
    return {
      color: "#22c55e",
      label: "Report Upload",
      badgeClass: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    };
  }

  if (/(referral|specialist|icu|transfer|escalat|surgery|consult)/.test(normalized)) {
    return {
      color: "#ef4444",
      label: "Escalation",
      badgeClass: "bg-red-50 text-red-700 ring-red-200",
    };
  }

  return {
    color: "#94a3b8",
    label: "Update",
    badgeClass: "bg-slate-100 text-slate-700 ring-slate-200",
  };
};

export default function TimelinePage() {
  const { patients, isLoading, error } = useLiveAlerts();
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPatients = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) return patients;

    return patients.filter((patient) => {
      const haystacks = [patient.name, patient.id, patient.disease].join(" ").toLowerCase();
      return haystacks.includes(normalizedSearch);
    });
  }, [searchTerm]);

  useEffect(() => {
    if (filteredPatients.length === 0) {
      setSelectedPatientId("");
      return;
    }

    if (!filteredPatients.some((patient) => patient.id === selectedPatientId)) {
      setSelectedPatientId(filteredPatients[0].id);
    }
  }, [filteredPatients, selectedPatientId]);

  const selectedPatient = useMemo(() => {
    if (!selectedPatientId) return null;
    return filteredPatients.find((patient) => patient.id === selectedPatientId) || filteredPatients[0] || null;
  }, [filteredPatients, selectedPatientId]);

  const historyEntries = selectedPatient?.history || [];

  return (
    <PageShell
      title="Case Timeline"
      subtitle="Chronological event log for the selected patient."
      status="Patient timeline"
    >
      <div className="space-y-6">
          <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Patient timeline</p>
              <p className="mt-1 text-sm text-slate-500">Search by patient name, ID, or diagnosis and review the event history.</p>
            </div>

            <div className="flex w-full max-w-xl flex-col gap-3 md:flex-row md:items-center">
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search patient"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-100"
              />

              <select
                value={selectedPatientId}
                onChange={(event) => setSelectedPatientId(event.target.value)}
                className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-100"
              >
                {filteredPatients.length === 0 ? (
                  <option value="">{isLoading ? "Loading patients" : "No matching patients"}</option>
                ) : (
                  filteredPatients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name} ({patient.id})
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-[28px] bg-red-50 px-5 py-4 text-sm font-semibold text-red-700 ring-1 ring-red-200">
            Backend connection issue: {error}
          </div>
        )}

        <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="mb-6 flex flex-wrap items-center gap-3 rounded-[28px] bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
            {legendItems.map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-sm text-slate-600">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          {filteredPatients.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
              No matching patients found.
            </div>
          ) : historyEntries.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
              No timeline events recorded for this patient.
            </div>
          ) : (
            <div className="relative ml-1 space-y-4">
              <div className="absolute left-1.5 top-2 bottom-2 w-px bg-slate-200" aria-hidden="true" />

              {historyEntries.map((entry, index) => {
                const [timePart, ...descriptionParts] = entry.split(" - ");
                const description = descriptionParts.join(" - ").trim();
                const eventStyle = getEventStyle(entry);

                return (
                  <article
                    key={`${selectedPatient.id}-${index}`}
                    className="relative pl-8"
                  >
                    <span
                      className="absolute left-0 top-2 h-3 w-3 rounded-full border-2 border-white"
                      style={{ backgroundColor: eventStyle.color }}
                    />

                    <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5 shadow-sm">
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="text-sm font-bold text-slate-900">{timePart.trim()}</p>
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.24em] ring-1 ${eventStyle.badgeClass}`}>
                          {eventStyle.label}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">{description}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
