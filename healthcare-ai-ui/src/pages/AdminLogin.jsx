import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { loginWithCredentials } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");

    const result = await loginWithCredentials({
      role: "admin",
      email,
      password,
    });

    setIsLoading(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    navigate("/admin-dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-white/10 p-10 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-cyan-400 text-slate-950">
            <ShieldCheck size={40} />
          </div>
        </div>

        <h1 className="text-center text-4xl font-bold text-white">
          Admin Login
        </h1>

        <p className="mt-3 text-center text-sm text-slate-400">
          Access the patient-to-doctor routing module.
        </p>

        <div className="mt-10 space-y-6">
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Gmail
            </label>
            <div className="flex items-center gap-3 rounded-2xl bg-slate-900/70 px-4 py-4">
              <Mail className="text-cyan-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@hospital.com"
                className="w-full bg-transparent text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Password
            </label>
            <div className="flex items-center gap-3 rounded-2xl bg-slate-900/70 px-4 py-4">
              <Lock className="text-cyan-400" size={20} />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter password"
                className="w-full bg-transparent text-white outline-none"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 py-4 font-semibold text-white shadow-xl transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Logging in..." : "Login as Admin"}
          </button>

          <Link to="/role" className="block text-center text-sm text-slate-400">
            Back to role selection
          </Link>
        </div>
      </div>
    </div>
  );
}
