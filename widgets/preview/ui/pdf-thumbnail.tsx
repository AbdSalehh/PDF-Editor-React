import { Page } from "react-pdf";

interface PDFThumbnailProps {
  pageNumber: number;
  isActive: boolean;
  onClick: () => void;
}

export default function PDFThumbnail({
  pageNumber,
  isActive,
  onClick,
}: PDFThumbnailProps) {
  return (
    <div
      onClick={onClick}
      className={`flex cursor-pointer flex-col items-center overflow-hidden rounded-lg border-2 transition-all ${
        isActive
          ? "border-blue-500 shadow-lg"
          : "border-slate-300 hover:border-blue-400 dark:border-neutral-600"
      }`}
    >
      <Page
        pageNumber={pageNumber}
        width={120}
        renderTextLayer={false}
        renderAnnotationLayer={false}
      />
      <div
        className={`w-full py-1 text-center text-xs font-medium ${
          isActive
            ? "bg-blue-500 text-white"
            : "bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-neutral-200"
        }`}
      >
        {pageNumber}
      </div>
    </div>
  );
}
