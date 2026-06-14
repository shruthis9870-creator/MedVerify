import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Upload,
  CalendarDays,
  HeartPulse,
  FileText,
  UserRound,
  Brain,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { fetchPatientReports, openReportFile } from "../services/api";

export default function PatientDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [reports, setReports] = useState([]);
  const [reportError, setReportError] = useState("");
  const [openReportError, setOpenReportError] = useState("");
  const patientId = user?.patientId;

  const handleOpenReport = async (report) => {
    setOpenReportError("");

    try {
      await openReportFile(report);
    } catch (error) {
      setOpenReportError(error.message || "Unable to open report.");
    }
  };

  useEffect(() => {
    let isCurrent = true;

    if (!patientId) {
      setReports([]);
      setReportError("Your patient session is missing a patient ID. Please log out and sign in again.");
      return () => {
        isCurrent = false;
      };
    }

    fetchPatientReports(patientId)
      .then((nextReports) => {
        if (!isCurrent) return;
        setReports(nextReports);
        setReportError("");
      })
      .catch((error) => {
        if (!isCurrent) return;
        setReportError(error.message || "Unable to load reports");
      });

    return () => {
      isCurrent = false;
    };
  }, [patientId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#071133] to-[#0F172A] text-white p-10">

      {/* HEADER */}

      <div className="mb-10">
  <h1 className="text-5xl font-bold">
    Patient Dashboard
  </h1>

  <p className="text-slate-400 mt-2">
    Monitor your treatment journey and medical reports, {user?.name || "Patient"}
  </p>
</div>

      {/* MAIN CARDS */}

      <div className="grid lg:grid-cols-3 gap-8">

        {/* Treatment */}

        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8">

          <HeartPulse
            size={40}
            className="text-red-400 mb-4"
          />

          <h2 className="text-2xl font-bold mb-2">
            Current Treatment
          </h2>

          <p className="text-slate-300">
            No live treatment plan available yet.
          </p>

          <p className="text-slate-500 mt-4 text-sm">
            Treatment details will appear here when provided by the backend.
          </p>

        </div>

        {/* Appointment */}

        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8">

          <CalendarDays
            size={40}
            className="text-cyan-400 mb-4"
          />

          <h2 className="text-2xl font-bold mb-2">
            Next Appointment
          </h2>

          <p className="text-slate-300">
            No appointment scheduled.
          </p>

          <p className="text-slate-500 mt-4 text-sm">
            Appointment data is not available from the backend yet.
          </p>

        </div>

        {/* Upload */}

        <Link to="/patient/upload-report">

          <div className="bg-gradient-to-r from-blue-500 to-cyan-400 rounded-3xl p-8 shadow-xl hover:scale-105 transition-all h-full">

            <Upload
              size={40}
              className="mb-4"
            />

            <h2 className="text-2xl font-bold">
              Upload Reports
            </h2>

            <p className="mt-3 opacity-90">
              Upload prescriptions, scans and reports
            </p>

          </div>

        </Link>

      </div>

      {/* SECOND ROW */}

      <div className="grid lg:grid-cols-2 gap-8 mt-10">

        {/* Treatment Progress */}

        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8">

          <h2 className="text-2xl font-bold mb-8">
            Treatment Progress
          </h2>

          <p className="text-slate-300">
            No live treatment milestones are available yet.
          </p>

        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
  <h2 className="text-2xl font-bold mb-6">
    Medication Schedule
  </h2>

  <p className="text-slate-300">
    No medication schedule is available from the backend yet.
  </p>
</div>

<div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
  <h2 className="text-2xl font-bold mb-6">
    Doctor Notes
  </h2>

  <p className="text-slate-300">
    No doctor notes are available yet.
  </p>
</div>

        

      
      {/* AI Health Summary */}

        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8">

          <div className="flex items-center gap-4 mb-6">

            <Brain
              size={35}
              className="text-cyan-400"
            />

            <h2 className="text-2xl font-bold">
              AI Health Summary
            </h2>

          </div>

          <p className="text-slate-300 leading-relaxed">
            AI analysis will appear after a real uploaded report is analyzed.
          </p>

          <button
  onClick={() => navigate("/patient/ai-analysis")}
  className="
    mt-6
    bg-gradient-to-r
    from-blue-500
    to-cyan-400
    px-6
    py-3
    rounded-2xl
    font-semibold
    shadow-xl
    hover:scale-105
    transition-all
  "
>
  View Full AI Analysis
</button>

        </div>
        </div>

      {/* REPORTS */}

      <div className="mt-12">

        <h2 className="text-3xl font-bold mb-6">
          Live Reports
        </h2>

        <div className="space-y-4">

          {reportError && (
            <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-5 text-sm font-semibold text-red-200">
              {reportError}
            </div>
          )}

          {openReportError && (
            <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-5 text-sm font-semibold text-red-200">
              {openReportError}
            </div>
          )}

          {reports.length > 0 ? (
            reports.map((report) => (
              <div
                key={`${report.reportId || report.url}-${report.name}`}
                className="flex items-center justify-between rounded-2xl bg-white/10 p-5 backdrop-blur-xl"
              >
                <div className="flex items-center gap-4">
                  <FileText className="text-cyan-400" />
                  <span>{report.name}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenReport(report)}
                  className="text-cyan-300 hover:text-cyan-100"
                >
                  Open
                </button>
              </div>
            ))
          ) : (
            <div className="rounded-2xl bg-white/10 p-5 text-slate-400 backdrop-blur-xl">
              No reports uploaded yet.
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
