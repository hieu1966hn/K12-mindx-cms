import React, { useContext } from 'react';
import { Code, Palette, Bot } from 'lucide-react';
import { UI_STRINGS } from '../constants';
import { LearningPathName } from '../types';
import { AppContext } from '../context/AppContext';

const pathDetails = {
    [LearningPathName.CODING_AI]: {
        icon: Code,
        description: UI_STRINGS.codingAiDesc,
        color: 'text-blue-500',
        bg: 'hover:bg-blue-50 dark:hover:bg-blue-900/20'
    },
    [LearningPathName.ART_DESIGN]: {
        icon: Palette,
        description: UI_STRINGS.artDesignDesc,
        color: 'text-orange-500',
        bg: 'hover:bg-orange-50 dark:hover:bg-orange-900/20'
    },
    [LearningPathName.ROBOTICS]: {
        icon: Bot,
        description: UI_STRINGS.roboticsDesc,
        color: 'text-green-500',
        bg: 'hover:bg-green-50 dark:hover:bg-green-900/20'
    }
}

export const HomePage: React.FC = () => {
    const context = useContext(AppContext);
    if(!context) return null;

    const { data, setSelectedPathId, setSelectedCourseId } = context;

    const handlePathClick = (pathId: string) => {
        setSelectedPathId(pathId);
        setSelectedCourseId(null);
    }
    
    return (
        <main className="flex-1 p-8 overflow-y-auto bg-gray-100 dark:bg-gray-900">
            <div className="text-center max-w-4xl mx-auto py-10">
                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100">{UI_STRINGS.homeTitle}</h2>
                <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">{UI_STRINGS.homeSubtitle}</p>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {data.map(path => {
                        const details = pathDetails[path.name];
                        const Icon = details.icon;
                        return (
                            <button key={path.id} onClick={() => handlePathClick(path.id)} className={`p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-left ${details.bg}`}>
                                <Icon className={`w-12 h-12 mb-4 ${details.color}`} />
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{path.name}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{details.description}</p>
                            </button>
                        )
                    })}
                </div>
            </div>
      </main>
    )
}