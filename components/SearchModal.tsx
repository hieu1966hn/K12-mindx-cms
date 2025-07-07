import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { Search, X, Book, FileText, LoaderCircle } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { UI_STRINGS } from '../constants';
import { SearchResult, LearningPath, Document, Course } from '../types';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

interface SearchModalProps {
  onClose: () => void;
}

/**
 * Component HighlightedText dùng để làm nổi bật (highlight) một phần của chuỗi văn bản
 * khớp với từ khóa tìm kiếm.
 */
const HighlightedText = ({ text, highlight }: { text: string, highlight: string }) => {
    if (!highlight?.trim() || !text) {
        return <span>{text || ''}</span>;
    }
    // Sử dụng biểu thức chính quy để tìm và thay thế, không phân biệt hoa thường.
    const escapedHighlight = highlight.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(${escapedHighlight})`, 'gi');
    const parts = text.split(regex);

    return (
        <span>
            {parts.map((part, i) => 
                // Các phần tử ở chỉ số lẻ là các chuỗi khớp.
                // Cách này đáng tin cậy hơn việc sử dụng regex.test(), vốn có thể bị ảnh hưởng bởi trạng thái (stateful) với cờ /g.
                i % 2 === 1 ? (
                    <strong key={i} className="text-[#E31F26] font-bold bg-red-100 dark:bg-red-900/50 rounded-sm px-0.5">
                        {part}
                    </strong>
                ) : (
                    <span key={i}>{part}</span>
                )
            )}
        </span>
    );
};

/**
 * Component SearchModal cung cấp một cửa sổ để người dùng tìm kiếm khóa học và tài liệu.
 */
export const SearchModal: React.FC<SearchModalProps> = ({ onClose }) => {
  // State cho từ khóa tìm kiếm, kết quả, và trạng thái đang tìm kiếm.
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const context = useContext(AppContext);

  // Khóa cuộn trang khi modal mở.
  useBodyScrollLock();

  // Tự động focus vào ô input khi modal mở.
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  if (!context) {
    throw new Error('SearchModal must be used within an AppProvider');
  }

  const { data, setSelectedPathId, setSelectedCourseId } = context;

  /**
   * Hàm thực hiện tìm kiếm cục bộ (local search) trên dữ liệu đã có.
   * Nó duyệt qua tất cả các lộ trình, khóa học, và tài liệu để tìm sự trùng khớp.
   * @param query - Từ khóa tìm kiếm.
   * @param allData - Toàn bộ dữ liệu của ứng dụng.
   * @returns Mảng các kết quả tìm kiếm (SearchResult[]).
   */
  const performLocalSearch = useCallback((query: string, allData: LearningPath[]): SearchResult[] => {
    const results: SearchResult[] = [];
    if (!query || query.trim().length < 2) {
        return results;
    }

    const lowerCaseQuery = query.toLowerCase();
    const addedIds = new Set<string>(); // Dùng Set để tránh thêm kết quả trùng lặp.

    allData.forEach(path => {
        // Search courses
        path.courses.forEach(course => {
            if (course.name.toLowerCase().includes(lowerCaseQuery) || course.content.toLowerCase().includes(lowerCaseQuery)) {
                const resultId = `course-${course.id}`;
                if (!addedIds.has(resultId)) {
                    results.push({
                        id: resultId,
                        type: 'course',
                        name: course.name,
                        context: `${path.name}`,
                        pathId: path.id,
                        courseId: course.id,
                        url: undefined
                    });
                    addedIds.add(resultId);
                }
            }

            // Search documents within the course
            course.documents.forEach(doc => {
                if (doc.name.toLowerCase().includes(lowerCaseQuery)) {
                    const resultId = `doc-${doc.id}`;
                    if (!addedIds.has(resultId)) {
                        results.push({
                            id: resultId,
                            type: 'document',
                            name: doc.name,
                            context: `${path.name} > ${course.name}`,
                            pathId: path.id,
                            courseId: course.id,
                            url: doc.url
                        });
                        addedIds.add(resultId);
                    }
                }
            });

            // Search documents within levels
            course.levels.forEach(level => {
                level.documents.forEach(doc => {
                    if (doc.name.toLowerCase().includes(lowerCaseQuery)) {
                        const resultId = `doc-${doc.id}`;
                        if (!addedIds.has(resultId)) {
                            results.push({
                                id: resultId,
                                type: 'document',
                                name: doc.name,
                                context: `${path.name} > ${course.name} > ${level.name}`,
                                pathId: path.id,
                                courseId: course.id,
                                url: doc.url
                            });
                            addedIds.add(resultId);
                        }
                    }
                });
            });
        });

        // Search documents at the path level
        path.documents.forEach(doc => {
            if (doc.name.toLowerCase().includes(lowerCaseQuery)) {
                const resultId = `doc-${doc.id}`;
                if (!addedIds.has(resultId)) {
                    results.push({
                        id: resultId,
                        type: 'document',
                        name: doc.name,
                        context: `${path.name}`,
                        pathId: path.id,
                        url: doc.url
                    });
                    addedIds.add(resultId);
                }
            }
        });
    });

    return results;
}, []);

  // `useEffect` để kích hoạt tìm kiếm mỗi khi `searchTerm` thay đổi.
  useEffect(() => {
    // Chỉ tìm kiếm khi người dùng nhập ít nhất 2 ký tự.
    if (searchTerm.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    // Sử dụng `setTimeout` để tạo độ trễ (debounce), tránh tìm kiếm liên tục mỗi khi gõ phím.
    const handler = setTimeout(() => {
      const results = performLocalSearch(searchTerm, data);
      setSearchResults(results);
      setIsSearching(false);
    }, 300); // Chờ 300ms sau khi người dùng ngừng gõ rồi mới tìm kiếm.

    // Dọn dẹp timeout khi component unmount hoặc searchTerm thay đổi.
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, data, performLocalSearch]);
  
  // Hàm xử lý khi người dùng click vào một kết quả tìm kiếm.
  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'document' && result.url) {
      // Mở tài liệu trong tab mới.
      window.open(result.url, '_blank', 'noopener,noreferrer');
    } else if (result.type === 'course' && result.courseId) {
      // Điều hướng đến trang chi tiết khóa học.
      setSelectedPathId(result.pathId);
      // Dùng timeout nhỏ để đảm bảo MainContent có thời gian render lại danh sách khóa học
      // trước khi chuyển sang chi tiết khóa học.
      setTimeout(() => setSelectedCourseId(result.courseId), 50);
    }
    onClose(); // Đóng modal sau khi chọn.
  };

  // Hàm render nội dung của modal (kết quả, thông báo, loading...).
    const renderContent = () => {
    if (isSearching) {
        return (
            <div className="flex items-center justify-center p-16 text-gray-500 dark:text-gray-400">
                <LoaderCircle size={24} className="animate-spin mr-3" />
                <span>{UI_STRINGS.searching}</span>
            </div>
        );
    }

    if (searchResults.length > 0) {
        return (
            <ul className="max-h-[60vh] overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700/60">
                {searchResults.map(result => (
                    <li key={result.id}>
                        <button 
                            onClick={() => handleResultClick(result)}
                            className="w-full text-left flex items-start gap-4 p-4 hover:bg-red-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                            <div className="flex-shrink-0 mt-1">
                                {result.type === 'course' ? <Book size={20} className="text-blue-500"/> : <FileText size={20} className="text-green-500"/>}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-base font-semibold text-gray-800 dark:text-gray-100 truncate">
                                    <HighlightedText text={result.name} highlight={searchTerm} />
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                    <HighlightedText text={result.context} highlight={searchTerm} />
                                </p>
                            </div>
                        </button>
                    </li>
                ))}
            </ul>
        );
    }
    
    if (searchTerm.trim().length >= 2) {
         return (
            <div className="flex flex-col items-center justify-center p-16 text-gray-500 dark:text-gray-400 text-center">
                <Search size={40} className="mb-4 opacity-50" />
                <p className="font-semibold text-lg">{UI_STRINGS.noResults}</p>
                <p className="text-sm">Hãy thử tìm kiếm với một từ khóa khác.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center p-16 text-gray-500 dark:text-gray-400 text-center">
            <Search size={40} className="mb-4 opacity-50" />
            <p className="font-semibold text-lg">Tìm kiếm khóa học & tài liệu</p>
            <p className="text-sm">Nhập ít nhất 2 ký tự để bắt đầu tìm kiếm.</p>
        </div>
    );
};
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-start justify-center z-50 pt-20 animate-fade-in" onMouseDown={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl m-4 relative animate-fade-in-up overflow-hidden"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Thanh tìm kiếm */}
        <div className="flex items-center w-full bg-transparent p-2 border-b border-gray-200 dark:border-gray-700/60">
            <Search className="h-5 w-5 mx-3 text-gray-400 flex-shrink-0" />
            <input
                ref={searchInputRef}
                type="text"
                placeholder={UI_STRINGS.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-lg placeholder-gray-400 text-gray-800 dark:text-gray-200 focus:outline-none"
            />
            {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="p-2 mr-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full transition-colors">
                    <X size={20} />
                </button>
            )}
        </div>
        {/* Nội dung kết quả */}
        {renderContent()}
      </div>
    </div>
  );
};