import React, { useState, useMemo } from 'react';
import { TOC_DATA, TOTAL_PAGES } from '../constants';
import { Search as SearchIcon, FileText, ArrowRight } from 'lucide-react';

interface SearchProps {
  onSelectPage: (page: number) => void;
}

const Search: React.FC<SearchProps> = ({ onSelectPage }) => {
  const [query, setQuery] = useState('');
  const [pageInput, setPageInput] = useState('');

  const filteredResults = useMemo(() => {
    if (!query) return [];
    return TOC_DATA.filter(item => 
      item.title.includes(query) || 
      (item.section && item.section.includes(query))
    );
  }, [query]);

  const handlePageJump = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(pageInput);
    if (p > 0 && p <= TOTAL_PAGES) {
      onSelectPage(p);
    } else {
      alert(`Please enter a page between 1 and ${TOTAL_PAGES}`);
    }
  };

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      <div className="bg-white p-4 shadow-sm sticky top-0 z-10">
        <h2 className="text-xl font-bold text-gray-800 mb-4">অনুসন্ধান করুন</h2>
        
        {/* Jump to page */}
        <form onSubmit={handlePageJump} className="flex gap-2 mb-6 p-4 bg-islamic-50 rounded-xl border border-islamic-100">
          <input
            type="number"
            placeholder={`পৃষ্ঠা নং (১-${TOTAL_PAGES})`}
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-islamic-500 font-mono"
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value)}
          />
          <button type="submit" className="bg-islamic-600 text-white px-4 py-2 rounded-lg font-medium">
            যান
          </button>
        </form>

        {/* Search topics */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="বিষয় খুঁজুন..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-islamic-500 focus:ring-1 focus:ring-islamic-500"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="p-4">
        {query && (
          <div className="mb-2 text-sm text-gray-500">
            {filteredResults.length} টি ফলাফল পাওয়া গেছে
          </div>
        )}

        <div className="space-y-2">
          {filteredResults.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectPage(item.page)}
              className="w-full bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:border-islamic-300 flex justify-between items-center text-left"
            >
              <div>
                <h3 className="font-medium text-gray-800">{item.title}</h3>
                {item.section && <p className="text-xs text-gray-500 mt-1">{item.section}</p>}
              </div>
              <div className="flex items-center text-islamic-600">
                 <span className="text-xs font-mono mr-2">পৃষ্ঠা {item.page}</span>
                 <ArrowRight size={16} />
              </div>
            </button>
          ))}
          
          {query && filteredResults.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              <FileText size={48} className="mx-auto mb-2 opacity-20" />
              <p>কোন ফলাফল পাওয়া যায়নি</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;