import { Mail, Phone } from "lucide-react";
import PageShell from "../components/layout/PageShell";
import { Link } from "react-router-dom";
import { useLiveAlerts } from "../hooks/useLiveAlerts";
import { useAuth } from "../context/AuthContext";
import { displaySpecialty, displayUserName, userInitials } from "../utils/profile";

export default function Profile() {
  const { patients } = useLiveAlerts();
  const { user } = useAuth();
  const patientsHandledToday = patients.length;
  const name = displayUserName(user);
  const specialty = displaySpecialty(user);
  const email = user?.email || "Not provided";
  const phone = user?.phone || "Not provided";

  return (
    <PageShell
      title={name}
      subtitle="Review your authenticated account details, specialty, and contact information."
      status="Doctor profile"
      footer={
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-slate-900">Update profile</p>
            <p className="mt-3 text-sm text-slate-600">Use the settings page to keep your contact and availability details current.</p>
          </div>
          <div className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-slate-900">Manage access</p>
            <p className="mt-3 text-sm text-slate-600">Keep your profile synced with hospital credentials for secure patient access.</p>
          </div>
        </div>
      }
    >
      <div className="rounded-[32px] bg-white p-10 shadow-sm ring-1 ring-slate-200 max-w-3xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
          <div className="h-32 w-32 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-4xl font-bold text-white">{userInitials(user)}</span>
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-4xl font-bold text-slate-900">{name}</h1>
              <span className="bg-emerald-100 text-emerald-700 rounded-full px-4 py-2 text-sm font-semibold">On Duty</span>
            </div>
            <p className="mt-2 text-xl text-slate-500">{specialty}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/edit-profile">
  <button className="rounded-3xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white">
    Edit Profile
  </button>
</Link>
              <a
                href={user?.email ? `mailto:${user.email}` : undefined}
                className="inline-flex items-center gap-2 rounded-3xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                <Mail className="h-4 w-4" />
                Email
              </a>
              <a
                href={user?.phone ? `tel:${user.phone}` : undefined}
                className="inline-flex items-center gap-2 rounded-3xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                <Phone className="h-4 w-4" />
                Call
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 text-sm text-slate-700">
          <div className="rounded-[24px] bg-slate-50 p-6">
            <p className="font-semibold text-slate-900">Hospital</p>
            <p className="mt-2 text-slate-600">Not provided</p>
          </div>
          <div className="rounded-[24px] bg-slate-50 p-6">
            <p className="font-semibold text-slate-900">Experience</p>
            <p className="mt-2 text-slate-600">Not provided</p>
          </div>
          <div className="rounded-[24px] bg-slate-50 p-6">
            <p className="font-semibold text-slate-900">Specialization</p>
            <p className="mt-2 text-slate-600">{specialty}</p>
          </div>
          <div className="rounded-[24px] bg-slate-50 p-6">
            <p className="font-semibold text-slate-900">Email</p>
            <p className="mt-2 text-slate-600">{email}</p>
          </div>
          <div className="rounded-[24px] bg-slate-50 p-6">
            <p className="font-semibold text-slate-900">Phone</p>
            <p className="mt-2 text-slate-600">{phone}</p>
          </div>
        </div>

        <div className="mt-6 rounded-[24px] bg-slate-50 p-6 text-sm text-slate-700">
          <p>
            <span className="font-semibold text-slate-900">Patients handled today:</span> {patientsHandledToday}
          </p>
        </div>
      </div>
    </PageShell>
  );
}
