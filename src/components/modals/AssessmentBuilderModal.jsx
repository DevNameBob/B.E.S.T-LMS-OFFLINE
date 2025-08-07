import React, { useState, useEffect } from 'react';
import styles from './Modal.module.css'; // Optional shared styles

const questionTypes = ['multipleChoice', 'written', 'scenario'];

/**
 * Modal for building an assessment with multiple question types.
 * @param {boolean} open - Controls visibility.
 * @param {Function} onClose - Closes the modal.
 * @param {Function} onSave - Saves the assessment list.
 * @param {Array} initialData - Preloaded questions.
 */
export default function AssessmentBuilderModal({
  open,
  onClose,
  onSave,
  initialData = [],
}) {
  const [assessmentList, setAssessmentList] = useState([]);
  const [type, setType] = useState('multipleChoice');
  const [questionData, setQuestionData] = useState({
    question: '',
    options: ['', '', ''],
    correctIndex: 0,
    wordLimit: 150,
    imageUrl: '',
  });

  useEffect(() => {
    if (open) {
      setAssessmentList(initialData);
      setQuestionData({
        question: '',
        options: ['', '', ''],
        correctIndex: 0,
        wordLimit: 150,
        imageUrl: '',
      });
    }
  }, [open, initialData]);

  const isQuestionFilled = () => {
    const trimmed = questionData.question.trim();
    if (!trimmed) return false;
    if (type === 'multipleChoice') {
      return questionData.options.some(opt => opt.trim() !== '');
    }
    return true;
  };

  const handleAddQuestion = () => {
    if (!isQuestionFilled()) return;
    setAssessmentList(prev => [...prev, { type, ...questionData }]);
    setQuestionData({
      question: '',
      options: ['', '', ''],
      correctIndex: 0,
      wordLimit: 150,
      imageUrl: '',
    });
  };

  const handleSave = () => {
    const hasPendingQuestion = isQuestionFilled();
    const finalList = hasPendingQuestion
      ? [...assessmentList, { type, ...questionData }]
      : assessmentList;

    onSave(finalList);
    onClose();
  };

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.heading}>📋 Build Assessment</h2>

        {/* Question Type */}
        <label className="block text-sm font-medium">Question Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={styles.select}
        >
          {questionTypes.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>

        {/* Question Prompt */}
        <label className="block text-sm font-medium mt-2">Question Prompt</label>
        <input
          type="text"
          value={questionData.question}
          onChange={(e) =>
            setQuestionData({ ...questionData, question: e.target.value })
          }
          className={styles.input}
        />

        {/* Multiple Choice Options */}
        {type === 'multipleChoice' && (
          <>
            {questionData.options.map((opt, i) => (
              <div key={i} className="mt-2">
                <label className="text-sm block font-medium">Option {i + 1}</label>
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => {
                    const updated = [...questionData.options];
                    updated[i] = e.target.value;
                    setQuestionData({ ...questionData, options: updated });
                  }}
                  className={styles.input}
                />
              </div>
            ))}
            <label className="block text-sm font-medium mt-2">Correct Answer</label>
            <select
              value={questionData.correctIndex}
              onChange={(e) =>
                setQuestionData({
                  ...questionData,
                  correctIndex: parseInt(e.target.value),
                })
              }
              className={styles.select}
            >
              {questionData.options.map((_, i) => (
                <option key={i} value={i}>Option {i + 1}</option>
              ))}
            </select>
          </>
        )}

        {/* Written Response */}
        {type === 'written' && (
          <>
            <label className="block text-sm font-medium mt-2">Word Limit</label>
            <input
              type="number"
              value={questionData.wordLimit}
              onChange={(e) =>
                setQuestionData({
                  ...questionData,
                  wordLimit: parseInt(e.target.value),
                })
              }
              className={styles.input}
            />
          </>
        )}

        {/* Scenario */}
        {type === 'scenario' && (
          <>
            <label className="block text-sm font-medium mt-2">Image URL</label>
            <input
              type="text"
              value={questionData.imageUrl}
              onChange={(e) =>
                setQuestionData({
                  ...questionData,
                  imageUrl: e.target.value,
                })
              }
              className={styles.input}
            />
            <label className="block text-sm font-medium mt-2">Scenario Description</label>
            <textarea
              value={questionData.question}
              onChange={(e) =>
                setQuestionData({
                  ...questionData,
                  question: e.target.value,
                })
              }
              className={styles.textarea}
              rows={3}
            />
          </>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center mt-4">
          <button
            type="button"
            onClick={handleAddQuestion}
            className="text-green-600 hover:underline text-sm"
          >
            ➕ Add Question
          </button>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
              Cancel
            </button>
            <button onClick={handleSave} className={styles.button}>
              ✅ Save Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}