import React from 'react';
import type { LucideProps } from 'lucide-react';

interface BadgeProps {
  children: React.ReactNode;
  colorScheme?: 'gray' | 'red' | 'blue' | 'green' | 'yellow' | 'purple';
  icon?: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
}

export const Badge: React.FC<BadgeProps> = ({ children, colorScheme = 'gray', icon: Icon }) => {
  const colorStyles = {
    gray: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    red: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
    green: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
    yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
    purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full ${colorStyles[colorScheme]}`}>
      {Icon && <Icon size={14} className="opacity-80" />}
      {children}
    </span>
  );
};
