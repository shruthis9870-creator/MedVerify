import { Link } from "react-router-dom";
import { ShieldCheck, User, Stethoscope, HeartPulse } from "lucide-react";

export default function RoleSelection() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#071133] to-[#0F172A] flex items-center justify-center px-6">

      <div className="max-w-6xl w-full">

        {/* Logo */}

        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-3xl bg-cyan-400 flex items-center justify-center shadow-2xl">
            <HeartPulse size={40} className="text-slate-950" />
          </div>
        </div>

        {/* Heading */}

        <h1 className="text-6xl font-bold text-white text-center mb-4">
          Welcome to MedVerify
        </h1>

        <p className="text-center text-slate-400 text-lg max-w-2xl mx-auto mb-16">
          Select your role to continue into the AI-powered healthcare platform.
        </p>

        {/* Cards */}

        <div className="grid gap-8 lg:grid-cols-3">

          {/* Doctor */}

          <Link to="/doctor-login">

            <div
              className="
                bg-white/10
                backdrop-blur-xl
                border border-white/20
                rounded-[32px]
                p-10
                shadow-xl
                hover:-translate-y-3
                hover:border-cyan-400
                transition-all duration-300
                cursor-pointer
              "
            >
              <div className="w-20 h-20 rounded-3xl bg-cyan-400 flex items-center justify-center mb-8">
                <Stethoscope size={40} className="text-slate-950" />
              </div>

              <h2 className="text-4xl font-bold text-white mb-4">
                Doctor
              </h2>

              <p className="text-slate-300 text-lg leading-relaxed">
                Access patient reports, AI recommendations,
                emergency alerts, analytics, and treatment planning.
              </p>

              <div className="mt-8 text-cyan-400 font-semibold">
                Continue as Doctor →
              </div>
            </div>

          </Link>

          {/* Admin */}

          <Link to="/admin-login">

            <div
              className="
                bg-white/10
                backdrop-blur-xl
                border border-white/20
                rounded-[32px]
                p-10
                shadow-xl
                hover:-translate-y-3
                hover:border-cyan-400
                transition-all duration-300
                cursor-pointer
              "
            >
              <div className="w-20 h-20 rounded-3xl bg-cyan-400 flex items-center justify-center mb-8">
                <ShieldCheck size={40} className="text-slate-950" />
              </div>

              <h2 className="text-4xl font-bold text-white mb-4">
                Admin
              </h2>

              <p className="text-slate-300 text-lg leading-relaxed">
                Manage routing, assign patients to doctors,
                review capacity, and monitor triage operations.
              </p>

              <div className="mt-8 text-cyan-400 font-semibold">
                Continue as Admin â†’
              </div>
            </div>

          </Link>

          {/* Patient */}

          <Link to="/patient-login">

            <div
              className="
                bg-white/10
                backdrop-blur-xl
                border border-white/20
                rounded-[32px]
                p-10
                shadow-xl
                hover:-translate-y-3
                hover:border-cyan-400
                transition-all duration-300
                cursor-pointer
              "
            >
              <div className="w-20 h-20 rounded-3xl bg-cyan-400 flex items-center justify-center mb-8">
                <User size={40} className="text-slate-950" />
              </div>

              <h2 className="text-4xl font-bold text-white mb-4">
                Patient
              </h2>

              <p className="text-slate-300 text-lg leading-relaxed">
                Upload medical reports, track treatment progress,
                receive AI insights, and manage appointments.
              </p>

              <div className="mt-8 text-cyan-400 font-semibold">
                Continue as Patient →
              </div>
            </div>

          </Link>

        </div>

      </div>

    </div>
  );
}
