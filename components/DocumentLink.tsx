import React, { useContext } from 'react';
import { Document, ParentId } from '../types';
import { DocumentIcon } from './icons';
import { DOCUMENT_NAMES, UI_STRINGS } from '../constants';
import { AppContext } from '../context/AppContext';
import { Pencil, Trash2 } from 'lucide-react';

interface DocumentLinkProps {
  document: Document;
  parentId: ParentId;
  onEdit: (doc: Document) => void;
}

export const DocumentLink: React.FC<DocumentLinkProps> = ({ document, parentId, onEdit }) => {
  const context = useContext(AppContext);
  if (!context) return null;

  const { currentUser, deleteDocument } = context;
  const isAdmin = currentUser?.role === 'admin';

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(UI_STRINGS.deleteConfirmation)) {
        deleteDocument(parentId, document.id);
    }
  };
  
  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(document);
  };

  return (
    <div className="relative group">
      <a
        href={document.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 group-hover:bg-red-100 dark:group-hover:bg-gray-600 transition-all duration-200 w-full"
      >
        <DocumentIcon category={document.category} className="w-5 h-5 text-[#E31F26] group-hover:scale-110 transition-transform flex-shrink-0" />
        <span className="text-gray-800 dark:text-gray-200 font-medium group-hover:text-black dark:group-hover:text-white truncate">
          {DOCUMENT_NAMES[document.category] || document.name}
        </span>
      </a>
      {isAdmin && (
        <div className="absolute top-1/2 -translate-y-1/2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-200 dark:bg-gray-600 rounded-full p-1">
          <button onClick={handleEdit} className="p-1 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-full text-blue-600 dark:text-blue-400" aria-label={UI_STRINGS.edit}>
            <Pencil size={14} />
          </button>
          <button onClick={handleDelete} className="p-1 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-full text-red-600 dark:text-red-400" aria-label={UI_STRINGS.delete}>
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
};
