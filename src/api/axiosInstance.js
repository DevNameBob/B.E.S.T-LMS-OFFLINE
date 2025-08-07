// src/api/axiosInstance.js
import axios from 'axios';

const USE_BACKEND = false; // Toggle to true when backend is available

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🧪 Mocked API fallback
let mockAnnouncements = JSON.parse(localStorage.getItem('mockAnnouncements') || '[]');
let mockChatRooms = JSON.parse(localStorage.getItem('mockChatRooms') || '[]');
let mockMessages = JSON.parse(localStorage.getItem('mockMessages') || '{}');
let mockDirectMessages = JSON.parse(localStorage.getItem('mockDirectMessages') || '{}');

const mockApi = {
  post: async (url, data) => simulateMockResponse(url, data),
  get: async (url) => simulateMockResponse(url),
  patch: async (url, data) => simulateMockResponse(url, data),
  delete: async (url) => simulateMockResponse(url),
};

function simulateMockResponse(url, data = {}) {
  switch (url) {
    case '/auth/login':
      if (
        ['faculty@example.com', 'learner@example.com', 'admin@example.com'].includes(data.email) &&
        data.password === 'password'
      ) {
        const role = data.email.includes('faculty') ? 'faculty' :
                     data.email.includes('learner') ? 'learner' : 'admin';
        return Promise.resolve({
          data: {
            token: 'mock-token',
            user: { id: 1, name: 'Mock User', role },
          },
        });
      } else {
        return Promise.reject({ response: { data: { error: 'Invalid mock credentials' } } });
      }

    case '/auth/me':
      return Promise.resolve({
        data: {
          id: 1,
          name: 'Mock User',
          role: localStorage.getItem('userRole') || 'learner',
        },
      });

    case '/announcements':
      if (data && data.title) {
        const newAnnouncement = {
          id: Date.now(),
          title: data.title,
          body: data.body || 'No content available.',
          audience: data.audience || 'all',
          authorId: data.authorId || 'mock-author',
          createdAt: new Date().toISOString(),
        };
        mockAnnouncements.push(newAnnouncement);
        localStorage.setItem('mockAnnouncements', JSON.stringify(mockAnnouncements));
        return Promise.resolve({ data: newAnnouncement });
      } else {
        const stored = localStorage.getItem('mockAnnouncements');
        if (stored) mockAnnouncements = JSON.parse(stored);
        return Promise.resolve({ data: mockAnnouncements });
      }

    case '/chat/rooms':
      if (data && data.name) {
        const newRoom = {
          _id: Date.now().toString(),
          name: data.name,
          description: data.description || '',
          access: data.access || ['shared'],
          createdBy: data.createdBy || 'mock-user',
        };
        mockChatRooms.push(newRoom);
        localStorage.setItem('mockChatRooms', JSON.stringify(mockChatRooms));
        return Promise.resolve({ data: newRoom });
      } else {
        return Promise.resolve({ data: mockChatRooms });
      }

    default:
      // Chat room messages
      if (url.startsWith('/chat/rooms/') && url.endsWith('/messages')) {
        const roomId = url.split('/')[2];
        const messages = mockMessages[roomId] || [];
        return Promise.resolve({ data: messages });
      }

      if (url.startsWith('/chat/rooms/') && url.endsWith('/messages') && data.text) {
        const roomId = url.split('/')[2];
        const newMessage = {
          _id: Date.now().toString(),
          senderId: data.senderId,
          senderName: data.senderName,
          text: data.text,
          timestamp: new Date().toISOString(),
        };
        if (!mockMessages[roomId]) mockMessages[roomId] = [];
        mockMessages[roomId].push(newMessage);
        localStorage.setItem('mockMessages', JSON.stringify(mockMessages));
        return Promise.resolve({ data: newMessage });
      }

      // Direct messages
      if (url.startsWith('/dm/messages/')) {
        const roomId = url.split('/').pop();
        const messages = mockDirectMessages[roomId] || [];
        return Promise.resolve({ data: messages });
      }

      if (url === '/dm/messages' && data.content) {
        const { roomId, senderId, content } = data;
        const newMessage = {
          id: Date.now(),
          roomId,
          senderId,
          content,
          timestamp: new Date().toISOString(),
        };
        if (!mockDirectMessages[roomId]) mockDirectMessages[roomId] = [];
        mockDirectMessages[roomId].push(newMessage);
        localStorage.setItem('mockDirectMessages', JSON.stringify(mockDirectMessages));
        return Promise.resolve({ data: newMessage });
      }

      return Promise.resolve({ data: {} });
  }
}

const api = USE_BACKEND ? axiosInstance : mockApi;

export default api;
export { axiosInstance, USE_BACKEND };