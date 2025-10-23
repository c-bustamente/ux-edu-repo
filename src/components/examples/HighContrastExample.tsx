/* Accessibility Example – Large Text & High Contrast Mode */
export function HighContrastExample() {
  return (
    <div className="max-w-sm mx-auto p-4 border-4 border-black bg-black text-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-2">Lesson: Color Accessibility</h2>
      <p className="text-lg mb-4">
        High contrast improves readability for users with low vision.
      </p>
      <button className="w-full bg-white text-black font-semibold py-2 rounded hover:bg-gray-200">
        Continue Lesson
      </button>
    </div>
  );
}
