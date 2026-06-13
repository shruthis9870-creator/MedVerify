import {
  LayoutDashboard,
  Activity,
  AlertTriangle,
  FileText,
  Users,
  Brain,
  History,
  Clock3,
  BarChart3,
  TrendingUp,
  Download,
  Settings,
  HelpCircle,
  Gauge,
  ChevronLeft,
  UserCircle,
  Ambulance,
  LifeBuoy,
  Info,
  UserCog,
} from "lucide-react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLiveAlerts } from "../../hooks/useLiveAlerts";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { alerts, activePatients, reportPatients } = useLiveAlerts(7000);
  const pendingReports = reportPatients.length;

  const menuItems = [
    {
      section: "MAIN",
      items: [
  {
    name: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    path: "/dashboard",
  },

  {
    name: "Emergency",
    icon: <AlertTriangle size={20} />,
    path: "/emergency",
  },

  {
    name: "Ambulance",
    icon: <Ambulance size={20} />,
    path: "/ambulance-tracking",
  },

  {
    name: "Support",
    icon: <LifeBuoy size={20} />,
    path: "/support",
  },

  {
    name: "About",
    icon: <Info size={20} />,
    path: "/about",
  },

  {
    name: "Edit Profile",
    icon: <UserCog size={20} />,
    path: "/edit-profile",
  },
],
    },

    {
      section: "CASES",
      items: [
        {
          name: "Active Cases",
          icon: <Activity size={20} />,
          path: "/active-cases",
          badge: activePatients.length,
        },

        {
          name: "High Risk Alerts",
          icon: <AlertTriangle size={20} />,
          path: "/alerts",
          badge: alerts.length,
        },

        {
          name: "Pending Reports",
          icon: <FileText size={20} />,
          path: "/pending-reports",
          badge: pendingReports,
        },

        {
          name: "All Patients",
          icon: <Users size={20} />,
          path: "/patients",
        },
      ],
    },

    {
      section: "TOOLS",
      items: [
        {
          name: "AI Recommendations",
          icon: <Brain size={20} />,
          path: "/ai-recommendations",
        },

        {
          name: "Decision Panel",
          icon: <Gauge size={20} />,
          path: "/decision-panel",
        },

        {
          name: "Patient History",
          icon: <History size={20} />,
          path: "/patient-history",
        },

        {
          name: "Timeline",
          icon: <Clock3 size={20} />,
          path: "/timeline",
        },
      ],
    },

    {
      section: "ANALYTICS",
      items: [
        {
          name: "Daily Stats",
          icon: <BarChart3 size={20} />,
          path: "/daily-stats",
        },

        {
          name: "Performance",
          icon: <TrendingUp size={20} />,
          path: "/performance",
        },

        {
          name: "Export Data",
          icon: <Download size={20} />,
          path: "/export-data",
        },
      ],
    },

    {
      section: "SETTINGS",
      items: [
        {
          name: "Settings",
          icon: <Settings size={20} />,
          path: "/settings",
        },

        {
          name: "Help & Support",
          icon: <HelpCircle size={20} />,
          path: "/help",
        },
      ],
    },
  ];

  return (
    <div className={`${collapsed ? 'w-20' : 'w-72'} h-screen bg-slate-950 text-slate-100 fixed left-0 top-0 p-6 overflow-x-hidden overflow-y-auto border-r border-slate-800 transition-all duration-300 flex flex-col`}>

      {/* HEADER WITH COLLAPSE TOGGLE */}
      <div className="flex items-center justify-between mb-10">

  <div className="flex items-center gap-3">

    <div className="w-10 h-10 rounded-2xl bg-cyan-400 flex items-center justify-center text-black font-bold text-lg">
      M
    </div>

    {!collapsed && (
      <div>
        <h1 className="text-3xl font-bold">
          MediAssist
        </h1>

        <p className="text-blue-200 text-xs">
          AI Health Triage
        </p>
      </div>
    )}

  </div>

  <button
    onClick={onToggle}
    className="p-2 hover:bg-slate-800 rounded-lg transition text-slate-400 hover:text-white"
    title={collapsed ? "Expand" : "Collapse"}
  >
    <ChevronLeft
      size={20}
      className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
    />
  </button>

</div>

      {/* MENU */}
      <div className="space-y-8 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
        {menuItems.map((section) => (
          <div key={section.section}>
            {!collapsed && <h2 className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-4 font-semibold">
              {section.section}
            </h2>}

            <div className="space-y-2">
              {section.items.map((item) => {
                const isActive =
                  item.path === "/"
                    ? location.pathname === item.path
                    : location.pathname.startsWith(item.path);

                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`group flex items-center ${
  collapsed ? "justify-center" : "justify-between"
} gap-3 rounded-3xl px-4 py-3 transition duration-200 relative ${
                      isActive
                        ? "bg-slate-800 text-white shadow-lg shadow-cyan-500/10"
                        : "text-slate-300 hover:bg-slate-900 hover:text-white"
                    }`}
                  >
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 rounded-r"></div>}
                    
                    <div className="flex items-center gap-3">
                      {item.icon}
                      {!collapsed && <span className="text-sm">{item.name}</span>}
                    </div>

                    {item.badge && !collapsed && (
                      <span className={`${
                        isActive ? 'bg-cyan-500 text-slate-950' : 'bg-red-500 text-white'
                      } text-xs px-2 py-1 rounded-full font-semibold`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* DOCTOR PROFILE MINI CARD */}
      {/* DOCTOR PROFILE */}

<div className="border-t border-slate-800 pt-6 mt-8">

  <div
    className={`
    flex
    items-center
    gap-3
    p-4
    rounded-3xl
    bg-slate-800
    hover:bg-slate-700
    transition
    ${collapsed ? "justify-center" : ""}
    `}
  >
    <UserCircle
      size={40}
      className="text-cyan-400"
    />

    {!collapsed && (
      <div>
        <p className="font-semibold">
          Dr. Sharma
        </p>

        <p className="text-xs text-slate-400">
          Cardiologist
        </p>
      </div>
    )}
  </div>

  <button
    onClick={() => {
      logout();
      navigate("/", { replace: true });
    }}
    className="
      w-full
      mt-4
      bg-red-500
      hover:bg-red-600
      text-white
      rounded-2xl
      py-3
      font-semibold
      transition-all
    "
  >
    Logout
  </button>

</div>
    </div>
  );
}
