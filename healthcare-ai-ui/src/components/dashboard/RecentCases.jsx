import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpDown, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { routePatientId } from "../../services/api";

export default function RecentCases({ patients = [], isLoading = false }) {
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState({ key: "severity", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [severityFilter, setSeverityFilter] = useState("all");
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [severityFilter, itemsPerPage]);

  // Filter by severity
  const filteredPatients = severityFilter === "all" 
    ? patients 
    : patients.filter(p => p.severity === severityFilter);

  // Sort patients
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    
    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // Paginate
  const totalPages = Math.max(Math.ceil(sortedPatients.length / itemsPerPage), 1);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedPatients = sortedPatients.slice(startIdx, startIdx + itemsPerPage);

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc",
    });
  };

  const SortHeader = ({ column, label }) => (
    <button
      onClick={() => handleSort(column)}
      className="flex items-center gap-2 hover:text-slate-900 transition font-semibold"
    >
      {label}
      {sortConfig.key === column && (
        <ArrowUpDown size={14} className={sortConfig.direction === "asc" ? "" : "rotate-180"} />
      )}
    </button>
  );

  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm ring-1 ring-slate-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Recent Cases</h2>
          <p className="text-sm text-slate-600 mt-1">
            {isLoading ? "Loading live patients..." : `Showing ${paginatedPatients.length} of ${filteredPatients.length} patients`}
          </p>
        </div>
        <button
          onClick={() => navigate("/active-cases")}
          className="bg-slate-950 text-white px-5 py-3 rounded-3xl hover:bg-slate-800 transition font-semibold text-sm"
        >
          View All Cases
        </button>
      </div>

      {/* SEVERITY FILTER */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {["all", "Critical", "Moderate", "Low"].map((severity) => (
          <button
            key={severity}
            onClick={() => {
              setSeverityFilter(severity);
              setCurrentPage(1);
            }}
            className={`rounded-3xl px-4 py-2 text-sm font-semibold transition ${
              severityFilter === severity
                ? severity === "all"
                  ? "bg-slate-900 text-white"
                  : severity === "Critical"
                  ? "bg-red-600 text-white"
                  : severity === "Moderate"
                  ? "bg-amber-600 text-white"
                  : "bg-emerald-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {severity === "all" ? "All" : severity}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="text-left text-sm text-slate-600 border-b border-slate-200">
              <th className="pb-4 font-semibold">
                <SortHeader column="id" label="ID" />
              </th>
              <th className="pb-4 font-semibold">
                <SortHeader column="name" label="Patient Name" />
              </th>
              <th className="pb-4 font-semibold">
                <SortHeader column="disease" label="Disease" />
              </th>
              <th className="pb-4 font-semibold">
                <SortHeader column="severity" label="Severity" />
              </th>
              <th className="pb-4 font-semibold">
                <SortHeader column="admitted" label="Admitted" />
              </th>
              <th className="pb-4 font-semibold">Age</th>
              <th className="pb-4 text-center font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPatients.map((patient) => (
              <tr
                key={patient.id}
                className="border-b border-slate-100 hover:bg-slate-50 transition cursor-pointer"
              >
                <td className="py-4 text-sm text-slate-700 font-mono">{patient.id}</td>
                <td className="py-4 text-sm font-semibold text-slate-900">{patient.name}</td>
                <td className="py-4 text-sm text-slate-700">{patient.disease}</td>
                <td className="py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      patient.severity === "Critical"
                        ? "bg-red-100 text-red-700"
                        : patient.severity === "Moderate"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {patient.severity}
                  </span>
                </td>
                <td className="py-4 text-sm text-slate-700">{patient.admitted}</td>
                <td className="py-4 text-sm text-slate-700">{patient.age}</td>
                <td className="py-4 text-center">
                  <button
                    onClick={() => navigate(`/patients/${routePatientId(patient.id)}`)}
                    className="inline-flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-full text-sm font-semibold transition"
                  >
                    <Eye size={16} />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!isLoading && paginatedPatients.length === 0 && (
          <div className="py-10 text-center text-sm text-slate-500">
            No live patient alerts yet. New WhatsApp emergency alerts will appear here.
          </div>
        )}
      </div>

      {/* PAGINATION */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-slate-600">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 px-3 py-2 rounded-3xl text-sm font-semibold transition"
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 px-3 py-2 rounded-3xl text-sm font-semibold transition"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
        <select
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
          className="bg-slate-100 text-slate-700 px-3 py-2 rounded-3xl text-sm font-semibold outline-none"
        >
          <option value={10}>10 per page</option>
          <option value={25}>25 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>
    </div>
  );
}
