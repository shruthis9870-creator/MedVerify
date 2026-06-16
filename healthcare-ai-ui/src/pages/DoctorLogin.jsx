import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Stethoscope } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function DoctorLogin() {
  const navigate = useNavigate();
  const { loginWithCredentials, requestOtp, verifyOtp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");
    const result = await loginWithCredentials({
      role: "doctor",
      email,
      password,
    });
    setIsLoading(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    navigate("/dashboard");
  };

  const handleRequestOtp = async () => {
    setError("");
    setOtpMessage("");
    const result = await requestOtp({
      role: "doctor",
      phone,
    });

    if (!result.ok) {
      setError(result.message);
      return;
    }

    setOtpMessage(
      result.dev_otp
        ? `Local testing OTP: ${result.dev_otp}`
        : "OTP sent to your registered phone."
    );
  };

  const handleVerifyOtp = async () => {
    setError("");
    const result = await verifyOtp({
      role: "doctor",
      phone,
      otp,
    });

    if (!result.ok) {
      setError(result.message);
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#071133] to-[#0F172A] flex items-center justify-center px-6">

      <div
        className="
          w-full
          max-w-md
          bg-white/10
          backdrop-blur-xl
          border
          border-white/20
          rounded-[32px]
          p-10
          shadow-2xl
        "
      >

        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-3xl bg-cyan-400 flex items-center justify-center">
            <Stethoscope size={40} className="text-slate-950" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-white text-center mb-3">
          Doctor Login
        </h1>

        <p className="text-slate-400 text-center mb-10">
          Sign in with your registered doctor account
        </p>

        <div className="space-y-6">

          <div>
            <label className="text-slate-300 text-sm mb-2 block">
              Email
            </label>

            <div className="flex items-center gap-3 bg-slate-900/70 rounded-2xl px-4 py-4">
              <Mail className="text-cyan-400" size={20} />
              <input
                type="email"
                placeholder="doctor@hospital.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="bg-transparent outline-none text-white w-full"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 text-sm mb-2 block">
              Password
            </label>

            <div className="flex items-center gap-3 bg-slate-900/70 rounded-2xl px-4 py-4">
              <Lock className="text-cyan-400" size={20} />
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="bg-transparent outline-none text-white w-full"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">

            <label className="flex items-center gap-2 text-slate-400">
              <input type="checkbox" />
              Remember me
            </label>

            <button className="text-cyan-400">
              Forgot Password?
            </button>

          </div>

          {error && (
            <div className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
              {error}
            </div>
          )}

          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
            New doctors should create an account first. Registered accounts are stored in Redis.
          </div>

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="
              w-full
              bg-gradient-to-r
              from-blue-500
              to-cyan-400
              py-4
              rounded-2xl
              font-semibold
              text-white
              shadow-xl
              hover:scale-105
              transition-all
            "
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
            <p className="mb-4 text-sm font-semibold text-slate-200">Login with OTP</p>
            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Registered phone number"
              className="mb-3 w-full rounded-2xl bg-slate-900 px-4 py-3 text-white outline-none"
            />
            <div className="flex gap-3">
              <button
                onClick={handleRequestOtp}
                className="flex-1 rounded-2xl border border-cyan-400/30 px-4 py-3 text-sm font-semibold text-cyan-100"
              >
                Send OTP
              </button>
              <input
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
                placeholder="OTP"
                className="w-24 rounded-2xl bg-slate-900 px-4 py-3 text-white outline-none"
              />
              <button
                onClick={handleVerifyOtp}
                className="flex-1 rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950"
              >
                Verify
              </button>
            </div>
            {otpMessage && <p className="mt-3 text-sm text-cyan-200">{otpMessage}</p>}
          </div>

          <Link
            to="/role"
            className="block text-center text-slate-400"
          >
            ← Back
          </Link>

        </div>

      </div>

    </div>
  );
}
