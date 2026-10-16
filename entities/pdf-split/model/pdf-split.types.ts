export interface SplitPage {
  pageNumber: number;
  isDeleted: boolean;
  splitGroup: number;
  rotation: number;
}

export interface UsePDFSplitReturn {
  pdfFile: File | null;
  originalFileName: string;
  numPages: number;
  pages: SplitPage[];
  isSplitting: boolean;
  totalZipSize: number;
  handlePDFUpload: (file: File) => void;
  onDocumentLoadSuccess: (data: { numPages: number }) => void;
  splitAllPages: () => void;
  addSplitAfterPage: (pageNumber: number) => void;
  removeSplitAfterPage: (pageNumber: number) => void;
  deletePage: (pageNumber: number) => void;
  movePage: (fromIndex: number, toIndex: number) => void;
  resetAll: () => void;
  rotatePage: (pageNumber: number) => void;
  resetPDF: () => void;
  hasChanges: () => boolean;
  getActivePagesGrouped: () => SplitPage[][];
  downloadSinglePDF: (groupIndex: number, fileName?: string) => Promise<void>;
  downloadAllAsZip: (fileName: string) => Promise<void>;
  setGroupName: (index: number, name: string) => void;
  getGroupName: (index: number) => string;
  getGroupSize: (index: number) => number;
  calculateGroupSize: (index: number) => Promise<void>;
  calculateAllSizes: () => Promise<void>;
}
