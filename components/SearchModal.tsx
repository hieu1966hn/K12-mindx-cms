import React, { useState, useEffect, useRef, useContext } from 'react';
import { Search, X, Book, FileText } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { UI_STRINGS } from '../constants';
import { SearchResult } from '../types';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

interface SearchModalProps {
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const context = useContext(AppContext);

  useBodyScrollLock();

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  if (!context) {
    throw new Error('SearchModal must be used within an AppProvider');
  }

  const { data, setSelectedPathId, setSelectedCourseId } = context;

  useEffect(() => {
    if (searchTerm.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    const results: SearchResult[] = [];
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    data.forEach(path => {
      path.courses.forEach(course => {
        if (course.name.toLowerCase().includes(lowerCaseSearchTerm)) {
          results.push({ id: course.id, type: 'course', name: course.name, context: path.name, pathId: path.id, courseId: course.id });
        }
        course.documents.forEach(doc => {
          if (doc.name.toLowerCase().includes(lowerCaseSearchTerm)) {
            results.push({ id: doc.id, type: 'document', name: doc.name, context: `${path.name} / ${course.name}`, pathId: path.id, courseId: course.id, url: doc.url });
          }
        });
        course.levels.forEach(level => {
          level.documents.forEach(doc => {
            if (doc.name.toLowerCase().includes(lowerCaseSearchTerm)) {
              results.push({ id: doc.id, type: 'document', name: doc.name, context: `${path.name} / ${course.name} / ${level.name}`, pathId: path.id, courseId: course.id, url: doc.url });
            }
          });
        });
      });
      path.documents.forEach(doc => {
        if (doc.name.toLowerCase().includes(lowerCaseSearchTerm)) {
          results.push({ id: doc.id, type: 'document', name: doc.name, context: path.name, pathId: path.id, url: doc.url });
        }
      });
    });
    setSearchResults(results.slice(0, 10));
  }, [searchTerm, data]);
  
  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'document' && result.url) {
      window.open(result.url, '_blank', 'noopener,noreferrer');
    } else if (result.type === 'course' && result.courseId) {
      setSelectedPathId(result.pathId);
      // Use a small timeout to ensure the path is set before the course,
      // which might be necessary if the MainContent component needs to re-render.
      setTimeout(() => setSelectedCourseId(result.courseId), 50);
    }
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-start justify-center z-50 transition-opacity duration-300 pt-20" onClick={onClose}>
      <div 
        className="bg-white dark:bg-[#313131] rounded-lg shadow-2xl w-full max-w-2xl m-4 relative transform transition-all duration-300 scale-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center w-full bg-gray-100 dark:bg-gray-700 rounded-t-lg p-2 border-b border-gray-200 dark:border-gray-600">
            <Search size={22} className="text-gray-400 mx-3 flex-shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder={UI_STRINGS.searchPlaceholder}
              className="w-full h-12 bg-transparent outline-none text-lg text-gray-800 dark:text-gray-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
             <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors mr-2"
                aria-label="Close search"
              >
                <X size={24} />
            </button>
        </div>
        
        {searchResults.length > 0 ? (
          <ul className="max-h-[60vh] overflow-y-auto">
            {searchResults.map(result => (
              <li key={result.id}>
                <button 
                  onClick={() => handleResultClick(result)}
                  className="w-full text-left flex items-start gap-4 p-4 hover:bg-red-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-700"
                >
                  {result.type === 'course' ? <Book size={24} className="text-[#E31F26] mt-1 flex-shrink-0" /> : <FileText size={24} className="text-blue-500 mt-1 flex-shrink-0" />}
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 dark:text-gray-100 truncate">{result.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{result.context}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        ) : (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                {searchTerm.length > 1 ? "Không tìm thấy kết quả." : "Nhập ít nhất 2 ký tự để tìm kiếm."}
            </div>
        )}
      </div>
    </div>
  );
};