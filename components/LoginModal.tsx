import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { UI_STRINGS } from '../constants';
import { X } from 'lucide-react';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

interface LoginModalProps {
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const context = useContext(AppContext);
  
  useBodyScrollLock();

  if (!context) {
    return null;
  }
  
  const { login } = context;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (login(username, password)) {
      onClose();
    } else {
      setError('Tên đăng nhập hoặc mật khẩu không đúng.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white dark:bg-[#313131] rounded-lg shadow-2xl p-8 w-full max-w-md m-4 relative transform transition-all duration-300 scale-95 hover:scale-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">{UI_STRINGS.adminLogin}</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="username">{UI_STRINGS.username}</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-[#E31F26] focus:border-transparent outline-none transition"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="password">{UI_STRINGS.password}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-[#E31F26] focus:border-transparent outline-none transition"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-[#E31F26] text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-red-500"
          >
            {UI_STRINGS.login}
          </button>
        </form>
      </div>
    </div>
  );
};