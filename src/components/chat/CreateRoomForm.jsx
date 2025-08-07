import { useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import styles from './CreateRoomForm.module.css';

const USE_BACKEND = false;

export default function CreateRoomForm({ user, onCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [access, setAccess] = useState(['shared']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const payload = {
      name,
      description,
      access,
      createdBy: user?._id || 'offline-user',
    };

    if (!USE_BACKEND) {
      const mockRoom = {
        _id: Date.now().toString(),
        ...payload,
      };

      const stored = localStorage.getItem('mockRooms');
      const updated = stored ? JSON.parse(stored).concat(mockRoom) : [mockRoom];
      localStorage.setItem('mockRooms', JSON.stringify(updated));

      onCreated?.(mockRoom);
      resetForm();
      setIsLoading(false);
      return;
    }

    try {
      const res = await axiosInstance.post('/chat/rooms', payload);
      onCreated?.(res.data);
      resetForm();
    } catch (err) {
      console.error('❌ Failed to create room:', err);
      setError('Failed to create room. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setAccess(['shared']);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3>Create New Group</h3>

      {error && <p className={styles.error}>{error}</p>}

      <input
        type="text"
        placeholder="Room name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        disabled={isLoading}
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        disabled={isLoading}
      />

      <label>
        Access:
        <select
          value={access[0]}
          onChange={(e) => setAccess([e.target.value])}
          disabled={isLoading}
        >
          <option value="shared">Shared</option>
          <option value="faculty">Faculty Only</option>
          <option value="learner">Learner Only</option>
        </select>
      </label>

      <button type="submit" disabled={isLoading}>
        {isLoading ? (
          <span className={styles.spinner} aria-label="Loading" />
        ) : (
          'Create'
        )}
      </button>
    </form>
  );
}