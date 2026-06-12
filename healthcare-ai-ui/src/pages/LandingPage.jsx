import { Link } from "react-router-dom";
import {
  Activity,
  ShieldAlert,
  HeartPulse,
  Ambulance,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-[#020617] via-[#071133] to-[#0F172A] text-white">

      {/* Navbar */}

      <nav className="flex items-center justify-between px-10 py-6">
        <h1 className="text-3xl font-bold text-cyan-400">
          MediAssist
        </h1>

        <Link to="/signin">
  <button className="rounded-2xl bg-white/10 border border-white/20 px-6 py-3 shadow-lg transition-all duration-300 hover:scale-105">
    Sign In
  </button>
</Link>
      </nav>

      {/* Hero Section */}

      <section className="mx-auto grid max-w-7xl items-center gap-16 px-8 py-20 lg:grid-cols-2">

        {/* Left */}

        <div>

          <p className="mb-6 text-lg uppercase tracking-[4px] text-cyan-400">
            AI Powered Healthcare Routing
          </p>

          <h1 className="text-6xl font-extrabold leading-tight lg:text-7xl">
            Smarter
            <br />
            Healthcare System
          </h1>

          <p className="mt-8 max-w-2xl text-xl leading-relaxed text-gray-300">
            MediAssist uses artificial intelligence to analyze symptoms,
            prioritize emergencies, route patients to nearby specialists,
            and assist healthcare professionals in real time.
          </p>

          {/* Buttons */}

          <div className="mt-10 flex gap-6">

            <Link to="/role">
              <button className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 px-8 py-4 text-lg font-semibold shadow-xl transition-all hover:scale-105">
                Log In
              </button>
            </Link>

            <Link to="/about">
              <button className="rounded-2xl border border-white/20 bg-white/5 px-8 py-4 text-lg transition-all hover:bg-white/10">
                Learn More
              </button>
            </Link>

          </div>

          {/* Stats */}

          <div className="mt-16 flex flex-wrap gap-6">

            <div className="flex h-60 w-40 flex-col items-center justify-center rounded-3xl border border-white/20 bg-white/10 text-center shadow-xl backdrop-blur-lg transition-all duration-300 hover:scale-105">
              <h2 className="text-6xl font-bold text-cyan-400">
                24/7
              </h2>

              <p className="mt-4 text-xl text-gray-300">
                Emergency AI Monitoring
              </p>
            </div>

            <div className="flex h-60 w-40 flex-col items-center justify-center rounded-3xl border border-white/20 bg-white/10 text-center shadow-xl backdrop-blur-lg transition-all duration-300 hover:scale-105">
              <h2 className="text-6xl font-bold text-cyan-400">
                500+
              </h2>

              <p className="mt-4 text-xl text-gray-300">
                Doctors Connected
              </p>
            </div>

            <div className="flex h-60 w-40 flex-col items-center justify-center rounded-3xl border border-white/20 bg-white/10 text-center shadow-xl backdrop-blur-lg transition-all duration-300 hover:scale-105">
              <h2 className="text-6xl font-bold text-cyan-400">
                AI
              </h2>

              <p className="mt-4 text-xl text-gray-300">
                Smart Emergency Routing
              </p>
            </div>

          </div>

        </div>

        {/* Right */}

        <div className="rounded-[40px] border border-white/20 bg-white/10 p-10 shadow-2xl backdrop-blur-xl">

          <h2 className="mb-10 text-5xl font-bold">
            Live AI Routing
          </h2>

          <div className="space-y-6">

            <div className="flex items-center gap-4 rounded-2xl bg-[#1E293B] p-6">
              <HeartPulse className="text-red-400" size={34} />
              <p className="text-2xl">
                Chest Pain → Cardiology
              </p>
            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-[#1E293B] p-6">
              <ShieldAlert className="text-yellow-400" size={34} />
              <p className="text-2xl">
                Fever → General Medicine
              </p>
            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-[#1E293B] p-6">
              <Ambulance className="text-cyan-400" size={34} />
              <p className="text-2xl">
                Fracture → Orthopedics
              </p>
            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-[#1E293B] p-6">
              <Activity className="text-green-400" size={34} />
              <p className="text-2xl">
                AI Report Analysis Completed
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* Features */}

      <section className="mx-auto max-w-7xl px-8 py-20">

        <h2 className="mb-16 text-center text-5xl font-bold">
          Core Features
        </h2>

        <div className="grid gap-10 md:grid-cols-3">

          <div className="rounded-3xl border border-white/20 bg-white/10 p-10 shadow-xl backdrop-blur-xl transition-all hover:-translate-y-2">
            <h3 className="mb-6 text-3xl font-bold text-cyan-400">
              Smart Routing
            </h3>

            <p className="text-lg leading-relaxed text-gray-300">
              AI analyzes patient symptoms and routes them to the most suitable healthcare specialist instantly.
            </p>
          </div>

          <div className="rounded-3xl border border-white/20 bg-white/10 p-10 shadow-xl backdrop-blur-xl transition-all hover:-translate-y-2">
            <h3 className="mb-6 text-3xl font-bold text-cyan-400">
              Emergency Detection
            </h3>

            <p className="text-lg leading-relaxed text-gray-300">
              Detects high-priority medical emergencies and triggers urgent notifications immediately.
            </p>
          </div>

          <div className="rounded-3xl border border-white/20 bg-white/10 p-10 shadow-xl backdrop-blur-xl transition-all hover:-translate-y-2">
            <h3 className="mb-6 text-3xl font-bold text-cyan-400">
              AI Assistance
            </h3>

            <p className="text-lg leading-relaxed text-gray-300">
              Assists doctors with patient history, report summaries, and treatment recommendations.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
}