

import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { UI_STRINGS } from '../constants';
import { Course, ParentId, ItemType, EditableItem } from '../types';
import { DocumentLink } from './DocumentLink';
import { PlusCircle } from 'lucide-react';
import { HomePage } from './HomePage';
import { EditModal } from './EditModal';
import { EmptyState } from './common/EmptyState';
import { CourseCard } from './CourseCard';
import { CourseDetailView } from './CourseDetailView';

export const MainContent: React.FC = () => {
  const context = useContext(AppContext);
  const [editingState, setEditingState] = useState<{item: EditableItem | null, type: ItemType, parentId: ParentId} | null>(null);

  if (!context) return null;

  const { selectedPathId, data, currentUser, selectedCourseId, setSelectedCourseId } = context;
  const selectedPath = data.find(p => p.id === selectedPathId);
  const selectedCourse = selectedPath?.courses.find(c => c.id === selectedCourseId);
  const isAdmin = currentUser?.role === 'admin';

  const handleEdit = (item: EditableItem | null, type: ItemType, parentId: ParentId) => {
      setEditingState({item, type, parentId});
  };

  const handleCloseModal = () => {
      setEditingState(null);
  }

  if (!selectedPath) {
    return <HomePage />;
  }

  if (selectedCourse) {
    return (
      <>
        <CourseDetailView 
          course={selectedCourse} 
          path={selectedPath}
          onEdit={handleEdit}
          onClose={() => setSelectedCourseId(null)}
        />
        {editingState && <EditModal item={editingState.item} type={editingState.type} parentId={editingState.parentId} onClose={handleCloseModal} />}
      </>
    );
  }

  const courses = selectedPath.courses;

  return (
    <>
    <main className="flex-1 p-6 md:p-10 overflow-y-auto animate-fadeIn">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">{selectedPath.name}</h2>
                {isAdmin && (
                    <button onClick={() => handleEdit(null, 'course', { pathId: selectedPath.id })} className="flex items-center gap-2 bg-[#E31F26] text-white font-semibold py-2 px-4 rounded-md hover:bg-red-700 transition-colors">
                        <PlusCircle size={20}/>
                        {UI_STRINGS.addCourse}
                    </button>
                )}
            </div>
            { (selectedPath.documents.length > 0 || isAdmin) &&
                <div className="mt-4">
                     <div className="flex justify-between items-center mb-3">
                        <h4 className="font-bold text-lg text-gray-800 dark:text-gray-200">Tài liệu lộ trình</h4>
                        {isAdmin && <button onClick={() => handleEdit(null, 'document', {pathId: selectedPath.id})} className="flex items-center gap-1 text-sm text-[#E31F26] hover:underline"><PlusCircle size={16}/>{UI_STRINGS.addDocument}</button>}
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {selectedPath.documents.map(doc => <DocumentLink key={doc.id} document={doc} parentId={{pathId: selectedPath.id}} onEdit={(d) => handleEdit(d, 'document', {pathId: selectedPath.id})}/>)}
                    </div>
                </div>
            }
        </div>
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map(course => <CourseCard key={course.id} course={course} pathId={selectedPath.id} onEdit={handleEdit} />)}
          </div>
        ) : (
          <EmptyState message="Chưa có khóa học nào trong lộ trình này." />
        )}
      </div>
    </main>
    {editingState && <EditModal item={editingState.item} type={editingState.type} parentId={editingState.parentId} onClose={handleCloseModal} />}
    </>
  );
};
