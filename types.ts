export enum LearningPathName {
  CODING_AI = 'Coding & AI',
  ART_DESIGN = 'Art & Design',
  ROBOTICS = 'Robotics',
}

export enum LevelName {
  BASIC = 'Cơ bản',
  ADVANCED = 'Nâng cao',
  INTENSIVE = 'Chuyên sâu',
}

export enum DocumentCategory {
  ROADMAP = 'Roadmap',
  SYLLABUS = 'Syllabus',
  TRIAL = 'Trial',
  LESSON_PLAN = 'Lesson Plan',
  TEACHING_GUIDE = 'Teaching Guide',
  SLIDE = 'Slide',
  PROJECT = 'Project',
  HOMEWORK = 'Homework',
  CHECKPOINT = 'Checkpoint',
  STUDENT_BOOK = 'Student Book',
}

export interface Document {
  id: string;
  category: DocumentCategory;
  name: string;
  url: string;
}

export interface Level {
  id: string;
  name: LevelName;
  content: string;
  objectives: string;
  documents: Document[];
}

export interface Course {
  id:string;
  name: string;
  year: number;
  ageGroup: string;
  language?: string;
  tools?: string[];
  content: string;
  objectives: string;
  levels: Level[];
  documents: Document[];
}

export interface LearningPath {
  id: string;
  name: LearningPathName;
  courses: Course[];
  documents: Document[];
}

export interface User {
  username: string;
  role: 'admin' | 'user';
}

export type EditableItem = Course | Level | Document | LearningPath;
export type ItemType = 'course' | 'level' | 'document' | 'learningPath';
export type ParentId = {pathId: string, courseId?: string, levelId?: string};

export interface SearchResult {
  id: string;
  type: 'course' | 'document';
  name: string;
  context: string; 
  pathId: string;
  courseId?: string;
  url?: string;
}

export interface AppContextType {
  data: LearningPath[];
  setData: React.Dispatch<React.SetStateAction<LearningPath[]>>;
  currentUser: User | null;
  login: (username: string, pass: string) => boolean;
  logout: () => void;
  selectedPathId: string | null;
  setSelectedPathId: (id: string | null) => void;
  selectedCourseId: string | null;
  setSelectedCourseId: (id: string | null) => void;

  // Edit mode
  hasUnsavedChanges: boolean;
  saveChanges: () => void;
  discardChanges: () => void;

  // CRUD operations
  addCourse: (pathId: string, courseData: Omit<Course, 'id' | 'levels' | 'documents'>) => void;
  updateCourse: (pathId: string, courseId: string, updates: Partial<Course>) => void;
  deleteCourse: (pathId: string, courseId: string) => void;
  
  addLevel: (pathId: string, courseId: string, levelData: Omit<Level, 'id' | 'documents'>) => void;
  updateLevel: (pathId: string, courseId: string, levelId: string, updates: Partial<Level>) => void;
  deleteLevel: (pathId: string, courseId: string, levelId: string) => void;
  
  addDocument: (parentId: ParentId, documentData: Omit<Document, 'id'>) => void;
  updateDocument: (parentId: ParentId, documentId: string, updates: Partial<Document>) => void;
  deleteDocument: (parentId: ParentId, documentId: string) => void;
}