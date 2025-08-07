import { useEffect, useState } from 'react';
import api, { USE_BACKEND } from '../../api/axiosInstance';
import styles from './DirectMessageView.module.css';

export default function DirectMessageView({ roomId, currentUserId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await api.get(`/dm/messages/${roomId}`);
        setMessages(res.data);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();
  }, [roomId]);

  async function sendMessage() {
    if (!input.trim()) return;

    const newMsg = {
      roomId,
      senderId: currentUserId,
      content: input,
    };

    try {
      const res = await api.post('/dm/messages', newMsg);
      setMessages((prev) => [...prev, res.data]);
      setInput('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  }

  if (loading) return <div className={styles.loading}>Loading conversation...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.messages}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`${styles.bubble} ${
              msg.senderId === currentUserId ? styles.outgoing : styles.incoming
            }`}
          >
            <div className={styles.text}>{msg.content}</div>
            <div className={styles.timestamp}>{formatTime(msg.timestamp)}</div>
          </div>
        ))}
      </div>

      <div className={styles.inputBar}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      {!USE_BACKEND && (
        <p className="text-sm text-gray-500 italic mt-2">
          🧪 Offline mode: messages are stored locally and won’t sync across devices.
        </p>
      )}
    </div>
  );
}

function formatTime(iso) {
  const date = new Date(iso);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}