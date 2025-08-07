import { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import styles from './ChatRoomView.module.css';

/**
 * Displays messages in a selected chat room and allows sending new ones.
 * @param {Object} room - Selected chat room.
 * @param {Object} user - Current user.
 * @param {Function} onBack - Callback to return to room list.
 */
export default function ChatRoomView({ room, user, onBack }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);

  // 📥 Fetch messages for the selected room
  const fetchMessages = async () => {
    try {
      const res = await api.get(`/chat/rooms/${room._id}/messages`);
      setMessages(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  };

  // 📤 Send a new message
  const sendMessage = async () => {
    if (!text.trim()) return;
    try {
      const res = await api.post(`/chat/rooms/${room._id}/messages`, {
        senderId: user._id,
        senderName: user.name,
        text,
      });
      setMessages((prev) => [...prev, res.data]);
      setText('');
    } catch (err) {
      console.error('❌ Failed to send message:', err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [room._id]);

  return (
    <div className={styles.container}>
      {/* 🔙 Header with Back Button */}
      <div className={styles.header}>
        <button onClick={onBack} className={styles.backButton}>← Back</button>
        <h3>{room.name}</h3>
      </div>

      {/* 💬 Message List */}
      <div className={styles.messages}>
        {loading ? (
          <p>Loading messages...</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`${styles.message} ${
                msg.senderId === user._id ? styles.self : styles.other
              }`}
            >
              <div className={styles.sender}>{msg.senderName}</div>
              <div className={styles.text}>{msg.text}</div>
            </div>
          ))
        )}
      </div>

      {/* 📝 Input Bar */}
      <div className={styles.inputBar}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className={styles.input}
        />
        <button onClick={sendMessage} className={styles.sendButton}>Send</button>
      </div>
    </div>
  );
}