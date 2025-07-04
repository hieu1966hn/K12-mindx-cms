

import React from 'react';
import {
  Map,
  BookOpen,
  PlayCircle,
  ClipboardList,
  BookUser,
  Presentation,
  FlaskConical,
  NotebookPen,
  Target,
  Book,
} from 'lucide-react';
import { DocumentCategory } from '../types';

const iconMap: Record<DocumentCategory, React.ElementType> = {
  [DocumentCategory.ROADMAP]: Map,
  [DocumentCategory.SYLLABUS]: BookOpen,
  [DocumentCategory.TRIAL]: PlayCircle,
  [DocumentCategory.LESSON_PLAN]: ClipboardList,
  [DocumentCategory.TEACHING_GUIDE]: BookUser,
  [DocumentCategory.SLIDE]: Presentation,
  [DocumentCategory.PROJECT]: FlaskConical,
  [DocumentCategory.HOMEWORK]: NotebookPen,
  [DocumentCategory.CHECKPOINT]: Target,
  [DocumentCategory.STUDENT_BOOK]: Book,
};

interface DocumentIconProps {
  category: DocumentCategory;
  className?: string;
}

export const DocumentIcon: React.FC<DocumentIconProps> = ({ category, className }) => {
  const IconComponent = iconMap[category];
  return <IconComponent className={className || 'w-5 h-5'} />;
};