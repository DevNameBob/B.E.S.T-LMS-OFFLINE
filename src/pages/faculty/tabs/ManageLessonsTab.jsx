import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LessonExplorerInline from '../lesson-view/LessonExplorerInline';
import styles from './ManageLessonsTab.module.css';

const USE_BACKEND = false;

const mockLessons = [
  {
    _id: 'lesson1',
    title: 'Algebra Basics',
    subject: 'Math',
    description: 'Intro to algebraic expressions and equations',
    grade: '10',
    schedule: 'Mon & Wed 10:00',
    learners: ['l1', 'l2'],
  },
  {
    _id: 'lesson2',
    title: 'Photosynthesis',
    subject: 'Biology',
    description: 'Understanding plant energy conversion',
    grade: '9',
    schedule: 'Tue 14:00',
    learners: ['l3'],
  },
];

const ManageLessonsTab = () => {
  const [lessons, setLessons] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [form, setForm] = useState({
    title: '',
    subject: '',
    description: '',
    grade: '',
    schedule: '',
  });

  const navigate = useNavigate();

  const fetchLessons = async () => {
    if (!USE_BACKEND) {
      setLessons(mockLessons);
      return;
    }

    try {
      const res = await axios.get('/api/lessons/faculty');
      console.log('📦 Lessons fetched:', res.data);
      setLessons(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch lessons:', err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    const newLesson = {
      ...form,
      _id: Date.now().toString(),
      learners: [],
    };

    try {
      if (!USE_BACKEND) {
        setLessons((prev) => [...prev, newLesson]);
      } else {
        const res = await axios.post('/api/lessons/create', form);
        console.log('✅ Lesson created:', res.data);
        await fetchLessons();
      }

      setForm({ title: '', subject: '', description: '', grade: '', schedule: '' });
      setShowModal(false);
    } catch (err) {
      console.error('❌ Failed to create lesson:', err);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Manage Lessons</h2>
        <button onClick={() => setShowModal(true)} className={styles.createButton}>
          + Create Lesson
        </button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Subject</th>
            <th>Grade</th>
            <th>Schedule</th>
            <th>Learners</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {lessons.map((lesson) => (
            <tr key={lesson._id}>
              <td>{lesson.title}</td>
              <td>{lesson.subject}</td>
              <td>{lesson.grade}</td>
              <td>{lesson.schedule}</td>
              <td>{lesson.learners?.length || 0}</td>
              <td>
                <button onClick={() => setSelectedLesson(lesson)} className={styles.viewButton}>
                  View Structure
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal: Lesson Viewer */}
      {selectedLesson && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button onClick={() => setSelectedLesson(null)} className={styles.closeButton}>✕</button>
            <div className={styles.modalHeader}>
              <h3>{selectedLesson.title}</h3>
              <a
                href={`/faculty/lessons/view/${selectedLesson._id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Full Page ↗
              </a>
            </div>
            <div className={styles.modalContent}>
              <LessonExplorerInline lessonId={selectedLesson._id} />
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Lesson */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button onClick={() => setShowModal(false)} className={styles.closeButton}>✕</button>
            <h3 className={styles.modalTitle}>Create New Lesson</h3>
            <form onSubmit={handleCreate} className={styles.form}>
              {['title', 'subject', 'grade', 'schedule'].map((field) => (
                <input
                  key={field}
                  type="text"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className={styles.input}
                  required
                />
              ))}
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={styles.textarea}
              />
              <button type="submit" className={styles.submitButton}>
                Create Lesson
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageLessonsTab;