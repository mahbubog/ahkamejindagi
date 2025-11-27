import React from 'react';
import { TOC_DATA } from '../constants';
import { TocItem } from '../types';
import { ChevronRight } from 'lucide-react';

interface TOCProps {
  onSelectPage: (page: number) => void;
}

const TOC: React.FC<TOCProps> = ({ onSelectPage }) => {
  // Group by section
  const grouped: Record<string, TocItem[]> = {};
  
  TOC_DATA.forEach(item => {
    const section = item.section || 'General';
    if (!grouped[section]) grouped[section] = [];
    grouped[section].push(item);
  });

  return (
    <div className="pb-20 bg-white min-h-screen">
      <div className="bg-islamic-700 text-white p-4 sticky top-0 z-10 shadow-md">
        <h2 className="text-xl font-bold">আহকামে জিন্দেগী - সূচীপত্র</h2>
      </div>
      
      <div className="p-4">
        {Object.entries(grouped).map(([section, items]) => (
          <div key={section} className="mb-6">
            {section !== 'General' && (
              <h3 className="text-lg font-semibold text-islamic-700 mb-2 px-2 border-b border-islamic-100 pb-1">
                {section}
              </h3>
            )}
            <div className="space-y-1">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelectPage(item.page)}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-islamic-50 active:bg-islamic-100 transition-colors text-left"
                >
                  <span className="text-gray-800 text-sm font-medium">{item.title}</span>
                  <div className="flex items-center text-gray-500">
                    <span className="text-xs mr-2 font-mono bg-gray-100 px-2 py-1 rounded">{item.page}</span>
                    <ChevronRight size={16} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TOC;