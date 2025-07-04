
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { AppContextType, User, LearningPath, Course, Level, Document, ParentId } from '../types';
import { INITIAL_DATA } from '../constants';
import { USER_CREDENTIALS } from '../data/auth';

export const AppContext = createContext<AppContextType | null>(null);

interface AppProviderProps {
  children: ReactNode;
}

const generateId = (prefix: string) => `${prefix}-${Date.now()}`;

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [data, setData] = useState<LearningPath[]>(INITIAL_DATA);
  const [selectedPathId, setSelectedPathId] = useState<string | null>(() => localStorage.getItem('selectedPathId'));
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(() => localStorage.getItem('selectedCourseId'));

  useEffect(() => {
    // This effect synchronizes the app's theme with the system's theme preference.
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    
    // Listen for changes in the system theme.
    mediaQuery.addEventListener('change', handleChange);
    
    // Cleanup listener on component unmount.
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Validate state from localStorage against current data
  useEffect(() => {
    const path = data.find(p => p.id === selectedPathId);
    if (!path) {
        if (selectedPathId !== null) setSelectedPathId(null);
        if (selectedCourseId !== null) setSelectedCourseId(null);
        return;
    }

    const course = path.courses.find(c => c.id === selectedCourseId);
    if (selectedCourseId && !course) {
        if (selectedCourseId !== null) setSelectedCourseId(null);
    }
  }, [data, selectedPathId, selectedCourseId]);

  // Persist selection to localStorage
  useEffect(() => {
    if (selectedPathId) {
        localStorage.setItem('selectedPathId', selectedPathId);
    } else {
        localStorage.removeItem('selectedPathId');
    }
  }, [selectedPathId]);

  useEffect(() => {
    if (selectedCourseId) {
        localStorage.setItem('selectedCourseId', selectedCourseId);
    } else {
        localStorage.removeItem('selectedCourseId');
    }
  }, [selectedCourseId]);


  const login = (username: string, pass: string): boolean => {
    const foundUser = USER_CREDENTIALS.find(
      (cred) => cred.username.toLowerCase() === username.toLowerCase() && cred.password === pass
    );

    if (foundUser) {
      const user: User = { username: foundUser.username, role: foundUser.role };
      setCurrentUser(user);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // --- CRUD Operations ---
  const addCourse = (pathId: string, courseData: Omit<Course, 'id' | 'levels' | 'documents'>) => {
    const newCourse: Course = { ...courseData, id: generateId('c'), levels: [], documents: [] };
    setData(d => d.map(p => p.id === pathId ? { ...p, courses: [...p.courses, newCourse] } : p));
  };

  const updateCourse = (pathId: string, courseId: string, updates: Partial<Course>) => {
    setData(d => d.map(p => p.id === pathId ? { ...p, courses: p.courses.map(c => c.id === courseId ? {...c, ...updates} : c) } : p));
  };

  const deleteCourse = (pathId: string, courseId: string) => {
    setData(d => d.map(p => p.id === pathId ? { ...p, courses: p.courses.filter(c => c.id !== courseId) } : p));
  };
  
  const addLevel = (pathId: string, courseId: string, levelData: Omit<Level, 'id' | 'documents'>) => {
    const newLevel: Level = { ...levelData, id: generateId('l'), documents: [] };
    setData(d => d.map(p => p.id === pathId ? { ...p, courses: p.courses.map(c => c.id === courseId ? { ...c, levels: [...c.levels, newLevel] } : c) } : p));
  };

  const updateLevel = (pathId: string, courseId: string, levelId: string, updates: Partial<Level>) => {
    setData(d => d.map(p => p.id === pathId ? { ...p, courses: p.courses.map(c => c.id === courseId ? { ...c, levels: c.levels.map(l => l.id === levelId ? {...l, ...updates} : l) } : c) } : p));
  };

  const deleteLevel = (pathId: string, courseId: string, levelId: string) => {
    setData(d => d.map(p => p.id === pathId ? { ...p, courses: p.courses.map(c => c.id === courseId ? { ...c, levels: c.levels.filter(l => l.id !== levelId) } : c) } : p));
  };

  const addDocument = (parentId: ParentId, documentData: Omit<Document, 'id'>) => {
    const newDocument: Document = { ...documentData, id: generateId('doc') };
    const {pathId, courseId, levelId} = parentId;

    setData(d => d.map(p => {
        if (p.id !== pathId) return p;
        if (!courseId) return { ...p, documents: [...p.documents, newDocument] }; // Add to path
        return {
            ...p,
            courses: p.courses.map(c => {
                if (c.id !== courseId) return c;
                if (!levelId) return { ...c, documents: [...c.documents, newDocument] }; // Add to course
                return {
                    ...c,
                    levels: c.levels.map(l => {
                        if (l.id !== levelId) return l;
                        return { ...l, documents: [...l.documents, newDocument] }; // Add to level
                    })
                }
            })
        }
    }));
  };
  
  const updateDocument = (parentId: ParentId, documentId: string, updates: Partial<Document>) => {
    const {pathId, courseId, levelId} = parentId;
    setData(d => d.map(p => {
        if (p.id !== pathId) return p;
        if (!courseId) return { ...p, documents: p.documents.map(doc => doc.id === documentId ? {...doc, ...updates} : doc) };
        return {
            ...p,
            courses: p.courses.map(c => {
                if (c.id !== courseId) return c;
                if (!levelId) return { ...c, documents: c.documents.map(doc => doc.id === documentId ? {...doc, ...updates} : doc) };
                return {
                    ...c,
                    levels: c.levels.map(l => {
                        if (l.id !== levelId) return l;
                        return { ...l, documents: l.documents.map(doc => doc.id === documentId ? {...doc, ...updates} : doc) };
                    })
                }
            })
        }
    }));
  };

  const deleteDocument = (parentId: ParentId, documentId: string) => {
    const {pathId, courseId, levelId} = parentId;
    setData(d => d.map(p => {
        if (p.id !== pathId) return p;
        if (!courseId) return { ...p, documents: p.documents.filter(doc => doc.id !== documentId) };
        return {
            ...p,
            courses: p.courses.map(c => {
                if (c.id !== courseId) return c;
                if (!levelId) return { ...c, documents: c.documents.filter(doc => doc.id !== documentId) };
                return {
                    ...c,
                    levels: c.levels.map(l => {
                        if (l.id !== levelId) return l;
                        return { ...l, documents: l.documents.filter(doc => doc.id !== documentId) };
                    })
                }
            })
        }
    }));
  };


  const contextValue: AppContextType = {
    currentUser,
    login,
    logout,
    data,
    setData,
    selectedPathId,
    setSelectedPathId,
    selectedCourseId,
    setSelectedCourseId,
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