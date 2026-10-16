import { useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';

interface PageCountLoaderProps {
  file: File;
  onLoad: (numPages: number) => void;
}

/**
 * Component that loads a PDF file and gets its page count without rendering
 * This avoids the ArrayBuffer detached error
 */
export default function PageCountLoader({ file, onLoad }: PageCountLoaderProps) {
  useEffect(() => {
    const loadPdf = async () => {
      try {
        // Create a copy of the file to avoid ArrayBuffer detachment
        const fileBytes = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(fileBytes);
        const pageCount = pdfDoc.getPageCount();
        onLoad(pageCount);
      } catch (error) {
        console.error('Error loading PDF:', error);
        onLoad(0); // Default to 0 on error
      }
    };

    loadPdf();
  }, [file, onLoad]);

  // This component doesn't render anything
  return null;
}
