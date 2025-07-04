import React, { useContext, useState } from 'react';

import { AppContext } from './context/AppContext';
import { Header } from './components/Header';
import { MainContent } from './components/MainContent';
import { Sidebar } from './components/Sidebar';

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
        <footer className="text-center p-2 text-sm text-gray-500 dark:text-gray-400">
            Research & Development - K12
        </footer>
      </div>
    </div>
  );
}

export default App;