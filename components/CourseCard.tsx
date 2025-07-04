

import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { UI_STRINGS } from '../constants';
import { Course, ParentId, ItemType, EditableItem } from '../types';
import { Pencil, Trash2, Calendar, Users, Wrench, Code } from 'lucide-react';
import { Badge } from './common/Badge';


interface CourseCardProps {
  course: Course;
  pathId: string;
  onEdit: (item: EditableItem, type: ItemType, parentId: ParentId) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, pathId, onEdit }) => {
  const context = useContext(AppContext);
  if(!context) return null;
  const { 
      setSelectedCourseId, 
      currentUser,
      deleteCourse,
  } = context;

  const isAdmin = currentUser?.role === 'admin';

  const handleDeleteCourse = (e: React.MouseEvent) => {
    e.stopPropagation();
    if(window.confirm(UI_STRINGS.deleteConfirmation)) {
        deleteCourse(pathId, course.id);
    }
  };

  return (
    <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-[#E31F26]/50 hover:-translate-y-1 cursor-pointer group"
        onClick={() => setSelectedCourseId(course.id)}
    >
      <div className="p-6">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-[#E31F26] transition-colors">{course.name}</h3>
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
              <div className="flex-shrink-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => { e.stopPropagation(); onEdit(course, 'course', { pathId })}} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300" aria-label={UI_STRINGS.edit}><Pencil size={18} /></button>
                  <button onClick={handleDeleteCourse} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-red-500" aria-label={UI_STRINGS.delete}><Trash2 size={18} /></button>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};