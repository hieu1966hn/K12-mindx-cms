
import React, { createContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { AppContextType, User, LearningPath, Course, Level, Document, ParentId } from '../types';
import { INITIAL_DATA, UI_STRINGS } from '../constants';
import { USER_CREDENTIALS } from '../data/auth';

export const AppContext = createContext<AppContextType | null>(null);

interface AppProviderProps {
  children: ReactNode;
}

const generateId = (prefix: string) => `${prefix}-${Date.now()}`;
const deepCopy = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [publishedData, setPublishedData] = useState<LearningPath[]>(() => {
    try {
        const savedData = localStorage.getItem('cmsData');
        return savedData ? JSON.parse(savedData) : INITIAL_DATA;
    } catch (error) {
        console.error("Failed to load data from localStorage", error);
        return INITIAL_DATA;
    }
  });

  const [draftData, setDraftData] = useState<LearningPath[]>(() => deepCopy(publishedData));

  const [selectedPathId, setSelectedPathId] = useState<string | null>(() => localStorage.getItem('selectedPathId'));
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(() => localStorage.getItem('selectedCourseId'));

  const hasUnsavedChanges = useMemo(() => 
    JSON.stringify(draftData) !== JSON.stringify(publishedData),
    [draftData, publishedData]
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const path = draftData.find(p => p.id === selectedPathId);
    if (!path) {
        if (selectedPathId !== null) setSelectedPathId(null);
        if (selectedCourseId !== null) setSelectedCourseId(null);
        return;
    }
    const course = path.courses.find(c => c.id === selectedCourseId);
    if (selectedCourseId && !course) {
        if (selectedCourseId !== null) setSelectedCourseId(null);
    }
  }, [draftData, selectedPathId, selectedCourseId]);

  useEffect(() => {
    if (selectedPathId) localStorage.setItem('selectedPathId', selectedPathId);
    else localStorage.removeItem('selectedPathId');
  }, [selectedPathId]);

  useEffect(() => {
    if (selectedCourseId) localStorage.setItem('selectedCourseId', selectedCourseId);
    else localStorage.removeItem('selectedCourseId');
  }, [selectedCourseId]);

  const saveChanges = () => {
    setPublishedData(draftData);
    localStorage.setItem('cmsData', JSON.stringify(draftData));
  };

  const discardChanges = () => {
    setDraftData(deepCopy(publishedData));
  };

  const login = (username: string, pass: string): boolean => {
    const foundUser = USER_CREDENTIALS.find(
      (cred) => cred.username.toLowerCase() === username.toLowerCase() && cred.password === pass
    );
    if (foundUser) {
      setCurrentUser({ username: foundUser.username, role: foundUser.role });
      return true;
    }
    return false;
  };

  const logout = () => {
    if (hasUnsavedChanges) {
      if (window.confirm("Bạn có các thay đổi chưa được lưu. Bạn có muốn hủy bỏ chúng và đăng xuất không?")) {
        discardChanges();
        setCurrentUser(null);
      }
    } else {
      setCurrentUser(null);
    }
  };

  const addCourse = (pathId: string, courseData: Omit<Course, 'id' | 'levels' | 'documents'>) => {
    const newCourse: Course = { ...courseData, id: generateId('c'), levels: [], documents: [] };
    setDraftData(d => d.map(p => p.id === pathId ? { ...p, courses: [...p.courses, newCourse] } : p));
  };

  const updateCourse = (pathId: string, courseId: string, updates: Partial<Course>) => {
    setDraftData(d => d.map(p => p.id === pathId ? { ...p, courses: p.courses.map(c => c.id === courseId ? {...c, ...updates} : c) } : p));
  };

  const deleteCourse = (pathId: string, courseId: string) => {
    setDraftData(d => d.map(p => p.id === pathId ? { ...p, courses: p.courses.filter(c => c.id !== courseId) } : p));
  };
  
  const addLevel = (pathId: string, courseId: string, levelData: Omit<Level, 'id' | 'documents'>) => {
    const newLevel: Level = { ...levelData, id: generateId('l'), documents: [] };
    setDraftData(d => d.map(p => p.id === pathId ? { ...p, courses: p.courses.map(c => c.id === courseId ? { ...c, levels: [...c.levels, newLevel] } : c) } : p));
  };

  const updateLevel = (pathId: string, courseId: string, levelId: string, updates: Partial<Level>) => {
    setDraftData(d => d.map(p => p.id === pathId ? { ...p, courses: p.courses.map(c => c.id === courseId ? { ...c, levels: c.levels.map(l => l.id === levelId ? {...l, ...updates} : l) } : c) } : p));
  };

  const deleteLevel = (pathId: string, courseId: string, levelId: string) => {
    setDraftData(d => d.map(p => p.id === pathId ? { ...p, courses: p.courses.map(c => c.id === courseId ? { ...c, levels: c.levels.filter(l => l.id !== levelId) } : c) } : p));
  };

  const addDocument = (parentId: ParentId, documentData: Omit<Document, 'id'>) => {
    const newDocument: Document = { ...documentData, id: generateId('doc') };
    const {pathId, courseId, levelId} = parentId;
    setDraftData(d => d.map(p => {
        if (p.id !== pathId) return p;
        if (!courseId) return { ...p, documents: [...p.documents, newDocument] };
        return { ...p, courses: p.courses.map(c => {
          if (c.id !== courseId) return c;
          if (!levelId) return { ...c, documents: [...c.documents, newDocument] };
          return { ...c, levels: c.levels.map(l => l.id !== levelId ? l : { ...l, documents: [...l.documents, newDocument] }) };
        })};
    }));
  };
  
  const updateDocument = (parentId: ParentId, documentId: string, updates: Partial<Document>) => {
    const {pathId, courseId, levelId} = parentId;
    setDraftData(d => d.map(p => {
        if (p.id !== pathId) return p;
        if (!courseId) return { ...p, documents: p.documents.map(doc => doc.id === documentId ? {...doc, ...updates} : doc) };
        return { ...p, courses: p.courses.map(c => {
          if (c.id !== courseId) return c;
          if (!levelId) return { ...c, documents: c.documents.map(doc => doc.id === documentId ? {...doc, ...updates} : doc) };
          return { ...c, levels: c.levels.map(l => l.id !== levelId ? l : { ...l, documents: l.documents.map(doc => doc.id === documentId ? {...doc, ...updates} : doc) }) };
        })};
    }));
  };

  const deleteDocument = (parentId: ParentId, documentId: string) => {
    const {pathId, courseId, levelId} = parentId;
    setDraftData(d => d.map(p => {
        if (p.id !== pathId) return p;
        if (!courseId) return { ...p, documents: p.documents.filter(doc => doc.id !== documentId) };
        return { ...p, courses: p.courses.map(c => {
          if (c.id !== courseId) return c;
          if (!levelId) return { ...c, documents: c.documents.filter(doc => doc.id !== documentId) };
          return { ...c, levels: c.levels.map(l => l.id !== levelId ? l : { ...l, documents: l.documents.filter(doc => doc.id !== documentId) }) };
        })};
    }));
  };

  const contextValue: AppContextType = {
    currentUser,
    login,
    logout,
    data: draftData,
    setData: setDraftData,
    selectedPathId,
    setSelectedPathId,
    selectedCourseId,
    setSelectedCourseId,
    hasUnsavedChanges,
    saveChanges,
    discardChanges,
    addCourse,
    updateCourse,
    deleteCourse,
    addLevel,
    updateLevel,
    deleteLevel,
    addDocument,
    updateDocument,
    deleteDocument,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};