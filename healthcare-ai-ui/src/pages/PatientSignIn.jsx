import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, Mail, Phone, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function PatientSignIn() {
  const navigate = useNavigate();
  const { signup, verifyOtp } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const [verificationStarted, setVerificationStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    setIsLoading(true);
    setError("");
    const result = await signup({
      role: "patient",
      name,
      phone,
      email,
      password,
    });
    setIsLoading(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    setVerificationStarted(true);
    setOtpMessage("OTP sent to your registered phone.");
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);
    setError("");
    const result = await verifyOtp({
      role: "patient",
      phone,
      otp,
    });
    setIsLoading(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    navigate("/patient/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#020617] via-[#071133] to-[#0F172A] px-6">
      <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-white/10 p-10 shadow-2xl backdrop-blur-xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-slate-400 hover:text-white"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <h1 className="text-4xl font-bold text-white">Patient Signup</h1>
        <p className="mt-3 text-slate-400">Create an account to upload reports and share them with doctors.</p>

        <div className="mt-8 space-y-5">
          <div className="flex items-center gap-3 rounded-2xl bg-slate-900/70 px-4 py-4">
            <UserRound className="text-cyan-400" />
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={verificationStarted}
              placeholder="Full name"
              className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-slate-900/70 px-4 py-4">
            <Phone className="text-cyan-400" />
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              disabled={verificationStarted}
              placeholder="Phone number with country code"
              className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-slate-900/70 px-4 py-4">
            <Mail className="text-cyan-400" />
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={verificationStarted}
              placeholder="Email address"
              className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-slate-900/70 px-4 py-4">
            <Lock className="text-cyan-400" />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={verificationStarted}
              placeholder="Password"
              className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
            />
          </div>

          {error && (
            <div className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
              {error}
            </div>
          )}

          {!verificationStarted ? (
            <button
              onClick={handleSignup}
              disabled={isLoading}
              className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 py-4 font-bold text-white shadow-xl transition-all hover:scale-105"
            >
              {isLoading ? "Creating..." : "Create Patient Account"}
            </button>
          ) : (
            <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-5">
              <p className="text-sm font-semibold text-cyan-100">{otpMessage}</p>
              <div className="mt-4 flex gap-3">
                <input
                  value={otp}
                  onChange={(event) => setOtp(event.target.value)}
                  placeholder="Enter OTP"
                  className="min-w-0 flex-1 rounded-2xl bg-slate-900 px-4 py-3 text-white outline-none"
                />
                <button
                  onClick={handleVerifyOtp}
                  disabled={isLoading}
                  className="rounded-2xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950"
                >
                  Verify
                </button>
              </div>
            </div>
          )}

          <Link to="/patient-login" className="block text-center text-sm text-slate-400">
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
}
