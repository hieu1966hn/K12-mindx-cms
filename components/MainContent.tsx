import React, { useContext, useState, useCallback } from 'react';
import { AppContext } from '../context/AppContext';
import { UI_STRINGS } from '../constants';
import { Course, ParentId, ItemType, EditableItem } from '../types';
import { DocumentLink } from './DocumentLink';
import { PlusCircle, ArrowLeft } from 'lucide-react';
import { HomePage } from './HomePage';
import { EditModal } from './EditModal';
import { EmptyState } from './common/EmptyState';
import { CourseCard } from './CourseCard';
import { CourseDetailView } from './CourseDetailView';
import { useSwipeBack } from '../hooks/useSwipeBack';
import { Skeleton } from './common/Skeleton';

// Component hiển thị khung xương (skeleton) cho danh sách khóa học khi đang tải dữ liệu.
// Cung cấp trải nghiệm người dùng tốt hơn thay vì một màn hình trắng.
const CourseListSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="bg-white dark:bg-gray-800/50 rounded-2xl border border-black/5 dark:border-white/5 overflow-hidden flex flex-col">
          <Skeleton className="h-48" />
          <div className="p-6 flex flex-col flex-grow">
            <Skeleton className="h-6 w-3/4 mb-4" />
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-5/6 mb-6" />
            <div className="mt-auto pt-5 border-t border-black/5 dark:border-white/10">
                <Skeleton className="h-6 w-1/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

