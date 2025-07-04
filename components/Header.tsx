import { LogIn, LogOut, Menu } from 'lucide-react';
import React, { useContext, useState } from 'react';

import { AppContext } from '../context/AppContext';
import { LoginModal } from './LoginModal';
import { Logo } from './common/Logo';
import { UI_STRINGS } from '../constants';

interface HeaderProps {
  onMobileMenuOpen: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMobileMenuOpen }) => {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('Header must be used within an AppProvider');
  }

  const { currentUser, logout } = context;

  const isDarkMode = document.documentElement.classList.contains('dark');


  const handleLoginClick = () => setLoginModalOpen(true);
  const handleLogoutClick = () => logout();

  return (
    <>
      <header className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white p-4 flex items-center justify-between sticky top-0 z-30">
        {/* Left side: Mobile Menu Toggle + Logo */}
        <div className="flex items-center gap-2">
            <button 
              onClick={onMobileMenuOpen} 
              className="p-2 -ml-2 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors md:hidden"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          {/* <Logo className="h-10 w-10" /> */}
          <Logo className="w-8 h-8" isDarkMode={isDarkMode} />

        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {currentUser ? (
            <button onClick={handleLogoutClick} className="flex items-center gap-2 bg-[#E31F26] text-white font-semibold py-2 px-4 rounded-md hover:bg-red-700 transition-colors">
              <LogOut size={18} />
              <span className="hidden md:inline">{UI_STRINGS.logout}</span>
            </button>
          ) : (
            <button onClick={handleLoginClick} aria-label={UI_STRINGS.login} className="flex items-center bg-[#E31F26] text-white font-semibold p-2 rounded-md hover:bg-red-700 transition-colors">
              <LogIn size={18} />
            </button>
          )}
        </div>
      </header>
      {isLoginModalOpen && <LoginModal onClose={() => setLoginModalOpen(false)} />}
    </>
  );
};