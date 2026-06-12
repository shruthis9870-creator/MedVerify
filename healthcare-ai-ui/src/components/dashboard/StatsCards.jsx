import { useNavigate } from "react-router-dom";
import { Heart, AlertTriangle, TrendingUp, Clock, Zap, Users, LogOut, Bell, ArrowUp, ArrowDown } from "lucide-react";

const stats = [
  { title: "Active Patients", value: 0 },
  { title: "Critical Cases", value: 0 },
  { title: "ICU Occupancy", value: "Live" },
  { title: "Emergency Alerts", value: 0 },
  { title: "Pending Reviews", value: 0 },
  { title: "Admitted Patients", value: 0 },
  { title: "Discharged Patients", value: 0 },
  { title: "AI Clinical Alerts", value: 0 },
];

export default function StatsCards({ patients = [], alerts = [], reportPatients = [] }) {
  const navigate = useNavigate();
  
  const iconMap = {
    "Active Patients": <Heart className="h-6 w-6" />,
    "Critical Cases": <AlertTriangle className="h-6 w-6" />,
    "ICU Occupancy": <TrendingUp className="h-6 w-6" />,
    "Emergency Alerts": <Zap className="h-6 w-6" />,
    "Pending Reviews": <Clock className="h-6 w-6" />,
    "Admitted Patients": <Users className="h-6 w-6" />,
    "Discharged Patients": <LogOut className="h-6 w-6" />,
    "AI Clinical Alerts": <Bell className="h-6 w-6" />,
  };

  const colorMap = {
    "Active Patients": { bg: "bg-blue-50", icon: "text-blue-600", border: "border-blue-200" },
    "Critical Cases": { bg: "bg-red-50", icon: "text-red-600", border: "border-red-200" },
    "ICU Occupancy": { bg: "bg-purple-50", icon: "text-purple-600", border: "border-purple-200" },
    "Emergency Alerts": { bg: "bg-orange-50", icon: "text-orange-600", border: "border-orange-200" },
    "Pending Reviews": { bg: "bg-amber-50", icon: "text-amber-600", border: "border-amber-200" },
    "Admitted Patients": { bg: "bg-indigo-50", icon: "text-indigo-600", border: "border-indigo-200" },
    "Discharged Patients": { bg: "bg-emerald-50", icon: "text-emerald-600", border: "border-emerald-200" },
    "AI Clinical Alerts": { bg: "bg-pink-50", icon: "text-pink-600", border: "border-pink-200" },
  };

  const navigationMap = {
    "Active Patients": "/active-cases",
    "Critical Cases": "/alerts",
    "Admitted Patients": "/active-cases",
    "Pending Reviews": "/pending-reports",
    "AI Clinical Alerts": "/alerts",
  };

  const trendMap = {
    "Active Patients": { value: "+2", positive: true },
    "Critical Cases": { value: "+1", positive: false },
    "ICU Occupancy": { value: "-5%", positive: true },
    "Emergency Alerts": { value: "+3", positive: false },
    "Pending Reviews": { value: "-2", positive: true },
    "Admitted Patients": { value: "+6", positive: true },
    "Discharged Patients": { value: "+1", positive: true },
    "AI Clinical Alerts": { value: "-1", positive: true },
  };

  const dynamicStats = [
    { ...stats[0], value: patients.filter(p => p.admitted === "Yes").length },
    { ...stats[1], value: patients.filter(p => p.severity === "Critical").length },
    stats[2],
    { ...stats[3], value: alerts.length },
    { ...stats[4], value: reportPatients.length },
    { ...stats[5], value: patients.filter(p => p.admitted === "Yes").length },
    stats[6],
    { ...stats[7], value: alerts.length },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {dynamicStats.map((item) => {
        const colors = colorMap[item.title];
        const trend = trendMap[item.title];
        const navPath = navigationMap[item.title];

        return (
          <div
            key={item.title}
            onClick={() => navPath && navigate(navPath)}
            className={`rounded-[28px] p-6 shadow-sm ring-1 transition ${colors.bg} ${colors.border} ${navPath ? 'cursor-pointer hover:shadow-md' : ''}`}
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className={`p-3 rounded-xl ${colors.bg}`}>
                <span className={colors.icon}>{iconMap[item.title]}</span>
              </div>
              {trend && (
                <div className={`flex items-center gap-1 text-xs font-semibold ${trend.positive ? 'text-emerald-600' : 'text-red-600'}`}>
                  {trend.positive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                  {trend.value}
                </div>
              )}
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-600">{item.title}</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">{item.value}</p>
            {navPath && <p className="mt-2 text-xs text-slate-500">Click to view details →</p>}
          </div>
        );
      })}
    </div>
  );
}
