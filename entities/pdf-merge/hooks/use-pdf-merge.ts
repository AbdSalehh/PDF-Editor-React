import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import type { MergePDFFile, UsePDFMergeReturn } from "../model/pdf-merge.types";

let idCounter = 0;
const generateId = () => `merge-${Date.now()}-${++idCounter}`;

export const usePDFMerge = (): UsePDFMergeReturn => {
  const [pdfFiles, setPdfFiles] = useState<MergePDFFile[]>([]);
  const [isMerging, setIsMerging] = useState(false);

  const addPDFFiles = useCallback((files: File[]) => {
    const newFiles: MergePDFFile[] = files.map((file) => ({
      id: generateId(),
      file,
      numPages: 0,
    }));
    setPdfFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const removePDFFile = useCallback((id: string) => {
    setPdfFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const updatePageCount = useCallback((id: string, numPages: number) => {
    setPdfFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, numPages } : f)),
    );
  }, []);

  const reorderPDFFiles = useCallback((fromIndex: number, toIndex: number) => {
    setPdfFiles((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
  }, []);

  const mergePDFs = useCallback(
    async (fileName: string) => {
      if (pdfFiles.length < 2) return false;

      setIsMerging(true);
      try {
        const mergedPdf = await PDFDocument.create();

        for (const pdfFile of pdfFiles) {
          const arrayBuffer = await pdfFile.file.arrayBuffer();
          const sourcePdf = await PDFDocument.load(arrayBuffer);
          const copiedPages = await mergedPdf.copyPages(
            sourcePdf,
            sourcePdf.getPageIndices(),
          );
          copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        const mergedBytes = await mergedPdf.save();
        const blob = new Blob([mergedBytes.buffer as ArrayBuffer], {
          type: "application/pdf",
        });

        const finalName = fileName.endsWith(".pdf")
          ? fileName
          : `${fileName}.pdf`;

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = finalName;
        a.click();
        URL.revokeObjectURL(url);

        return true;
      } finally {
        setIsMerging(false);
      }
    },
    [pdfFiles],
  );

  const resetPDF = useCallback(() => {
    setPdfFiles([]);
    setIsMerging(false);
  }, []);

  return {
    pdfFiles,
    isMerging,
    addPDFFiles,
    removePDFFile,
    updatePageCount,
    reorderPDFFiles,
    mergePDFs,
    resetPDF,
  };
};
