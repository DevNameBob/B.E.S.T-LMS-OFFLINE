import React from 'react';
import CreateRoomForm from './CreateRoomForm';

/**
 * Modal wrapper for creating a new chat room.
 * @param {Function} onClose - Closes the modal.
 * @param {Function} onRoomCreated - Callback after room creation.
 */
const CreateRoomModal = ({ onClose, onRoomCreated }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
        {/* ❌ Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        {/* 📝 Modal Title */}
        <h2 className="text-lg font-semibold mb-4">Create New Chat Room</h2>

        {/* 🧩 Embedded Form */}
        <CreateRoomForm onRoomCreated={onRoomCreated} onClose={onClose} />
      </div>
    </div>
  );
};

export default CreateRoomModal;