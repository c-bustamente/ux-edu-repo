/* Blended Learning Example – Sync Online & In-Person */
export function BlendedHybridExample() {
  return (
    <div className="max-w-md mx-auto border rounded-lg bg-white shadow-sm p-4">
      <h3 className="font-semibold mb-2">Hybrid Class Schedule</h3>
      <ul className="text-sm space-y-1">
        <li className="flex justify-between">
          <span>Monday – In Person</span>
          <span className="text-gray-500">Room 204</span>
        </li>
        <li className="flex justify-between">
          <span>Wednesday – Online Session</span>
          <span className="text-green-600">Zoom Link</span>
        </li>
        <li className="flex justify-between">
          <span>Friday – Project Discussion</span>
          <span className="text-blue-600">Forum Thread</span>
        </li>
      </ul>
      <button className="mt-3 w-full bg-blue-600 text-white py-1 rounded text-sm hover:bg-blue-700">
        Sync Calendar
      </button>
    </div>
  );
}
