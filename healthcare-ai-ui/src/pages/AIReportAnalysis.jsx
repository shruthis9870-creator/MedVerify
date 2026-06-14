import { useEffect, useState } from "react";
import { Brain, FileText } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { fetchPatientReports } from "../services/api";

export default function AIReportAnalysis() {
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
      <div className="mb-12">
        <div className="mb-4 flex items-center gap-4">
          <Brain size={50} className="text-cyan-400" />
          <h1 className="text-5xl font-bold">AI Report Analysis</h1>
        </div>
        <p className="text-slate-400">
          Analysis appears here only after real uploaded report data is available.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-3xl border border-red-400/30 bg-red-500/10 p-5 text-sm font-semibold text-red-200">
          {error}
        </div>
      )}

      <div className="rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <FileText className="text-cyan-400" />
          <h2 className="text-2xl font-bold">Uploaded reports</h2>
        </div>

        <div className="mt-6 space-y-3">
          {reports.length > 0 ? (
            reports.map((report) => (
              <div
                key={`${report.reportId || report.url}-${report.name}`}
                className="rounded-2xl bg-slate-950/60 p-4 text-slate-200"
              >
                {report.name}
              </div>
            ))
          ) : (
            <p className="text-slate-300">
              {isLoading ? "Loading live reports..." : "No reports are available for AI analysis yet."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
