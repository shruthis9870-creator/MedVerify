import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DoctorActions() {
  const navigate = useNavigate();
  const [actionState, setActionState] = useState({});
  const [savedActions, setSavedActions] = useState([]);
  const [notes, setNotes] = useState("");
  const [savedNotes, setSavedNotes] = useState("");

  return (
    <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Doctor actions</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">Decision panel</h2>
          <p className="mt-3 text-sm text-slate-500">Quickly respond to case recommendations, approve treatments, or request additional data.</p>
        </div>
        <button
          onClick={() => navigate("/patients")}
          className="rounded-3xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Open patient details
        </button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {[
          { key: "approve", label: "Approve", tone: "bg-emerald-600 hover:bg-emerald-500" },
          { key: "reject", label: "Reject", tone: "bg-red-600 hover:bg-red-500" },
          { key: "tests", label: "Request tests", tone: "bg-sky-600 hover:bg-sky-500" },
          { key: "hospital", label: "Recommend hospital", tone: "bg-amber-500 hover:bg-amber-400" },
        ].map((action) => (
          <button
            key={action.key}
            onClick={() => {
              setActionState((current) => ({ ...current, [action.key]: true }));
              setSavedActions((current) => [
                ...current.filter((item) => item !== action.label),
                action.label,
              ]);
            }}
            className={`rounded-[32px] px-5 py-4 text-sm font-semibold text-white transition ${action.tone} ${actionState[action.key] ? "ring-2 ring-offset-2 ring-slate-900" : ""}`}
          >
            {actionState[action.key] ? `${action.label} saved` : action.label}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-[28px] bg-slate-50 p-5 ring-1 ring-slate-200">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">Saved actions</p>
            <p className="mt-1 text-xs text-slate-500">Clinician actions captured from the quick response panel.</p>
          </div>
          {savedActions.length > 0 && (
            <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
              {savedActions.length} saved
            </span>
          )}
        </div>

        {savedActions.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {savedActions.map((action) => (
              <span key={action} className="rounded-full bg-emerald-100 px-3 py-2 text-xs font-semibold text-emerald-700">
                {action}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-500">No actions saved yet. Use the quick actions above to capture decisions.</p>
        )}
      </div>

      <div className="mt-8 rounded-[32px] bg-slate-50 p-5 ring-1 ring-slate-200">
        <label className="block text-sm font-semibold text-slate-900 mb-3">Doctor notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add recommendation notes or follow-up instructions..."
          className="w-full rounded-[24px] border border-slate-200 bg-white p-4 text-sm text-slate-700 outline-none transition focus:border-slate-400"
          rows={5}
        />
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={() => setSavedNotes(notes)}
            className="rounded-3xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Save notes
          </button>
          <button
            onClick={() => {
              setNotes("");
              setSavedNotes("");
            }}
            className="rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
          >
            Clear notes
          </button>
        </div>
        <p className="mt-3 text-xs font-semibold text-slate-500">
          {savedNotes ? `Saved note ready for review (${savedNotes.length} characters).` : "Add notes before finalizing the care plan."}
        </p>
      </div>
    </div>
  );
}