// ==============================
// 📄 Overview.jsx
// ==============================
// This component displays a performance summary for faculty,
// including metrics like rating, hours taught, and feedback.
// ==============================

import styles from './Overview.module.css';

/**
 * Overview displays a full-width performance summary for faculty.
 * It includes:
 * - A grid of key metrics (rating, hours, engagement, etc.)
 * - A section for recent learner feedback
 */
export default function Overview() {
  // 📊 Performance metrics to display in cards
  const metrics = [
    {
      label: 'Learner Rating',
      value: '4.6 / 5',
      icon: '⭐',
      description: 'Based on 87 learner reviews this term.',
    },
    {
      label: 'Hours Taught',
      value: '18 hrs',
      icon: '⏱️',
      description: 'Total classroom hours this week.',
    },
    {
      label: 'Homework Graded',
      value: '42',
      icon: '📝',
      description: 'Assignments reviewed this week.',
    },
    {
      label: 'Engagement Score',
      value: '91%',
      icon: '📈',
      description: 'Calculated from feedback, attendance, and activity.',
    },
  ];

  // 💬 Recent learner feedback quotes
  const feedback = [
    '“Explains concepts clearly and makes class fun!”',
    '“Would love more visual examples in lessons.”',
    '“Very supportive and always available for questions.”',
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Overview</h2>

      {/* 📊 Metrics Grid */}
      <div className={styles.metricsGrid}>
        {metrics.map((metric, index) => (
          <div key={index} className={styles.card}>
            <div className="text-3xl mb-2">{metric.icon}</div>
            <div className="text-2xl font-bold text-indigo-700">{metric.value}</div>
            <div className="text-sm font-medium text-gray-700 mt-1">{metric.label}</div>
            <p className="text-xs text-gray-500 mt-2">{metric.description}</p>
          </div>
        ))}
      </div>

      {/* 💬 Feedback Highlights */}
      <div className={styles.feedbackBox}>
        <h3 className={styles.feedbackTitle}>Recent Learner Feedback</h3>
        <ul className={styles.feedbackList}>
          {feedback.map((quote, i) => (
            <li key={i} className={styles.feedbackItem}>
              “{quote}”
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}