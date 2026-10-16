import { Button } from "@/shared/ui/button";
import {
  ZoomIn,
  ZoomOut,
  ArrowRightToLine,
  ArrowLeftToLine,
  RotateCcw,
} from "lucide-react";
import { useZoomState } from "@/entities/pdf-editor";

export default function ZoomControls() {
  const {
    scale,
    pdfFile,
    currentPage,
    numPages,
    handleZoomIn: onZoomIn,
    handleZoomOut: onZoomOut,
    handlePrevPage: onPrevPage,
    handleNextPage: onNextPage,
    resetPDF: onResetPDF,
  } = useZoomState();
  return (
    <div className="flex items-center justify-center rounded-lg border border-[#1a1917]/15 bg-transparent p-3 dark:border-[#ece8df]/15">
      <div
        className={`flex w-full items-center gap-4 ${
          numPages && numPages > 1 ? "justify-between" : "justify-center"
        }`}
      >
        {/* Page Navigation */}
        {currentPage &&
          numPages &&
          onPrevPage &&
          onNextPage &&
          numPages > 1 && (
            <div className="xs:gap-2 flex items-center gap-1">
              <Button
                onClick={onPrevPage}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
                className="xs:!p-4 bg-slate-900! p-2! dark:bg-neutral-200!"
              >
                <ArrowLeftToLine className="xs:size-4 size-2 text-white dark:text-neutral-900" />
              </Button>
              <span className="xs:text-sm xs:min-w-[60px] min-w-[40px] text-center text-xs">
                {currentPage} / {numPages}
              </span>
              <Button
                onClick={onNextPage}
                disabled={currentPage === numPages}
                variant="outline"
                size="sm"
                className="xs:!p-4 bg-slate-900! p-2! dark:bg-neutral-200!"
              >
                <ArrowRightToLine className="xs:size-4 size-2 text-white dark:text-neutral-900" />
              </Button>
            </div>
          )}

        <div className="flex items-center gap-3">
          {/* Reset PDF Button */}
          {pdfFile && onResetPDF && (
            <Button
              onClick={onResetPDF}
              variant="outline"
              size="sm"
              className="xs:!p-4 bg-red-500! p-2! text-white! hover:bg-red-600! dark:bg-red-500! dark:hover:bg-red-600!"
            >
              <RotateCcw className="xs:size-4 size-2 text-white dark:text-white" />
              Reset PDF
            </Button>
          )}

          {/* Zoom Controls */}
          <div className="xs:gap-2 flex items-center gap-1">
            <Button
              onClick={onZoomOut}
              variant="outline"
              size="sm"
              className="xs:!p-4 bg-slate-900! p-2! dark:bg-neutral-200!"
            >
              <ZoomOut className="xs:size-4 size-2 text-white dark:text-neutral-900" />
            </Button>
            <span className="xs:text-sm xs:min-w-[60px] min-w-[40px] text-center text-xs font-medium text-slate-700 dark:text-neutral-200">
              {Math.round(scale * 100)}%
            </span>
            <Button
              onClick={onZoomIn}
              variant="outline"
              size="sm"
              className="xs:!p-4 bg-slate-900! p-2! dark:bg-neutral-200!"
            >
              <ZoomIn className="xs:size-4 size-2 text-white dark:text-neutral-900" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
