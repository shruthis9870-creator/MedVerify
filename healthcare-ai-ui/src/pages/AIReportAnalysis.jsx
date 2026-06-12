import {
  Brain,
  HeartPulse,
  AlertTriangle,
  CheckCircle,
  Stethoscope,
} from "lucide-react";

export default function AIReportAnalysis() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#071133] to-[#0F172A] text-white p-10">

      {/* Header */}

      <div className="mb-12">

        <div className="flex items-center gap-4 mb-4">

          <Brain
            size={50}
            className="text-cyan-400"
          />

          <h1 className="text-5xl font-bold">
            AI Report Analysis
          </h1>

        </div>

        <p className="text-slate-400">
          Generated from uploaded ECG Report.pdf
        </p>

      </div>

      {/* Summary Cards */}

      <div className="grid lg:grid-cols-3 gap-8">

        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8">

          <AlertTriangle
            size={40}
            className="text-yellow-400 mb-4"
          />

          <h2 className="text-2xl font-bold">
            Severity
          </h2>

          <p className="text-yellow-400 text-3xl mt-3">
            Medium
          </p>

        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8">

          <HeartPulse
            size={40}
            className="text-red-400 mb-4"
          />

          <h2 className="text-2xl font-bold">
            Condition
          </h2>

          <p className="text-slate-300 mt-3">
            Mild Cardiac Irregularity
          </p>

        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8">

          <CheckCircle
            size={40}
            className="text-green-400 mb-4"
          />

          <h2 className="text-2xl font-bold">
            Confidence
          </h2>

          <p className="text-green-400 text-3xl mt-3">
            92%
          </p>

        </div>

      </div>

      {/* Findings */}

      <div className="mt-10 bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8">

        <h2 className="text-3xl font-bold mb-6">
          AI Findings
        </h2>

        <ul className="space-y-4 text-slate-300">

          <li>
            • Slight abnormality detected in ECG waveform.
          </li>

          <li>
            • Heart rate remains within acceptable range.
          </li>

          <li>
            • No immediate emergency indicators detected.
          </li>

          <li>
            • Follow-up consultation recommended.
          </li>

        </ul>

      </div>

      {/* Recommendation */}

      <div className="mt-10 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-3xl p-8 shadow-xl">

        <div className="flex items-center gap-4 mb-4">

          <Stethoscope size={40} />

          <h2 className="text-3xl font-bold">
            Recommended Specialist
          </h2>

        </div>

        <p className="text-xl">
          Cardiologist
        </p>

        <p className="mt-3 opacity-90">
          AI recommends consultation with a cardiology specialist
          within the next 7 days.
        </p>

      </div>

    </div>
  );
}