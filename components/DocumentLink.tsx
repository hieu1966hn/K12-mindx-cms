

import React, { useContext, useCallback, memo } from 'react';
import { Document, ParentId } from '../types';
import { DocumentIcon } from './icons';
import { DOCUMENT_NAMES, UI_STRINGS } from '../constants';
import { AppContext } from '../context/AppContext';
import { Pencil, Trash2, GripVertical } from 'lucide-react';

interface DocumentLinkProps {
  document: Document; // Đối tượng tài liệu để hiển thị.
  parentId: ParentId; // ID của các mục cha, cần thiết cho các hành động CRUD.
  onEdit: (doc: Document) => void; // Callback được gọi khi admin nhấn nút sửa.
  isDragging?: boolean; // Cờ báo hiệu mục này đang được kéo.
  isDragOver?: boolean; // Cờ báo hiệu mục này đang bị một mục khác kéo qua.
}

/**
 * Component DocumentLink hiển thị một liên kết đến một tài liệu.
 * Nó cũng bao gồm các nút điều khiển (sửa, xóa) cho quản trị viên (admin)
 * và một tay cầm để kéo-thả.
 */
export const DocumentLink: React.FC<DocumentLinkProps> = memo(({ document, parentId, onEdit, isDragging, isDragOver }) => {
  const context = useContext(AppContext);
  if (!context) return null;

  const { currentUser, deleteDocument } = context;
  const isAdmin = currentUser?.role === 'admin';

  // Hàm xử lý khi admin nhấn nút xóa.
  // `useCallback` để tối ưu hóa, tránh tạo lại hàm không cần thiết.
  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); // Ngăn thẻ `<a>` điều hướng.
    e.stopPropagation(); // Ngăn sự kiện click lan ra các phần tử cha.
    if (window.confirm(UI_STRINGS.deleteConfirmation)) {
        deleteDocument(parentId, document.id);
    }
  }, [deleteDocument, parentId, document.id]);
  
  // Hàm xử lý khi admin nhấn nút sửa.
  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(document);
  }, [onEdit, document]);

  // Các lớp CSS cho container bọc ngoài, xử lý UI cho việc kéo-thả
  const wrapperClasses = [
    'relative group', // `group` cho phép các phần tử con thay đổi style khi container được hover.
    isDragOver ? 'pt-1' : '', // Thêm padding-top để tạo không gian cho đường kẻ khi kéo qua.
  ].join(' ');

  // Các lớp CSS cho thẻ `<a>` chính.
  const linkClasses = [
      "flex items-center gap-3 px-4 py-2.5 rounded-lg bg-black/5 dark:bg-white/5 transition-all duration-200 w-full",
      isAdmin && !isDragging ? "group-hover:bg-black/10 dark:group-hover:bg-white/10" : "",
      isDragging ? "opacity-40" : "opacity-100", // Giảm độ mờ khi đang kéo.
      isDragOver ? "border-t-2 border-[#E31F26]" : "" // Hiển thị đường kẻ ở trên khi một mục khác được kéo qua.
  ].join(" ");
  
  return (
    <div className={wrapperClasses}>
      <a
        href={document.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => { if (isAdmin && isDragging) e.preventDefault(); }} // Ngăn click khi đang kéo
        className={linkClasses}
      >
        {/* Biểu tượng kéo-thả, chỉ hiển thị cho admin */}
        {isAdmin && <GripVertical size={18} className="text-gray-400 dark:text-gray-500 flex-shrink-0 cursor-grab" />}
        
        {/* Biểu tượng của loại tài liệu */}
        <DocumentIcon category={document.category} className="w-5 h-5 text-gray-600 dark:text-gray-400 md:group-hover:text-[#E31F26] transition-colors flex-shrink-0" />
        
        {/* Tên tài liệu */}
        <span className="text-gray-800 dark:text-gray-200 font-medium md:group-hover:text-black dark:md:group-hover:text-white truncate transition-colors">
          {DOCUMENT_NAMES[document.category] || document.name}
        </span>
        
        {/* Các nút điều khiển Sửa/Xóa, chỉ hiển thị cho admin và khi hover */}
        {isAdmin && (
          <div className="absolute top-1/2 -translate-y-1/2 right-2 flex items-center gap-1 opacity-0 md:group-hover:opacity-100 transition-opacity bg-gray-200/50 dark:bg-gray-700/50 backdrop-blur-sm rounded-full p-1 z-10">
            <button onClick={handleEdit} className="p-1 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full text-blue-600 dark:text-blue-400" aria-label={UI_STRINGS.edit}>
              <Pencil size={14} />
            </button>
            <button onClick={handleDelete} className="p-1 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full text-red-600 dark:text-red-400" aria-label={UI_STRINGS.delete}>
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </a>
    </div>
  );
});
