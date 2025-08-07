const USE_BACKEND = false;

/**
 * Displays a chapter's title, summary, rich HTML content, and assessment preview.
 * @param {Object} chapter - Chapter data object.
 */
export default function ChapterContent({ chapter }) {
  if (!chapter) {
    // Fallback if no chapter is selected
    return <p className="text-gray-500">No chapter selected.</p>;
  }

  return (
    <div className="space-y-6">
      {/* 📘 Chapter Title */}
      <h2 className="text-xl font-semibold">{chapter.title}</h2>

      {/* 📄 Summary */}
      <p className="text-gray-700">{chapter.summary || 'No summary provided.'}</p>

      {/* 📝 Rich HTML Content */}
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: chapter.content || '<p>No content yet.</p>' }}
      />

      {/* 📋 Assessment Preview */}
      {chapter.assessment?.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold text-gray-800">📋 Assessment</h3>
          <ul className="list-disc pl-5 text-sm text-gray-700">
            {chapter.assessment.map((q, idx) => (
              <li key={idx}>
                <strong>Q{idx + 1} ({q.type}):</strong> {q.question}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ▶️ CTA Button */}
      <button className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
        Start Chapter
      </button>
    </div>
  );
}