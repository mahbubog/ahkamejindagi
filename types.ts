export interface TocItem {
  id: number;
  title: string;
  page: number;
  section?: string;
}

export interface Highlight {
  id: string;
  page: number;
  x: number; // Percentage X
  y: number; // Percentage Y
  color: string;
}

export interface BookData {
  bookmarks: number[]; // Array of bookmarked page numbers
  highlights: Highlight[];
  lastReadPage: number;
}

export enum ViewMode {
  READER = 'READER',
  TOC = 'TOC',
  BOOKMARKS = 'BOOKMARKS',
  SEARCH = 'SEARCH'
}