import React, { useState, useEffect, useContext } from 'react';
import { UI_STRINGS, DOCUMENT_NAMES } from '../constants';
import { AppContext } from '../context/AppContext';
import { Course, Level, Document, DocumentCategory, LevelName, EditableItem, ItemType, ParentId } from '../types';
import { X, ChevronDown } from 'lucide-react';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

interface EditModalProps {
    item: EditableItem | null;
    type: ItemType;
    parentId: ParentId;
    onClose: () => void;
}

const getTitle = (type: ItemType, isEditing: boolean): string => {
    const action = isEditing ? UI_STRINGS.edit : UI_STRINGS.add;
    switch(type) {
        case 'course': return `${action} ${UI_STRINGS.courses}`;
        case 'level': return `${action} ${UI_STRINGS.levels}`;
        case 'document': return `${action} ${UI_STRINGS.documents}`;
        default: return 'Edit';
    }
}

export const EditModal: React.FC<EditModalProps> = ({ item, type, parentId, onClose }) => {
    const [formData, setFormData] = useState<any>({});
    const context = useContext(AppContext);
    
    useBodyScrollLock();

    useEffect(() => {
        if (item) {
            if (type === 'course') {
                 // Convert tools array to string for editing
                setFormData({...item, tools: (item as Course).tools?.join(', ') || ''});
            } else {
                setFormData(item);
            }
        } else {
            // Set defaults for new items
            const defaults: any = {};
            if (type === 'document') defaults.category = DocumentCategory.LESSON_PLAN;
            if (type === 'level') defaults.name = LevelName.BASIC;
            setFormData(defaults);
        }
    }, [item, type]);

    if (!context) return null;

    const { addCourse, updateCourse, addLevel, updateLevel, addDocument, updateDocument } = context;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const isEditing = !!item;
        
        // Create a new object for submission to avoid mutating state directly.
        const submissionData = { ...formData };

        // Apply necessary data transformations before submission.
        if (type === 'course') {
            if (submissionData.tools && typeof submissionData.tools === 'string') {
                submissionData.tools = submissionData.tools.split(',').map((t: string) => t.trim()).filter(Boolean);
            }
            if (submissionData.year) {
                submissionData.year = parseInt(String(submissionData.year), 10);
            }
        }

        switch(type) {
            case 'course':
                isEditing ? updateCourse(parentId.pathId, item!.id, submissionData) : addCourse(parentId.pathId, submissionData);
                break;
            case 'level':
                 isEditing ? updateLevel(parentId.pathId, parentId.courseId!, item!.id, submissionData) : addLevel(parentId.pathId, parentId.courseId!, submissionData);
                break;
            case 'document':
                 isEditing ? updateDocument(parentId, item!.id, submissionData) : addDocument(parentId, submissionData);
                break;
        }
        onClose();
    };
    
    const renderFormFields = () => {
        switch(type) {
            case 'course': return (
                <>
                    <InputField name="name" label={UI_STRINGS.name} value={formData.name || ''} onChange={handleChange} required />
                    <InputField name="year" type="number" label={UI_STRINGS.year} value={formData.year || ''} onChange={handleChange} required />
                    <InputField name="ageGroup" label={UI_STRINGS.ageGroupLabel} value={formData.ageGroup || ''} onChange={handleChange} required />
                    <InputField name="language" label={UI_STRINGS.language} value={formData.language || ''} onChange={handleChange} />
                    <InputField name="tools" label={UI_STRINGS.toolsLabel} value={formData.tools || ''} onChange={handleChange} />
                    <TextareaField name="content" label={UI_STRINGS.content} value={formData.content || ''} onChange={handleChange} required />
                    <TextareaField name="objectives" label={UI_STRINGS.courseObjectives} value={formData.objectives || ''} onChange={handleChange} required />
                </>
            );
            case 'level': return (
                 <>
                    <SelectField name="name" label={UI_STRINGS.level} value={formData.name || ''} onChange={handleChange} options={Object.values(LevelName)} required/>
                    <TextareaField name="content" label={UI_STRINGS.levelContent} value={formData.content || ''} onChange={handleChange} required />
                    <TextareaField name="objectives" label={UI_STRINGS.levelObjectives} value={formData.objectives || ''} onChange={handleChange} required />
                </>
            );
            case 'document': return (
                <>
                    <InputField name="name" label={UI_STRINGS.name} value={formData.name || ''} onChange={handleChange} required />
                    <InputField name="url" label={UI_STRINGS.url} value={formData.url || ''} onChange={handleChange} required />
                    <SelectField name="category" label={UI_STRINGS.category} value={formData.category || ''} onChange={handleChange} options={Object.values(DocumentCategory)} optionNames={DOCUMENT_NAMES} required />
                </>
            );
            default: return null;
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300" onMouseDown={onClose}>
            <div className="bg-white dark:bg-[#313131] rounded-lg shadow-2xl p-8 w-full max-w-2xl m-4 relative transform transition-all duration-300 scale-95" onMouseDown={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors" aria-label="Close modal">
                    <X size={24} />
                </button>
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">{getTitle(type, !!item)}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto p-2">
                        {renderFormFields()}
                    </div>
                    <div className="flex justify-end gap-4 mt-8">
                        <button type="button" onClick={onClose} className="py-2 px-4 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition">{UI_STRINGS.cancel}</button>
                        <button type="submit" className="py-2 px-4 rounded-md bg-[#E31F26] text-white font-bold hover:bg-red-700 transition">{UI_STRINGS.save}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const commonInputClass = "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-[#E31F26] focus:border-transparent outline-none transition";

const InputField: React.FC<{name: string, label: string, value: string, onChange: any, required?: boolean, type?: string}> = ({ name, label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor={name}>{label}</label>
        <input id={name} name={name} {...props} className={commonInputClass} />
    </div>
);

const TextareaField: React.FC<{name: string, label: string, value: string, onChange: any, required?: boolean}> = ({ name, label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor={name}>{label}</label>
        <textarea id={name} name={name} {...props} rows={3} className={commonInputClass} />
    </div>
);

const SelectField: React.FC<{name: string, label: string, value: string, onChange: any, options: string[], optionNames?: {[key:string]: string}, required?: boolean}> = ({ name, label, options, optionNames, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor={name}>{label}</label>
        <div className="relative">
            <select id={name} name={name} {...props} className={`${commonInputClass} appearance-none pr-12`}>
                {options.map(opt => <option key={opt} value={opt}>{optionNames ? optionNames[opt] : opt}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 dark:text-gray-400">
                <ChevronDown size={20} />
            </div>
        </div>
    </div>
);