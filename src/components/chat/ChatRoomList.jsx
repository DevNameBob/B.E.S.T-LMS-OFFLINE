import { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import styles from './ChatRoomList.module.css';
import CreateRoomForm from './CreateRoomForm';
import { useAuth } from '../../context/AuthContext';

const USE_BACKEND = false;

const mockInitialRooms = [
  {
    _id: 'r1',
    name: 'Math Department',
    description: 'Discuss curriculum updates',
  },
];

export default function ChatRoomList({ onSelect }) {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchRooms = async () => {
    if (!USE_BACKEND) {
      const stored = localStorage.getItem('mockRooms');
      setRooms(stored ? JSON.parse(stored) : mockInitialRooms);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get('/chat/rooms');
      setRooms(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch chat rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleCreatedRoom = (newRoom) => {
    const updated = [...rooms, newRoom];
    setRooms(updated);
    setShowForm(false);

    if (!USE_BACKEND) {
      localStorage.setItem('mockRooms', JSON.stringify(updated));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.createButton} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '➕ Create Group'}
        </button>
      </div>

      {showForm && user && (
        <CreateRoomForm user={user} onCreated={handleCreatedRoom} />
      )}

      {loading ? (
        <p>Loading rooms...</p>
      ) : rooms.length === 0 ? (
        <p className={styles.empty}>No rooms available. Create one to get started!</p>
      ) : (
        <ul className={styles.roomList}>
          {rooms.map((room) => (
            <li key={room._id} className={styles.roomItem} onClick={() => onSelect(room)}>
              <div className={styles.avatar}>
                {room.name.charAt(0).toUpperCase()}
              </div>
              <div className={styles.roomContent}>
                <div className={styles.roomName}>{room.name}</div>
                <div className={styles.roomDescription}>
                  {room.description || 'No description'}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}