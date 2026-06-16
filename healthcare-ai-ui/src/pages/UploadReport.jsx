import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  FileText,
  CheckCircle,
  Brain,
} from "lucide-react";
import { uploadPatientReport } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function UploadReport() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const patientId = user?.patientId;
  const missingPatientId = !patientId;

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
      setUploadStatus("");
      setUploadError("");
    }
  };

  const handleUpload = async () => {
    if (!uploadedFile) return;

    if (missingPatientId) {
      setUploadError("Your patient session is missing a patient ID. Please log out and sign in again.");
      return;
    }

    setIsUploading(true);
    setUploadError("");

    try {
      await uploadPatientReport({
        patientId,
        patientName: user?.name || "Patient",
        file: uploadedFile,
      });
      setUploadStatus("Report uploaded and sent to the doctor dashboard.");
    } catch (error) {
      setUploadError(error.message || "Unable to upload report.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#071133] to-[#0F172A] text-white p-10">

      {/* Header */}

      <div className="mb-12">

        <h1 className="text-5xl font-bold">
          Upload Medical Reports
        </h1>

          <p className="text-slate-400 mt-3">
          Upload prescriptions, scans, blood reports and doctors will see them live.
        </p>

      </div>

      {/* Upload Area */}

      <div className="max-w-4xl">

        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-10">

          <div className="flex flex-col items-center text-center">

            <Upload
              size={70}
              className="text-cyan-400 mb-6"
            />

            <h2 className="text-3xl font-bold mb-3">
              Drag & Drop Report
            </h2>

          <p className="text-slate-400 mb-8">
              PDF, JPG, PNG supported
            </p>

            {missingPatientId && (
              <div className="mb-6 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
                Your patient session is missing a patient ID. Please log out and sign in again.
              </div>
            )}

            <label className="cursor-pointer">

              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                disabled={missingPatientId}
              />

              <div className={`bg-gradient-to-r from-blue-500 to-cyan-400 px-8 py-4 rounded-2xl font-bold shadow-xl transition-all ${missingPatientId ? "cursor-not-allowed opacity-50" : "hover:scale-105"}`}>
                Choose File
              </div>

            </label>

          </div>

        </div>

        {/* Uploaded File */}

        {uploadedFile && (

  <div className="mt-8 bg-white/10 rounded-3xl p-6 border border-white/10">

    <div className="flex justify-between items-center">

      <div className="flex items-center gap-4">

        <FileText
          size={30}
          className="text-cyan-400"
        />

        <div>

          <h3 className="font-semibold">
            {uploadedFile.name}
          </h3>

          <p className="text-slate-400 text-sm">
            Ready to send to doctor dashboard
          </p>

        </div>

      </div>

      <CheckCircle
        size={28}
        className="text-green-400"
      />

    </div>

    <button
      onClick={handleUpload}
      disabled={isUploading || missingPatientId}
      className={`mt-6 bg-gradient-to-r from-blue-500 to-cyan-400 px-6 py-3 rounded-2xl font-semibold transition-all ${isUploading || missingPatientId ? "cursor-not-allowed opacity-50" : "hover:scale-105"}`}
    >
      {isUploading ? "Uploading..." : "Upload to Doctor Dashboard"}
    </button>

    {uploadStatus && (
      <div className="mt-4 rounded-2xl border border-green-400/30 bg-green-500/10 px-4 py-3 text-sm font-semibold text-green-200">
        {uploadStatus}
      </div>
    )}

    {uploadError && (
      <div className="mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
        {uploadError}
      </div>
    )}

    {uploadStatus && (
      <button
        onClick={() => navigate("/patient/ai-analysis")}
        className="mt-4 rounded-2xl border border-white/10 px-6 py-3 font-semibold text-white transition-all hover:bg-white/10"
      >
        View AI Analysis
      </button>
    )}

  </div>

)}

      </div>

      {/* AI Section */}

      <div className="mt-12 max-w-4xl">

        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8">

          <div className="flex items-center gap-4 mb-4">

            <Brain
              size={35}
              className="text-cyan-400"
            />

            <h2 className="text-2xl font-bold">
              AI Processing
            </h2>

          </div>

          <p className="text-slate-300 leading-relaxed">
            Once uploaded, MedVerify AI analyzes the report,
            identifies abnormalities, prioritizes severity,
            and assists healthcare professionals with treatment routing.
          </p>

        </div>

      </div>

    </div>
  );
}
