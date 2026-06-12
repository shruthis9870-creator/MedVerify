export default function ReportViewer() {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg">

      <h2 className="text-2xl font-bold mb-5">
        Medical Reports
      </h2>

      <div className="bg-gray-100 h-40 rounded-2xl flex items-center justify-center text-gray-400">
        PDF Preview
      </div>

      <div className="mt-5 space-y-3">

        <div className="flex justify-between">
          <span>Hemoglobin</span>

          <span className="text-red-500 font-bold">
            LOW
          </span>
        </div>

        <div className="flex justify-between">
          <span>Blood Sugar</span>

          <span className="text-orange-500 font-bold">
            HIGH
          </span>
        </div>

      </div>

    </div>
  );
}