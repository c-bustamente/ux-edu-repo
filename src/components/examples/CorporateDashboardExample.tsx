/* Corporate Training Example – Progress Dashboard */
export function CorporateDashboardExample() {
  return (
    <div className="max-w-md mx-auto border rounded-lg bg-white shadow-sm p-4">
      <h3 className="font-semibold text-lg mb-3">Compliance Training Progress</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Employee Completion</span>
          <span className="font-medium text-green-600">87%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded">
          <div className="h-2 bg-green-500 rounded" style={{ width: "87%" }}></div>
        </div>
        <div className="flex justify-between">
          <span>Certificates Issued</span>
          <span className="font-medium text-blue-600">452</span>
        </div>
      </div>
      <button className="mt-3 w-full bg-blue-600 text-white py-1 rounded text-sm hover:bg-blue-700">
        Download Report CSV
      </button>
    </div>
  );
}
