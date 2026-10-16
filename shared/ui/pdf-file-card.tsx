import { Card, CardContent } from "@/shared/ui/card";
import { Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useDrag, useDrop } from "react-dnd";
import { useRef, useState, useEffect } from "react";
import { pdfjs, Document, Page } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFFileCardProps {
  fileName: string;
  numPages: number;
  onRemove: () => void;
  index?: number;
  onMove?: (fromIndex: number, toIndex: number) => void;
  fileSize?: number;
  file?: File;
}

export default function PDFFileCard({
  fileName,
  numPages,
  onRemove,
  index,
  onMove,
  fileSize,
  file,
}: PDFFileCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const [{ isDragging }, drag] = useDrag({
    type: "PDF_FILE",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: () => index !== undefined && onMove !== undefined,
  });

  const [, drop] = useDrop({
    accept: "PDF_FILE",
    hover: (item: { index: number }) => {
      if (!ref.current || index === undefined || !onMove) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      onMove(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  if (index !== undefined && onMove) {
    drag(drop(ref));
  }

  // Create URL for PDF file
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  return (
    <Card
      ref={ref}
      className={`relative overflow-hidden transition-all ${isDragging ? "opacity-50" : "opacity-100"} ${onMove ? "cursor-move" : ""}`}
    >
      <CardContent className="p-0">
        <div className="relative">
          {/* Order Badge */}
          {index !== undefined && (
            <div className="absolute top-2 left-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white shadow-md">
              {index + 1}
            </div>
          )}

          {/* Delete Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-white/80 p-0 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>

          {/* PDF Thumbnail */}
          {pdfUrl ? (
            <div className="relative h-48 w-full overflow-hidden bg-white">
              <Document
                file={pdfUrl}
                loading={
                  <div className="flex h-full items-center justify-center text-sm text-slate-400">
                    Loading...
                  </div>
                }
                error={
                  <div className="flex h-full items-center justify-center text-sm text-slate-400">
                    Loading...
                  </div>
                }
              >
                <Page
                  pageNumber={1}
                  height={192}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="flex items-center justify-center"
                />
              </Document>
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center bg-slate-100">
              <span className="text-sm text-slate-400">No preview</span>
            </div>
          )}

          {/* File Name Overlay */}
          <div className="absolute right-0 bottom-0 left-0 bg-black/70 px-3 py-2">
            <p className="truncate text-xs font-medium text-white">
              {fileName}
            </p>
            <div className="flex gap-2 text-[10px] text-slate-300">
              <span>{numPages > 0 ? `${numPages} halaman` : "Loading..."}</span>
              {fileSize && (
                <>
                  <span>•</span>
                  <span>{(fileSize / 1024 / 1024).toFixed(2)} MB</span>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
