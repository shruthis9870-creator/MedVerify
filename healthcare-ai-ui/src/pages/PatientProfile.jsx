import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, FileText, XCircle } from "lucide-react";
import { useLiveAlerts } from "../hooks/useLiveAlerts";
import { routePatientId } from "../services/api";

const decisionKey = (patientId) => `medverify-recommendation-${patientId}`;

function getRecommendationDecision(patientId) {
  const value = window.localStorage.getItem(decisionKey(patientId));
  return value ? JSON.parse(value) : null;
}

function recordRecommendationDecision(patientId, action, reason) {
  const decision = {
    action,
    reason,
    recordedAt: new Date().toLocaleString(),
  };
  window.localStorage.setItem(decisionKey(patientId), JSON.stringify(decision));
  return decision;
}

export default function PatientProfile() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const decodedId = decodeURIComponent(id || "");
  const locationPatient = location.state?.selectedPatient;
  const { patients, isLoading, error } = useLiveAlerts();
  const patient = locationPatient || patients.find((entry) => entry.id === decodedId);

  const [showConfirmModal, setShowConfirmModal] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [decisionRefresh, setDecisionRefresh] = useState(0);
  const [selectedReport, setSelectedReport] = useState(null);
  const [testRequestMessage, setTestRequestMessage] = useState("");

  useEffect(() => {
    if (patient?.reports?.length) {
      setSelectedReport(patient.reports[0]);
    } else {
      setSelectedReport(null);
    }
    setTestRequestMessage("");
  }, [patient]);

  if (!patient) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="rounded-[32px] bg-white p-12 shadow-sm ring-1 ring-slate-200 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {isLoading ? "Loading patient..." : "Patient Not Found"}
          </h1>
          <p className="text-slate-600 mb-6">
            {error || "This patient is not present in the active backend alert feed."}
          </p>
          <button
            onClick={() => navigate("/patients")}
            className="rounded-3xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Back to Patients
          </button>
        </div>
      </div>
    );
  }

  const recommendationText = patient.aiSuggestions?.[0] || "No AI recommendation available";
  const recommendationReason = patient.aiSuggestions?.slice(1).join("; ") || "No additional AI context available.";
  const patientDecision = getRecommendationDecision(patient.id);

  const handleRecommendationAction = (action) => {
    const recordedDecision = recordRecommendationDecision(
      patient.id,
      action,
      action === "reject" ? rejectionReason.trim() || "No reason provided" : "Accepted by clinician"
    );

    if (recordedDecision) setDecisionRefresh((current) => current + 1);
    setShowConfirmModal(null);
    setRejectionReason("");
  };

  return (
    <div className="space-y-8">
      <button
        onClick={() => navigate("/patients")}
        className="inline-flex items-center gap-2 rounded-3xl bg-slate-100 hover:bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition"
      >
        <ArrowLeft size={16} />
        Back to Patients
      </button>

      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Patient profile</p>
          <h1 className="mt-2 text-4xl font-semibold text-slate-900">{patient.name}</h1>
          <p className="mt-3 text-sm text-slate-500">
            Live clinical view generated from WhatsApp triage alerts and uploaded report metadata.
          </p>
        </div>

        <div className="inline-flex flex-wrap items-center gap-3">
          <span className="rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">{patient.phone || patient.id}</span>
          <span className="rounded-3xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white">{patient.disease}</span>
          <span className={`rounded-3xl px-4 py-3 text-sm font-semibold text-white ${
            patient.severity === "Critical" ? "bg-red-600" : patient.severity === "Moderate" ? "bg-amber-600" : "bg-emerald-600"
          }`}>
            {patient.severity}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[2.3fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-semibold text-slate-900">Patient History</h2>
            <p className="mt-2 text-sm text-slate-500">Live alert timeline for this patient.</p>
            <div className="mt-6 space-y-4">
              {patient.history.map((item) => (
                <div key={item} className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Report Viewer</h2>
                <p className="mt-2 text-sm text-slate-500">Reports uploaded through WhatsApp appear here when the backend includes media URLs.</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">
                {patient.reports.length} uploaded
              </span>
            </div>

            <div className="mt-6 rounded-[28px] border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-4 rounded-3xl bg-white px-4 py-3 ring-1 ring-slate-200">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Active preview</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{selectedReport?.name || "No report selected"}</p>
                </div>
                {selectedReport?.url && (
                  <a
                    href={selectedReport.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700"
                  >
                    Open source
                  </a>
                )}
              </div>

              <div className="mt-4 h-[320px] rounded-[24px] bg-slate-950 text-white p-6">
                <div className="flex h-full flex-col justify-between rounded-[20px] border border-slate-800 bg-slate-900/80 p-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Clinical document preview</p>
                    <p className="mt-3 text-2xl font-semibold">{selectedReport?.name || "No document available"}</p>
                    <p className="mt-2 text-sm text-slate-300">
                      {selectedReport?.url
                        ? "This report is linked to the media URL received from the backend alert payload."
                        : "No report media has been attached to this active alert yet."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Uploaded Files ({patient.reports.length})</h3>
              <div className="space-y-2">
                {patient.reports.length > 0 ? (
                  patient.reports.map((report) => (
                    <button
                      key={`${report.name}-${report.url}`}
                      onClick={() => setSelectedReport(report)}
                      className={`flex w-full items-center gap-3 rounded-3xl p-4 text-left transition ${selectedReport === report ? "bg-slate-900 text-white" : "bg-slate-50 hover:bg-slate-100 text-slate-700"}`}
                    >
                      <FileText className={`h-5 w-5 ${selectedReport === report ? "text-white" : "text-slate-600"}`} />
                      <span className="text-sm font-medium">{report.name}</span>
                    </button>
                  ))
                ) : (
                  <div className="rounded-3xl bg-slate-50 p-4 text-center text-slate-600 text-sm">
                    No reports uploaded
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-semibold text-slate-900 mb-5">Patient summary</h2>
            <div className="space-y-4 text-sm text-slate-600">
              <div className="flex items-center justify-between rounded-3xl bg-slate-50 px-4 py-4">
                <span>Age</span>
                <span className="font-semibold text-slate-900">{patient.age}</span>
              </div>
              <div className="flex items-center justify-between rounded-3xl bg-slate-50 px-4 py-4">
                <span>Organ system</span>
                <span className="font-semibold text-slate-900">{patient.organ}</span>
              </div>
              <div className="flex items-center justify-between rounded-3xl bg-slate-50 px-4 py-4">
                <span>Admitted</span>
                <span className="font-semibold text-slate-900">{patient.admitted}</span>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-semibold text-slate-900 mb-5">Symptoms</h2>
            <ul className="space-y-3 text-slate-700">
              {patient.symptoms.map((symptom) => (
                <li key={symptom} className="rounded-3xl bg-slate-50 px-4 py-3">
                  {symptom}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-semibold text-slate-900 mb-5">AI Recommendation</h2>
            <div className="space-y-5">
              <div className="rounded-3xl bg-blue-50 p-5 border border-blue-200">
                <p className="font-semibold text-lg text-slate-900">Suggested action</p>
                <p className="mt-2 text-sm text-slate-600">{recommendationText}</p>
              </div>
              <div className="rounded-3xl bg-red-50 p-5 border border-red-200">
                <p className="font-semibold text-slate-900">Why this case was flagged</p>
                <p className="mt-2 text-sm text-slate-600">{recommendationReason}</p>
              </div>
              {patientDecision && (
                <div className={`rounded-3xl border p-5 ${patientDecision.action === "accept" ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}>
                  <p className="font-semibold text-slate-900">Decision recorded: {patientDecision.action === "accept" ? "Accepted" : "Rejected"}</p>
                  <p className="mt-2 text-sm text-slate-600">Recorded at {patientDecision.recordedAt}</p>
                  <p className="mt-2 text-xs text-slate-600">Reason: {patientDecision.reason}</p>
                </div>
              )}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowConfirmModal({ type: "accept", isOpen: true })}
                  disabled={Boolean(patientDecision)}
                  className="inline-flex items-center gap-2 rounded-3xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <CheckCircle size={16} />
                  Accept
                </button>
                <button
                  onClick={() => setShowConfirmModal({ type: "reject", isOpen: true })}
                  disabled={Boolean(patientDecision)}
                  className="inline-flex items-center gap-2 rounded-3xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <XCircle size={16} />
                  Reject
                </button>
                <button
                  onClick={() => setTestRequestMessage(`${patient.name} test request queued from live triage data.`)}
                  className="rounded-3xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Request tests
                </button>
              </div>

              {testRequestMessage && (
                <div className="rounded-3xl bg-blue-50 p-4 text-sm text-blue-800 ring-1 ring-blue-200">
                  {testRequestMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showConfirmModal?.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="rounded-[32px] bg-white p-8 shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              {showConfirmModal.type === "accept" ? "Accept Recommendation" : "Reject Recommendation"}
            </h3>
            <p className="text-slate-600 mb-6">
              {showConfirmModal.type === "accept"
                ? "Confirm that you want to accept this AI recommendation."
                : "Confirm rejection and provide your reasoning."}
            </p>
            {showConfirmModal.type === "reject" && (
              <textarea
                value={rejectionReason}
                onChange={(event) => setRejectionReason(event.target.value)}
                placeholder="Your reason for rejection..."
                className="w-full rounded-3xl border border-slate-200 p-4 mb-6 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                rows={3}
              />
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(null)}
                className="flex-1 rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRecommendationAction(showConfirmModal.type)}
                className={`flex-1 rounded-3xl px-4 py-3 text-sm font-semibold text-white transition ${
                  showConfirmModal.type === "accept"
                    ? "bg-emerald-600 hover:bg-emerald-500"
                    : "bg-red-600 hover:bg-red-500"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
