


import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Course, LearningPath, Level, EditableItem, ItemType, ParentId, Document } from '../types';
import { UI_STRINGS } from '../constants';
import { DocumentLink } from './DocumentLink';
import { Badge } from './common/Badge';
import { Pencil, Trash2, PlusCircle, Calendar, Users, Wrench, Code, ArrowLeft, ChevronDown, BookOpen, FileText } from 'lucide-react';
import { useSwipeBack } from '../hooks/useSwipeBack';

interface CourseDetailViewProps {
  course: Course;
  path: LearningPath;
  onEdit: (item: EditableItem | null, type: ItemType, parentId: ParentId) => void;
  onClose: () => void;
}

const LevelAccordion: React.FC<{
  level: Level;
  isOpen: boolean;
  onToggle: () => void;
  onEditLevel: () => void;
  onDelete: () => void;
  onAddDocument: () => void;
  onEditDocument: (doc: Document) => void;
  isAdmin: boolean;
  parentId: ParentId;
}> = ({ level, isOpen, onToggle, onEditLevel, onDelete, onAddDocument, onEditDocument, isAdmin, parentId }) => {
    return (
        <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700/50 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600">
            <button
                onClick={onToggle}
                className="w-full flex justify-between items-center p-5 text-left group"
                aria-expanded={isOpen}
                aria-controls={`level-content-${level.id}`}
            >
                <h4 className="font-bold text-lg text-gray-800 dark:text-gray-100 group-hover:text-[#E31F26] transition-colors">{level.name}</h4>
                <div className="flex items-center gap-3">
                    {isAdmin && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={(e) => { e.stopPropagation(); onEditLevel(); }} className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full" aria-label={UI_STRINGS.edit}><Pencil size={16} /></button>
                            <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-red-500" aria-label={UI_STRINGS.delete}><Trash2 size={16} /></button>
                        </div>
                    )}
                    <ChevronDown size={24} className={`text-gray-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#E31F26]' : ''}`} />
                </div>
            </button>
            
            <div
                id={`level-content-${level.id}`}
                className={`transition-[max-height,opacity] duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="px-5 pb-5 border-t border-gray-200 dark:border-gray-700/50 pt-4">
                    <div className="grid md:grid-cols-2 gap-x-6 gap-y-2 mb-4 text-sm">
                        <p><strong className="font-medium text-gray-700 dark:text-gray-300">{UI_STRINGS.levelContent}:</strong> <span className="text-gray-600 dark:text-gray-400">{level.content}</span></p>
                        <p><strong className="font-medium text-gray-700 dark:text-gray-300">{UI_STRINGS.levelObjectives}:</strong> <span className="text-gray-600 dark:text-gray-400">{level.objectives}</span></p>
                    </div>
                    {(level.documents.length > 0 || isAdmin) && (
                        <div className="mt-4">
                            <div className="flex justify-between items-center mb-2">
                                <h5 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Tài liệu cấp độ</h5>
                                {isAdmin && <button onClick={onAddDocument} className="flex items-center gap-1 text-xs text-[#E31F26] hover:underline"><PlusCircle size={14} />{UI_STRINGS.addDocument}</button>}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {level.documents.map(doc => <DocumentLink key={doc.id} document={doc} parentId={parentId} onEdit={onEditDocument} />)}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


export const CourseDetailView: React.FC<CourseDetailViewProps> = ({ course, path, onEdit, onClose }) => {
  const context = useContext(AppContext);
  const [openLevelId, setOpenLevelId] = useState<string | null>(null);
  const swipeBackRef = useSwipeBack(onClose);

  if (!context) return null;
  
  const { currentUser, deleteCourse, deleteLevel } = context;
  const isAdmin = currentUser?.role === 'admin';
  const pathId = path.id;

  const toggleLevel = (levelId: string) => {
    setOpenLevelId(prevOpenId => (prevOpenId === levelId ? null : levelId));
  };

  const handleDeleteCourse = () => {
    if (window.confirm(UI_STRINGS.deleteConfirmation)) {
      deleteCourse(pathId, course.id);
      onClose();
    }
  };

  const handleDeleteLevel = (levelId: string) => {
    if (window.confirm(UI_STRINGS.deleteConfirmation)) {
      deleteLevel(pathId, course.id, levelId);
    }
  }

  return (
    <main ref={swipeBackRef} className="flex-1 p-6 md:p-10 overflow-y-auto animate-fadeIn">
      <div className="max-w-7xl mx-auto">
        <button onClick={onClose} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 font-semibold transition-colors">
          <ArrowLeft size={20} />
          Trở về {path.name}
        </button>

        {/* Course Header */}
        <div className="flex justify-between items-start gap-4 mb-4">
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">{course.name}</h2>
            {isAdmin && (
                <div className="flex-shrink-0 flex items-center gap-2">
                    <button onClick={() => onEdit(course, 'course', { pathId })} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full" aria-label={UI_STRINGS.edit}><Pencil size={20} /></button>
                    <button onClick={handleDeleteCourse} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-red-500" aria-label={UI_STRINGS.delete}><Trash2 size={20} /></button>
                </div>
            )}
        </div>
        
        {/* Badges */}
        <div className="flex items-center flex-wrap gap-2 mb-10">
            <Badge colorScheme="gray" icon={Calendar}>Năm {course.year}</Badge>
            <Badge colorScheme="blue" icon={Users}>Tuổi {course.ageGroup}</Badge>
            {course.language && <Badge colorScheme="green" icon={Code}>{course.language}</Badge>}
            {course.tools?.map(tool => <Badge key={tool} colorScheme="yellow" icon={Wrench}>{tool}</Badge>)}
        </div>

        <div className="space-y-10">
            {/* Course Content & Objectives */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                    <h3 className="font-bold text-xl mb-3 text-gray-800 dark:text-gray-200 flex items-center gap-2"><BookOpen size={20} className="text-[#E31F26]" /> {UI_STRINGS.courseContent}</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{course.content}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                    <h3 className="font-bold text-xl mb-3 text-gray-800 dark:text-gray-200 flex items-center gap-2"><Users size={20} className="text-[#E31F26]" /> {UI_STRINGS.courseObjectives}</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{course.objectives}</p>
                </div>
            </div>

            {/* Course Documents */}
            {(course.documents.length > 0 || isAdmin) && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-xl text-gray-800 dark:text-gray-200 flex items-center gap-2"><FileText size={20} className="text-[#E31F26]"/> Tài liệu</h3>
                        {isAdmin && <button onClick={() => onEdit(null, 'document', { pathId, courseId: course.id })} className="flex items-center gap-1 text-sm text-[#E31F26] hover:underline"><PlusCircle size={16} /></button>}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {course.documents.map(doc => <DocumentLink key={doc.id} document={doc} parentId={{ pathId, courseId: course.id }} onEdit={(d) => onEdit(d, 'document', { pathId, courseId: course.id })} />)}
                    </div>
                </div>
            )}

             {/* Levels */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-2xl text-gray-800 dark:text-gray-200">{UI_STRINGS.levels}</h3>
                    {isAdmin && <button onClick={() => onEdit(null, 'level', { pathId, courseId: course.id })} className="flex items-center gap-1 text-sm text-[#E31F26] hover:underline"><PlusCircle size={16} />{UI_STRINGS.addLevel}</button>}
                </div>
                <div className="space-y-4">
                    {course.levels.map(level => (
                       <LevelAccordion 
                        key={level.id}
                        level={level}
                        isOpen={openLevelId === level.id}
                        onToggle={() => toggleLevel(level.id)}
                        onEditLevel={() => onEdit(level, 'level', { pathId, courseId: course.id })}
                        onDelete={() => handleDeleteLevel(level.id)}
                        onAddDocument={() => onEdit(null, 'document', { pathId, courseId: course.id, levelId: level.id })}
                        onEditDocument={(d) => onEdit(d, 'document', { pathId, courseId: course.id, levelId: level.id })}
                        isAdmin={isAdmin}
                        parentId={{ pathId, courseId: course.id, levelId: level.id }}
                       />
                    ))}
                </div>
            </div>
        </div>
      </div>
    </main>
  );
};