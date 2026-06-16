import { useEffect, useState } from "react";
import { FileText, Phone, Shield, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { fetchPatientReports } from "../services/api";

export default function PatientProfilePage() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCurrent = true;

    if (!user?.patientId) {
      setReports([]);
      setError("Your patient session is missing a patient ID.");
      setIsLoading(false);
      return () => {
        isCurrent = false;
      };
    }

    fetchPatientReports(user.patientId)
      .then((nextReports) => {
        if (!isCurrent) return;
        setReports(nextReports);
        setError("");
      })
      .catch((err) => {
        if (!isCurrent) return;
        setError(err.message || "Unable to load reports.");
      })
      .finally(() => {
        if (!isCurrent) return;
        setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [user?.patientId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#071133] to-[#0F172A] p-10 text-white">
      <div className="mb-10 flex items-center gap-5">
        <div className="rounded-3xl bg-cyan-500 p-5">
          <UserRound size={40} />
        </div>
        <div>
          <h1 className="text-5xl font-bold">Patient Profile</h1>
          <p className="text-slate-400">Authenticated patient account information</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-xl">
          <h2 className="mb-6 text-2xl font-bold">Personal Details</h2>
          <div className="space-y-4">
            <p>
              <span className="text-cyan-400">Name:</span> {user?.name || "Not provided"}
            </p>
            <p>
              <span className="text-cyan-400">Email:</span> {user?.email || "Not provided"}
            </p>
            <p>
              <span className="text-cyan-400">Patient ID:</span> {user?.patientId || "Not provided"}
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-xl">
          <h2 className="mb-6 text-2xl font-bold">Contact</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Phone className="text-cyan-400" />
              <span>{user?.phone || "Not provided"}</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="text-cyan-400" />
              <span>Insurance data is not available from the backend yet.</span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-8 rounded-3xl border border-red-400/30 bg-red-500/10 p-5 text-sm font-semibold text-red-200">
          {error}
        </div>
      )}

      <div className="mt-10 rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-xl">
        <div className="mb-6 flex items-center gap-3">
          <FileText className="text-cyan-400" />
          <h2 className="text-3xl font-bold">Reports</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {reports.length > 0 ? (
            reports.map((report) => (
              <div
                key={`${report.reportId || report.url}-${report.name}`}
                className="rounded-2xl bg-slate-900 p-5"
              >
                {report.name}
              </div>
            ))
          ) : (
            <div className="rounded-2xl bg-slate-900 p-5 text-slate-300 md:col-span-3">
              {isLoading ? "Loading live reports..." : "No reports uploaded yet."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
