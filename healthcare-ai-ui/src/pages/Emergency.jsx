import { useNavigate } from "react-router-dom";
import {
  Ambulance,
  Phone,
  Siren,
  HeartPulse,
  TriangleAlert,
} from "lucide-react";

import PageShell from "../components/layout/PageShell";

export default function Emergency() {
  const navigate = useNavigate();

  const emergencyContacts = [
    {
      title: "Emergency Ambulance",
      number: "+91 108",
      icon: Ambulance,
      color: "bg-red-100 text-red-600",
    },
    {
      title: "Hospital Emergency",
      number: "+91 9876543210",
      icon: Phone,
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Critical Care Unit",
      number: "+91 9123456780",
      icon: HeartPulse,
      color: "bg-pink-100 text-pink-600",
    },
  ];

  return (
    <PageShell
      title="Emergency Response"
      subtitle="Immediate emergency assistance and critical patient routing."
      status="24/7 Emergency Active"
    >
      <div className="space-y-8">

        {/* Emergency Banner */}
        <div className="rounded-[32px] bg-gradient-to-r from-red-500 to-orange-500 p-8 text-white shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div>
              <div className="flex items-center gap-3">
                <Siren className="h-10 w-10" />
                <h1 className="text-4xl font-bold">
                  Emergency Assistance
                </h1>
              </div>

              <p className="mt-4 max-w-2xl text-lg text-red-100">
                Trigger ambulance dispatch, contact emergency teams,
                and route critical patients instantly.
              </p>
            </div>

            <button
              onClick={() => navigate("/ambulance-tracking")}
              className="rounded-3xl bg-white px-6 py-4 text-lg font-semibold text-red-600 shadow-lg transition hover:scale-105"
            >
              Track Ambulance
            </button>

          </div>
        </div>

        {/* Emergency Cards */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {emergencyContacts.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-3xl ${item.color}`}
                >
                  <Icon className="h-8 w-8" />
                </div>

                <h2 className="mt-6 text-2xl font-semibold text-slate-900">
                  {item.title}
                </h2>

                <p className="mt-3 text-lg text-slate-600">
                  {item.number}
                </p>

                <button
                  className="mt-6 w-full rounded-3xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Call Now
                </button>
              </div>
            );
          })}
        </div>

        {/* AI Alert Section */}
        <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200">

          <div className="flex items-center gap-3">
            <TriangleAlert className="h-8 w-8 text-red-500" />

            <h2 className="text-3xl font-bold text-slate-900">
              AI Emergency Alerts
            </h2>
          </div>

          <div className="mt-8 space-y-4">

            <div className="rounded-3xl border border-red-200 bg-red-50 p-5">
              <h3 className="font-semibold text-red-700">
                Critical Cardiac Emergency
              </h3>

              <p className="mt-2 text-sm text-red-600">
                AI detected abnormal ECG pattern requiring immediate
                cardiologist intervention.
              </p>
            </div>

            <div className="rounded-3xl border border-orange-200 bg-orange-50 p-5">
              <h3 className="font-semibold text-orange-700">
                Trauma Patient Routing
              </h3>

              <p className="mt-2 text-sm text-orange-600">
                Nearest trauma center identified within 6 km radius.
              </p>
            </div>

            <div className="rounded-3xl border border-pink-200 bg-pink-50 p-5">
              <h3 className="font-semibold text-pink-700">
                Ambulance Dispatch Recommended
              </h3>

              <p className="mt-2 text-sm text-pink-600">
                AI priority system marked patient condition as high risk.
              </p>
            </div>

          </div>
        </div>

      </div>
    </PageShell>
  );
}