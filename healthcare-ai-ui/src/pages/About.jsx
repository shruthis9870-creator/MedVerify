import {
  HeartPulse,
  BrainCircuit,
  ShieldCheck,
  Activity,
} from "lucide-react";

import PageShell from "../components/layout/PageShell";

export default function About() {
  const features = [
    {
      title: "AI-Based Diagnosis",
      description:
        "Advanced artificial intelligence helps analyze reports and patient conditions instantly.",
      icon: BrainCircuit,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Emergency Routing",
      description:
        "Patients are automatically routed to the nearest and most suitable specialist or hospital.",
      icon: Activity,
      color: "bg-red-100 text-red-600",
    },
    {
      title: "Secure Healthcare",
      description:
        "All healthcare data is protected with modern encryption and secure infrastructure.",
      icon: ShieldCheck,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Smart Monitoring",
      description:
        "Real-time patient monitoring and intelligent recommendations improve response times.",
      icon: HeartPulse,
      color: "bg-pink-100 text-pink-600",
    },
  ];

  return (
    <PageShell
      title="About MediAssist"
      subtitle="An AI-powered healthcare platform designed for intelligent patient care and emergency response."
      status="Healthcare AI Platform"
    >
      <div className="space-y-8">

        {/* Hero Section */}
        <div className="rounded-[32px] bg-gradient-to-r from-cyan-500 to-blue-600 p-10 text-white shadow-xl">

          <div className="max-w-4xl">

            <h1 className="text-5xl font-bold leading-tight">
              Revolutionizing Healthcare
              with Artificial Intelligence
            </h1>

            <p className="mt-6 text-lg text-cyan-100 leading-relaxed">
              MediAssist combines AI-powered diagnosis, emergency response,
              smart hospital routing, and real-time patient monitoring
              into one intelligent healthcare ecosystem.
            </p>

          </div>

        </div>

        {/* Vision + Mission */}
        <div className="grid gap-6 lg:grid-cols-2">

          <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200">

            <h2 className="text-3xl font-bold text-slate-900">
              Our Vision
            </h2>

            <p className="mt-5 text-slate-600 leading-relaxed">
              To build a future where healthcare becomes faster,
              smarter, and more accessible using intelligent AI systems
              that assist doctors, hospitals, and emergency services.
            </p>

          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200">

            <h2 className="text-3xl font-bold text-slate-900">
              Our Mission
            </h2>

            <p className="mt-5 text-slate-600 leading-relaxed">
              MediAssist aims to reduce emergency response times,
              improve patient outcomes, and support medical professionals
              with powerful AI-driven recommendations and analytics.
            </p>

          </div>

        </div>

        {/* Features */}
        <div>

          <div className="mb-8">

            <h2 className="text-4xl font-bold text-slate-900">
              Core Features
            </h2>

            <p className="mt-3 text-slate-500">
              Powerful AI capabilities built for modern healthcare systems.
            </p>

          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg"
                >

                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-3xl ${feature.color}`}
                  >
                    <Icon className="h-8 w-8" />
                  </div>

                  <h3 className="mt-6 text-2xl font-semibold text-slate-900">
                    {feature.title}
                  </h3>

                  <p className="mt-4 text-sm leading-relaxed text-slate-600">
                    {feature.description}
                  </p>

                </div>
              );
            })}

          </div>

        </div>

        {/* Bottom Banner */}
        <div className="rounded-[32px] bg-slate-950 p-10 text-white shadow-xl">

          <h2 className="text-4xl font-bold">
            Healthcare + AI = Better Lives
          </h2>

          <p className="mt-5 max-w-3xl text-slate-300 leading-relaxed">
            Our platform empowers doctors and healthcare providers
            with real-time intelligence, helping save lives through
            faster diagnosis, better coordination, and smarter decisions.
          </p>

        </div>

      </div>
    </PageShell>
  );
}