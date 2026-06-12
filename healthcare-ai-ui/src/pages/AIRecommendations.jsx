import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ShieldAlert, Sparkles } from "lucide-react";
import { useLiveAlerts } from "../hooks/useLiveAlerts";
import { routePatientId } from "../services/api";

const decisionKey = (patientId) => `medverify-recommendation-${patientId}`;

function getRecommendationDecision(patientId) {
  const value = window.localStorage.getItem(decisionKey(patientId));
  return value ? JSON.parse(value) : null;
}

function recordRecommendationDecision(patientId, action) {
  const decision = {
    action,
    reason: action === "accepted" ? "Accepted by clinician" : "Rejected by clinician",
    recordedAt: new Date().toLocaleString(),
  };
  window.localStorage.setItem(decisionKey(patientId), JSON.stringify(decision));
  return decision;
}

export default function AIRecommendations() {
  const navigate = useNavigate();
  const { patients, isLoading, error } = useLiveAlerts();
  const [decisionRefresh, setDecisionRefresh] = useState(0);

  const recommendations = patients
    .filter((patient) => patient.aiSuggestions && patient.aiSuggestions.length > 0)
    .slice(0, 6)
    .map((patient) => ({
      patientId: patient.id,
      recommendation: patient.aiSuggestions[0],
      severity: patient.severity,
      reason: `${patient.disease}. ${patient.aiSuggestions.slice(1).join(" ")}`,
    }));

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">AI insights</p>
          <h1 className="mt-2 text-4xl font-semibold text-slate-900">AI Recommendations</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-500">
            Patient-specific action items generated from active backend alert data.
          </p>
        </div>

        <div className="inline-flex items-center gap-3 rounded-3xl bg-slate-950 px-5 py-3 text-white shadow-sm">
          <Sparkles className="h-5 w-5 text-cyan-300" />
          <span className="text-sm font-semibold">Always verify with clinical review</span>
        </div>
      </div>

      {error && (
        <div className="rounded-[28px] bg-red-50 px-5 py-4 text-sm font-semibold text-red-700 ring-1 ring-red-200">
          Backend connection issue: {error}
        </div>
      )}

      <div className="space-y-6">
        {recommendations.map((item) => {
          const patient = patients.find((p) => p.id === item.patientId);
          const patientDecision = getRecommendationDecision(patient.id);

          return (
            <div key={patient.id} className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-3xl font-semibold text-slate-900">{patient.name}</h2>
                  <p className="mt-1 text-sm text-slate-500">Patient ID: {patient.phone || patient.id}</p>
                </div>

                <div
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white ${
                    item.severity === "Critical"
                      ? "bg-red-500"
                      : item.severity === "Moderate"
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  }`}
                >
                  {item.severity}
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl bg-slate-50 p-6">
                  <div className="flex items-center gap-2 text-slate-500">
                    <ShieldAlert className="h-5 w-5" />
                    <h3 className="font-semibold">Reason flagged</h3>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{item.reason}</p>
                </div>

                <div className="rounded-3xl bg-cyan-50 p-6">
                  <div className="flex items-center gap-2 text-cyan-700">
                    <ArrowRight className="h-5 w-5" />
                    <h3 className="font-semibold">Recommended action</h3>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-700">{item.recommendation}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-4">
                <button
                  onClick={() => navigate(`/patients/${routePatientId(patient.id)}`)}
                  className="rounded-3xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  View patient profile
                </button>
                <button
                  onClick={() => {
                    recordRecommendationDecision(patient.id, "accepted");
                    setDecisionRefresh((current) => current + 1);
                  }}
                  disabled={patientDecision?.action === "accepted" || patientDecision?.action === "rejected"}
                  className={`rounded-3xl px-6 py-3 text-sm font-semibold transition ${
                    patientDecision?.action === "accepted"
                      ? "bg-emerald-200 text-emerald-900"
                      : "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                  } disabled:cursor-not-allowed disabled:opacity-75`}
                >
                  {patientDecision?.action === "accepted" ? "Recommendation accepted" : "Accept recommendation"}
                </button>
                <button
                  onClick={() => {
                    recordRecommendationDecision(patient.id, "rejected");
                    setDecisionRefresh((current) => current + 1);
                  }}
                  disabled={patientDecision?.action === "accepted" || patientDecision?.action === "rejected"}
                  className={`rounded-3xl px-6 py-3 text-sm font-semibold transition ${
                    patientDecision?.action === "rejected"
                      ? "bg-red-200 text-red-900"
                      : "bg-red-500 text-white hover:bg-red-400"
                  } disabled:cursor-not-allowed disabled:opacity-75`}
                >
                  {patientDecision?.action === "rejected" ? "Recommendation rejected" : "Reject recommendation"}
                </button>
              </div>
            </div>
          );
        })}

        {!isLoading && recommendations.length === 0 && (
          <div className="rounded-[32px] bg-white p-10 text-center text-sm text-slate-600 shadow-sm ring-1 ring-slate-200">
            No live AI recommendations are available yet.
          </div>
        )}
      </div>
    </div>
  );
}
