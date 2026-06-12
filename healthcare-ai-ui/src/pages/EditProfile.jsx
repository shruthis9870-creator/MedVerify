import { useState } from "react";

import {
  User,
  Mail,
  Phone,
  Building2,
  BriefcaseMedical,
} from "lucide-react";

import PageShell from "../components/layout/PageShell";

export default function EditProfile() {
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    name: "Dr. Sharma",
    email: "drsharma@mediassist.com",
    phone: "+91 9876543210",
    hospital: "MediAssist Hospital",
    specialization: "Cardiology",
    experience: "15 Years",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  return (
    <PageShell
      title="Edit Profile"
      subtitle="Update your doctor profile and professional information."
      status="Profile Management"
    >
      <div className="space-y-8">

        {/* Header Card */}
        <div className="rounded-[32px] bg-gradient-to-r from-cyan-500 to-blue-600 p-8 text-white shadow-xl">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div>

              <h1 className="text-4xl font-bold">
                Doctor Profile Settings
              </h1>

              <p className="mt-4 max-w-2xl text-lg text-cyan-100">
                Manage your personal details, specialization,
                and hospital information securely.
              </p>

            </div>

            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white/20 text-white text-4xl font-bold backdrop-blur-md">
              DS
            </div>

          </div>

        </div>

        {/* Form */}
        <form
          onSubmit={handleSave}
          className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200"
        >

          <div className="grid gap-6 md:grid-cols-2">

            {/* Name */}
            <div>

              <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">

                <User className="h-4 w-4" />

                Full Name

              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
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

            {/* Email */}
            <div>

              <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">

                <Mail className="h-4 w-4" />

                Email Address

              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
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

            {/* Phone */}
            <div>

              <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">

                <Phone className="h-4 w-4" />

                Phone Number

              </label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
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

            {/* Hospital */}
            <div>

              <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">

                <Building2 className="h-4 w-4" />

                Hospital Name

              </label>

              <input
                type="text"
                name="hospital"
                value={formData.hospital}
                onChange={handleChange}
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

            {/* Specialization */}
            <div>

              <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">

                <BriefcaseMedical className="h-4 w-4" />

                Specialization

              </label>

              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
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

            {/* Experience */}
            <div>

              <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">

                <BriefcaseMedical className="h-4 w-4" />

                Experience

              </label>

              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
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

          </div>

          {/* Button */}
          <button
            type="submit"
            className="
              mt-8
              rounded-3xl
              bg-slate-950
              px-8
              py-4
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-slate-800
            "
          >
            Save Changes
          </button>

          {/* Success */}
          {saved && (

            <div className="mt-6 rounded-3xl bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200">

              Profile updated successfully.

            </div>

          )}

        </form>

      </div>
    </PageShell>
  );
}