/* MOOC Example – Discussion Forum & Peer Interaction */
export function MoocForumExample() {
  return (
    <div className="max-w-md mx-auto border rounded-lg bg-white shadow-sm p-4">
      <h3 className="font-semibold mb-2">Discussion: How to Apply UX Heuristics</h3>
      <div className="border-t border-b py-2 text-sm space-y-2">
        <p>
          <span className="font-semibold text-blue-700">Ana:</span> I used consistency
          principles to improve navigation!
        </p>
        <p>
          <span className="font-semibold text-blue-700">Tom:</span> Peer review helped me
          refine feedback forms.
        </p>
      </div>
      <input
        className="mt-3 w-full border rounded-md p-2 text-sm"
        placeholder="Add a comment..."
      />
      <button className="mt-2 w-full bg-blue-600 text-white py-1 rounded text-sm hover:bg-blue-700">
        Post Reply
      </button>
    </div>
  );
}
