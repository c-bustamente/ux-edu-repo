/* Tech-Savvy Audience Example – Power Shortcuts & Advanced Filters */
export function TechSavvyShortcutsExample() {
  return (
    <div className="max-w-md mx-auto border rounded-lg bg-white shadow-sm p-4">
      <h3 className="font-semibold mb-2">Quick Command Palette</h3>
      <input
        className="w-full border p-2 rounded-md text-sm mb-2"
        placeholder="Type a command (e.g., Jump to Module)"
      />
      <ul className="text-sm border rounded-md divide-y">
        <li className="p-2 hover:bg-gray-50">Go to Dashboard → Ctrl + D</li>
        <li className="p-2 hover:bg-gray-50">Export Progress → Ctrl + E</li>
        <li className="p-2 hover:bg-gray-50">Open Filter Panel → Ctrl + F</li>
      </ul>
      <div className="text-xs text-gray-500 mt-2">Supports keyboard shortcuts & regex filters</div>
    </div>
  );
}
