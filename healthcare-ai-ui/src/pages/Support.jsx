import { useState } from "react";

import {
  Headset,
  Phone,
  Mail,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

import PageShell from "../components/layout/PageShell";

export default function Support() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  };

  return (
    <PageShell
      title="Support Center"
      subtitle="Get technical assistance, emergency support, and healthcare system guidance."
      status="24/7 Support Available"
    >
      <div className="space-y-8">

        {/* Top Banner */}
        <div className="rounded-[32px] bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-white shadow-xl">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div>

              <div className="flex items-center gap-3">

                <Headset className="h-10 w-10" />

                <h1 className="text-4xl font-bold">
                  MediAssist Support
                </h1>

              </div>

              <p className="mt-4 max-w-2xl text-lg text-cyan-100">
                Reach our healthcare support team anytime for
                emergency help, technical assistance, or AI guidance.
              </p>

            </div>

            <div className="rounded-3xl bg-white/20 px-6 py-5 backdrop-blur-md">

              <p className="text-sm uppercase tracking-[0.2em] text-cyan-100">
                Response Time
              </p>

              <h2 className="mt-2 text-5xl font-bold">
                &lt; 5 min
              </h2>

            </div>

          </div>

        </div>

        {/* Support Cards */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg">

            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-100 text-blue-600">
              <Phone className="h-8 w-8" />
            </div>

            <h2 className="mt-6 text-2xl font-semibold text-slate-900">
              Emergency Call
            </h2>

            <p className="mt-3 text-slate-600">
              +91 9876543210
            </p>

          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg">

            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-100 text-cyan-600">
              <Mail className="h-8 w-8" />
            </div>

            <h2 className="mt-6 text-2xl font-semibold text-slate-900">
              Email Support
            </h2>

            <p className="mt-3 text-slate-600">
              support@mediassist.com
            </p>

          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg">

            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-green-100 text-green-600">
              <MessageCircle className="h-8 w-8" />
            </div>

            <h2 className="mt-6 text-2xl font-semibold text-slate-900">
              Live Chat
            </h2>

            <p className="mt-3 text-slate-600">
              Available 24/7
            </p>

          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg">

            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-purple-100 text-purple-600">
              <ShieldCheck className="h-8 w-8" />
            </div>

            <h2 className="mt-6 text-2xl font-semibold text-slate-900">
              AI Assistance
            </h2>

            <p className="mt-3 text-slate-600">
              Intelligent healthcare guidance
            </p>

          </div>

        </div>

        {/* Support Form */}
        <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200">

          <div>

            <h2 className="text-3xl font-bold text-slate-900">
              Submit Support Request
            </h2>

            <p className="mt-3 text-slate-500">
              Describe your issue and our team will assist you immediately.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Full Name
              </label>

              <input
                type="text"
                required
                placeholder="Enter your name"
                className="
                  w-full
                  rounded-3xl
                  border
                  border-slate-200
                  bg-slate-50
                  px-5
                  py-4
                  text-sm
                  outline-none
                  focus:border-cyan-400
                "
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email Address
              </label>

              <input
                type="email"
                required
                placeholder="Enter your email"
                className="
                  w-full
                  rounded-3xl
                  border
                  border-slate-200
                  bg-slate-50
                  px-5
                  py-4
                  text-sm
                  outline-none
                  focus:border-cyan-400
                "
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Issue Description
              </label>

              <textarea
                rows={5}
                required
                placeholder="Describe your issue..."
                className="
                  w-full
                  rounded-3xl
                  border
                  border-slate-200
                  bg-slate-50
                  px-5
                  py-4
                  text-sm
                  outline-none
                  focus:border-cyan-400
                "
              />

            </div>

            <button
              type="submit"
              className="
                rounded-3xl
                bg-slate-950
                px-6
                py-4
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-slate-800
              "
            >
              Submit Request
            </button>

            {submitted && (

              <div className="rounded-3xl bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200">

                Support request submitted successfully.

              </div>

            )}

          </form>

        </div>

      </div>
    </PageShell>
  );
}