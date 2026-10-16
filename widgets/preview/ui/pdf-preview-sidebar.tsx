import { Document } from "react-pdf";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import PDFThumbnail from "./pdf-thumbnail";

interface PDFPreviewSidebarProps {
  pdfFile: File | null;
  numPages: number;
  currentPage: number;
  onPageClick: (pageNumber: number) => void;
}

export default function PDFPreviewSidebar({
  pdfFile,
  numPages,
  currentPage,
  onPageClick,
}: PDFPreviewSidebarProps) {
  if (!pdfFile) return null;

  return (
    <Card className="pb-5 lg:col-span-1">
      <CardHeader>
        <CardTitle>Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-300 max-h-[600px] space-y-3 overflow-y-auto pr-2">
          <Document file={pdfFile}>
            {Array.from(new Array(numPages), (_, index) => {
              const pageNumber = index + 1;
              return (
                <div key={pageNumber} className="mb-3">
                  <PDFThumbnail
                    pageNumber={pageNumber}
                    isActive={currentPage === pageNumber}
                    onClick={() => onPageClick(pageNumber)}
                  />
                </div>
              );
            })}
          </Document>
        </div>
      </CardContent>
    </Card>
  );
}
