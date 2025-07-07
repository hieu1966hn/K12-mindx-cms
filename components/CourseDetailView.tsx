import React, { useContext, useState, useCallback, memo, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { Course, LearningPath, Level, EditableItem, ItemType, ParentId, Document, LevelName } from '../types';
import { UI_STRINGS } from '../constants';
import { DocumentLink } from './DocumentLink';
import { Badge } from './common/Badge';
import { Pencil, Trash2, PlusCircle, Calendar, Users, Wrench, Code, ArrowLeft, BookOpen, FileText, Layers, CheckCircle, Files, BarChartHorizontal, BarChartHorizontalBig, Zap } from 'lucide-react';
import { useSwipeBack } from '../hooks/useSwipeBack';
import { MarkdownRenderer } from './common/MarkdownRenderer';

// --- Các component con để cấu trúc code tốt hơn và dễ đọc hơn ---

// Component hiển thị phần đầu của trang chi tiết khóa học.
const CourseDetailHeader: React.FC<{
  course: Course;
  pathName: string;
  isAdmin: boolean;
  onClose: () => void; // Hàm xử lý khi nhấn nút quay lại
  onEdit: () => void; // Hàm xử lý khi nhấn nút chỉnh sửa
  onDelete: () => void; // Hàm xử lý khi nhấn nút xóa
}> = memo(({ course, pathName, isAdmin, onClose, onEdit, onDelete }) => (
  <>
    <div className="flex justify-between items-start gap-4 mb-4">
      <div>
        <button onClick={onClose} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 font-semibold transition-colors">
          <ArrowLeft size={20} />
          Trở về {pathName}
        </button>
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#E31F26]">{course.name}</h2>
      </div>
      {/* Các nút điều khiển chỉ hiển thị cho admin */}
      {isAdmin && (
        <div className="flex-shrink-0 flex items-center gap-2 mt-16">
          <button onClick={onEdit} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full" aria-label={UI_STRINGS.edit}><Pencil size={20} /></button>
          <button onClick={onDelete} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full text-red-500" aria-label={UI_STRINGS.delete}><Trash2 size={20} /></button>
        </div>
      )}
    </div>

    {/* Hiển thị các badge thông tin về khóa học */}
    <div className="flex items-center flex-wrap gap-2 mb-12">
      <Badge colorScheme="orange" icon={Calendar}>Năm {course.year}</Badge>
      <Badge colorScheme="blue" icon={Users}>Tuổi {course.ageGroup}</Badge>
      {course.language && <Badge colorScheme="green" icon={Code}>{course.language}</Badge>}
      {course.tools?.map(tool => <Badge key={tool} colorScheme="yellow" icon={Wrench}>{tool}</Badge>)}
    </div>
  </>
));

// Interface cho các props liên quan đến chức năng kéo-thả.
interface DraggableProps {
    draggedDocId: string | null; // ID của tài liệu đang được kéo
    dragOverDocId: string | null; // ID của tài liệu đang bị kéo qua
    handleDragStart: (e: React.DragEvent, doc: Document, parentId: ParentId) => void;
    handleDragEnter: (e: React.DragEvent, doc: Document, parentId: ParentId) => void;
    handleDragEnd: (e: React.DragEvent) => void;
    handleDrop: (e: React.DragEvent, parentId: ParentId) => void;
}

// Component hiển thị thông tin chính của khóa học (cột bên trái).
const CourseInfoCard: React.FC<{
    course: Course;
    path: LearningPath;
    isAdmin: boolean;
    onEdit: (item: EditableItem | null, type: ItemType, parentId: ParentId) => void;
    dnd: DraggableProps; // Props cho kéo-thả
}> = memo(({ course, path, isAdmin, onEdit, dnd }) => {
    const parentId = { pathId: path.id, courseId: course.id };
    return (
        <div className="lg:col-span-1 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-6 lg:p-8 rounded-2xl border border-black/5 dark:border-white/5 space-y-8">
            <section>
                 <h3 className="font-bold text-xl text-[#E31F26] mb-3 flex items-center gap-3">
                    <BookOpen size={22} /> {UI_STRINGS.courseContent}
                </h3>
                <MarkdownRenderer as="p" text={course.content} className="text-gray-600 dark:text-gray-400" />
            </section>
            
            <section>
                <h3 className="font-bold text-xl text-[#E31F26] mb-3 flex items-center gap-3">
                    <CheckCircle size={22} /> {UI_STRINGS.courseObjectives}
                </h3>
                <MarkdownRenderer as="p" text={course.objectives} className="text-gray-600 dark:text-gray-400" />
            </section>
            
            {/* Danh sách tài liệu của khóa học, chỉ hiển thị nếu có tài liệu hoặc là admin */}
            {(course.documents.length > 0 || isAdmin) && (
                <section>
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-xl text-[#E31F26] flex items-center gap-3">
                            <Files size={22} /> Tài liệu khóa học
                        </h3>
                        {isAdmin && (
                            <button onClick={() => onEdit(null, 'document', parentId)} className="flex items-center gap-1 text-sm text-[#E31F26] hover:underline">
                                <PlusCircle size={16} />{UI_STRINGS.addDocument}
                            </button>
                        )}
                    </div>
                    {/* Khu vực cho phép thả (drop zone) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" onDrop={(e) => dnd.handleDrop(e, parentId)} onDragOver={e => e.preventDefault()}>
                        {course.documents.map(doc => (
                            <div
                                key={doc.id}
                                draggable={isAdmin} // Chỉ cho phép kéo nếu là admin
                                onDragStart={(e) => dnd.handleDragStart(e, doc, parentId)}
                                onDragEnter={(e) => dnd.handleDragEnter(e, doc, parentId)}
                                onDragEnd={dnd.handleDragEnd}
                                className="transition-all"
                            >
                                <DocumentLink 
                                    document={doc} 
                                    parentId={parentId} 
                                    onEdit={(d) => onEdit(d, 'document', parentId)} 
                                    isDragging={dnd.draggedDocId === doc.id}
                                    isDragOver={dnd.draggedDocId !== doc.id && dnd.dragOverDocId === doc.id}
                                />
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
});

const levelIcons: Record<LevelName, React.ElementType> = {
    [LevelName.BASIC]: BarChartHorizontal,
    [LevelName.ADVANCED]: BarChartHorizontalBig,
    [LevelName.INTENSIVE]: Zap,
};

// Component hiển thị các cấp độ (levels) của khóa học (cột bên phải).
const LevelsCard: React.FC<{
    course: Course;
    pathId: string;
    isAdmin: boolean;
    onEdit: (item: EditableItem | null, type: ItemType, parentId: ParentId) => void;
    onDeleteLevel: (levelId: string) => void;
    dnd: DraggableProps;
}> = memo(({ course, pathId, isAdmin, onEdit, onDeleteLevel, dnd }) => {
    // State để theo dõi cấp độ nào đang được chọn để hiển thị chi tiết.
    const [selectedLevelId, setSelectedLevelId] = useState<string | null>(course.levels[0]?.id || null);

    const handleLevelSelect = (levelId: string) => {
        setSelectedLevelId(levelId);
    };

    if (!course.levels.length && !isAdmin) return null;

    const selectedLevelIndex = course.levels.findIndex(level => level.id === selectedLevelId);
    const progressWidth = course.levels.length > 0 ? ((selectedLevelIndex + 1) / course.levels.length) * 100 : 0;

    return (
        <div className="lg:col-span-1">
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-black/5 dark:border-white/5 lg:sticky lg:top-24">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-xl text-[#E31F26] flex items-center gap-3">
                        <Layers size={22} /> {UI_STRINGS.levels}
                    </h3>
                    {isAdmin && (
                        <button onClick={() => onEdit(null, 'level', { pathId: pathId, courseId: course.id })} className="flex items-center gap-1 text-sm text-[#E31F26] hover:underline">
                            <PlusCircle size={16} />{UI_STRINGS.addLevel}
                        </button>
                    )}
                </div>
                
                {/* Các tab để chuyển đổi giữa các cấp độ */}
                <div className="w-full">
                    <div className="flex justify-between items-center gap-2 md:gap-4 mb-2">
                        {course.levels.map(level => {
                            const isSelected = selectedLevelId === level.id;
                            const Icon = levelIcons[level.name as LevelName] || FileText;
                            return (
                                <button
                                    key={level.id}
                                    onClick={() => handleLevelSelect(level.id)}
                                    className="flex-1 flex items-center gap-3 p-1 transition-all duration-300 rounded-lg focus:outline-none focus:ring-0 focus:ring-offset-0"
                                    aria-selected={isSelected}
                                >
                                    <div className={`p-2 rounded-lg transition-colors duration-300 ${isSelected ? 'bg-[#E31F26] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                                        <Icon size={20} />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <span className={`block font-bold text-sm transition-colors duration-300 ${isSelected ? 'text-gray-800 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
                                            {level.name}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div
                            className="bg-[#E31F26] h-1.5 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progressWidth}%` }}
                        />
                    </div>
                </div>

                {/* Nội dung chi tiết của cấp độ được chọn */}
                <div className="mt-4 min-h-[200px]">
                    {course.levels.map(level => (
                        <div key={level.id} role="tabpanel" hidden={selectedLevelId !== level.id} className={selectedLevelId === level.id ? 'animate-fade-in' : ''}>
                            {selectedLevelId === level.id && (
                                <div className="bg-gray-100/70 dark:bg-gray-900/40 p-5 rounded-lg relative">
                                    {isAdmin && (
                                        <div className="absolute top-3 right-3 flex items-center gap-1">
                                            <button onClick={() => onEdit(level, 'level', {pathId: pathId, courseId: course.id})} className="p-1.5 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full text-blue-600 dark:text-blue-400" aria-label={UI_STRINGS.edit}>
                                                <Pencil size={14} />
                                            </button>
                                            <button onClick={() => onDeleteLevel(level.id)} className="p-1.5 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full text-red-600 dark:text-red-400" aria-label={UI_STRINGS.delete}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    )}
                                    <section className="space-y-4">
                                        <div>
                                            <h4 className="font-semibold text-[#E31F26] flex items-center gap-2"><BookOpen size={16}/> {UI_STRINGS.levelContent}</h4>
                                            <MarkdownRenderer as="p" text={level.content} className="text-gray-600 dark:text-gray-400 mt-1 pl-8" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-[#E31F26] flex items-center gap-2"><CheckCircle size={16}/> {UI_STRINGS.levelObjectives}</h4>
                                            <MarkdownRenderer as="p" text={level.objectives} className="text-gray-600 dark:text-gray-400 mt-1 pl-8" />
                                        </div>
                                    </section>
                                    
                                    {(level.documents.length > 0 || isAdmin) && (
                                    <section className="mt-6">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-semibold text-[#E31F26] flex items-center gap-2"><Files size={16}/> {UI_STRINGS.documents}</h4>
                                            {isAdmin && <button onClick={() => onEdit(null, 'document', { pathId, courseId: course.id, levelId: level.id })} className="flex items-center gap-1 text-xs text-[#E31F26] hover:underline"><PlusCircle size={14}/>{UI_STRINGS.addDocument}</button>}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2" onDrop={(e) => dnd.handleDrop(e, { pathId, courseId: course.id, levelId: level.id })} onDragOver={e => e.preventDefault()}>
                                            {level.documents.map(doc => (
                                              <div
                                                key={doc.id}
                                                draggable={isAdmin}
                                                onDragStart={(e) => dnd.handleDragStart(e, doc, { pathId, courseId: course.id, levelId: level.id })}
                                                onDragEnter={(e) => dnd.handleDragEnter(e, doc, { pathId, courseId: course.id, levelId: level.id })}
                                                onDragEnd={dnd.handleDragEnd}
                                              >
                                                <DocumentLink 
                                                  document={doc}
                                                  parentId={{ pathId, courseId: course.id, levelId: level.id }}
                                                  onEdit={(d) => onEdit(d, 'document', { pathId, courseId: course.id, levelId: level.id })}
                                                  isDragging={dnd.draggedDocId === doc.id}
                                                  isDragOver={dnd.draggedDocId !== doc.id && dnd.dragOverDocId === doc.id}
                                                />
                                              </div>
                                            ))}
                                        </div>
                                    </section>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
});


// --- Component chính ---

interface CourseDetailViewProps {
  course: Course;
  path: LearningPath;
  onEdit: (item: EditableItem | null, type: ItemType, parentId: ParentId) => void;
  onClose: () => void;
}

// Component chính để hiển thị toàn bộ trang chi tiết khóa học.
export const CourseDetailView: React.FC<CourseDetailViewProps> = memo(({ course, path, onEdit, onClose }) => {
  const context = useContext(AppContext);
  // Hook cho phép vuốt để quay lại trên di động.
  const swipeBackRef = useSwipeBack(onClose);

  // State cho chức năng kéo-thả tài liệu.
  const [draggedDocId, setDraggedDocId] = useState<string | null>(null);
  const [dragOverDocId, setDragOverDocId] = useState<string | null>(null);
  // Ref để lưu parentId của tài liệu được kéo, nhằm đảm bảo chỉ có thể thả trong cùng một danh sách.
  const dragSourceParentId = useRef<ParentId | null>(null);

  if (!context) return null;
  
  const { currentUser, deleteCourse, deleteLevel: contextDeleteLevel, reorderDocuments } = context;
  const isAdmin = currentUser?.role === 'admin';
  const pathId = path.id;

  // Hàm xử lý việc xóa khóa học.
  const handleDeleteCourse = useCallback(() => {
    if (window.confirm(UI_STRINGS.deleteConfirmation)) {
      deleteCourse(pathId, course.id);
      onClose(); // Điều hướng về trang trước sau khi xóa.
    }
  }, [deleteCourse, pathId, course.id, onClose]);

  // Hàm xử lý việc xóa một cấp độ.
  const handleDeleteLevel = useCallback((levelId: string) => {
    if (window.confirm(UI_STRINGS.deleteConfirmation)) {
      contextDeleteLevel(pathId, course.id, levelId);
    }
  }, [contextDeleteLevel, pathId, course.id]);
  
  // --- Các hàm xử lý kéo-thả (Drag and Drop) ---

  // Khi bắt đầu kéo một tài liệu.
  const handleDragStart = useCallback((e: React.DragEvent, doc: Document, parentId: ParentId) => {
    if(!isAdmin) return;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', doc.id); // Cần thiết cho Firefox
    setDraggedDocId(doc.id);
    dragSourceParentId.current = parentId; // Lưu lại nguồn
  }, [isAdmin]);

  // Khi kéo một tài liệu đi vào khu vực của một tài liệu khác.
  const handleDragEnter = useCallback((e: React.DragEvent, doc: Document, parentId: ParentId) => {
    if(!isAdmin) return;
    e.preventDefault();
    // Chỉ cho phép sắp xếp lại trong cùng một danh sách (cùng parentId).
    if (JSON.stringify(dragSourceParentId.current) === JSON.stringify(parentId)) {
        if (doc.id !== draggedDocId) {
            setDragOverDocId(doc.id); // Đánh dấu vị trí sẽ thả
        }
    }
  }, [draggedDocId, isAdmin]);

  // Khi kết thúc kéo (dù thành công hay không).
  const handleDragEnd = useCallback((e: React.DragEvent) => {
    if(!isAdmin) return;
    setDraggedDocId(null);
    setDragOverDocId(null);
    dragSourceParentId.current = null;
  }, [isAdmin]);

  // Khi thả một tài liệu vào một vị trí hợp lệ.
  const handleDrop = useCallback((e: React.DragEvent, parentId: ParentId) => {
    e.preventDefault();
    if(!isAdmin) return;
    // Kiểm tra các điều kiện để đảm bảo việc thả là hợp lệ.
    if (!draggedDocId || !dragOverDocId || JSON.stringify(dragSourceParentId.current) !== JSON.stringify(parentId)) {
      handleDragEnd(e);
      return;
    }
    
    // Tìm danh sách tài liệu hiện tại (của khóa học hoặc của cấp độ).
    let currentDocuments: Document[] | undefined;
    if (parentId.levelId) {
        currentDocuments = course.levels.find(l => l.id === parentId.levelId)?.documents;
    } else {
        currentDocuments = course.documents;
    }

    if (!currentDocuments) return;

    // Tìm vị trí của tài liệu được kéo và vị trí đích.
    const draggedIndex = currentDocuments.findIndex(doc => doc.id === draggedDocId);
    const targetIndex = currentDocuments.findIndex(doc => doc.id === dragOverDocId);

    if (draggedIndex === -1 || targetIndex === -1 || draggedIndex === targetIndex) return;

    // Sắp xếp lại mảng tài liệu.
    const reorderedDocs = [...currentDocuments];
    const [draggedItem] = reorderedDocs.splice(draggedIndex, 1);
    reorderedDocs.splice(targetIndex, 0, draggedItem);
    
    const reorderedIds = reorderedDocs.map(doc => doc.id);
    // Gọi hàm từ context để cập nhật state và lưu.
    reorderDocuments(parentId, reorderedIds);

    handleDragEnd(e); // Dọn dẹp state kéo-thả.
  }, [draggedDocId, dragOverDocId, course.documents, course.levels, reorderDocuments, handleDragEnd, isAdmin]);

  // Gom các props và hàm xử lý dnd lại để truyền xuống component con.
  const dndProps = {
    draggedDocId,
    dragOverDocId,
    handleDragStart,
    handleDragEnter,
    handleDragEnd,
    handleDrop,
  };

  return (
    <main ref={swipeBackRef} className="flex-1 p-6 sm:p-10 lg:p-14 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <CourseDetailHeader
          course={course}
          pathName={path.name}
          isAdmin={isAdmin}
          onClose={onClose}
          onEdit={() => onEdit(course, 'course', { pathId })}
          onDelete={handleDeleteCourse}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <CourseInfoCard course={course} path={path} isAdmin={isAdmin} onEdit={onEdit} dnd={dndProps} />
            <LevelsCard course={course} pathId={pathId} isAdmin={isAdmin} onEdit={onEdit} onDeleteLevel={handleDeleteLevel} dnd={dndProps} />
        </div>
      </div>
    </main>
  );
});