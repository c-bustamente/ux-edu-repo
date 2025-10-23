/* Web Example – Faceted Search & Autocomplete */
export function FacetedSearchExample() {
  return (
    <div className="flex gap-3 w-full max-w-lg p-4 border rounded-lg bg-white shadow-sm">
      {/* Filters */}
      <aside className="w-1/3 border-r pr-3 text-sm">
        <h4 className="font-semibold mb-2">Filter by</h4>
        <label className="block"><input type="checkbox" className="mr-1" /> Videos</label>
        <label className="block"><input type="checkbox" className="mr-1" /> PDFs</label>
        <label className="block"><input type="checkbox" className="mr-1" /> Exercises</label>
      </aside>
      {/* Results */}
      <div className="flex-1">
        <input
          className="w-full border p-2 rounded-md text-sm mb-2"
          placeholder="Search courses..."
        />
        <ul className="text-sm space-y-1">
          <li className="border p-2 rounded-md hover:bg-gray-50">Accessibility Basics</li>
          <li className="border p-2 rounded-md hover:bg-gray-50">Intro to UX Laws</li>
        </ul>
      </div>
    </div>
  );
}
