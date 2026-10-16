import { Document } from "react-pdf";
import { Card, CardContent } from "@/shared/ui/card";
import ZoomControls from "./zoom-controls";
import PDFPageLayer from "./pdf-page-layer";
import { FileUpload } from "@/shared/ui/file-upload";
import { useCanvasState } from "@/entities/pdf-editor";

export default function PDFCanvas() {
  const {
    pdfFile,
    numPages,
    canvasRef,
    pageRefs,
    onDocumentLoadSuccess,
    handleMouseMove,
    handleMouseUp,
    handleCanvasClick,
    handlePDFDrop,
  } = useCanvasState();

  const handleLoadSuccess = ({ numPages }: { numPages: number }) => {
    onDocumentLoadSuccess({ numPages });
  };

  return (
    <Card className="h-fit w-full md:w-full lg:col-span-3">
      <CardContent className="h-fit p-6">
        {!pdfFile ? (
          <FileUpload onChange={handlePDFDrop} />
        ) : (
          <div className="w-full space-y-4">
            <ZoomControls />

            <div
              ref={canvasRef}
              className="scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-slate-700 scrollbar-track-slate-300 relative flex w-full justify-center overflow-auto rounded-lg border border-[#1a1917]/15 bg-transparent dark:border-[#ece8df]/15"
              style={{
                height: "600px",
                minHeight: "600px",
                maxHeight: "600px",
              }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onClick={handleCanvasClick}
            >
              <div className="my-auto inline-block">
                <Document
                  file={pdfFile}
                  onLoadSuccess={handleLoadSuccess}
                  loading={
                    <div className="flex h-150 items-center justify-center">
                      <p className="text-slate-600 dark:text-neutral-300">
                        Loading PDF...
                      </p>
                    </div>
                  }
                >
                  {Array.from({ length: numPages }, (_, index) => {
                    const pageNumber = index + 1;
                    return (
                      <PDFPageLayer
                        key={pageNumber}
                        pageNumber={pageNumber}
                        pageRef={(el) => {
                          if (el) pageRefs.current.set(pageNumber, el);
                        }}
                      />
                    );
                  })}
                </Document>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
