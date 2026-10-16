import { Page } from "react-pdf";
import { Scissors, Trash2, RotateCw } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useDrag, useDrop } from "react-dnd";
import { useEffect, useRef, useState } from "react";

interface SplitPageThumbnailProps {
  pageNumber: number;
  splitGroup: number;
  isDeleted: boolean;
  rotation: number;
  scale?: number;
  onDelete: () => void;
  onAddSplit: () => void;
  onRemoveSplit: () => void;
  onRotate: () => void;
  onMove: (fromIndex: number, toIndex: number) => void;
  index: number;
  hasSplitAfter: boolean;
  onPreview: () => void;
}

const SPLIT_COLORS = [
  "bg-blue-100 border-blue-400 dark:bg-blue-900/30 dark:border-blue-600/50",
  "bg-green-100 border-green-400 dark:bg-green-900/30 dark:border-green-600/50",
  "bg-purple-100 border-purple-400 dark:bg-purple-900/30 dark:border-purple-600/50",
  "bg-orange-100 border-orange-400 dark:bg-orange-900/30 dark:border-orange-600/50",
  "bg-pink-100 border-pink-400 dark:bg-pink-900/30 dark:border-pink-600/50",
  "bg-yellow-100 border-yellow-400 dark:bg-yellow-900/30 dark:border-yellow-600/50",
  "bg-red-100 border-red-400 dark:bg-red-900/30 dark:border-red-600/50",
  "bg-indigo-100 border-indigo-400 dark:bg-indigo-900/30 dark:border-indigo-600/50",
  "bg-teal-100 border-teal-400 dark:bg-teal-900/30 dark:border-teal-600/50",
  "bg-cyan-100 border-cyan-400 dark:bg-cyan-900/30 dark:border-cyan-600/50",
];

export default function SplitPageThumbnail({
  pageNumber,
  splitGroup,
  isDeleted,
  rotation,
  scale = 0.3,
  onDelete,
  onAddSplit,
  onRemoveSplit,
  onRotate,
  onMove,
  index,
  hasSplitAfter,
  onPreview,
}: SplitPageThumbnailProps) {
  const ref = useRef<HTMLDivElement>(null);
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = pageContainerRef.current;
    if (!element || isVisible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [isVisible]);

  const [{ isDragging }, drag] = useDrag({
    type: "PAGE",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "PAGE",
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        onMove(item.index, index);
        item.index = index;
      }
    },
  });

  drag(drop(ref));

  if (isDeleted) return null;

  const colorClass = SPLIT_COLORS[(splitGroup - 1) % SPLIT_COLORS.length];

  return (
    <div className="relative w-full">
      <div
        ref={ref}
        className={`group relative cursor-move rounded-lg border-2 p-2 transition-all ${colorClass} ${
          isDragging ? "opacity-50" : "opacity-100"
        }`}
      >
        {/* Split Group Badge */}
        <div className="absolute top-1 left-1 z-10 rounded-full bg-slate-900 px-2 py-1 text-xs font-bold text-white shadow-lg">
          Split {splitGroup}
        </div>

        {/* Page Number Badge */}
        <div className="absolute top-1 right-1 z-10 rounded-full bg-white px-2 py-1 text-xs font-semibold text-slate-900 shadow-md">
          {pageNumber}
        </div>

        {/* Delete Button */}
        <Button
          onClick={onDelete}
          className="absolute top-10 right-1 z-10 h-8 w-8 rounded-sm bg-neutral-100/70! p-0 shadow-none hover:bg-red-100/70!"
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>

        {/* Rotate Button */}
        <Button
          onClick={onRotate}
          className="absolute top-20 right-1 z-10 h-8 w-8 rounded-sm bg-neutral-100/70! p-0 shadow-none hover:bg-blue-100/70!"
        >
          <RotateCw className="h-4 w-4 text-blue-500" />
        </Button>

        {/* PDF Page - lazy rendered when scrolled into view, click to preview */}
        <div
          ref={pageContainerRef}
          onClick={onPreview}
          className="flex h-70 cursor-zoom-in items-center justify-center overflow-hidden rounded-md bg-white shadow-md"
        >
          {isVisible ? (
            <Page
              key={`page-${pageNumber}-rotation-${rotation}`}
              pageNumber={pageNumber}
              scale={scale}
              rotate={rotation}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="pointer-events-none max-h-full max-w-full object-contain"
            />
          ) : (
            <div className="h-full w-full animate-pulse bg-slate-200 dark:bg-neutral-700" />
          )}
        </div>

        {/* Split Control Button */}
        <div className="mt-2 flex justify-center">
          {hasSplitAfter ? (
            <Button
              onClick={onRemoveSplit}
              className="h-7 bg-red-500! text-xs hover:bg-red-600! dark:text-neutral-200"
              size="sm"
            >
              <Scissors className="mr-1 h-3 w-3" />
              Remove Split
            </Button>
          ) : (
            <Button
              onClick={onAddSplit}
              className="h-7 bg-blue-500! text-xs hover:bg-blue-600! dark:text-neutral-200"
              size="sm"
            >
              <Scissors className="mr-1 h-3 w-3" />
              Split Here
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
