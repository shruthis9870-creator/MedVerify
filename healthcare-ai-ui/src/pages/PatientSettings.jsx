import {
  User,
  Lock,
  Bell,
  Shield,
  Save,
} from "lucide-react";

export default function PatientSettings() {
  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-5xl font-bold text-white">
          Settings
        </h1>

        <p className="text-slate-400 mt-2">
          Manage your account preferences
        </p>
      </div>

      {/* Profile */}

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">

        <div className="flex items-center gap-3 mb-6">
          <User className="text-cyan-400" />
          <h2 className="text-2xl font-bold">
            Profile Settings
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            placeholder="Full Name"
            className="bg-slate-800 p-4 rounded-2xl"
          />

          <input
            placeholder="Email"
            className="bg-slate-800 p-4 rounded-2xl"
          />

        </div>
      </div>

      {/* Password */}

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">

        <div className="flex items-center gap-3 mb-6">
          <Lock className="text-cyan-400" />
          <h2 className="text-2xl font-bold">
            Password
          </h2>
        </div>

        <input
          type="password"
          placeholder="New Password"
          className="w-full bg-slate-800 p-4 rounded-2xl"
        />

      </div>

      {/* Notifications */}

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">

        <div className="flex items-center gap-3 mb-6">
          <Bell className="text-cyan-400" />
          <h2 className="text-2xl font-bold">
            Notifications
          </h2>
        </div>

        <label className="flex items-center gap-3">
          <input type="checkbox" />
          Appointment Alerts
        </label>

      </div>

      {/* Privacy */}

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">

        <div className="flex items-center gap-3 mb-6">
          <Shield className="text-cyan-400" />
          <h2 className="text-2xl font-bold">
            Privacy
          </h2>
        </div>

        <p className="text-slate-400">
          Your medical data is encrypted and securely stored.
        </p>

      </div>

      <button
        className="
        bg-gradient-to-r
        from-blue-500
        to-cyan-400
        px-8
        py-4
        rounded-2xl
        font-semibold
        flex
        items-center
        gap-2
        "
      >
        <Save size={18} />
        Save Changes
      </button>

    </div>
  );
}