import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  LogOut,
  RefreshCw,
  Search,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  fetchRoutingAssignments,
  syncRoutingAssignments,
  updateRoutingAssignmentStatus,
} from "../services/api";

const statusOptions = ["Unassigned", "Assigned", "In Review", "Closed"];

function severityClass(severity) {
  if (severity === "Critical") return "bg-red-50 text-red-700 ring-red-200";
  if (severity === "Urgent") return "bg-amber-50 text-amber-700 ring-amber-200";
  return "bg-emerald-50 text-emerald-700 ring-emerald-200";
}

function statusClass(status) {
  if (status === "Closed") return "bg-emerald-600 text-white";
  if (status === "In Review") return "bg-blue-600 text-white";
  if (status === "Unassigned") return "bg-amber-600 text-white";
  return "bg-slate-900 text-white";
}

export default function AdminDashboard() {
  const { logout, user } = useAuth();
  const [routingData, setRoutingData] = useState({
    assignments: [],
    doctors: [],
    summary: {},
  });
  const [query, setQuery] = useState("");
  const [severity, setSeverity] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadAssignments = async () => {
    setIsRefreshing(true);
    try {
      const data = await fetchRoutingAssignments();
      setRoutingData({
        assignments: data.assignments || [],
        doctors: data.doctors || [],
        summary: data.summary || {},
        generatedAt: data.generated_at,
      });
      setError("");
    } catch (err) {
      setError(err.message || "Unable to load routing assignments.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleSyncAssignments = async () => {
    setIsRefreshing(true);
    try {
      const data = await syncRoutingAssignments();
      setRoutingData({
        assignments: data.assignments || [],
        doctors: data.doctors || [],
        summary: data.summary || {},
        generatedAt: data.generated_at,
      });
      setError("");
    } catch (err) {
      setError(err.message || "Unable to sync routing assignments.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    handleSyncAssignments();
    const intervalId = window.setInterval(handleSyncAssignments, 8000);
    return () => window.clearInterval(intervalId);
  }, []);

  const filteredAssignments = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return routingData.assignments.filter((assignment) => {
      const matchesSeverity = severity === "All" || assignment.severity === severity;
      const searchable = [
        assignment.patient_name,
        assignment.patient_id,
        assignment.doctor_name,
        assignment.specialty,
        ...(assignment.symptoms || []),
      ]
        .join(" ")
        .toLowerCase();

      return matchesSeverity && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [query, routingData.assignments, severity]);

  const handleStatusChange = async (assignmentId, nextStatus) => {
    const previous = routingData;
    setRoutingData((current) => ({
      ...current,
      assignments: current.assignments.map((assignment) =>
        assignment.assignment_id === assignmentId
          ? { ...assignment, status: nextStatus }
          : assignment
      ),
    }));

    try {
      await updateRoutingAssignmentStatus(assignmentId, nextStatus);
      await loadAssignments();
    } catch (err) {
      setRoutingData(previous);
      setError(err.message || "Unable to update assignment status.");
    }
  };

  const summary = routingData.summary || {};

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-cyan-300">
              <ShieldCheck size={26} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Admin Routing
              </p>
              <h1 className="text-3xl font-semibold text-slate-950">
                Patient Assignment Dashboard
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              {user?.email || "Admin"}
            </div>
            <button
              onClick={loadAssignments}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
              Refresh
            </button>
            <button
              onClick={handleSyncAssignments}
              className="inline-flex items-center gap-2 rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
            >
              <ClipboardList size={18} />
              Sync New Routes
            </button>
            <button
              onClick={() => {
                logout();
                window.location.href = "/admin-login";
              }}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-6">
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={<Users size={22} />}
            label="Routed patients"
            value={summary.routed_patients || 0}
          />
          <MetricCard
            icon={<AlertTriangle size={22} />}
            label="Critical routes"
            value={summary.critical_routes || 0}
          />
          <MetricCard
            icon={<Activity size={22} />}
            label="Urgent routes"
            value={summary.urgent_routes || 0}
          />
          <MetricCard
            icon={<CheckCircle2 size={22} />}
            label="Avg confidence"
            value={`${summary.avg_confidence || 0}%`}
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="rounded-2xl border border-slate-200 bg-white">
            <div className="flex flex-col gap-4 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">
                  Assignment Queue
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Live routes generated from active patient symptoms and alerts.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <Search size={18} className="text-slate-400" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search patients, doctors, symptoms"
                    className="w-full bg-transparent text-sm outline-none sm:w-72"
                  />
                </div>
                <select
                  value={severity}
                  onChange={(event) => setSeverity(event.target.value)}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold outline-none"
                >
                  <option>All</option>
                  <option>Critical</option>
                  <option>Urgent</option>
                  <option>Routine</option>
                </select>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {isLoading ? (
                <div className="p-8 text-sm font-semibold text-slate-500">
                  Loading routing assignments...
                </div>
              ) : filteredAssignments.length === 0 ? (
                <div className="p-8 text-sm font-semibold text-slate-500">
                  No active patient routes match the current filters.
                </div>
              ) : (
                filteredAssignments.map((assignment) => (
                  <AssignmentRow
                    key={assignment.assignment_id}
                    assignment={assignment}
                    onStatusChange={handleStatusChange}
                  />
                ))
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
                  <Stethoscope size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">
                    Doctor Capacity
                  </h2>
                  <p className="text-sm text-slate-500">
                    Active load by specialty.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {routingData.doctors.length === 0 ? (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
                    No registered doctors found in the backend. Create doctor accounts to enable live assignment.
                  </div>
                ) : routingData.doctors.map((doctor) => {
                  const capacity = doctor.capacity || 1;
                  const loadPercent = Math.min(
                    Math.round((doctor.assigned / capacity) * 100),
                    100
                  );

                  return (
                    <div key={doctor.id}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {doctor.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {doctor.specialty} · {doctor.shift}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-slate-500">
                          {doctor.assigned}/{capacity}
                        </span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-slate-100">
                        <div
                          className="h-2 rounded-full bg-cyan-500"
                          style={{ width: `${loadPercent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

function MetricCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
          {icon}
        </div>
        <span className="text-3xl font-semibold text-slate-950">{value}</span>
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-500">{label}</p>
    </div>
  );
}

function AssignmentRow({ assignment, onStatusChange }) {
  return (
    <article className="p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${severityClass(assignment.severity)}`}>
              {assignment.severity}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {assignment.specialty}
            </span>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              {assignment.confidence}% confidence
            </span>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Patient
              </p>
              <h3 className="mt-1 text-xl font-semibold text-slate-950">
                {assignment.patient_name}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {assignment.patient_id}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Assigned Doctor
              </p>
              <h3 className="mt-1 text-xl font-semibold text-slate-950">
                {assignment.doctor_name}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {assignment.doctor_unit} · {assignment.doctor_shift}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {(assignment.symptoms || []).slice(0, 4).map((symptom) => (
              <span
                key={symptom}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
              >
                {symptom}
              </span>
            ))}
          </div>

          <div className="mt-4 rounded-2xl bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              <ClipboardList size={18} className="mt-0.5 text-slate-400" />
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {assignment.reason}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {assignment.recommended_action}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex min-w-[190px] flex-col gap-3">
          {statusOptions.map((option) => (
            <button
              key={option}
              onClick={() => onStatusChange(assignment.assignment_id, option)}
              className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                assignment.status === option
                  ? statusClass(option)
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </article>
  );
}
