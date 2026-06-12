import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PageShell from "../components/layout/PageShell";
import { useLiveAlerts } from "../hooks/useLiveAlerts";

export default function PatientHistory() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedPatient = location.state?.selectedPatient;
  const { patients, isLoading, error } = useLiveAlerts();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);

  const filteredPatients = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return patients.filter((patient) => {
      if (!term) return true;
      return `${patient.name} ${patient.id}`.toLowerCase().includes(term);
    });
  }, [searchTerm]);

  const displayPatients = selectedPatient
    ? (showAll ? filteredPatients : [selectedPatient])
    : (showAll ? filteredPatients : filteredPatients.slice(0, 5));

  const hasMorePatients = !selectedPatient && filteredPatients.length > 5;

  return (
    <PageShell
      title="Patient History & Medical Records"
      subtitle="Comprehensive historical medical information, previous hospitalizations, treatments, medications, and reason for doctor change."
      status="Patient medical history"
      footer={
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-slate-900">Medical continuity</p>
            <p className="mt-2 text-sm text-slate-600">Track patient's complete medical history for informed clinical decisions.</p>
          </div>
          <div className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-slate-900">Treatment timeline</p>
            <p className="mt-2 text-sm text-slate-600">Understand previous treatments, medications, and clinical progression.</p>
          </div>
        </div>
      }
    >
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-3xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search patients by name or ID"
            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-[28px] bg-red-50 px-5 py-4 text-sm font-semibold text-red-700 ring-1 ring-red-200">
          Backend connection issue: {error}
        </div>
      )}

      {selectedPatient && (
        <div className="rounded-[32px] bg-slate-50 p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Selected patient</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">{selectedPatient.name}</h2>
              <p className="mt-1 text-sm text-slate-500">Patient ID: {selectedPatient.id}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-3xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                {selectedPatient.severity}
              </span>
              <button
                onClick={() => setShowAll((current) => !current)}
                className="rounded-3xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                {showAll ? "Hide all patients" : "View All Patients"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {displayPatients.length > 0 ? (
          displayPatients.map((patient) => {
            const hasMedicalHistory = patient.medicalHistory && (
              (patient.medicalHistory.previousHospitalizations && patient.medicalHistory.previousHospitalizations.length > 0) ||
              (patient.medicalHistory.currentMedications && patient.medicalHistory.currentMedications.length > 0) ||
              (patient.medicalHistory.allergies && patient.medicalHistory.allergies.length > 0) ||
              Boolean(patient.medicalHistory.reasonForDoctorChange)
            );

            return (
              <div key={patient.id} className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-900">{patient.name}</h2>
                    <p className="mt-1 text-sm text-slate-500">Patient ID: {patient.id} • Age: {patient.age} • {patient.disease}</p>
                  </div>
                  <span className="rounded-3xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                    {patient.severity}
                  </span>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="rounded-[28px] bg-slate-50 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Current History Timeline</h3>
                    <div className="space-y-3 text-sm text-slate-700">
                      {patient.history && patient.history.length > 0 ? (
                        patient.history.map((item, index) => (
                          <div key={index} className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200 border-l-4 border-blue-500">
                            {item}
                          </div>
                        ))
                      ) : (
                        <div className="rounded-3xl bg-slate-100 p-4 text-slate-600">No current history available</div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-[28px] bg-slate-50 p-6">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">Medical Summary</h3>
                      {hasMedicalHistory ? (
                        <div className="space-y-4">
                          {patient.medicalHistory.previousHospitalizations?.length > 0 && (
                            <div>
                              <p className="text-sm font-semibold text-slate-900">Previous Hospitalizations</p>
                              <div className="mt-2 space-y-2">
                                {patient.medicalHistory.previousHospitalizations.map((hospitalization, index) => (
                                  <div key={index} className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200 border-l-4 border-amber-500 text-sm text-slate-700">
                                    {hospitalization}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {patient.medicalHistory.currentMedications?.length > 0 && (
                            <div>
                              <p className="text-sm font-semibold text-slate-900">Current Medications</p>
                              <div className="mt-2 space-y-2">
                                {patient.medicalHistory.currentMedications.map((medication, index) => (
                                  <div key={index} className="rounded-3xl bg-white px-4 py-2 shadow-sm ring-1 ring-slate-200 text-sm text-slate-700">
                                    • {medication}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {patient.medicalHistory.allergies?.length > 0 && (
                            <div>
                              <p className="text-sm font-semibold text-slate-900">Allergies & Sensitivities</p>
                              <div className="mt-2 space-y-2">
                                {patient.medicalHistory.allergies.map((allergy, index) => (
                                  <div key={index} className="rounded-3xl bg-red-50 px-4 py-2 shadow-sm ring-1 ring-red-200 text-sm text-red-700 font-medium">
                                    ⚠️ {allergy}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {patient.medicalHistory.reasonForDoctorChange && (
                            <div className="rounded-3xl bg-cyan-50 p-4 border-l-4 border-cyan-500 ring-1 ring-cyan-200">
                              <p className="text-sm font-semibold text-cyan-900">Reason for Seeking Care</p>
                              <p className="mt-2 text-sm text-cyan-800">{patient.medicalHistory.reasonForDoctorChange}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="rounded-3xl bg-slate-100 p-4 text-sm text-slate-600">
                          No medical history recorded
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-[28px] bg-slate-50 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Current Symptoms</h3>
                  <div className="flex flex-wrap gap-2">
                    {patient.symptoms && patient.symptoms.length > 0 ? (
                      patient.symptoms.map((symptom, index) => (
                        <span key={index} className="inline-flex items-center rounded-full bg-slate-200 px-4 py-2 text-sm font-medium text-slate-800">
                          {symptom}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-600">No symptoms recorded</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-[32px] bg-white p-8 text-center shadow-sm ring-1 ring-slate-200 text-sm text-slate-600">
            {isLoading ? "Loading live patient history..." : "No patients match your search."}
          </div>
        )}

        {!selectedPatient && hasMorePatients && !showAll && (
          <div className="flex justify-center">
            <button
              onClick={() => setShowAll(true)}
              className="rounded-3xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Show More
            </button>
          </div>
        )}
      </div>
    </PageShell>
  );
}
