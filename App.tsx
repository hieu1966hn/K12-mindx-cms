

import React, { useState, useContext } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { AppContext } from './context/AppContext';

function App() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const context = useContext(AppContext);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#1C1C1C] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Sidebar 
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <div className="flex flex-col flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900/80">
        <Header onMobileMenuOpen={() => setMobileMenuOpen(true)} />
        <MainContent />
        <footer className="text-center p-2 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800">
            MindX Technology School
        </footer>
      </div>
    </div>
  );
}

export default App;