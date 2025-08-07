import React, { useState } from 'react';
import AssessmentBuilderModal from '../modals/AssessmentBuilderModal';

const USE_BACKEND = false;

/**
 * Modal for editing a lesson's title, summary, and assessment.
 * @param {Object} initialData - Existing lesson data.
 * @param {Function} onSubmit - Callback to save changes.
 * @param {Function} onClose - Callback to close modal.
 */
export default function LessonEditorModal({ initialData = {}, onSubmit, onClose }) {
  const [title, setTitle] = useState(initialData.title || '');
  const [summary, setSummary] = useState(initialData.summary || '');
  const [assessment, setAssessment] = useState(initialData.assessment || []);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);

  // 💾 Save handler
  const handleSave = () => {
    const updatedLesson = {
      ...initialData,
      title,
      summary,
      assessment,
    };

    console.log('💾 Saving lesson:', updatedLesson);

    // 🧪 Offline or backend submission
    onSubmit(updatedLesson);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded max-w-xl w-full space-y-4">
        <h2 className="text-lg font-semibold">Edit Lesson</h2>

        {/* 📝 Title Input */}
        <input
          type="text"
          placeholder="Lesson Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />

        {/* 📄 Summary Input */}
        <textarea
          placeholder="Summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          rows={3}
        />

        {/* 📋 Assessment Modal Trigger */}
        <button
          type="button"
          onClick={() => setShowAssessmentModal(true)}
          className="text-sm text-indigo-600 hover:underline"
        >
          ✍️ Edit Assessment
        </button>

        {/* 🧩 Assessment Builder */}
        <AssessmentBuilderModal
          open={showAssessmentModal}
          initialData={assessment}
          onClose={() => setShowAssessmentModal(false)}
          onSave={setAssessment}
        />

        {/* ✅ Action Buttons */}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded">Save</button>
        </div>
      </div>
    </div>
  );
}