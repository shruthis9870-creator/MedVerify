import { Link, useLocation } from "react-router-dom"

import {
  LayoutDashboard,
  User,
  Bell,
  Settings,
  CircleHelp
} from "lucide-react"

export default function Sidebar() {

  const location = useLocation()

  return (

    <div className="w-72 min-h-screen bg-[#0F172A] text-white p-6 flex flex-col border-r border-white/10">

      <div className="mb-12">

  <h1 className="text-3xl font-bold tracking-wide">
    MediAssist
  </h1>

  <p className="text-gray-400 text-sm mt-2">
    AI Healthcare System
  </p>

</div>

      <Link to="/dashboard">

        <div
          className={`p-4 rounded-2xl flex items-center gap-3 transition-all duration-300 cursor-pointer
${
location.pathname === "/dashboard"
? "bg-gradient-to-r from-blue-500 to-cyan-400 shadow-lg"
: "hover:bg-white/10"
}`}
        >
          <LayoutDashboard size={20} />
          Dashboard
        </div>

      </Link>

      <Link to="/profile">

        <div
          className={`p-4 rounded-2xl flex items-center gap-3 transition-all duration-300 cursor-pointer
${
location.pathname === "/profile"
? "bg-gradient-to-r from-blue-500 to-cyan-400 shadow-lg"
: "hover:bg-white/10"
}`}
        >
          <User size={20} />
          Doctor Profile
        </div>

      </Link>

      <Link to="/notifications">

        <div
          className={`p-4 rounded-2xl flex items-center gap-3 transition-all duration-300 cursor-pointer
${
location.pathname === "/notifications"
? "bg-gradient-to-r from-blue-500 to-cyan-400 shadow-lg"
: "hover:bg-white/10"
}`}
        >
          <Bell size={20} />
          Notifications
        </div>

      </Link>

      <Link to="/settings">

        <div
          className={`p-4 rounded-2xl flex items-center gap-3 transition-all duration-300 cursor-pointer
${
location.pathname === "/settings"
? "bg-gradient-to-r from-blue-500 to-cyan-400 shadow-lg"
: "hover:bg-white/10"
}`}
        >
          <Settings size={20} />
          Settings
        </div>

      </Link>

      <Link to="/help">

        <div
          className={`p-4 rounded-2xl flex items-center gap-3 transition-all duration-300 cursor-pointer
${
location.pathname === "/help"
? "bg-gradient-to-r from-blue-500 to-cyan-400 shadow-lg"
: "hover:bg-white/10"
}`}
        >
          <CircleHelp size={20} />
          Help & Support
        </div>

      </Link>

      <div className="mt-auto bg-[#101f52] p-5 rounded-3xl">

        <h2 className="font-semibold text-lg">
          AI Assistant Active
        </h2>

        <p className="text-gray-300 text-sm mt-2">
          Smart healthcare routing system online.
        </p>

      </div>

    </div>

  )
}