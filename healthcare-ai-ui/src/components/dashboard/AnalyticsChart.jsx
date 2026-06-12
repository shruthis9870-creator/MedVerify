import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { useLiveAlerts } from "../../hooks/useLiveAlerts";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg bg-slate-900 p-3 shadow-lg">
        <p className="text-sm text-white font-semibold">{payload[0].payload.day}</p>
        <p className="text-sm text-cyan-400">{payload[0].value} patients</p>
      </div>
    );
  }
  return null;
};

export default function AnalyticsChart() {
  const [period, setPeriod] = useState("week");
  const { alerts } = useLiveAlerts(7000);

  const weekData = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      return {
        key: date.toISOString().slice(0, 10),
        day: date.toLocaleDateString([], { weekday: "short" }),
        patients: 0,
      };
    });

    alerts.forEach((alert) => {
      const key = alert.createdAt ? new Date(alert.createdAt).toISOString().slice(0, 10) : days.at(-1).key;
      const bucket = days.find((day) => day.key === key);
      if (bucket) bucket.patients += 1;
    });

    return days;
  }, [alerts]);

  const monthData = useMemo(() => {
    const weeks = [
      { day: "Week 1", patients: 0 },
      { day: "Week 2", patients: 0 },
      { day: "Week 3", patients: 0 },
      { day: "Week 4", patients: 0 },
    ];

    alerts.forEach((alert) => {
      const date = alert.createdAt ? new Date(alert.createdAt) : new Date();
      const weekIndex = Math.min(3, Math.floor((date.getDate() - 1) / 7));
      weeks[weekIndex].patients += 1;
    });

    return weeks;
  }, [alerts]);

  const data = period === "week" ? weekData : monthData;

  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Daily Patient Analytics</h2>
          <p className="text-sm text-slate-600 mt-1">Patient admission trends and occupancy monitoring</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPeriod("week")}
            className={`rounded-3xl px-4 py-2 text-sm font-semibold transition ${
              period === "week"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setPeriod("month")}
            className={`rounded-3xl px-4 py-2 text-sm font-semibold transition ${
              period === "month"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            This Month
          </button>
        </div>
      </div>

      <div className="w-full h-80 min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="day" stroke="#64748b" style={{ fontSize: "12px" }} />
            <YAxis stroke="#64748b" style={{ fontSize: "12px" }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="patients"
              stroke="#2563eb"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorPatients)"
              name="Patient Admissions"
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
