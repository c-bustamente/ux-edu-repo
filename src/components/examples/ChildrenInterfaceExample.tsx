/* Children Audience Example – Playful, Large Touch Targets */
export function ChildrenInterfaceExample() {
  return (
    <div className="max-w-xs mx-auto border-4 border-yellow-300 rounded-2xl p-4 bg-yellow-50 text-center shadow-md">
      <h3 className="text-lg font-bold mb-3 text-yellow-800">Shapes Adventure</h3>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {["🔵", "🟥", "🟢"].map((shape, i) => (
          <button
            key={i}
            className="text-3xl bg-white rounded-full shadow p-3 hover:scale-110 transition-transform"
          >
            {shape}
          </button>
        ))}
      </div>
      <button className="bg-green-500 text-white px-3 py-2 rounded-full text-sm font-semibold hover:bg-green-600">
        Next Level →
      </button>
    </div>
  );
}
