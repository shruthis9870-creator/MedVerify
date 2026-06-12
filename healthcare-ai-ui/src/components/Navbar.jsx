import { NavLink } from "react-router-dom"

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-10 py-5 bg-white shadow-md">

      <h1 className="text-2xl font-bold text-blue-700">
        Healthcare AI
      </h1>

      <div className="flex gap-6 text-gray-700 font-medium">

        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "text-blue-700 font-bold"
              : "hover:text-blue-600 transition-all duration-300"
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive
              ? "text-blue-700 font-bold"
              : "hover:text-blue-600 transition-all duration-300"
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/reports"
          className={({ isActive }) =>
            isActive
              ? "text-blue-700 font-bold"
              : "hover:text-blue-600 transition-all duration-300"
          }
        >
          Reports
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive
              ? "text-blue-700 font-bold"
              : "hover:text-blue-600 transition-all duration-300"
          }
        >
          Settings
        </NavLink>

      </div>

    </nav>
  )
}