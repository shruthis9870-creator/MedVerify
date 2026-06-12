import {
LayoutDashboard,
Upload,
FileText,
Bell,
User,
Settings,
LogOut,
ChevronLeft,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";


export default function PatientSidebar({
collapsed,
onToggle,
}) {
const location = useLocation();

const menuItems = [
{
name: "Dashboard",
icon: <LayoutDashboard size={20} />,
path: "/patient/dashboard",
},
{
name: "Upload Reports",
icon: <Upload size={20} />,
path: "/patient/upload-report",
},
{
name: "AI Analysis",
icon: <FileText size={20} />,
path: "/patient/ai-analysis",
},
{
name: "Notifications",
icon: <Bell size={20} />,
path: "/patient/notifications",
},
{
name: "Profile",
icon: <User size={20} />,
path: "/patient/profile",
},
{
  name: "Settings",
  icon: <Settings size={20} />,
  path: "/patient/settings",
},
];

return (
<div
className={`         ${collapsed ? "w-24" : "w-72"}
        h-screen
        fixed
        left-0
        top-0
        bg-slate-950
        text-slate-100
        border-r
        border-slate-800
        transition-all
        duration-300
        flex
        flex-col
        p-6
        overflow-x-hidden
      `}
>
{/* HEADER */}


  <div
    className={`flex items-center ${
      collapsed ? "justify-center" : "justify-between"
    } mb-10`}
  >
    <div className="flex items-center gap-3">

      <div
        className="
          w-10
          h-10
          rounded-2xl
          bg-cyan-400
          flex
          items-center
          justify-center
          text-black
          font-bold
          text-lg
        "
      >
        M
      </div>

      {!collapsed && (
        <div>
          <h1 className="text-3xl font-bold">
            MediAssist
          </h1>

          <p className="text-xs text-cyan-200">
            Patient Portal
          </p>
        </div>
      )}
    </div>

    {!collapsed && (
      <button
        onClick={onToggle}
        className="
          p-2
          hover:bg-slate-800
          rounded-lg
          transition
          text-slate-400
          hover:text-white
        "
      >
        <ChevronLeft size={20} />
      </button>
    )}

    {collapsed && (
      <button
        onClick={onToggle}
        className="
          absolute
          top-6
          right-4
          p-1
          text-slate-400
        "
      >
        <ChevronLeft
          size={18}
          className="rotate-180"
        />
      </button>
    )}
  </div>

  {/* MENU */}

  <div className="flex-1 space-y-2 overflow-y-auto">

    {menuItems.map((item) => {

      const active =
        location.pathname === item.path;

      return (
        <Link
          key={item.name}
          to={item.path}
          className={`
            group
            flex
            items-center
            ${collapsed ? "justify-center" : ""}
            gap-3
            px-4
            py-3
            rounded-3xl
            transition-all
            duration-200
            relative
            ${
              active
                ? "bg-slate-800 text-white shadow-lg shadow-cyan-500/10"
                : "text-slate-300 hover:bg-slate-900 hover:text-white"
            }
          `}
        >
          {active && (
            <div
              className="
                absolute
                left-0
                top-0
                bottom-0
                w-1
                bg-cyan-400
                rounded-r
              "
            />
          )}

          <div className="flex items-center gap-3">
            {item.icon}

            {!collapsed && (
              <span className="text-sm">
                {item.name}
              </span>
            )}
          </div>
        </Link>
      );
    })}
  </div>

  {/* LOGOUT */}

  <button
    onClick={() => {
      localStorage.removeItem("role");
      window.location.href = "/";
    }}
    className="
      bg-red-500
      hover:bg-red-600
      rounded-3xl
      p-3
      font-semibold
      transition-all
      flex
      items-center
      justify-center
      gap-2
    "
  >
    <LogOut size={18} />

    {!collapsed && "Logout"}
  </button>
</div>


);
}
