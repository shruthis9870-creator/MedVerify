import Layout from "../components/Layout";
import { useState } from "react";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  

  return (
    <Layout darkMode={darkMode}>
      <div
        className={`space-y-6 transition-all duration-500 ${
          darkMode
            ? "bg-slate-900 p-6 rounded-3xl"
            : ""
        }`}
      >
        {/* Header */}

        <div className="flex justify-between items-center">
          <div>
            <h1
              className={`text-4xl font-bold ${
                darkMode
                  ? "text-white"
                  : "text-[#0F172A]"
              }`}
            >
              Settings
            </h1>

            <p
              className={`mt-2 ${
                darkMode
                  ? "text-slate-400"
                  : "text-gray-500"
              }`}
            >
              Manage your healthcare dashboard preferences.
            </p>
          </div>
        </div>

        {/* Appearance */}

        <div
          className={`
          rounded-3xl
          p-6
          shadow-lg
          transition-all
          duration-500
          ${
            darkMode
              ? "bg-slate-800 border border-slate-700"
              : "bg-white/80 backdrop-blur-lg border border-white/40"
          }
        `}
        >
          <h2
            className={`text-2xl font-bold ${
              darkMode
                ? "text-white"
                : "text-[#0F172A]"
            }`}
          >
            Appearance
          </h2>

          <p
            className={`mt-2 ${
              darkMode
                ? "text-slate-400"
                : "text-gray-500"
            }`}
          >
            Customize dashboard theme and accessibility.
          </p>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="
              mt-6
              bg-gradient-to-r
              from-blue-500
              to-cyan-400
              text-white
              px-6
              py-3
              rounded-2xl
              shadow-lg
              hover:scale-105
              transition-all
              duration-300
            "
          >
            {darkMode
              ? "Disable Dark Mode"
              : "Enable Dark Mode"}
          </button>
        </div>

        {/* Security */}

        <div
          className={`
          rounded-3xl
          p-6
          shadow-lg
          transition-all
          duration-500
          ${
            darkMode
              ? "bg-slate-800 border border-slate-700"
              : "bg-white/80 backdrop-blur-lg border border-white/40"
          }
        `}
        >
          <h2
            className={`text-2xl font-bold ${
              darkMode
                ? "text-white"
                : "text-[#0F172A]"
            }`}
          >
            Security
          </h2>

          <p
            className={`mt-2 ${
              darkMode
                ? "text-slate-400"
                : "text-gray-500"
            }`}
          >
            Manage passwords and authentication settings.
          </p>

          <button
            className={`
            mt-6
            px-6
            py-3
            rounded-2xl
            transition-all
            duration-300
            ${
              darkMode
                ? "bg-slate-700 text-white hover:bg-slate-600"
                : "bg-[#0F172A] text-white hover:bg-[#1E293B]"
            }
          `}
          >
            Change Password
          </button>
        </div>

        {/* Logout */}

        <div
          className={`
          rounded-3xl
          p-6
          shadow-lg
          transition-all
          duration-500
          ${
            darkMode
              ? "bg-slate-800 border border-red-500/30"
              : "bg-white/80 backdrop-blur-lg border border-white/40"
          }
        `}
        >
          <h2
            className={`text-2xl font-bold ${
              darkMode
                ? "text-white"
                : "text-[#0F172A]"
            }`}
          >
            Account
          </h2>

          <p
            className={`mt-2 ${
              darkMode
                ? "text-slate-400"
                : "text-gray-500"
            }`}
          >
            Logout from your doctor dashboard.
          </p>

          <button
            onClick={() => {
              localStorage.removeItem("role");
              window.location.href = "/";
            }}
            className="
              mt-6
              bg-red-500
              text-white
              px-6
              py-3
              rounded-2xl
              hover:bg-red-600
              transition-all
              duration-300
            "
          >
            Logout
          </button>
        </div>
      </div>
    </Layout>
  );
}