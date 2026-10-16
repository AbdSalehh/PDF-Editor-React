import { useEffect, useState } from "react";
import { Document, Page } from "react-pdf";
import { ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

interface PagePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: File | null;
  pageNumber: number | null;
  rotation: number;
}

const MIN_SCALE = 0.5;
const MAX_SCALE = 3;
const SCALE_STEP = 0.25;

export default function PagePreviewDialog({
  open,
  onOpenChange,
  file,
  pageNumber,
  rotation,
}: PagePreviewDialogProps) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (open) setScale(1);
  }, [open, pageNumber]);

  const zoomIn = () =>
    setScale((prev) => Math.min(prev + SCALE_STEP, MAX_SCALE));
  const zoomOut = () =>
    setScale((prev) => Math.max(prev - SCALE_STEP, MIN_SCALE));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[95dvh]! max-w-3xl! sm:max-w-3xl!">
        <DialogHeader className="flex w-[95%] flex-row items-center justify-between">
          <DialogTitle>Preview Halaman {pageNumber ?? ""}</DialogTitle>

          <div className="flex items-center justify-center gap-2">
            <Button
              type="button"
              onClick={zoomOut}
              disabled={scale <= MIN_SCALE}
              className="h-8 w-8 rounded-lg bg-neutral-200! p-0 text-neutral-700 shadow-none hover:bg-neutral-300! disabled:opacity-40 dark:bg-neutral-800! dark:text-neutral-200"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center text-xs font-medium text-neutral-600 dark:text-neutral-300">
              {Math.round(scale * 100)}%
            </span>
            <Button
              type="button"
              onClick={zoomIn}
              disabled={scale >= MAX_SCALE}
              className="h-8 w-8 rounded-lg bg-neutral-200! p-0 text-neutral-700 shadow-none hover:bg-neutral-300! disabled:opacity-40 dark:bg-neutral-800! dark:text-neutral-200"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="scrollbar-thin flex max-h-[80vh] min-h-[80vh] justify-center overflow-auto rounded-lg bg-slate-100 p-4 dark:bg-neutral-800">
          {file && pageNumber && (
            <div className="m-auto">
              <Document
                file={file}
                loading={
                  <div className="flex h-[70vh] w-[50vh] items-center justify-center">
                    <p className="text-sm text-slate-500 dark:text-neutral-400">
                      Memuat halaman...
                    </p>
                  </div>
                }
              >
                <Page
                  key={`preview-${pageNumber}-rotation-${rotation}`}
                  pageNumber={pageNumber}
                  scale={scale}
                  rotate={rotation}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="shadow-lg"
                />
              </Document>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
