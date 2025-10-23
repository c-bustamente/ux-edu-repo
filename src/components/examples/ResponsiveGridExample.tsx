/* Responsive Example – Fluid Grid & Content Reflow */
export function ResponsiveGridExample() {
  return (
    <div className="w-full max-w-lg mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="border rounded-md bg-white shadow-sm h-24 flex items-center justify-center text-gray-500"
        >
          Card {i}
        </div>
      ))}
    </div>
  );
}
