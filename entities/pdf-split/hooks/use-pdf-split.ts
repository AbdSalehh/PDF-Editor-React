import { useState, useCallback, useRef } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import JSZip from "jszip";
import type { SplitPage, UsePDFSplitReturn } from "../model/pdf-split.types";

export const usePDFSplit = (): UsePDFSplitReturn => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [originalFileName, setOriginalFileName] = useState("");
  const [numPages, setNumPages] = useState(0);
  const [pages, setPages] = useState<SplitPage[]>([]);
  const [isSplitting, setIsSplitting] = useState(false);
  const [totalZipSize, setTotalZipSize] = useState(0);

  const groupNamesRef = useRef<Record<number, string>>({});
  const groupSizesRef = useRef<Record<number, number>>({});
  const pdfBytesRef = useRef<ArrayBuffer | null>(null);

  const handlePDFUpload = useCallback((file: File) => {
    setPdfFile(file);
    const name = file.name.replace(/\.pdf$/i, "");
    setOriginalFileName(name);
    groupNamesRef.current = {};
    groupSizesRef.current = {};
    setTotalZipSize(0);

    const reader = new FileReader();
    reader.onload = (e) => {
      const buffer = e.target?.result as ArrayBuffer;
      pdfBytesRef.current = buffer.slice(0);
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const detectPageRotations = useCallback(
    async (numPages: number): Promise<number[]> => {
      if (!pdfBytesRef.current) return Array(numPages).fill(0);
      try {
        const pdfDoc = await PDFDocument.load(pdfBytesRef.current.slice(0));
        return Array.from({ length: numPages }, (_, i) => {
          const angle = pdfDoc.getPage(i).getRotation().angle;
          const normalized = Math.round(angle / 90) * 90;
          return ((normalized % 360) + 360) % 360;
        });
      } catch {
        return Array(numPages).fill(0);
      }
    },
    [],
  );

  const onDocumentLoadSuccess = useCallback(
    async (data: { numPages: number }) => {
      setNumPages(data.numPages);
      const rotations = await detectPageRotations(data.numPages);
      const initialPages: SplitPage[] = Array.from(
        { length: data.numPages },
        (_, i) => ({
          pageNumber: i + 1,
          isDeleted: false,
          splitGroup: 1,
          rotation: rotations[i],
        }),
      );
      setPages(initialPages);
    },
    [detectPageRotations],
  );

  const splitAllPages = useCallback(() => {
    setPages((prev) => prev.map((page, i) => ({ ...page, splitGroup: i + 1 })));
  }, []);

  const addSplitAfterPage = useCallback((pageNumber: number) => {
    setPages((prev) => {
      const pageIndex = prev.findIndex((p) => p.pageNumber === pageNumber);
      if (pageIndex === -1 || pageIndex === prev.length - 1) return prev;

      const currentGroup = prev[pageIndex].splitGroup;
      const newGroup = currentGroup + 1;

      return prev.map((page, i) => {
        if (i <= pageIndex) return page;
        if (page.splitGroup >= newGroup) {
          return { ...page, splitGroup: page.splitGroup + 1 };
        }
        return { ...page, splitGroup: newGroup };
      });
    });
  }, []);

  const removeSplitAfterPage = useCallback((pageNumber: number) => {
    setPages((prev) => {
      const pageIndex = prev.findIndex((p) => p.pageNumber === pageNumber);
      if (pageIndex === -1 || pageIndex === prev.length - 1) return prev;

      const currentGroup = prev[pageIndex].splitGroup;
      const nextGroup = prev[pageIndex + 1]?.splitGroup;

      if (currentGroup === nextGroup) return prev;

      return prev.map((page) => {
        if (page.splitGroup === nextGroup) {
          return { ...page, splitGroup: currentGroup };
        }
        if (page.splitGroup > nextGroup) {
          return { ...page, splitGroup: page.splitGroup - 1 };
        }
        return page;
      });
    });
  }, []);

  const deletePage = useCallback((pageNumber: number) => {
    setPages((prev) =>
      prev.map((page) =>
        page.pageNumber === pageNumber ? { ...page, isDeleted: true } : page,
      ),
    );
  }, []);

  const movePage = useCallback((fromIndex: number, toIndex: number) => {
    setPages((prev) => {
      const activePages = prev.filter((p) => !p.isDeleted);
      const deletedPages = prev.filter((p) => p.isDeleted);

      const updated = [...activePages];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);

      // Reassign splitGroup: moved page joins the group of its new neighbor
      let targetGroup: number;
      if (toIndex > 0) {
        targetGroup = updated[toIndex - 1].splitGroup;
      } else if (updated.length > 1) {
        targetGroup = updated[1].splitGroup;
      } else {
        targetGroup = moved.splitGroup;
      }

      // Keep the moved page's rotation when changing groups (rotation is absolute)
      updated[toIndex] = {
        ...updated[toIndex],
        splitGroup: targetGroup,
      };

      return [...updated, ...deletedPages];
    });
  }, []);

  const resetAll = useCallback(async () => {
    if (!pdfBytesRef.current) return;
    try {
      const pdfDoc = await PDFDocument.load(pdfBytesRef.current.slice(0));
      const count = pdfDoc.getPageCount();
      const rotations = Array.from({ length: count }, (_, i) => {
        const angle = pdfDoc.getPage(i).getRotation().angle;
        return (((Math.round(angle / 90) * 90) % 360) + 360) % 360;
      });
      setPages(
        Array.from({ length: count }, (_, i) => ({
          pageNumber: i + 1,
          isDeleted: false,
          splitGroup: 1,
          rotation: rotations[i],
        })),
      );
    } catch {
      setPages((prev) =>
        [...prev]
          .sort((a, b) => a.pageNumber - b.pageNumber)
          .map((page) => ({
            ...page,
            isDeleted: false,
            splitGroup: 1,
            rotation: 0,
          })),
      );
    }
    groupNamesRef.current = {};
    groupSizesRef.current = {};
    setTotalZipSize(0);
  }, []);

  const rotatePage = useCallback((pageNumber: number) => {
    setPages((prev) =>
      prev.map((page) =>
        page.pageNumber === pageNumber
          ? { ...page, rotation: (((page.rotation + 90) % 360) + 360) % 360 }
          : page,
      ),
    );
  }, []);

  const resetPDF = useCallback(() => {
    setPdfFile(null);
    setOriginalFileName("");
    setNumPages(0);
    setPages([]);
    setIsSplitting(false);
    setTotalZipSize(0);
    pdfBytesRef.current = null;
    groupNamesRef.current = {};
    groupSizesRef.current = {};
  }, []);

  const hasChanges = useCallback((): boolean => {
    const activePages = pages.filter((p) => !p.isDeleted);
    if (activePages.length !== numPages) return true;

    const groups = new Set(activePages.map((p) => p.splitGroup));
    if (groups.size > 1) return true;

    for (let i = 0; i < activePages.length; i++) {
      if (activePages[i].pageNumber !== i + 1) return true;
      if (activePages[i].rotation !== 0) return true;
    }

    return false;
  }, [pages, numPages]);

  const getActivePagesGrouped = useCallback((): SplitPage[][] => {
    const activePages = pages.filter((p) => !p.isDeleted);
    const groups: Record<number, SplitPage[]> = {};

    activePages.forEach((page) => {
      if (!groups[page.splitGroup]) {
        groups[page.splitGroup] = [];
      }
      groups[page.splitGroup].push(page);
    });

    return Object.keys(groups)
      .sort((a, b) => Number(a) - Number(b))
      .map((key) => groups[Number(key)]);
  }, [pages]);

  const buildGroupPDF = useCallback(
    async (group: SplitPage[]): Promise<Uint8Array> => {
      if (!pdfBytesRef.current) throw new Error("No PDF loaded");

      const sourcePdf = await PDFDocument.load(pdfBytesRef.current.slice(0));
      const newPdf = await PDFDocument.create();

      for (const page of group) {
        const [copiedPage] = await newPdf.copyPages(sourcePdf, [
          page.pageNumber - 1,
        ]);
        // page.rotation is the absolute visual rotation (source + user-applied)
        // so we set it directly without adding source rotation again
        const finalRotation = ((page.rotation % 360) + 360) % 360;
        copiedPage.setRotation(degrees(finalRotation));
        newPdf.addPage(copiedPage);
      }

      return newPdf.save();
    },
    [],
  );

  const downloadSinglePDF = useCallback(
    async (groupIndex: number, fileName?: string) => {
      setIsSplitting(true);
      try {
        const groups = getActivePagesGrouped();
        const group = groups[groupIndex];
        if (!group) return;

        const pdfBytes = await buildGroupPDF(group);

        const name =
          fileName ||
          groupNamesRef.current[groupIndex] ||
          `${originalFileName}-part-${groupIndex + 1}`;
        const finalName = name.endsWith(".pdf") ? name : `${name}.pdf`;

        const blob = new Blob([pdfBytes.buffer as ArrayBuffer], {
          type: "application/pdf",
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = finalName;
        a.click();
        URL.revokeObjectURL(url);
      } finally {
        setIsSplitting(false);
      }
    },
    [getActivePagesGrouped, buildGroupPDF, originalFileName],
  );

  const downloadAllAsZip = useCallback(
    async (fileName: string) => {
      setIsSplitting(true);
      try {
        const groups = getActivePagesGrouped();
        const zip = new JSZip();

        for (let i = 0; i < groups.length; i++) {
          const pdfBytes = await buildGroupPDF(groups[i]);
          const groupName =
            groupNamesRef.current[i] || `${originalFileName}-part-${i + 1}`;
          const groupFileName = `${groupName}.pdf`;

          zip.file(groupFileName, pdfBytes);
        }

        const zipBlob = await zip.generateAsync({ type: "blob" });

        const finalName = fileName.endsWith(".zip")
          ? fileName
          : `${fileName}.zip`;

        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = finalName;
        a.click();
        URL.revokeObjectURL(url);
      } finally {
        setIsSplitting(false);
      }
    },
    [getActivePagesGrouped, buildGroupPDF, originalFileName],
  );

  const setGroupName = useCallback((index: number, name: string) => {
    groupNamesRef.current = { ...groupNamesRef.current, [index]: name };
  }, []);

  const getGroupName = useCallback(
    (index: number): string => {
      return (
        groupNamesRef.current[index] || `${originalFileName}-part-${index + 1}`
      );
    },
    [originalFileName],
  );

  const getGroupSize = useCallback((index: number): number => {
    return groupSizesRef.current[index] || 0;
  }, []);

  const calculateGroupSize = useCallback(
    async (index: number) => {
      const groups = getActivePagesGrouped();
      const group = groups[index];
      if (!group) return;

      const pdfBytes = await buildGroupPDF(group);
      groupSizesRef.current = {
        ...groupSizesRef.current,
        [index]: pdfBytes.length,
      };
    },
    [getActivePagesGrouped, buildGroupPDF],
  );

  const calculateAllSizes = useCallback(async () => {
    const groups = getActivePagesGrouped();
    let total = 0;

    for (let i = 0; i < groups.length; i++) {
      const pdfBytes = await buildGroupPDF(groups[i]);
      groupSizesRef.current[i] = pdfBytes.length;
      total += pdfBytes.length;
    }

    setTotalZipSize(total);
  }, [getActivePagesGrouped, buildGroupPDF]);

  return {
    pdfFile,
    originalFileName,
    numPages,
    pages,
    isSplitting,
    totalZipSize,
    handlePDFUpload,
    onDocumentLoadSuccess,
    splitAllPages,
    addSplitAfterPage,
    removeSplitAfterPage,
    deletePage,
    movePage,
    resetAll,
    rotatePage,
    resetPDF,
    hasChanges,
    getActivePagesGrouped,
    downloadSinglePDF,
    downloadAllAsZip,
    setGroupName,
    getGroupName,
    getGroupSize,
    calculateGroupSize,
    calculateAllSizes,
  };
};
