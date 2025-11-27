import React from 'react';
import { ViewMode } from '../types';
import { BookOpen, List, Bookmark, Search as SearchIcon } from 'lucide-react';

interface NavbarProps {
  currentView: ViewMode;
  setView: (view: ViewMode) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  const navItems = [
    { view: ViewMode.READER, icon: BookOpen, label: 'পড়া' },
    { view: ViewMode.TOC, icon: List, label: 'সূচীপত্র' },
    { view: ViewMode.SEARCH, icon: SearchIcon, label: 'অনুসন্ধান' },
    { view: ViewMode.BOOKMARKS, icon: Bookmark, label: 'বুকমার্ক' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setView(item.view)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
              currentView === item.view ? 'text-islamic-700 font-bold' : 'text-gray-500'
            }`}
          >
            <item.icon size={24} />
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Navbar;