/* Virtual Classroom Example – Real-Time Collaboration */
export function RealTimeCollabExample() {
  return (
    <div className="max-w-md mx-auto border rounded-lg bg-white shadow-sm p-4">
      <div className="flex justify-between mb-3">
        <h3 className="font-semibold text-lg">Live Whiteboard</h3>
        <span className="text-sm text-green-600">5 Participants</span>
      </div>
      <div className="h-32 border border-dashed rounded-md flex items-center justify-center text-gray-400">
        Drawing Area
      </div>
      <div className="flex justify-between mt-3 text-sm">
        <button className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">Shapes</button>
        <button className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">Text</button>
        <button className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">Colors</button>
      </div>
    </div>
  );
}
