import { Link } from "react-router-dom";
import {
  User,
  Stethoscope,
  ShieldCheck,
} from "lucide-react";

export default function SignIn() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#071133] to-[#0F172A] flex items-center justify-center px-6">

      <div className="max-w-6xl w-full">

        {/* Header */}

        <div className="text-center mb-16">

          <h1 className="text-6xl font-bold text-white mb-4">
            Secure Sign In
          </h1>

          <p className="text-slate-400 text-xl">
            Continue with your MediAssist account
          </p>

        </div>

        {/* Cards */}

        <div className="grid md:grid-cols-2 gap-10">

          {/* Doctor */}

          <Link to="/doctor-signin">

            <div
              className="
              group
              h-full
              bg-white/10
              backdrop-blur-xl
              rounded-[32px]
              p-10
              border
              border-white/10
              hover:border-cyan-400
              transition-all
              duration-300
              hover:scale-[1.02]
              hover:shadow-cyan-500/20
              shadow-2xl
              "
            >

              <div
                className="
                w-20
                h-20
                rounded-3xl
                bg-cyan-500/20
                flex
                items-center
                justify-center
                mb-8
                "
              >
                <Stethoscope
                  size={42}
                  className="text-cyan-400"
                />
              </div>

              <h2 className="text-4xl font-bold text-white mb-4">
                Doctor Portal
              </h2>

              <p className="text-slate-400 text-lg leading-relaxed">
                Secure access for healthcare professionals,
                patient management, AI recommendations,
                and clinical dashboards.
              </p>

              <div className="flex items-center gap-3 mt-8 text-cyan-400">

                <ShieldCheck size={20} />

                <span>
                  OTP Protected Access
                </span>

              </div>

            </div>

          </Link>

          {/* Patient */}

          <Link to="/patient-signin">

            <div
              className="
              group
              h-full
              bg-white/10
              backdrop-blur-xl
              rounded-[32px]
              p-10
              border
              border-white/10
              hover:border-cyan-400
              transition-all
              duration-300
              hover:scale-[1.02]
              hover:shadow-cyan-500/20
              shadow-2xl
              "
            >

              <div
                className="
                w-20
                h-20
                rounded-3xl
                bg-cyan-500/20
                flex
                items-center
                justify-center
                mb-8
                "
              >
                <User
                  size={42}
                  className="text-cyan-400"
                />
              </div>

              <h2 className="text-4xl font-bold text-white mb-4">
                Patient Portal
              </h2>

              <p className="text-slate-400 text-lg leading-relaxed">
                Access appointments, reports,
                AI health analysis, prescriptions,
                and treatment progress securely.
              </p>

              <div className="flex items-center gap-3 mt-8 text-cyan-400">

                <ShieldCheck size={20} />

                <span>
                  OTP Protected Access
                </span>

              </div>

            </div>

          </Link>

        </div>

        {/* Footer */}

        <div className="text-center mt-16">

          <p className="text-slate-500">
            Protected by MediAssist Secure Authentication
          </p>

        </div>

      </div>

    </div>
  );
}