import { useState } from 'react';
import ChatRoomList from './ChatRoomList';
import DirectMessageList from './DirectMessageList';
import styles from './ChatSwitcher.module.css';

/**
 * Tab switcher between group chat rooms and direct messages.
 * @param {Function} onSelect - Callback when a room or DM is selected.
 */
export default function ChatSwitcher({ onSelect }) {
  const [activeTab, setActiveTab] = useState('rooms');

  return (
    <div className={styles.container}>
      {/* 🧭 Tab Bar */}
      <div className={styles.tabBar}>
        <button
          className={`${styles.tab} ${activeTab === 'rooms' ? styles.active : ''}`}
          onClick={() => setActiveTab('rooms')}
        >
          💬 Rooms
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'friends' ? styles.active : ''}`}
          onClick={() => setActiveTab('friends')}
        >
          👥 Friends
        </button>
      </div>

      {/* 📄 Tab Content */}
      <div className={styles.content}>
        {activeTab === 'rooms' ? (
          <ChatRoomList onSelect={onSelect} />
        ) : (
          <DirectMessageList onSelect={onSelect} />
        )}
      </div>
    </div>
  );
}