import React, { useState, useRef, useEffect } from 'react';
import { Bookmark, ChevronLeft, ChevronRight, Highlighter, ZoomIn, ZoomOut } from 'lucide-react';
import { TOTAL_PAGES } from '../constants';
import { Highlight } from '../types';

interface ReaderProps {
  currentPage: number;
  setPage: (page: number) => void;
  isBookmarked: boolean;
  toggleBookmark: () => void;
  highlights: Highlight[];
  addHighlight: (h: Highlight) => void;
  removeHighlight: (id: string) => void;
}

const Reader: React.FC<ReaderProps> = ({
  currentPage,
  setPage,
  isBookmarked,
  toggleBookmark,
  highlights,
  addHighlight,
  removeHighlight
}) => {
  const [zoom, setZoom] = useState(1);
  const [isHighlightMode, setIsHighlightMode] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleNext = () => {
    if (currentPage < TOTAL_PAGES) setPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setPage(currentPage - 1);
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHighlightMode || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newHighlight: Highlight = {
      id: Date.now().toString(),
      page: currentPage,
      x,
      y,
      color: 'rgba(255, 255, 0, 0.4)'
    };

    addHighlight(newHighlight);
    setIsHighlightMode(false); // Turn off after adding one
  };

  // Filter highlights for current page
  const pageHighlights = highlights.filter(h => h.page === currentPage);

  // Mock image source using a placeholder service for demo. 
  // In production, this would be your actual scanned images.
  // The prompts implies page 1-656.
  // We are using a placeholder text overlay image for demonstration.
  const imageUrl = `https://placehold.co/600x900/FFF/000?text=Page+${currentPage}\\nAhkame+Zindegi`;
  // REAL APP: const imageUrl = `/pages/page-${currentPage}.jpg`;

  return (
    <div className="flex flex-col h-full pb-16 bg-gray-100">
      {/* Toolbar */}
      <div className="sticky top-0 z-40 flex items-center justify-between px-4 py-2 bg-white shadow-sm">
        <div className="flex items-center space-x-2">
           <span className="text-sm font-bold text-gray-700">পৃষ্ঠা {currentPage}</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsHighlightMode(!isHighlightMode)}
            className={`p-2 rounded-full ${isHighlightMode ? 'bg-yellow-100 text-yellow-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Highlighter size={20} />
          </button>
          <button 
            onClick={toggleBookmark}
            className={`p-2 rounded-full ${isBookmarked ? 'text-islamic-500 fill-current' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Bookmark size={20} className={isBookmarked ? 'fill-islamic-500' : ''} />
          </button>
        </div>
      </div>

      {/* Image Container */}
      <div className="flex-1 overflow-auto relative flex justify-center bg-gray-200 p-2 min-h-[80vh]">
        <div 
          className="relative shadow-xl transition-transform duration-200 ease-out bg-white"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', maxWidth: '100%' }}
          onClick={handleImageClick}
        >
          <img
            ref={imageRef}
            src={imageUrl}
            alt={`Page ${currentPage}`}
            className={`max-w-full h-auto select-none ${isHighlightMode ? 'cursor-crosshair' : ''}`}
            draggable={false}
          />
          
          {/* Highlights Overlay */}
          {pageHighlights.map(h => (
            <div
              key={h.id}
              onClick={(e) => {
                e.stopPropagation();
                if(confirm('Delete this highlight?')) removeHighlight(h.id);
              }}
              className="absolute cursor-pointer border border-yellow-600"
              style={{
                left: `${h.x}%`,
                top: `${h.y}%`,
                width: '100%', // Simulating line highlight
                height: '20px',
                maxWidth: '200px', // Approximate width
                backgroundColor: h.color,
                transform: 'translate(-50%, -50%)'
              }}
              title="Click to remove highlight"
            />
          ))}
        </div>
      </div>

      {/* Navigation Controls (Floating) */}
      <div className="fixed bottom-20 left-0 right-0 flex justify-center space-x-8 pointer-events-none">
        <button 
          onClick={handlePrev}
          disabled={currentPage <= 1}
          className="pointer-events-auto bg-islamic-700 text-white p-3 rounded-full shadow-lg disabled:opacity-50 hover:bg-islamic-900 transition"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="pointer-events-auto bg-white/90 backdrop-blur rounded-full px-4 py-2 shadow-lg flex items-center space-x-4 border border-gray-200">
             <button onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}><ZoomOut size={18}/></button>
             <span className="text-xs font-mono w-8 text-center">{Math.round(zoom * 100)}%</span>
             <button onClick={() => setZoom(Math.min(3, zoom + 0.1))}><ZoomIn size={18}/></button>
        </div>
        <button 
          onClick={handleNext}
          disabled={currentPage >= TOTAL_PAGES}
          className="pointer-events-auto bg-islamic-700 text-white p-3 rounded-full shadow-lg disabled:opacity-50 hover:bg-islamic-900 transition"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default Reader;