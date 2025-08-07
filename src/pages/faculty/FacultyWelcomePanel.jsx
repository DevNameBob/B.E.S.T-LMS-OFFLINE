// ==============================
// 📄 FacultyWelcomePanel.jsx
// ==============================
// This component renders the welcome panel at the top of the Faculty Dashboard.
// It includes a rotating tab panel (Reminders, Announcements, Timetable),
// and uses a gradient background block for styling.
// ==============================

import { useNavigate } from 'react-router-dom';

// 🧠 Custom hook to auto-cycle through tabs (like a carousel)
import useAutoTab from '../../hooks/useAutoTab';

// 🎨 Reusable gradient background wrapper
import GradientBlock from '../../components/GradientBlock';

// 🎨 Styles
import styles from './FacultyWelcomePanel.module.css';

/**
 * Welcome panel for faculty users.
 * Displays rotating announcements and a warm greeting.
 *
 * @param {string} name - Faculty member's name
 * @param {string} title - Faculty title (e.g. Mr., Ms., Dr.)
 */
export default function FacultyWelcomePanel({ name = 'WhoWho', title = 'Mr.' }) {
  const navigate = useNavigate();

  // 🧭 Tabs to rotate through
  const tabs = ['Reminders', 'Announcements', 'Timetable'];

  // 🔄 Active tab index, auto-cycled by custom hook
  const [activeTab, setActiveTab] = useAutoTab(tabs.length);

  // 📢 Content for each tab
  const announcements = {
    Reminders: [
      '🗓️ Staff meeting – Friday @ 14:00',
      '📥 Submit term marks by Thursday',
      '📌 Grade 12 mock review due next week',
    ],
    Announcements: [
      '📢 Exam schedule released',
      '📢 Grade 9 trip confirmed',
      '📢 New library hours posted',
    ],
    Timetable: [
      '🕒 08:00 – Grade 10 Math',
      '🕒 09:30 – Grade 11 Physics',
      '🕒 11:00 – Grade 9 Life Sciences',
    ],
  };

  // 🚀 Navigate to relevant page when an item is clicked
  const handleClick = () => {
    if (tabs[activeTab] === 'Timetable') {
      navigate('/timetable');
    } else {
      navigate('/notifications');
    }
  };

  return (
    <GradientBlock>
      <div className={styles.panel}>
        <div className="w-full max-w-7xl">
          {/* 👋 Welcome Message */}
          <h1 className={styles.heading}>
            Welcome Back, {title} {name}
          </h1>
          <p className={styles.subtext}>
            Here’s what’s happening in your school day today:
          </p>

          {/* 🧾 Sliding Announcement Panel */}
          <div className={styles.announcementBox}>
            <div className="space-y-3">
              {announcements[tabs[activeTab]].map((item, index) => (
                <div
                  key={index}
                  onClick={handleClick}
                  className={styles.announcementItem}
                >
                  <p className="text-sm text-gray-800">{item}</p>
                </div>
              ))}
            </div>

            {/* 🧭 Tab Navigation */}
            <div className={styles.tabNav}>
              {tabs.map((tab, index) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(index)}
                  className={`${styles.tabButton} ${
                    index === activeTab ? styles.activeTab : styles.inactiveTab
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </GradientBlock>
  );
}