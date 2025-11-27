import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Reader from './components/Reader';
import TOC from './components/TOC';
import Search from './components/Search';
import { BookData, Highlight, ViewMode } from './types';
import { TOC_DATA } from './constants';
import { Bookmark, Trash2, ArrowRight } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'ahkame-zindegi-data-v1';

function App() {
  const [view, setView] = useState<ViewMode>(ViewMode.TOC); // Default to TOC for better UX
  const [currentPage, setCurrentPage] = useState(1);
  const [userData, setUserData] = useState<BookData>({
    bookmarks: [],
    highlights: [],
    lastReadPage: 1
  });

  // Load from Local Storage
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        setUserData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved data", e);
      }
    }
  }, []);

  // Save to Local Storage whenever data changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData));
  }, [userData]);

  // Update last read page
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setUserData(prev => ({ ...prev, lastReadPage: page }));
  };

  const handleViewChange = (newView: ViewMode) => {
    setView(newView);
  };

  const toggleBookmark = () => {
    setUserData(prev => {
      const bookmarks = prev.bookmarks.includes(currentPage)
        ? prev.bookmarks.filter(p => p !== currentPage)
        : [...prev.bookmarks, currentPage].sort((a, b) => a - b);
      return { ...prev, bookmarks };
    });
  };

  const addHighlight = (highlight: Highlight) => {
    setUserData(prev => ({
      ...prev,
      highlights: [...prev.highlights, highlight]
    }));
  };

  const removeHighlight = (id: string) => {
    setUserData(prev => ({
      ...prev,
      highlights: prev.highlights.filter(h => h.id !== id)
    }));
  };

  const navigateToPage = (page: number) => {
    handlePageChange(page);
    setView(ViewMode.READER);
  };

  const renderContent = () => {
    switch (view) {
      case ViewMode.READER:
        return (
          <Reader
            currentPage={currentPage}
            setPage={handlePageChange}
            isBookmarked={userData.bookmarks.includes(currentPage)}
            toggleBookmark={toggleBookmark}
            highlights={userData.highlights}
            addHighlight={addHighlight}
            removeHighlight={removeHighlight}
          />
        );
      case ViewMode.TOC:
        return <TOC onSelectPage={navigateToPage} />;
      case ViewMode.SEARCH:
        return <Search onSelectPage={navigateToPage} />;
      case ViewMode.BOOKMARKS:
        return (
          <div className="pb-20 bg-gray-50 min-h-screen p-4">
             <div className="bg-white rounded-lg shadow-sm p-4 mb-4 border-l-4 border-islamic-500">
               <h2 className="font-bold text-lg">বুকমার্ক এবং হাইলাইট</h2>
               <p className="text-sm text-gray-600">আপনার সংরক্ষিত পৃষ্ঠা এবং নোটসমূহ</p>
             </div>

             {userData.bookmarks.length === 0 && userData.highlights.length === 0 && (
               <div className="text-center mt-20 text-gray-400">
                 <Bookmark size={48} className="mx-auto mb-2 opacity-20" />
                 <p>এখনও কিছু বুকমার্ক করা হয়নি</p>
               </div>
             )}

             <div className="space-y-3">
               {userData.bookmarks.map(page => {
                 // Find chapter name for this page if possible
                 const chapter = TOC_DATA.slice().reverse().find(t => t.page <= page);
                 return (
                   <div key={page} onClick={() => navigateToPage(page)} className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center cursor-pointer hover:bg-islamic-50">
                     <div>
                       <span className="inline-block bg-islamic-100 text-islamic-800 text-xs px-2 py-1 rounded mb-1">বুকমার্ক</span>
                       <h3 className="font-medium">পৃষ্ঠা {page}</h3>
                       <p className="text-sm text-gray-500">{chapter ? chapter.title : 'General'}</p>
                     </div>
                     <ArrowRight size={16} className="text-gray-400" />
                   </div>
                 )
               })}
             </div>
             
             {userData.highlights.length > 0 && (
               <div className="mt-8">
                 <h3 className="font-bold text-gray-700 mb-3">হাইলাইট সমূহ ({userData.highlights.length})</h3>
                 <div className="space-y-2">
                   {/* Group highlights by page for display */}
                   {(Array.from(new Set(userData.highlights.map(h => h.page))) as number[]).sort((a,b)=>a-b).map(page => (
                      <div key={`hl-${page}`} className="bg-yellow-50 border border-yellow-200 p-3 rounded cursor-pointer" onClick={() => navigateToPage(page)}>
                        <div className="flex justify-between">
                           <span className="text-sm font-medium text-yellow-800">পৃষ্ঠা {page} - হাইলাইট</span>
                           <ArrowRight size={14} className="text-yellow-600" />
                        </div>
                      </div>
                   ))}
                 </div>
               </div>
             )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col max-w-md mx-auto bg-white shadow-2xl overflow-hidden relative">
       {/* Main Content Area */}
       <div className="flex-1 overflow-y-auto no-scrollbar">
         {renderContent()}
       </div>
       
       {/* Navbar */}
       <Navbar currentView={view} setView={handleViewChange} />
    </div>
  );
}

export default App;