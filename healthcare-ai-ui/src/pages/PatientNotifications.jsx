import { Bell } from "lucide-react";

export default function PatientNotifications() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#071133] to-[#0F172A] p-10 text-white">
      <div className="mb-10 flex items-center gap-4">
        <Bell size={50} className="text-cyan-400" />
        <div>
          <h1 className="text-5xl font-bold">Notifications</h1>
          <p className="text-slate-400">Recent updates from MedVerify</p>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/10 p-8 text-slate-300 backdrop-blur-xl">
        No live notifications are available yet.
      </div>
    </div>
  );
}
