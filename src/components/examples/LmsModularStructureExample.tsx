/* LMS Example – Structured Course Modules */
export function LmsModularStructureExample() {
  return (
    <div className="max-w-md mx-auto border rounded-lg bg-white shadow-sm p-4">
      <h3 className="font-semibold text-lg mb-3">Course: Introduction to UX</h3>
      <ul className="space-y-2 text-sm">
        <li className="flex items-center justify-between border p-2 rounded-md">
          <span>Module 1 – Foundations of UX</span>
          <span className="text-green-600 font-medium">✓ Completed</span>
        </li>
        <li className="flex items-center justify-between border p-2 rounded-md bg-blue-50">
          <span>Module 2 – Usability Heuristics</span>
          <span className="text-blue-600 font-medium">In Progress</span>
        </li>
        <li className="flex items-center justify-between border p-2 rounded-md">
          <span>Module 3 – Visual Design Basics</span>
          <span className="text-gray-400">Locked</span>
        </li>
      </ul>
      <div className="mt-3 text-xs text-gray-600">Sequential Progress Enabled</div>
    </div>
  );
}
