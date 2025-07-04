
import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { UI_STRINGS } from '../constants';
import { Course, Level, ParentId, ItemType, EditableItem } from '../types';
import { DocumentLink } from './DocumentLink';
import { Pencil, Trash2, PlusCircle, Calendar, Users, Wrench, Code } from 'lucide-react';
import { HomePage } from './HomePage';
import { EditModal } from './EditModal';
import { Badge } from './common/Badge';
import { EmptyState } from './common/EmptyState';


interface CourseCardProps {
  course: Course;
  pathId: string;
  onEdit: (item: EditableItem, type: ItemType, parentId: ParentId) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, pathId, onEdit }) => {
  const context = useContext(AppContext);
  if(!context) return null;
  const { 
      selectedCourseId, 
      setSelectedCourseId, 
      currentUser,
      deleteCourse,
      deleteLevel,
  } = context;
  const isSelected = selectedCourseId === course.id;
  const isAdmin = currentUser?.role === 'admin';

  const handleDeleteCourse = (e: React.MouseEvent) => {
    e.stopPropagation();
    if(window.confirm(UI_STRINGS.deleteConfirmation)) {
        deleteCourse(pathId, course.id);
    }
  };

  const handleDeleteLevel = (e: React.MouseEvent, levelId: string) => {
      e.stopPropagation();
      if(window.confirm(UI_STRINGS.deleteConfirmation)) {
          deleteLevel(pathId, course.id, levelId);
      }
  }

  return (
    <div 
        className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${isSelected ? 'border-[#E31F26]' : 'border-transparent'}`}
        onClick={() => setSelectedCourseId(isSelected ? null : course.id)}
    >
      <div className="p-6">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{course.name}</h3>
            <div className="flex items-center flex-wrap gap-2 mt-3">
              <Badge colorScheme="gray" icon={Calendar}>Năm {course.year}</Badge>
              <Badge colorScheme="blue" icon={Users}>Tuổi {course.ageGroup}</Badge>
              {course.language && 
                <Badge colorScheme="green" icon={Code}>{course.language}</Badge>
              }
              {course.tools?.map(tool => (
                <Badge key={tool} colorScheme="yellow" icon={Wrench}>{tool}</Badge>
              ))}
            </div>
          </div>
          {isAdmin && (
              <div className="flex-shrink-0 flex items-center gap-2">
                  <button onClick={(e) => { e.stopPropagation(); onEdit(course, 'course', { pathId })}} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"><Pencil size={18} /></button>
                  <button onClick={handleDeleteCourse} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-red-500"><Trash2 size={18} /></button>
              </div>
          )}
        </div>
      </div>
      
      <div className={`transition-[max-height,padding-bottom] duration-700 ease-in-out overflow-hidden ${isSelected ? 'max-h-[2000px] pb-6' : 'max-h-0'}`}>
          <div className="px-6">
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 mb-6">
                  <div>
                      <h4 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-200">{UI_STRINGS.courseContent}</h4>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{course.content}</p>
                  </div>
                  <div>
                      <h4 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-200">{UI_STRINGS.courseObjectives}</h4>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{course.objectives}</p>
                  </div>
              </div>

              { (course.documents.length > 0 || isAdmin) && 
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                        <h4 className="font-bold text-lg text-gray-800 dark:text-gray-200">Tài liệu khóa học</h4>
                        {isAdmin && <button onClick={(e) => {e.stopPropagation(); onEdit(null, 'document', {pathId, courseId: course.id})}} className="flex items-center gap-1 text-sm text-[#E31F26] hover:underline"><PlusCircle size={16}/>{UI_STRINGS.addDocument}</button>}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {course.documents.map(doc => <DocumentLink key={doc.id} document={doc} parentId={{pathId, courseId: course.id}} onEdit={(d) => onEdit(d, 'document', {pathId, courseId: course.id})} />)}
                    </div>
                </div>
              }
              
              <div>
                <div className="flex justify-between items-center mb-3">
                    <h4 className="font-bold text-lg text-gray-800 dark:text-gray-200">{UI_STRINGS.levels}</h4>
                    {isAdmin && <button onClick={(e) => {e.stopPropagation(); onEdit(null, 'level', {pathId, courseId: course.id})}} className="flex items-center gap-1 text-sm text-[#E31F26] hover:underline"><PlusCircle size={16}/>{UI_STRINGS.addLevel}</button>}
                </div>
                <div className="space-y-4">
                  {course.levels.map(level => (
                    <div key={level.id} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <h5 className="font-semibold text-xl text-[#E31F26]">{level.name}</h5>
                        {isAdmin && (
                            <div className="flex items-center gap-1">
                                <button onClick={(e) => { e.stopPropagation(); onEdit(level, 'level', {pathId, courseId: course.id})}} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"><Pencil size={16} /></button>
                                <button onClick={(e) => handleDeleteLevel(e, level.id)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-red-500"><Trash2 size={16} /></button>
                            </div>
                        )}
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 my-2 text-sm">
                          <p><strong className="font-medium text-gray-700 dark:text-gray-300">{UI_STRINGS.levelContent}:</strong> {level.content}</p>
                          <p><strong className="font-medium text-gray-700 dark:text-gray-300">{UI_STRINGS.levelObjectives}:</strong> {level.objectives}</p>
                      </div>
                      { (level.documents.length > 0 || isAdmin) && 
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-center mb-2">
                                <h6 className="font-semibold text-gray-700 dark:text-gray-300">Tài liệu cấp độ</h6>
                                {isAdmin && <button onClick={(e) => {e.stopPropagation(); onEdit(null, 'document', {pathId, courseId: course.id, levelId: level.id})}} className="flex items-center gap-1 text-xs text-[#E31F26] hover:underline"><PlusCircle size={14}/>{UI_STRINGS.addDocument}</button>}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {level.documents.map(doc => <DocumentLink key={doc.id} document={doc} parentId={{pathId, courseId: course.id, levelId: level.id}} onEdit={(d) => onEdit(d, 'document', {pathId, courseId: course.id, levelId: level.id})}/>)}
                            </div>
                        </div>
                      }
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};


export const MainContent: React.FC = () => {
  const context = useContext(AppContext);
  const [editingState, setEditingState] = useState<{item: EditableItem | null, type: ItemType, parentId: ParentId} | null>(null);

  if (!context) return null;

  const { selectedPathId, data, currentUser } = context;
  const selectedPath = data.find(p => p.id === selectedPathId);
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

  const courses = selectedPath.courses;

  return (
    <>
    <main className="flex-1 p-6 md:p-10 overflow-y-auto">
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
        <div className="space-y-6">
          {courses.map(course => <CourseCard key={course.id} course={course} pathId={selectedPath.id} onEdit={handleEdit} />)}
          {courses.length === 0 && (
            <EmptyState message="Chưa có khóa học nào trong lộ trình này." />
          )}
        </div>
      </div>
    </main>
    {editingState && <EditModal item={editingState.item} type={editingState.type} parentId={editingState.parentId} onClose={handleCloseModal} />}
    </>
  );
};