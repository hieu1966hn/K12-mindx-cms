import React, { useState, useContext } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { AppContext } from './context/AppContext';
import { Save, XCircle } from 'lucide-react';

function SaveChangesBanner() {
  const context = useContext(AppContext);

  if (!context || !context.currentUser || context.currentUser.role !== 'admin' || !context.hasUnsavedChanges) {
      return null;
  }

  const { saveChanges, discardChanges } = context;

  return (
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-xl p-4 z-[60] animate-fadeIn">
          <div className="bg-gray-900 text-white rounded-lg shadow-2xl p-4 flex items-center justify-between ring-1 ring-red-500/50">
              <p className="font-semibold">Bạn có các thay đổi chưa được lưu.</p>
              <div className="flex items-center gap-4">
                  <button 
                      onClick={discardChanges}
                      className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                      aria-label="Hủy bỏ thay đổi"
                  >
                      <XCircle size={18} />
                      Hủy bỏ
                  </button>
                  <button 
                      onClick={saveChanges}
                      className="flex items-center gap-2 bg-[#E31F26] text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                      aria-label="Lưu thay đổi"
                  >
                      <Save size={18} />
                      Lưu
                  </button>
              </div>
          </div>
      </div>
  );
}


function App() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      <SaveChangesBanner />
    </div>
  );
}

export default App;