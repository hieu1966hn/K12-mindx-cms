import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { LearningPath, LearningPathName } from '../types';
import { UI_STRINGS } from '../constants';
import { Code, Palette, Bot, Home, Phone, Mail, Menu, Search, X } from 'lucide-react';
import { SearchModal } from './SearchModal';

const pathIcons: Record<LearningPathName, React.ElementType> = {
    [LearningPathName.CODING_AI]: Code,
    [LearningPathName.ART_DESIGN]: Palette,
    [LearningPathName.ROBOTICS]: Bot,
};

interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
    isMobileOpen: boolean;
    onMobileClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle, isMobileOpen, onMobileClose }) => {
  const context = useContext(AppContext);
  const [isSearchModalOpen, setSearchModalOpen] = useState(false);

  if (!context) return null;

  const { data, selectedPathId, setSelectedPathId, setSelectedCourseId } = context;

  const handlePathClick = (pathId: string) => {
      setSelectedPathId(pathId);
      setSelectedCourseId(null);
      onMobileClose();
  }
  
  const handleHomeClick = () => {
    setSelectedPathId(null);
    setSelectedCourseId(null);
    onMobileClose();
  }
  
  const handleSearchClick = () => {
    setSearchModalOpen(true);
  }

  const isHomeSelected = selectedPathId === null;

  const navButtonClass = (isActive: boolean) => `
    w-full text-left py-2.5 rounded-lg transition-colors duration-200 flex items-center
    px-4 gap-4
    ${isCollapsed ? 'md:justify-center md:px-3' : 'md:px-4'}
    ${isActive
        ? 'bg-red-50 dark:bg-red-900/40 text-[#E31F26] dark:text-red-300 font-semibold'
        : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
    }
  `;

  const iconButtonClass = "p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors";

  return (
      <>
      {/* Backdrop for mobile overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity md:hidden ${isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onMobileClose}
        aria-hidden="true"
      ></div>

      <aside className={`
        flex-shrink-0 flex flex-col
        bg-white dark:bg-[#313131] border-r border-gray-200 dark:border-gray-700
        fixed md:relative inset-y-0 left-0 z-50 w-80 
        transition-transform duration-300 ease-in-out
        transform md:transform-none
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isCollapsed ? 'md:w-20' : 'md:w-80'}
      `}>
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
          
          {/* Sidebar Header: Refactored for clarity */}
          <div className="mb-4">
            {/* Mobile Header */}
            <div className="flex items-center justify-between md:hidden">
              <button
                onClick={onMobileClose}
                className={iconButtonClass}
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
              <button
                onClick={handleSearchClick}
                className={iconButtonClass}
                aria-label="Search"
              >
                <Search size={22} />
              </button>
            </div>

            {/* Desktop Header */}
            <div className={`hidden md:flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
              <button
                onClick={onToggle}
                className={iconButtonClass}
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <Menu size={24} />
              </button>
              {!isCollapsed && (
                <button
                  onClick={handleSearchClick}
                  className={iconButtonClass}
                  aria-label="Search"
                >
                  <Search size={22} />
                </button>
              )}
            </div>
          </div>
          
          <nav>
            <ul className="space-y-2">
                <li>
                    <button onClick={handleHomeClick} className={navButtonClass(isHomeSelected)}>
                        <Home className="w-6 h-6 flex-shrink-0" />
                        <span className={isCollapsed ? "md:hidden" : "block"}><span className="font-semibold truncate">{UI_STRINGS.home}</span></span>
                    </button>
                </li>
            </ul>
          </nav>
          
          <div className="my-4">
            {isCollapsed ? <hr className="border-gray-300 dark:border-gray-600 mx-auto w-1/2 md:w-full" /> : <h2 className="text-sm font-bold uppercase text-gray-500 dark:text-gray-400 px-4">{UI_STRINGS.learningPaths}</h2>}
          </div>

          <nav>
            <ul className="space-y-2">
              {data.map((path: LearningPath) => {
                  const Icon = pathIcons[path.name];
                  return (
                      <li key={path.id}>
                      <button
                          onClick={() => handlePathClick(path.id)}
                          className={navButtonClass(selectedPathId === path.id)}
                      >
                          {Icon && <Icon className="w-6 h-6 flex-shrink-0" />}
                          <span className={isCollapsed ? "md:hidden" : "block"}><span className="font-semibold truncate">{path.name}</span></span>
                      </button>
                      </li>
                  );
              })}
            </ul>
          </nav>
        </div>
        
        <div className={`p-4 flex-shrink-0 transition-opacity duration-300 ${isCollapsed ? 'md:opacity-0 md:pointer-events-none' : 'opacity-100'}`}>
             <div className="space-y-3">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm uppercase px-4">{UI_STRINGS.contact}</h3>
                <a href={`mailto:${UI_STRINGS.contactEmail}`} className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-[#E31F26] dark:hover:text-red-400 px-4 py-1 rounded-md">
                    <Mail size={18} />
                    <span className="text-sm truncate">{UI_STRINGS.contactEmail}</span>
                </a>
                <a href={`tel:${UI_STRINGS.contactPhone.replace(/\./g, '')}`} className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-[#E31F26] dark:hover:text-red-400 px-4 py-1 rounded-md">
                    <Phone size={18} />
                    <span className="text-sm truncate">{UI_STRINGS.contactPhone}</span>
                </a>
            </div>
        </div>
      </aside>
      {isSearchModalOpen && <SearchModal onClose={() => setSearchModalOpen(false)} />}
      </>
  );
};