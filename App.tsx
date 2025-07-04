
import React, { useState, useContext } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { AppContext } from './context/AppContext';

function App() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(true);
  const context = useContext(AppContext);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Sidebar 
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div className="flex flex-col flex-1 overflow-hidden bg-gray-100 dark:bg-gray-900">
        <Header />
        <MainContent />
        <footer className="text-center p-2 text-sm text-gray-500 dark:text-gray-400">
            MindX Technology School
        </footer>
      </div>
    </div>
  );
}

export default App;