'use client';

import { clsx } from 'clsx';

interface FilterTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  className?: string;
}

const categories = [
  { id: 'all', label: 'All Resources', icon: '🌟' },
  { id: 'web', label: 'Web', icon: '🌐' },
  { id: 'app', label: 'App', icon: '📱' },
  { id: 'design', label: 'Design', icon: '🎨' },
  { id: 'development', label: 'Development', icon: '💻' },
  { id: 'ai', label: 'AI Tools', icon: '🤖' },
  { id: 'productivity', label: 'Productivity', icon: '⚡' },
  { id: 'business', label: 'Business', icon: '💼' },
  { id: 'learning', label: 'Learning', icon: '📚' },
  { id: 'devops', label: 'DevOps', icon: '🔧' },
];

export default function FilterTabs({ 
  activeCategory, 
  onCategoryChange, 
  className 
}: FilterTabsProps) {
  return (
    <div className={clsx('flex flex-wrap gap-2', className)}>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={clsx(
            'flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200',
            'border border-transparent',
            'hover:scale-105 active:scale-95',
            activeCategory === category.id
              ? 'bg-gray-900 text-white shadow-lg'
              : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          )}
        >
          <span className="text-base">{category.icon}</span>
          <span>{category.label}</span>
        </button>
      ))}
    </div>
  );
}