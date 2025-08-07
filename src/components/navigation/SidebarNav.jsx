import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './SidebarNav.module.css';

const navItems = [
  { label: 'Dashboard', path: '/faculty/dashboard', icon: '🏠' },
  { label: 'Manage Learners', path: '/faculty/learners', icon: '👨‍🏫' },
  { label: 'Announcements', path: '/faculty/announcements', icon: '📣' },
  { label: 'Lessons', path: '/faculty/lessons', icon: '📚' },
  { label: 'Settings', path: '/faculty/settings', icon: '⚙️' },
];

export default function SidebarNav() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 🔍 Match current path to nav item
  const isActive = (path) => location.pathname.startsWith(path);

  const handleNav = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <aside className={styles.sidebar} aria-label="Sidebar Navigation">
      {/* ☰ Toggle Button */}
      <button
        className={styles.toggle}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Toggle Sidebar"
      >
        ☰
      </button>

      {/* 📚 Navigation List */}
      <nav className={`${styles.nav} ${isOpen ? styles.open : ''}`}>
        <ul className={styles.navList}>
          {navItems.map((item) => (
            <li key={item.path}>
              <button
                className={`${styles.navItem} ${isActive(item.path) ? styles.active : ''}`}
                onClick={() => handleNav(item.path)}
                role="button"
                tabIndex={0}
                aria-pressed={isActive(item.path)}
              >
                <span className={styles.icon}>{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}