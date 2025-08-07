import styles from './ChatRoomList.module.css'; // ✅ Reuse room styles

// 🧪 Mock direct messages for offline mode
const mockDMs = [
  {
    id: 'dm1',
    name: 'Thabo M.',
    avatar: '/avatars/thabo.png',
    lastMessage: 'See you at 10am!',
    timestamp: '08:45',
  },
  {
    id: 'dm2',
    name: 'Zanele K.',
    avatar: '/avatars/zanele.png',
    lastMessage: 'Got the notes, thanks 🙌',
    timestamp: 'Yesterday',
  },
  {
    id: 'dm3',
    name: 'Mr. Dlamini',
    avatar: '/avatars/dlamini.png',
    lastMessage: 'Assignment feedback uploaded.',
    timestamp: 'Mon',
  },
];

/**
 * Displays a list of direct message threads.
 * @param {Function} onSelect - Callback when a DM is selected.
 */
export default function DirectMessageList({ onSelect }) {
  return (
    <div className={styles.container}>
      <ul className={styles.roomList}>
        {mockDMs.map(dm => (
          <li
            key={dm.id}
            className={styles.roomItem}
            onClick={() => onSelect(dm.id)}
          >
            {/* 🖼️ Avatar */}
            <img src={dm.avatar} alt={dm.name} className={styles.avatar} />

            {/* 📝 DM Content */}
            <div className={styles.roomContent}>
              <div className={styles.roomName}>{dm.name}</div>
              <div className={styles.roomDescription}>{dm.lastMessage}</div>
            </div>

            {/* 🕒 Timestamp */}
            <div className={styles.timestamp}>{dm.timestamp}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}