// Component chính hiển thị nội dung, thay đổi tùy theo lựa chọn của người dùng.
// Nó hoạt động như một "router" đơn giản, quyết định hiển thị trang chủ,
// danh sách khóa học, hoặc chi tiết một khóa học.
export const MainContent: React.FC = () => {
  const context = useContext(AppContext);
  // State để quản lý việc mở/đóng và dữ liệu cho modal chỉnh sửa (thêm/sửa).
  const [editingState, setEditingState] = useState<{item: EditableItem | null, type: ItemType, parentId: ParentId} | null>(null);

  // Lấy các giá trị cần thiết từ context. Các hooks phải được gọi ở cấp cao nhất.
  const { setSelectedPathId, data, loading, selectedPathId, selectedCourseId, currentUser } = context ?? {};
  
  // Hàm callback để quay về trang chủ.
  const handleBackToHome = useCallback(() => {
    if (setSelectedPathId) {
      setSelectedPathId(null);
    }
  }, [setSelectedPathId]);

  // Xác định xem hook `useSwipeBack` có nên được kích hoạt hay không.
  // Chỉ kích hoạt trên màn hình danh sách khóa học.
  const selectedPathForHook = data?.find(p => p.id === selectedPathId);
  const selectedCourseForHook = selectedPathForHook?.courses.find(c => c.id === selectedCourseId);
  const isCourseListVisible = !loading && !!selectedPathForHook && !selectedCourseForHook;
  
  // Hook để cho phép người dùng vuốt để quay lại trên thiết bị di động.
  const swipeBackRef = useSwipeBack(handleBackToHome, isCourseListVisible);


  if (!context) return null; // Guard clause

  const { setSelectedCourseId: ctxSetSelectedCourseId } = context;
  const isAdmin = currentUser?.role === 'admin';

  // Hàm để mở modal chỉnh sửa, được truyền xuống các component con.
  const handleEdit = useCallback((item: EditableItem | null, type: ItemType, parentId: ParentId) => {
      setEditingState({item, type, parentId});
  }, []);

  // Hàm để đóng modal chỉnh sửa.
  const handleCloseModal = useCallback(() => {
      setEditingState(null);
  }, []);

  // --- Logic hiển thị theo thứ tự ưu tiên ---

  // 1. Hiển thị skeleton khi đang tải dữ liệu lần đầu.
  if (loading) {
    return (
      <main className="flex-1 p-6 sm:p-10 lg:p-14 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-8 w-1/3 mb-4" />
          <Skeleton className="h-12 w-3/5 mb-10" />
          <CourseListSkeleton />
        </div>
      </main>
    );
  }

  // 2. Hiển thị trang chủ nếu không có lộ trình nào được chọn.
  if (!selectedPathId) {
    return <HomePage />;
  }
  
  const selectedPath = data.find(p => p.id === selectedPathId);

  // 3. Xử lý trường hợp ID lộ trình không hợp lệ (ví dụ: đã bị xóa nhưng còn trong localStorage).
  if (!selectedPath) {
    // Điều này có thể xảy ra nếu ID trong localStorage đã cũ.
    // Effect trong context sẽ xóa nó, nhưng điều này ngăn chặn crash trước khi effect chạy.
    return (
      <main className="flex-1 p-6 sm:p-10 lg:p-14 overflow-y-auto">
        <EmptyState message="Lộ trình học không tồn tại hoặc đã bị xóa." />
      </main>
    );
  }
  
  const selectedCourse = selectedPath.courses.find(c => c.id === selectedCourseId);

  // 4. Hiển thị chi tiết khóa học nếu một khóa học được chọn.
  if (selectedCourse) {
    return (
        <>
          <CourseDetailView 
            course={selectedCourse} 
            path={selectedPath}
            onEdit={handleEdit}
            onClose={() => ctxSetSelectedCourseId(null)}
          />
          {/* Modal chỉnh sửa sẽ hiển thị nếu `editingState` có giá trị */}
          {editingState && <EditModal item={editingState.item} type={editingState.type} parentId={editingState.parentId} onClose={handleCloseModal} />}
        </>
    );
  }
  
  // 5. Mặc định: Hiển thị danh sách các khóa học trong lộ trình đã chọn.
  const courses = selectedPath.courses;

  return (
    <>
      <main ref={swipeBackRef} className="flex-1 p-6 sm:p-10 lg:p-14 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header của trang danh sách khóa học */}
          <div className="mb-10">
              {/* Nút quay lại */}
              <button onClick={handleBackToHome} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 font-semibold transition-colors">
                <ArrowLeft size={20} />
                Trở về {UI_STRINGS.home}
              </button>
              {/* Tiêu đề và nút "Thêm khóa học" cho admin */}
              <div className="flex flex-wrap justify-between items-center gap-4">
                  <h2 className="text-4xl md:text-5xl font-extrabold text-[#E31F26]">{selectedPath.name}</h2>
                  {isAdmin && (
                      <button onClick={() => handleEdit(null, 'course', { pathId: selectedPath.id })} className="flex items-center gap-2 bg-[#E31F26] text-white font-semibold py-2.5 px-5 rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20">
                          <PlusCircle size={20}/>
                          {UI_STRINGS.addCourse}
                      </button>
                  )}
              </div>
              {/* Hiển thị tài liệu của lộ trình */}
              { (selectedPath.documents.length > 0 || isAdmin) &&
                  <div className="mt-6">
                       <div className="flex justify-between items-center mb-3">
                          <h4 className="text-lg font-semibold text-[#E31F26]">Tài liệu lộ trình</h4>
                          {isAdmin && <button onClick={() => handleEdit(null, 'document', {pathId: selectedPath.id})} className="flex items-center gap-1 text-sm text-[#E31F26] hover:underline"><PlusCircle size={16}/>{UI_STRINGS.addDocument}</button>}
                      </div>
                      <div className="flex flex-wrap gap-3">
                          {selectedPath.documents.map(doc => <DocumentLink key={doc.id} document={doc} parentId={{pathId: selectedPath.id}} onEdit={(d) => handleEdit(d, 'document', {pathId: selectedPath.id})}/>)}
                      </div>
                  </div>
              }
          </div>
          {/* Danh sách các thẻ khóa học */}
          {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {courses.map((course) => <CourseCard key={course.id} course={course} pathId={selectedPath.id} onEdit={handleEdit} />)}
          </div>
          ) : (
          <EmptyState message="Chưa có khóa học nào trong lộ trình này." />
          )}
        </div>
      </main>
      {/* Modal chỉnh sửa */}
      {editingState && <EditModal item={editingState.item} type={editingState.type} parentId={editingState.parentId} onClose={handleCloseModal} />}
    </>
  );
};