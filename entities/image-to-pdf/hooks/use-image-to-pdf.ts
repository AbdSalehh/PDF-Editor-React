import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import type {
  ImageItem,
  PageOrientation,
  PageSize,
  PageMargin,
  UseImageToPDFReturn,
} from "../model/image-to-pdf.types";

let idCounter = 0;
const generateId = () => `img-${Date.now()}-${++idCounter}`;

const PAGE_SIZES = {
  a4: { width: 595.28, height: 841.89 },
  letter: { width: 612, height: 792 },
};

const MARGINS = {
  none: 0,
  small: 20,
  big: 50,
};

export const useImageToPDF = (): UseImageToPDFReturn => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isConverting, setIsConverting] = useState(false);

  const addImages = useCallback((files: FileList | null) => {
    if (!files) return;

    const newImages: ImageItem[] = [];
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        newImages.push({
          id: generateId(),
          file,
          preview: URL.createObjectURL(file),
        });
      }
    });

    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.preview);
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const reorderImages = useCallback((fromIndex: number, toIndex: number) => {
    setImages((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    setImages((prev) => {
      prev.forEach((img) => URL.revokeObjectURL(img.preview));
      return [];
    });
  }, []);

  const convertToPDF = useCallback(
    async (
      orientation: PageOrientation,
      pageSize: PageSize,
      margin: PageMargin,
      fileName: string,
    ) => {
      if (images.length === 0) return;
      setIsConverting(true);

      try {
        const pdfDoc = await PDFDocument.create();
        const marginPx = MARGINS[margin];

        for (const image of images) {
          const arrayBuffer = await image.file.arrayBuffer();
          const mimeType = image.file.type.toLowerCase();

          let pdfImage;
          if (mimeType === "image/png") {
            pdfImage = await pdfDoc.embedPng(arrayBuffer);
          } else {
            // Convert non-JPEG/PNG to JPEG via canvas
            if (mimeType !== "image/jpeg" && mimeType !== "image/jpg") {
              const bitmap = await createImageBitmap(image.file);
              const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
              const ctx = canvas.getContext("2d");
              if (ctx) {
                ctx.drawImage(bitmap, 0, 0);
                const jpegBlob = await canvas.convertToBlob({
                  type: "image/jpeg",
                  quality: 0.92,
                });
                const jpegBuffer = await jpegBlob.arrayBuffer();
                pdfImage = await pdfDoc.embedJpg(jpegBuffer);
              } else {
                continue;
              }
            } else {
              pdfImage = await pdfDoc.embedJpg(arrayBuffer);
            }
          }

          const imgWidth = pdfImage.width;
          const imgHeight = pdfImage.height;

          let pageWidth: number;
          let pageHeight: number;

          if (pageSize === "fit") {
            // Use the image's natural dimensions — no orientation swap
            pageWidth = imgWidth + marginPx * 2;
            pageHeight = imgHeight + marginPx * 2;
          } else {
            const size = PAGE_SIZES[pageSize];
            if (orientation === "landscape") {
              pageWidth = size.height;
              pageHeight = size.width;
            } else {
              pageWidth = size.width;
              pageHeight = size.height;
            }
          }

          const page = pdfDoc.addPage([pageWidth, pageHeight]);
          const availableWidth = pageWidth - marginPx * 2;
          const availableHeight = pageHeight - marginPx * 2;

          const scaleX = availableWidth / imgWidth;
          const scaleY = availableHeight / imgHeight;
          const scale = Math.min(scaleX, scaleY, 1);

          const drawWidth = imgWidth * scale;
          const drawHeight = imgHeight * scale;
          const x = marginPx + (availableWidth - drawWidth) / 2;
          const y = marginPx + (availableHeight - drawHeight) / 2;

          page.drawImage(pdfImage, {
            x,
            y,
            width: drawWidth,
            height: drawHeight,
          });
        }

        const pdfBytes = await pdfDoc.save();
        const finalName = fileName.endsWith(".pdf")
          ? fileName
          : `${fileName}.pdf`;
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
        setIsConverting(false);
      }
    },
    [images],
  );

  return {
    images,
    isConverting,
    addImages,
    removeImage,
    reorderImages,
    convertToPDF,
    clearAll,
  };
};
