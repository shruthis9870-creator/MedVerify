import { useState } from "react";
import { CheckCircle, XCircle, Beaker, Hospital, FileText } from "lucide-react";
import PageShell from "../components/layout/PageShell";

const approvedRecommendations = [];
const rejectedRecommendations = [];
const testRequests = [];
const hospitalRecommendations = [];

export default function DecisionPanel() {
  const [activeTab, setActiveTab] = useState("approved");
  const [doctorNotes, setDoctorNotes] = useState("");
  const [savedNotes, setSavedNotes] = useState("");
  const notesTabCount = doctorNotes.trim().length > 0 ? 1 : 0;

  const tabs = [
    {
      id: "approved",
      label: "Approved",
      icon: <CheckCircle className="h-5 w-5" />,
      count: approvedRecommendations.length,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      id: "rejected",
      label: "Rejected",
      icon: <XCircle className="h-5 w-5" />,
      count: rejectedRecommendations.length,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      id: "tests",
      label: "Test Requests",
      icon: <Beaker className="h-5 w-5" />,
      count: testRequests.length,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: "hospital",
      label: "Hospital Transfers",
      icon: <Hospital className="h-5 w-5" />,
      count: hospitalRecommendations.length,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      id: "notes",
      label: "Doctor Notes",
      icon: <FileText className="h-5 w-5" />,
      count: notesTabCount,
      color: "text-slate-600",
      bgColor: "bg-slate-50",
    },
  ];

  return (
    <PageShell
      title="AI Decision Panel"
      subtitle="Comprehensive overview of AI-generated recommendations, approvals, rejections, test requests, and hospital referrals."
      status="Clinical decision tracking"
      footer={
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tabs.map((tab) => (
            <div key={tab.id} className={`rounded-[24px] ${tab.bgColor} p-5 shadow-sm ring-1 ring-slate-200`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={tab.color}>{tab.icon}</span>
                <p className="text-sm font-semibold text-slate-900">{tab.label}</p>
              </div>
              <p className={`text-3xl font-bold ${tab.color}`}>{tab.count}</p>
            </div>
          ))}
        </div>
      }
    >
      {/* TABS */}
      <div className="flex gap-2 mb-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`inline-flex items-center gap-2 rounded-3xl px-5 py-3 text-sm font-semibold whitespace-nowrap transition ${
              activeTab === tab.id
                ? `${tab.bgColor} ${tab.color} ring-1 ring-current`
                : "bg-slate-50 text-slate-700 hover:bg-slate-100"
            }`}
          >
            {tab.icon}
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* APPROVED RECOMMENDATIONS */}
      {activeTab === "approved" && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Approved Recommendations</h2>
          {approvedRecommendations.map((item) => (
            <div key={item.id} className="rounded-[28px] bg-emerald-50 p-6 shadow-sm ring-1 ring-emerald-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{item.patientName}</h3>
                  <p className="text-sm text-slate-600 mt-1">Patient ID: {item.patientId}</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 text-white px-3 py-1 text-xs font-semibold">
                  <CheckCircle size={14} />
                  Approved
                </span>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs uppercase text-slate-600 font-semibold mb-2">Recommendation</p>
                  <p className="text-sm text-slate-700">{item.recommendation}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-slate-600 font-semibold mb-2">Reasoning</p>
                  <p className="text-sm text-slate-700">{item.reason}</p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-white rounded-[20px] border border-emerald-200">
                <p className="text-xs uppercase text-slate-600 font-semibold mb-2">Outcome</p>
                <p className="text-sm text-slate-700">{item.outcome}</p>
              </div>

              <p className="mt-4 text-xs text-slate-500">Approved: {item.approvedDate}</p>
            </div>
          ))}
          {approvedRecommendations.length === 0 && (
            <div className="rounded-[28px] bg-slate-50 p-8 text-center text-slate-600">
              No approved recommendations yet.
            </div>
          )}
        </div>
      )}

      {/* REJECTED RECOMMENDATIONS */}
      {activeTab === "rejected" && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Rejected Recommendations</h2>
          {rejectedRecommendations.map((item) => (
            <div key={item.id} className="rounded-[28px] bg-red-50 p-6 shadow-sm ring-1 ring-red-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{item.patientName}</h3>
                  <p className="text-sm text-slate-600 mt-1">Patient ID: {item.patientId}</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-red-600 text-white px-3 py-1 text-xs font-semibold">
                  <XCircle size={14} />
                  Rejected
                </span>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs uppercase text-slate-600 font-semibold mb-2">Recommendation</p>
                  <p className="text-sm text-slate-700">{item.recommendation}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-slate-600 font-semibold mb-2">Reasoning</p>
                  <p className="text-sm text-slate-700">{item.reason}</p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-white rounded-[20px] border border-red-200">
                <p className="text-xs uppercase text-slate-600 font-semibold mb-2">Rejection Reason</p>
                <p className="text-sm text-slate-700">{item.rejectionReason}</p>
              </div>

              <p className="mt-4 text-xs text-slate-500">Rejected: {item.rejectedDate}</p>
            </div>
          ))}
          {rejectedRecommendations.length === 0 && (
            <div className="rounded-[28px] bg-slate-50 p-8 text-center text-slate-600">
              No rejected recommendations yet.
            </div>
          )}
        </div>
      )}

      {/* TEST REQUESTS */}
      {activeTab === "tests" && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">AI-Generated Test Requests</h2>
          {testRequests.map((item) => (
            <div key={item.id} className="rounded-[28px] bg-blue-50 p-6 shadow-sm ring-1 ring-blue-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{item.patientName}</h3>
                  <p className="text-sm text-slate-600 mt-1">Patient ID: {item.patientId}</p>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white ${
                    item.status === "Completed"
                      ? "bg-emerald-600"
                      : item.status === "In Progress"
                      ? "bg-blue-600"
                      : item.status === "Pending"
                      ? "bg-amber-600"
                      : "bg-slate-600"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-xs uppercase text-slate-600 font-semibold mb-3">Tests Requested</p>
                <div className="flex flex-wrap gap-2">
                  {item.tests.map((test, idx) => (
                    <span key={idx} className="bg-white rounded-full px-3 py-1 text-sm font-medium text-blue-700 border border-blue-200">
                      {test}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-white rounded-[20px] border border-blue-200">
                <p className="text-xs uppercase text-slate-600 font-semibold mb-2">Clinical Reasoning</p>
                <p className="text-sm text-slate-700">{item.reason}</p>
              </div>

              <p className="mt-4 text-xs text-slate-500">Requested: {item.requestedDate}</p>
            </div>
          ))}
          {testRequests.length === 0 && (
            <div className="rounded-[28px] bg-slate-50 p-8 text-center text-slate-600">
              No test requests yet.
            </div>
          )}
        </div>
      )}

      {/* HOSPITAL RECOMMENDATIONS */}
      {activeTab === "hospital" && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Hospital Transfer Recommendations</h2>
          {hospitalRecommendations.map((item) => (
            <div key={item.id} className="rounded-[28px] bg-purple-50 p-6 shadow-sm ring-1 ring-purple-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{item.patientName}</h3>
                  <p className="text-sm text-slate-600 mt-1">Patient ID: {item.patientId}</p>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white ${
                      item.urgency === "Critical"
                        ? "bg-red-600"
                        : item.urgency === "High"
                        ? "bg-amber-600"
                        : "bg-blue-600"
                    }`}
                  >
                    {item.urgency}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                      item.status === "Approved"
                        ? "bg-emerald-100 text-emerald-700"
                        : item.status === "In Transit"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 mb-4">
                <div>
                  <p className="text-xs uppercase text-slate-600 font-semibold mb-2">Current Location</p>
                  <p className="text-sm text-slate-700">{item.currentLocation}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-slate-600 font-semibold mb-2">Recommended Facility</p>
                  <p className="text-sm text-slate-700 font-semibold text-purple-700">{item.recommendedFacility}</p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-[20px] border border-purple-200">
                <p className="text-xs uppercase text-slate-600 font-semibold mb-2">Clinical Reasoning</p>
                <p className="text-sm text-slate-700">{item.reason}</p>
              </div>

              <p className="mt-4 text-xs text-slate-500">Recommended: {item.recommendedDate}</p>
            </div>
          ))}
          {hospitalRecommendations.length === 0 && (
            <div className="rounded-[28px] bg-slate-50 p-8 text-center text-slate-600">
              No hospital transfer recommendations yet.
            </div>
          )}
        </div>
      )}

      {/* DOCTOR NOTES */}
      {activeTab === "notes" && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Doctor Notes & Observations</h2>
          <div className="rounded-[28px] bg-slate-50 p-6 shadow-sm ring-1 ring-slate-200">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-900 mb-3">Clinical Notes</label>
              <textarea
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                placeholder="Add your clinical observations, follow-up instructions, treatment plans, or additional notes for the current decision tracking..."
                className="w-full rounded-[24px] border border-slate-200 bg-white p-4 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                rows={8}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setSavedNotes(doctorNotes)}
                className="rounded-3xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Save Notes
              </button>
              <button
                onClick={() => {
                  setDoctorNotes("");
                  setSavedNotes("");
                }}
                className="rounded-3xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
              >
                Clear
              </button>
            </div>
            {savedNotes && (
              <p className="mt-4 rounded-3xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200">
                Notes saved successfully for the clinical review.
              </p>
            )}
          </div>

          {doctorNotes && (
            <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Preview of Notes</h3>
              <div className="rounded-[20px] bg-slate-50 p-4 border border-slate-200 whitespace-pre-wrap text-sm text-slate-700">
                {doctorNotes}
              </div>
            </div>
          )}
        </div>
      )}
    </PageShell>
  );
}
