// ==============================
// 📄 AnnouncementsTab.jsx
// ==============================
// Faculty-side tabbed interface for announcements and chat.
// Includes responsive tab toggle, announcement CRUD, and chat views.
// ==============================

import { useState, useEffect } from 'react';
import api, { USE_BACKEND } from '../../../api/axiosInstance';

// 🧩 Local Components
import CreateAnnouncementForm from '../../../components/announcements/CreateAnnouncementForm/CreateAnnouncementForm';
import AnnouncementList from '../../../components/announcements/AnnouncementList';
import ChatRoomList from '../../../components/chat/ChatRoomList';
import ChatRoomView from '../../../components/chat/ChatRoomView';
import DirectMessageList from '../../../components/chat/DirectMessageList';
import DirectMessageView from '../../../components/chat/DirectMessageView';

import styles from './AnnouncementsTab.module.css';

export default function AnnouncementsTab() {
  // 🧑 Mock user (replace with real auth context)
  const user = {
    _id: '123',
    name: 'John Doe',
    role: 'faculty', // or 'learner'
  };

  // 🧠 State Management
  const [activeTab, setActiveTab] = useState('announcements');
  const [chatMode, setChatMode] = useState('rooms');
  const [selectedChatRoom, setSelectedChatRoom] = useState(null);
  const [selectedDMRoom, setSelectedDMRoom] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔁 Tab switch resets chat selections
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedChatRoom(null);
    setSelectedDMRoom(null);
  };

  // 🔙 Back from chat views
  const handleBack = () => {
    setSelectedChatRoom(null);
    setSelectedDMRoom(null);
  };

  // 📡 Fetch announcements from API or mock
  const fetchAnnouncements = async () => {
    try {
      const res = await api.get('/announcements');
      setAnnouncements(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <div className={styles.container}>
      {/* 💻 Pill-style tab bar (always visible) */}
      <div className={styles.tabBar}>
        <button
          className={`${styles.tabButton} ${activeTab === 'announcements' ? styles.activeTab : ''}`}
          onClick={() => handleTabChange('announcements')}
        >
          📣 Announcements
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'chat' ? styles.activeTab : ''}`}
          onClick={() => handleTabChange('chat')}
        >
          💬 Chat
        </button>
      </div>

      {/* 📣 Announcements View */}
      {activeTab === 'announcements' ? (
        <>
          <div className={styles.header}>
            <h2 className={styles.title}>📣 Announcements</h2>
            {user.role === 'faculty' && (
              <button
                onClick={() => setShowForm((prev) => !prev)}
                className={styles.button}
              >
                {showForm ? '❌ Cancel' : '➕ Create'}
              </button>
            )}
          </div>

          {showForm && (
            <div className={styles.section}>
              <CreateAnnouncementForm user={user} onCreated={fetchAnnouncements} />
            </div>
          )}

          {loading ? (
            <p>Loading announcements...</p>
          ) : (
            <>
              <AnnouncementList announcements={announcements} />
              {!USE_BACKEND && (
                <p className="text-sm text-gray-500 italic mt-4">
                  🧪 Offline mode: announcements are stored locally and won’t persist across devices.
                </p>
              )}
            </>
          )}
        </>
      ) : (
        <>
          {/* 💬 Chat Sub-Tabs: Rooms vs Friends */}
          <div className={styles.subTabBar}>
            <button
              className={`${styles.subTab} ${chatMode === 'rooms' ? styles.active : ''}`}
              onClick={() => {
                setChatMode('rooms');
                setSelectedChatRoom(null);
                setSelectedDMRoom(null);
              }}
            >
              💬 Rooms
            </button>
            <button
              className={`${styles.subTab} ${chatMode === 'friends' ? styles.active : ''}`}
              onClick={() => {
                setChatMode('friends');
                setSelectedChatRoom(null);
                setSelectedDMRoom(null);
              }}
            >
              👥 Friends
            </button>
          </div>

          {/* 🧩 Chat Views */}
          {chatMode === 'rooms' ? (
            selectedChatRoom ? (
              <ChatRoomView room={selectedChatRoom} user={user} onBack={handleBack} />
            ) : (
              <ChatRoomList onSelect={setSelectedChatRoom} />
            )
          ) : selectedDMRoom ? (
            <>
              <div className={styles.chatHeader}>
                <button onClick={handleBack} className={styles.backButton}>← Back</button>
                <h3 className={styles.chatTitle}>Direct Message</h3>
              </div>
              <DirectMessageView roomId={selectedDMRoom} currentUserId={user._id} />
            </>
          ) : (
            <DirectMessageList onSelect={setSelectedDMRoom} />
          )}
        </>
      )}
    </div>
  );
}