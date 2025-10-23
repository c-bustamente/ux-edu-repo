/* Mobile Example – Bottom Navigation for Primary Actions */
export function MobileBottomNavExample() {
  return (
    <div className="w-full max-w-xs mx-auto bg-white border rounded-lg shadow-sm overflow-hidden">
      <div className="h-40 flex items-center justify-center text-gray-400 text-sm">
        Course Content Area
      </div>
      <nav className="flex justify-around border-t bg-gray-50 p-2">
        {["Home", "Courses", "Progress", "Profile"].map((item, i) => (
          <button
            key={i}
            className="flex flex-col items-center text-xs text-gray-600 hover:text-blue-600"
          >
            <div className="w-6 h-6 rounded-full bg-gray-200 mb-1" />
            {item}
          </button>
        ))}
      </nav>
    </div>
  );
}
