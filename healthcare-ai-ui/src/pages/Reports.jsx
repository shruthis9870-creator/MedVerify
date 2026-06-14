import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Clock3, Download, FileText } from "lucide-react";
import PageShell from "../components/layout/PageShell";
import { useLiveAlerts } from "../hooks/useLiveAlerts";
import { fetchPatientReports, openReportFile } from "../services/api";

export default function Reports() {
  const { id } = useParams();
  const decodedId = decodeURIComponent(id || "");
  const { patients, isLoading, error } = useLiveAlerts();
  const patient = patients.find((entry) => entry.id === decodedId);
  const [storedReports, setStoredReports] = useState([]);
  const [reportError, setReportError] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const reportPatient = patient || (
    storedReports.length > 0
      ? {
          id: decodedId,
          name: decodedId ? `Patient ${decodedId.replace(/^whatsapp:/i, "").slice(-4)}` : "Unknown patient",
          reports: storedReports,
          aiSuggestions: ["Stored reports are available, but there is no active alert for this patient."],
          severity: "Stored",
          age: "Not provided",
          organ: "Triage",
          latestAlert: null,
        }
      : null
  );
  const visibleReports = reportPatient?.reports || [];

  const handleOpenReport = async (report) => {
    setReportError("");

    try {
      await openReportFile(report);
    } catch (err) {
      setReportError(err.message || "Unable to open report");
    }
  };

  useEffect(() => {
    if (!decodedId) return;

    let isCurrent = true;

    fetchPatientReports(decodedId)
      .then((reports) => {
        if (!isCurrent) return;
        setStoredReports(reports);
        setReportError("");
      })
      .catch((err) => {
        if (!isCurrent) return;
        setReportError(err.message || "Unable to load stored reports");
      });

    return () => {
      isCurrent = false;
    };
  }, [decodedId]);

  useEffect(() => {
    if (visibleReports.length) {
      setSelectedReport(visibleReports[0]);
    } else {
      setSelectedReport(null);
    }
    setZoomLevel(1);
  }, [visibleReports]);

  if (!reportPatient) {
    return (
      <PageShell
        title={isLoading ? "Loading report" : "Report not found"}
        subtitle={error || reportError || "The requested patient report is not present in active alerts or stored report records."}
        status="Patient report"
      >
        <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <p className="text-slate-600">Please verify the patient ID or wait for the live alert feed to sync.</p>
        </div>
      </PageShell>
    );
  }

  const aiFindings = reportPatient.aiSuggestions?.length ? reportPatient.aiSuggestions : ["No AI findings available for this patient."];

  return (
    <PageShell
      title="Report Viewer"
      subtitle={`Review live report uploads and AI alert context for ${reportPatient.name}.`}
      status="Patient report"
      footer={
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-slate-900">Report snapshot</p>
            <p className="mt-2 text-sm text-slate-600">{visibleReports.length} files are linked to this patient.</p>
          </div>
          <div className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-slate-900">AI priority</p>
            <p className="mt-2 text-sm text-slate-600">{reportPatient.severity} case based on the latest workflow alert.</p>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[2.4fr_1fr]">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Total reports</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">{visibleReports.length}</p>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Last updated</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">Live</p>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Severity</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">{reportPatient.severity}</p>
            </div>
          </div>

          <div className="rounded-[32px] bg-slate-950 p-8 text-white shadow-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Medical report</p>
                <h2 className="mt-3 text-3xl font-semibold">Live Preview</h2>
              </div>
              <div className="flex items-center gap-2 rounded-3xl bg-white/10 px-4 py-2 text-sm text-slate-200">
                <Clock3 size={18} /> Synced from backend
              </div>
            </div>

            <div className="mt-8 h-[520px] rounded-[28px] bg-slate-900/80 border border-slate-800 p-6 overflow-hidden">
              <div className="flex h-full flex-col justify-between rounded-[24px] border border-slate-800 bg-slate-950/70 p-6 transition-transform duration-200" style={{ transform: `scale(${zoomLevel})`, transformOrigin: "center" }}>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Previewing</p>
                  <p className="mt-3 text-2xl font-semibold text-white">{selectedReport?.name || "No report selected"}</p>
                  <p className="mt-2 text-sm text-slate-300">
                    {selectedReport?.reportId
                      ? "Open the attached file through the secure report endpoint."
                      : "No secure report file is attached to this active alert yet."}
                  </p>
                </div>
                <div className="rounded-3xl bg-white/10 p-4 text-sm text-slate-200">
                  {reportPatient.latestAlert?.reason || "Stored report details will appear here."}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              {reportError && (
                <div className="basis-full rounded-3xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700">
                  {reportError}
                </div>
              )}

              <button
                onClick={() => setZoomLevel((current) => Number((current + 0.1).toFixed(1)))}
                className="rounded-3xl bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
              >
                Zoom In
              </button>
              <button
                onClick={() => setZoomLevel((current) => Math.max(0.5, Number((current - 0.1).toFixed(1))))}
                className="rounded-3xl bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
              >
                Zoom Out
              </button>
              {selectedReport?.reportId && (
                <button
                  type="button"
                  onClick={() => handleOpenReport(selectedReport)}
                  className="inline-flex items-center gap-2 rounded-3xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                >
                  <Download size={16} /> Open Source
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-semibold text-slate-900 mb-5">Uploaded Reports</h2>
            <div className="space-y-4">
              {visibleReports.length > 0 ? (
                visibleReports.map((report) => (
                  <div key={`${report.name}-${report.url}`} className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-slate-500" />
                      <div>
                        <p className="font-semibold text-slate-900">{report.name}</p>
                        <p className="text-sm text-slate-500">Received from alert payload</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="rounded-2xl bg-slate-950 px-4 py-2 text-sm text-white transition hover:bg-slate-800"
                    >
                      Open
                    </button>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl bg-slate-50 p-5 text-sm text-slate-600">
                  No report media has been attached to this active patient alert.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-semibold text-slate-900">AI Findings</h2>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">{reportPatient.severity}</span>
            </div>
            <div className="space-y-4">
              {aiFindings.map((finding, index) => (
                <div key={finding} className="rounded-3xl bg-blue-50 px-4 py-4 text-sm text-blue-900 border border-blue-200">
                  <p className="font-semibold">AI finding #{index + 1}</p>
                  <p className="mt-2">{finding}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-semibold text-slate-900 mb-5">Key Details</h2>
            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Patient age</span>
                <span className="font-semibold text-slate-900">{reportPatient.age}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Organ system</span>
                <span className="font-semibold text-slate-900">{reportPatient.organ}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Severity</span>
                <span className="font-semibold text-slate-900">{reportPatient.severity}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
