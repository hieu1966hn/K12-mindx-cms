import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
    message: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
    return (
        <div className="text-center py-16 px-6 bg-white dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
            <Inbox className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500" strokeWidth={1.5} />
            <p className="mt-4 text-lg font-medium text-gray-500 dark:text-gray-400">{message}</p>
        </div>
    );
};
