import { useMemo, useState } from "react";
import { AlertCircle, Clock3, ShieldAlert, Sparkles } from "lucide-react";
import { useLiveAlerts } from "../../hooks/useLiveAlerts";

const severityStyles = {
  Critical: {
    badge: "bg-red-100 text-red-700 ring-red-200",
    glow: "bg-red-500",
    icon: AlertCircle,
  },
  Moderate: {
    badge: "bg-amber-100 text-amber-700 ring-amber-200",
    glow: "bg-amber-500",
    icon: ShieldAlert,
  },
  Low: {
    badge: "bg-emerald-100 text-emerald-700 ring-emerald-200",
    glow: "bg-emerald-500",
    icon: Sparkles,
  },
};

export default function Timeline({ compact = false, showHeader = true, maxItems = 6 }) {
  const { alerts, isLoading } = useLiveAlerts(5000);
  const [filter, setFilter] = useState("all");
  const [readIds, setReadIds] = useState(() => new Set());

  const timelineEvents = useMemo(
    () =>
      alerts.map((alert) => ({
        id: alert.alertId,
        severity: alert.severity,
        timestamp: alert.createdLabel,
        patientName: alert.patient,
        title: alert.issue,
        message: alert.reason,
      })),
    [alerts]
  );

  const filteredEvents = useMemo(() => {
    const base = timelineEvents.slice(0, maxItems);

    if (filter === "unread") {
      return base.filter((item) => !readIds.has(item.id));
    }

    if (filter === "critical") {
      return base.filter((item) => item.severity === "Critical");
    }

    return base;
  }, [filter, readIds, maxItems, timelineEvents]);

  const unreadCount = timelineEvents.filter((item) => !readIds.has(item.id)).length;

  const toggleRead = (id) => {
    setReadIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const markAllRead = () => {
    setReadIds(new Set(timelineEvents.map((item) => item.id)));
  };

  const renderEventCard = (item) => {
    const severityMeta = severityStyles[item.severity] || severityStyles.Low;
    const SeverityIcon = severityMeta.icon;
    const isRead = readIds.has(item.id);

    return (
      <div
        key={item.id}
        className={`relative rounded-[28px] border p-5 transition ${
          isRead
            ? "border-slate-200 bg-slate-50"
            : "border-cyan-200 bg-cyan-50/80 shadow-sm"
        }`}
      >
        <div className="absolute left-6 top-6 h-full w-px bg-slate-200" aria-hidden="true" />
        <div className="relative flex gap-4">
          <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-4 ring-white ${severityMeta.badge}`}>
            <SeverityIcon className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.24em] ring-1 ${severityMeta.badge}`}>
                {item.severity}
              </span>
              <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500 ring-1 ring-slate-200">
                {item.timestamp}
              </span>
              <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-semibold text-white">
                {item.patientName}
              </span>
            </div>

            <div className="mt-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-base font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1 text-sm text-slate-600">{item.message}</p>
              </div>

              <button
                onClick={() => toggleRead(item.id)}
                className={`rounded-full px-3 py-1.5 text-[10px] font-semibold transition ${
                  isRead
                    ? "bg-slate-200 text-slate-700"
                    : "bg-slate-900 text-white"
                }`}
              >
                {isRead ? "Read" : "Unread"}
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-200/80 pt-3">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <Clock3 className="h-3.5 w-3.5" />
                Updated from backend alerts
              </div>

              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${severityMeta.glow}`} aria-hidden="true" />
                <span className="text-xs font-semibold text-slate-700">Live feed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const emptyText = isLoading ? "Loading live notifications..." : "No notifications match this filter right now.";

  if (compact) {
    return (
      <div className="space-y-3">
        <div className="flex gap-2">
          {[
            { key: "all", label: "All" },
            { key: "unread", label: "Unread" },
            { key: "critical", label: "Critical" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                filter === tab.key
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredEvents.length > 0 ? (
            filteredEvents.map(renderEventCard)
          ) : (
            <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
              {emptyText}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
      {showHeader && (
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Live timeline</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Case Timeline</h2>
            <p className="mt-2 text-sm text-slate-500">Patient activity stream from active backend alerts.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-3xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
              {unreadCount} unread events
            </div>
            <div className="rounded-3xl bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700">
              {timelineEvents.length} total updates
            </div>
            <button
              onClick={markAllRead}
              className="rounded-3xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              Mark all read
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        {[
          { key: "all", label: "All" },
          { key: "unread", label: "Unread" },
          { key: "critical", label: "Critical" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              filter === tab.key
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.map(renderEventCard)
        ) : (
          <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
            {emptyText}
          </div>
        )}
      </div>
    </div>
  );
}
