import React, { useContext, useCallback, memo } from 'react';
import { AppContext } from '../context/AppContext';
import { UI_STRINGS } from '../constants';
import { Course, ParentId, ItemType, EditableItem } from '../types';
import { Pencil, Trash2, Calendar, Users, Wrench, ArrowRight } from 'lucide-react';
import { Badge } from './common/Badge';
import { MarkdownRenderer } from './common/MarkdownRenderer';

interface CourseCardProps {
  course: Course;
  pathId: string;
  onEdit: (item: EditableItem, type: ItemType, parentId: ParentId) => void;
}

/**
 * Component PlaceholderImage tạo ra một hình ảnh gradient làm ảnh đại diện mặc định
 * cho các khóa học không có `imageUrl`.
 * Màu gradient được chọn một cách ngẫu nhiên nhưng nhất quán dựa trên ID của khóa học.
 */
const PlaceholderImage = memo(({ courseId }: { courseId: string }) => {
  const gradients = [
    'from-blue-400 to-cyan-300 dark:from-blue-900/70 dark:to-cyan-800/70',
    'from-red-400 to-orange-300 dark:from-red-900/70 dark:to-orange-800/70',
    'from-green-400 to-teal-300 dark:from-green-900/70 dark:to-teal-800/70',
    'from-purple-400 to-indigo-300 dark:from-purple-900/70 dark:to-indigo-800/70',
    'from-pink-400 to-rose-300 dark:from-pink-900/70 dark:to-rose-800/70',
  ];
  // Chọn một gradient dựa trên ký tự cuối của courseId để đảm bảo mỗi card có màu khác nhau nhưng ổn định.
  const index = (courseId.charCodeAt(courseId.length - 1) || 0) % gradients.length;
  const gradientClass = gradients[index];

  return <div className={`w-full h-full bg-gradient-to-br ${gradientClass} transition-transform duration-500 ease-in-out group-hover:scale-110`} />;
});

/**
 * Component CourseCard hiển thị thông tin tóm tắt của một khóa học
 * trong danh sách các khóa học.
 */
export const CourseCard: React.FC<CourseCardProps> = memo(({ course, pathId, onEdit }) => {
  const context = useContext(AppContext);
  if (!context) return null;
  const {
    setSelectedCourseId,
    currentUser,
    deleteCourse,
  } = context;

  const isAdmin = currentUser?.role === 'admin';

  // Hàm xử lý khi admin xóa khóa học.
  const handleDeleteCourse = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Ngăn sự kiện click lan ra thẻ card chính, tránh việc điều hướng.
    if (window.confirm(UI_STRINGS.deleteConfirmation)) {
      deleteCourse(pathId, course.id);
    }
  }, [deleteCourse, pathId, course.id]);
  
  // Hàm xử lý khi admin sửa khóa học.
  const handleEditCourse = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(course, 'course', { pathId });
  }, [onEdit, course, pathId]);

  // Hàm xử lý khi người dùng click vào thẻ để xem chi tiết.
  const handleShowDetailsClick = useCallback(() => {
    setSelectedCourseId(course.id);
  }, [setSelectedCourseId, course.id]);

  return (
    <div
      onClick={handleShowDetailsClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleShowDetailsClick()}
      role="button"
      tabIndex={0}
      className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-black/5 dark:border-white/5 md:hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col group relative cursor-pointer focus:outline-none shadow-lg shadow-gray-400/10 dark:shadow-black/20 hover:shadow-xl hover:shadow-gray-500/10 dark:hover:shadow-black/30"
    >
      {/* Các nút điều khiển Sửa/Xóa, chỉ hiển thị cho admin và khi hover */}
      {isAdmin && (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button onClick={handleEditCourse} className="p-2 bg-black/40 hover:bg-black/60 rounded-full text-white backdrop-blur-sm" aria-label={UI_STRINGS.edit}>
            <Pencil size={16} />
          </button>
          <button onClick={handleDeleteCourse} className="p-2 bg-black/40 hover:bg-black/60 rounded-full text-white backdrop-blur-sm" aria-label={UI_STRINGS.delete}>
            <Trash2 size={16} />
          </button>
        </div>
      )}

      {/* Vùng hiển thị ảnh đại diện */}
      <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center relative overflow-hidden">
        {course.imageUrl ? (
          <img
            src={course.imageUrl}
            alt={course.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out md:group-hover:scale-110"
          />
        ) : (
          <PlaceholderImage courseId={course.id} />
        )}
      </div>

      {/* Vùng nội dung text của thẻ */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-[#E31F26] mb-3 transition-colors duration-300">
          {course.name}
        </h3>
        
        {/* Các badge thông tin */}
        <div className="flex flex-wrap items-center gap-2">
            <Badge colorScheme="orange" icon={Calendar}>Năm {course.year}</Badge>
            <Badge colorScheme="blue" icon={Users}>{course.ageGroup}</Badge>
            {course.tools?.[0] && (
              <Badge colorScheme="yellow" icon={Wrench}>
                {course.tools[0]}
              </Badge>
            )}
        </div>

        {/* Mô tả ngắn */}
        <div className="mt-4 text-gray-600 dark:text-gray-400 text-sm flex-grow line-clamp-2">
          <MarkdownRenderer text={course.content} />
        </div>
        
        {/* Nút "Xem chi tiết" */}
        <div className="mt-6 pt-5 border-t border-black/5 dark:border-white/10 flex justify-between items-center">
            <span className="font-bold text-[#E31F26]">Xem chi tiết</span>
            <ArrowRight size={20} className="text-[#E31F26] md:group-hover:translate-x-1.5 transition-transform" />
        </div>
      </div>
    </div>
  );
});