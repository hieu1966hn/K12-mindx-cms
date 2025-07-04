import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { LearningPath, LearningPathName } from '../types';
import { UI_STRINGS } from '../constants';
import { Code, Palette, Bot, Home, Phone, Mail, Menu, Search } from 'lucide-react';
import { SearchModal } from './SearchModal';

const pathIcons: Record<LearningPathName, React.ElementType> = {
    [LearningPathName.CODING_AI]: Code,
    [LearningPathName.ART_DESIGN]: Palette,
    [LearningPathName.ROBOTICS]: Bot,
};

interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const context = useContext(AppContext);
  const [isSearchModalOpen, setSearchModalOpen] = useState(false);

  if (!context) return null;

  const { data, selectedPathId, setSelectedPathId, setSelectedCourseId } = context;

  const handlePathClick = (pathId: string) => {
      setSelectedPathId(pathId);
      setSelectedCourseId(null);
  }
  
  const handleHomeClick = () => {
    setSelectedPathId(null);
    setSelectedCourseId(null);
  }
  
  const handleSearchClick = () => {
    setSearchModalOpen(true);
  }

  const isHomeSelected = selectedPathId === null;

  const navButtonClass = (isActive: boolean) => `
    w-full text-left py-2.5 rounded-md transition-colors duration-200 flex items-center
    ${isCollapsed ? 'px-3 justify-center' : 'px-4 gap-4'}
    ${isActive
        ? 'bg-[#E31F26] text-white font-semibold shadow-md'
        : 'hover:bg-red-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
    }
  `;

  const iconButtonClass = "p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors";

  return (
      <>
      <aside className={`
        flex-shrink-0 flex flex-col transition-all duration-300 ease-in-out
        bg-white dark:bg-[#313131] border-r border-gray-200 dark:border-gray-700
        ${isCollapsed ? 'w-20' : 'w-80'}
      `}>
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
          <div className={`mb-4 flex items-center justify-between`}>
            <button
                onClick={onToggle}
                className={iconButtonClass}
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
                <Menu size={24} />
            </button>
            
            {/* --- MODIFIED LINE START --- */}
            {/* The search button is now wrapped in a condition to only render when sidebar is NOT collapsed */}
            {!isCollapsed && (
              <button 
                onClick={handleSearchClick} 
                className={iconButtonClass} 
                aria-label="Search"
              >
                <Search size={22} />
              </button>
            )}
            {/* --- MODIFIED LINE END --- */}

          </div>

          <nav>
            <ul className="space-y-2">
                <li>
                    <button onClick={handleHomeClick} className={navButtonClass(isHomeSelected)}>
                        <Home className="w-6 h-6 flex-shrink-0" />
                        {!isCollapsed && <span className="font-semibold truncate">{UI_STRINGS.home}</span>}
                    </button>
                </li>
            </ul>
          </nav>
          
          <div className="my-4">
            {isCollapsed ? <hr className="border-gray-300 dark:border-gray-600" /> : <h2 className="text-sm font-bold uppercase text-gray-500 dark:text-gray-400 px-4">{UI_STRINGS.learningPaths}</h2>}
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
                          {!isCollapsed && <span className="font-semibold truncate">{path.name}</span>}
                      </button>
                      </li>
                  );
              })}
            </ul>
          </nav>
        </div>
        
        <div className={`p-4 flex-shrink-0 transition-opacity duration-300 ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
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