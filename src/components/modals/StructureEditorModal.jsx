import React, { useState, useEffect } from 'react';
import styles from './Modal.module.css'; // ✅ Shared modal styles

export default function StructureEditorModal({
  type = 'topic',
  mode = 'create',
  initialData = {},
  onClose,
  onSubmit
}) {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [xp, setXp] = useState(0);
  const [questions, setQuestions] = useState([
    { question: '', options: ['', '', ''], correctIndex: 0 }
  ]);

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setTitle(initialData.title || '');
      setSummary(initialData.summary || '');
      setXp(initialData.xp || 0);
      setQuestions(
        initialData.assessment?.length
          ? initialData.assessment
          : [{ question: '', options: ['', '', ''], correctIndex: 0 }]
      );
    }
  }, [initialData, mode]);

  const handleSubmit = () => {
    if (!title.trim() || !summary.trim()) {
      alert('Please enter both title and summary');
      return;
    }

    const filteredAssessment = questions.filter(q =>
      q.question && q.options.every(opt => opt)
    );

    onSubmit({
      title,
      summary,
      xp: Number(xp) || 0,
      assessment: filteredAssessment
    });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.heading}>
          {mode === 'edit' ? `Edit ${type}` : `Add New ${type}`}
        </h2>

        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder={`${type} title`}
          className={styles.input}
        />

        <textarea
          value={summary}
          onChange={e => setSummary(e.target.value)}
          placeholder="Summary"
          className={styles.textarea}
          rows={3}
        />

        <div className="flex items-center gap-2">
          <label className="text-sm">XP:</label>
          <input
            type="number"
            value={xp}
            onChange={e => setXp(e.target.value)}
            className={`${styles.input} w-20 px-2 py-1`}
            min="0"
          />
        </div>

        <details className="mt-2">
          <summary className="font-semibold cursor-pointer text-indigo-600">
            Optional Quiz
          </summary>
          <div className="mt-2 space-y-3">
            {questions.map((q, idx) => (
              <div key={idx} className="border p-3 rounded bg-gray-50">
                <input
                  value={q.question}
                  onChange={e => {
                    const updated = [...questions];
                    updated[idx].question = e.target.value;
                    setQuestions(updated);
                  }}
                  placeholder={`Question ${idx + 1}`}
                  className={styles.input}
                />
                {q.options.map((opt, optIdx) => (
                  <div key={optIdx} className="flex items-center gap-2 mb-1">
                    <input
                      value={opt}
                      onChange={e => {
                        const updated = [...questions];
                        updated[idx].options[optIdx] = e.target.value;
                        setQuestions(updated);
                      }}
                      placeholder={`Option ${optIdx + 1}`}
                      className={`${styles.input} flex-1`}
                    />
                    <label className="text-sm">
                      <input
                        type="radio"
                        name={`correct-${idx}`}
                        checked={q.correctIndex === optIdx}
                        onChange={() => {
                          const updated = [...questions];
                          updated[idx].correctIndex = optIdx;
                          setQuestions(updated);
                        }}
                      />
                      Correct
                    </label>
                  </div>
                ))}
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setQuestions([
                  ...questions,
                  { question: '', options: ['', '', ''], correctIndex: 0 }
                ])
              }
              className="text-green-600 hover:underline text-sm"
            >
              Add another question
            </button>
          </div>
        </details>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className={`${styles.button} ${styles.secondary}`}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={styles.button}
          >
            {mode === 'edit' ? 'Update' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}