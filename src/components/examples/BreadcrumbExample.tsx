/* Web Example – Breadcrumb Navigation & Course Map */
export function BreadcrumbExample() {
  return (
    <div className="w-full max-w-md mx-auto border rounded-lg bg-white shadow-sm p-4">
      {/* Breadcrumb Navigation */}
      <nav className="text-sm text-gray-600 mb-3 flex flex-wrap items-center gap-1">
        <span className="text-blue-600 hover:underline cursor-pointer">Home</span>
        <span>›</span>
        <span className="text-blue-600 hover:underline cursor-pointer">Courses</span>
        <span>›</span>
        <span className="text-blue-600 hover:underline cursor-pointer">UX Fundamentals</span>
        <span>›</span>
        <span className="font-semibold text-gray-800">Module 2</span>
      </nav>

      {/* Course Map Preview */}
      <div className="border rounded-md p-3 bg-gray-50">
        <h3 className="font-semibold text-sm mb-2">Course Map</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>Module 1: Introduction to UX</span>
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span className="font-medium">Module 2: Navigation & Interaction</span>
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-300 rounded-full" />
            <span>Module 3: Visual Design Principles</span>
          </li>
        </ul>
        <button className="mt-3 w-full text-sm text-blue-600 hover:underline">
          View Full Course Map →
        </button>
      </div>
    </div>
  );
}
