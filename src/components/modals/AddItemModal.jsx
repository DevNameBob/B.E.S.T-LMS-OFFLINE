import React, { useState } from 'react';
import styles from './Modal.module.css'; // Optional shared styles

/**
 * Modal for adding a single item (e.g. tag, label, name).
 * @param {string} title - Modal heading.
 * @param {string} placeholder - Input placeholder.
 * @param {Function} onClose - Closes the modal.
 * @param {Function} onSubmit - Submits the entered value.
 */
export default function AddItemModal({ title, placeholder, onClose, onSubmit }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSubmit(value);
    setValue('');
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button onClick={onClose} className={styles.closeButton}>✕</button>
        <h3 className={styles.heading}>{title}</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={styles.input}
            required
          />
          <button type="submit" className={styles.button}>Add</button>
        </form>
      </div>
    </div>
  );
}