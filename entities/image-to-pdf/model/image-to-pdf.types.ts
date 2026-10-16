export interface ImageItem {
  id: string;
  file: File;
  preview: string;
}

export type PageOrientation = "portrait" | "landscape";
export type PageSize = "fit" | "a4" | "letter";
export type PageMargin = "none" | "small" | "big";

export interface UseImageToPDFReturn {
  images: ImageItem[];
  isConverting: boolean;
  addImages: (files: FileList | null) => void;
  removeImage: (id: string) => void;
  reorderImages: (fromIndex: number, toIndex: number) => void;
  convertToPDF: (
    orientation: PageOrientation,
    pageSize: PageSize,
    margin: PageMargin,
    fileName: string,
  ) => Promise<void>;
  clearAll: () => void;
}
