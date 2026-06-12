import {
  Ambulance,
  MapPin,
  Clock3,
  Phone,
  Activity,
} from "lucide-react";

import PageShell from "../components/layout/PageShell";

export default function AmbulanceTracking() {
  const ambulanceData = [
    {
      id: "AMB-204",
      driver: "Ravi Kumar",
      location: "MG Road, Bangalore",
      eta: "6 mins",
      status: "On Route",
    },
    {
      id: "AMB-118",
      driver: "Suresh Patel",
      location: "Electronic City",
      eta: "12 mins",
      status: "Dispatching",
    },
    {
      id: "AMB-332",
      driver: "Akash Sharma",
      location: "Whitefield",
      eta: "3 mins",
      status: "Nearby",
    },
  ];

  return (
    <PageShell
      title="Ambulance Tracking"
      subtitle="Real-time ambulance monitoring and emergency dispatch management."
      status="Live GPS Tracking"
    >
      <div className="space-y-8">

        {/* Top Banner */}
        <div className="rounded-[32px] bg-gradient-to-r from-cyan-500 to-blue-600 p-8 text-white shadow-xl">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div>
              <div className="flex items-center gap-3">

                <Ambulance className="h-10 w-10" />

                <h1 className="text-4xl font-bold">
                  Ambulance Control Center
                </h1>

              </div>

              <p className="mt-4 max-w-2xl text-lg text-cyan-100">
                Monitor ambulance movement, estimated arrival times,
                and emergency dispatch activity in real time.
              </p>
            </div>

            <div className="rounded-3xl bg-white/20 px-6 py-5 backdrop-blur-md">
              <p className="text-sm uppercase tracking-[0.2em] text-cyan-100">
                Active Ambulances
              </p>

              <h2 className="mt-2 text-5xl font-bold">
                12
              </h2>
            </div>

          </div>
        </div>

        {/* Ambulance Cards */}
        <div className="grid gap-6 xl:grid-cols-3">

          {ambulanceData.map((ambulance) => (

            <div
              key={ambulance.id}
              className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg"
            >

              {/* Header */}
              <div className="flex items-center justify-between">

                <div className="flex items-center gap-4">

                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-100 text-cyan-600">
                    <Ambulance className="h-8 w-8" />
                  </div>

                  <div>

                    <h2 className="text-2xl font-bold text-slate-900">
                      {ambulance.id}
                    </h2>

                    <p className="text-sm text-slate-500">
                      Driver: {ambulance.driver}
                    </p>

                  </div>

                </div>

                <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                  {ambulance.status}
                </span>

              </div>

              {/* Details */}
              <div className="mt-8 space-y-5">

                <div className="flex items-center gap-3 text-slate-700">

                  <MapPin className="h-5 w-5 text-red-500" />

                  <span>{ambulance.location}</span>

                </div>

                <div className="flex items-center gap-3 text-slate-700">

                  <Clock3 className="h-5 w-5 text-orange-500" />

                  <span>ETA: {ambulance.eta}</span>

                </div>

                <div className="flex items-center gap-3 text-slate-700">

                  <Phone className="h-5 w-5 text-green-500" />

                  <span>Emergency Contact Available</span>

                </div>

              </div>

              {/* Button */}
              <button
                className="
                  mt-8
                  w-full
                  rounded-3xl
                  bg-slate-950
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-slate-800
                "
              >
                View Live Location
              </button>

            </div>

          ))}
        </div>

        {/* Live Tracking Section */}
        <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200">

          <div className="flex items-center gap-3">

            <Activity className="h-8 w-8 text-cyan-500" />

            <h2 className="text-3xl font-bold text-slate-900">
              Real-Time Tracking
            </h2>

          </div>

          <div className="mt-8 rounded-[28px] bg-slate-100 p-12 text-center">

            <p className="text-lg text-slate-500">
              Live GPS tracking map integration can be added here.
            </p>

            <div className="mt-6 flex justify-center">

              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-cyan-100 text-cyan-600">
                <MapPin className="h-12 w-12" />
              </div>

            </div>

          </div>

        </div>

      </div>
    </PageShell>
  );
}