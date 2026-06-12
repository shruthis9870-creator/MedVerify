import {
  UserRound,
  Phone,
  HeartPulse,
  Shield,
  FileText,
} from "lucide-react";

export default function PatientProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#071133] to-[#0F172A] text-white p-10">

      {/* Header */}

      <div className="flex items-center gap-5 mb-10">

        <div className="bg-cyan-500 p-5 rounded-3xl">
          <UserRound size={40} />
        </div>

        <div>
          <h1 className="text-5xl font-bold">
            Patient Profile
          </h1>

          <p className="text-slate-400">
            Personal & Medical Information
          </p>
        </div>

      </div>

      {/* Profile Cards */}

      <div className="grid lg:grid-cols-2 gap-8">

        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8">

          <h2 className="text-2xl font-bold mb-6">
            Personal Details
          </h2>

          <div className="space-y-4">

            <p>
              <span className="text-cyan-400">Name:</span> Rahul Sharma
            </p>

            <p>
              <span className="text-cyan-400">Age:</span> 34
            </p>

            <p>
              <span className="text-cyan-400">Gender:</span> Male
            </p>

            <p>
              <span className="text-cyan-400">Blood Group:</span> B+
            </p>

          </div>

        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8">

          <h2 className="text-2xl font-bold mb-6">
            Emergency Contact
          </h2>

          <div className="space-y-4">

            <div className="flex items-center gap-3">
              <Phone className="text-cyan-400" />
              <span>+91 9876543210</span>
            </div>

            <div className="flex items-center gap-3">
              <Shield className="text-cyan-400" />
              <span>Health Insurance Active</span>
            </div>

          </div>

        </div>

      </div>

      {/* Medical History */}

      <div className="mt-10 bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8">

        <div className="flex items-center gap-3 mb-6">

          <HeartPulse className="text-red-400" />

          <h2 className="text-3xl font-bold">
            Medical History
          </h2>

        </div>

        <ul className="space-y-4 text-slate-300">

          <li>• Hypertension (2023)</li>

          <li>• Routine Cardiology Monitoring</li>

          <li>• No major surgeries reported</li>

          <li>• Allergy: Penicillin</li>

        </ul>

      </div>

      {/* Reports */}

      <div className="mt-10 bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8">

        <div className="flex items-center gap-3 mb-6">

          <FileText className="text-cyan-400" />

          <h2 className="text-3xl font-bold">
            Reports Summary
          </h2>

        </div>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-slate-900 rounded-2xl p-5">
            Blood Test.pdf
          </div>

          <div className="bg-slate-900 rounded-2xl p-5">
            ECG Report.pdf
          </div>

          <div className="bg-slate-900 rounded-2xl p-5">
            MRI Scan.pdf
          </div>

        </div>

      </div>

    </div>
  );
}