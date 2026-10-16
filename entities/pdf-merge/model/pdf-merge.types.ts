export interface MergePDFFile {
  id: string;
  file: File;
  numPages: number;
}

export interface UsePDFMergeReturn {
  pdfFiles: MergePDFFile[];
  isMerging: boolean;
  addPDFFiles: (files: File[]) => void;
  removePDFFile: (id: string) => void;
  updatePageCount: (id: string, numPages: number) => void;
  reorderPDFFiles: (fromIndex: number, toIndex: number) => void;
  mergePDFs: (fileName: string) => Promise<boolean>;
  resetPDF: () => void;
}
