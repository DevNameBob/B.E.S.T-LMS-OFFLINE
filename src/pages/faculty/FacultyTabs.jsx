// ==============================
// 📄 FacultyTabs.jsx
// ==============================
// Renders tab buttons for the Faculty Dashboard.
// Tabs are conditionally accessible based on user role.
// ==============================

import { LockClosedIcon } from '@heroicons/react/24/solid';
import styles from './FacultyTabs.module.css';

/**
 * @param {string} activeTab - Currently selected tab key
 * @param {function} setActiveTab - Updates selected tab
 * @param {string} role - Current user's role (e.g. 'educator', 'admin')
 */
export default function FacultyTabs({ activeTab, setActiveTab, role }) {
  // 🧭 Define all available tabs with required roles
  const tabs = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'announcements', label: 'Announcements', roles: ['admin', 'announcer'] },
    { key: 'manage-learners', label: 'Manage Learners', roles: ['admin', 'onboarder'] },
    { key: 'manage-lessons', label: 'Manage Lessons', roles: ['admin', 'contentHead'] },
    { key: 'manage-faculty', label: 'Manage Faculty', roles: ['admin'] },
    { key: 'manage-lms', label: 'Manage LMS', roles: ['admin'] },
  ];

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {tabs.map((tab) => {
        const isAccessible = !tab.roles || tab.roles.includes(role);
        const isActive = activeTab === tab.key;

        return (
          <button
            key={tab.key}
            onClick={() => isAccessible && setActiveTab(tab.key)}
            disabled={!isAccessible}
            className={`${styles.tabButton} ${
              isAccessible
                ? isActive
                  ? styles.active
                  : styles.inactive
                : styles.disabled
            }`}
          >
            {/* 🔒 Lock icon for restricted tabs */}
            {!isAccessible && (
              <LockClosedIcon className="w-4 h-4 text-gray-400" />
            )}

            {/* 🏷️ Tab label */}
            {tab.label}

            {/* 💬 Tooltip for restricted tabs */}
            {!isAccessible && tab.roles && (
              <span className={styles.tooltip}>
                Restricted to: {tab.roles.join(', ')}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}