import { useState } from "react"

import {
  Menu,
  X,
  Bell
} from "lucide-react"

import Sidebar from "./Sidebar"
import { useAuth } from "../context/AuthContext"
import { displaySpecialty, displayUserName } from "../utils/profile"

export default function Layout({
  children,
  darkMode = false,
}) {
  console.log("Layout Dark Mode:", darkMode);

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user } = useAuth()

  return (

    <div
  className={`
    flex
    min-h-screen
    ${darkMode ? "bg-slate-950" : "bg-[#0F172A]"}
  `}
>

      {/* Sidebar */}

      <div
        className={`
          ${sidebarOpen ? "block" : "hidden"}
          md:block
        `}
      >

        <Sidebar />

      </div>

      {/* Main Content */}

      <div
  className={`
    flex-1
    p-8
    rounded-l-[40px]
    overflow-y-auto
    transition-all
    duration-300
    ${
      darkMode
        ? "bg-slate-900 text-white"
        : "bg-[#F1F5F9] text-slate-900"
    }
  `}
>

        {/* Top Navbar */}

        <div className="flex justify-between items-center mb-8">

          {/* Left Side */}

          <div className="flex items-center gap-4">

            {/* Hamburger */}

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="
              bg-white
              p-3
              rounded-2xl
              shadow-lg
              hover:scale-105
              transition-all duration-300
            "
            >

              {
                sidebarOpen
                  ? <X size={24} />
                  : <Menu size={24} />
              }

            </button>

            {/* Search */}

            <input
              type="text"
              placeholder="Search..."
              className="
              bg-white
              px-5
              py-3
              rounded-2xl
              shadow-lg
              outline-none
              w-64
            "
            />

          </div>

          {/* Right Side */}

          <div className="flex items-center gap-4">

            {/* Notification */}

            <div
              className="
              bg-white
              p-3
              rounded-2xl
              shadow-lg
              hover:scale-105
              transition-all duration-300
            "
            >

              <Bell className="text-[#0F172A]" />

            </div>

            {/* Profile */}

            <div
              className="
              flex items-center gap-3
              bg-white
              px-4 py-2
              rounded-2xl
              shadow-lg
            "
            >

              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"></div>

              <div>

                <p className="font-semibold text-sm">
                  {displayUserName(user)}
                </p>

                <p className="text-gray-500 text-xs">
                  {displaySpecialty(user)}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* Page Content */}

        {children}

        {/* Floating AI Button */}

        <button
          className="
          fixed bottom-8 right-8
          bg-gradient-to-r from-blue-500 to-cyan-400
          text-white
          px-6 py-4
          rounded-full
          shadow-2xl
          hover:scale-110
          transition-all duration-300
        "
        >

          AI Assistant

        </button>

      </div>

    </div>

  )
}
