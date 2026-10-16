import { pdfjs } from "react-pdf";
import { useState, useCallback } from "react";
import { PDFSidebar } from "@/widgets/sidebar";
import { PDFCanvas } from "@/widgets/canvas";
import { PDFPreviewSidebar } from "@/widgets/preview";
import { DownloadDialog } from "@/widgets/dialog";
import {
  usePDFEditorStore,
  usePDFEditorEffects,
  usePDFDownload,
} from "@/entities/pdf-editor";
import { triggerConfetti } from "@/shared/lib/confetti";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PDFEditor() {
  const pdfFile = usePDFEditorStore((s) => s.pdfFile);
  const pdfData = usePDFEditorStore((s) => s.pdfData);
  const originalFileName = usePDFEditorStore((s) => s.originalFileName);
  const numPages = usePDFEditorStore((s) => s.numPages);
  const images = usePDFEditorStore((s) => s.images);
  const texts = usePDFEditorStore((s) => s.texts);
  const shapes = usePDFEditorStore((s) => s.shapes);
  const scale = usePDFEditorStore((s) => s.scale);
  const currentPage = usePDFEditorStore((s) => s.currentPage);
  const scrollToPage = usePDFEditorStore((s) => s.scrollToPage);

  // Initialize side effects (wheel zoom, scroll tracking, keyboard shortcuts)
  usePDFEditorEffects();

  const { downloadPDF, isDownloading } = usePDFDownload();
  const [useCustomName, setUseCustomName] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);

  const handleDownload = useCallback(
    async (fileName?: string) => {
      const success = await downloadPDF(
        pdfData,
        images,
        texts,
        shapes,
        scale,
        fileName,
      );
      if (!success) return;
      triggerConfetti();
    },
    [pdfData, images, texts, shapes, scale, downloadPDF],
  );

  const handleDownloadClick = () => {
    const defaultFileName = originalFileName || "edited-pdf";
    if (useCustomName) {
      setShowDownloadDialog(true);
    } else {
      handleDownload(`${defaultFileName}.pdf`);
    }
  };

  return (
    <div className="mx-auto w-dvw">
      <div className="mx-auto flex flex-col items-center justify-center gap-4 lg:max-w-7xl lg:flex-row lg:items-start 2xl:min-w-7xl">
        <div className="relative w-[90dvw] lg:max-w-[20%]">
          <PDFSidebar
            onDownloadPDF={handleDownloadClick}
            isDownloading={isDownloading}
            useCustomName={useCustomName}
            onCustomNameChange={setUseCustomName}
          />
        </div>

        {pdfFile && numPages > 1 && (
          <div className="hidden lg:block lg:max-w-[17%]">
            <PDFPreviewSidebar
              pdfFile={pdfFile}
              numPages={numPages}
              currentPage={currentPage}
              onPageClick={scrollToPage}
            />
          </div>
        )}

        <div className="w-[90dvw] lg:max-w-[63%]">
          <PDFCanvas />
        </div>
      </div>

      {/* Download Dialog */}
      <DownloadDialog
        open={showDownloadDialog}
        onOpenChange={setShowDownloadDialog}
        defaultFileName={originalFileName || "edited-pdf"}
        onDownload={handleDownload}
        isProcessing={isDownloading}
        title="Download PDF"
        description="Ubah nama file PDF yang telah diedit"
      />
    </div>
  );
}
