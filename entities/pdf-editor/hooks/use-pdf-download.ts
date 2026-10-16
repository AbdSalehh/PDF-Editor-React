import { useState } from "react";
import type {
  ImageElement,
  TextElement,
  ShapeElement,
} from "../model/pdf-editor.types";
import fontkit from "@pdf-lib/fontkit";
import { toast } from "sonner";

// Helper function to load custom fonts with bold, italic, and bold italic support
const loadCustomFont = async (
  fontFamily: string,
  isBold: boolean = false,
  isItalic: boolean = false,
): Promise<ArrayBuffer | null> => {
  const fontMap: Record<
    string,
    { base: string; bold: string; italic: string; boldItalic: string }
  > = {
    "Roboto, sans-serif": {
      base: "fonts/roboto.ttf",
      bold: "fonts/robotob.ttf",
      italic: "fonts/robotoi.ttf",
      boldItalic: "fonts/robotoz.ttf",
    },
    "'Open Sans', sans-serif": {
      base: "fonts/opensans.ttf",
      bold: "fonts/opensansb.ttf",
      italic: "fonts/opensansi.ttf",
      boldItalic: "fonts/opensansz.ttf",
    },
    "Lato, sans-serif": {
      base: "fonts/lato.ttf",
      bold: "fonts/latob.ttf",
      italic: "fonts/latoi.ttf",
      boldItalic: "fonts/latoz.ttf",
    },
    "Georgia, sans-serif": {
      base: "fonts/georgia.ttf",
      bold: "fonts/georgiab.ttf",
      italic: "fonts/georgiai.ttf",
      boldItalic: "fonts/georgiaz.ttf",
    },
    "Calibri, sans-serif": {
      base: "fonts/calibri.ttf",
      bold: "fonts/calibrib.ttf",
      italic: "fonts/calibrii.ttf",
      boldItalic: "fonts/calibriz.ttf",
    },
  };

  const fontFiles = fontMap[fontFamily];
  if (!fontFiles) return null;

  // Pilih file font berdasarkan bold dan italic
  let fontUrl: string;
  if (isBold && isItalic) {
    fontUrl = fontFiles.boldItalic;
  } else if (isBold) {
    fontUrl = fontFiles.bold;
  } else if (isItalic) {
    fontUrl = fontFiles.italic;
  } else {
    fontUrl = fontFiles.base;
  }

  try {
    const response = await fetch(fontUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch font: ${response.statusText}`);
    }
    return await response.arrayBuffer();
  } catch (error) {
    console.error(
      `Failed to load font ${fontFamily} (bold: ${isBold}, italic: ${isItalic}):`,
      error,
    );
    return null;
  }
};

export const usePDFDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const downloadPDF = async (
    pdfData: Uint8Array | null,
    images: ImageElement[],
    texts: TextElement[] = [],
    shapes: ShapeElement[] = [],
    scale: number,
    fileName?: string,
  ): Promise<boolean> => {
    if (!pdfData) return false;

    try {
      setIsDownloading(true);

      const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");

      const pdfDoc = await PDFDocument.load(pdfData);

      // Register fontkit for custom font support
      pdfDoc.registerFontkit(fontkit);

      // Combine all elements with their timestamps for proper z-index ordering
      const allElements: Array<{
        type: "image" | "text" | "shape";
        data: any;
        timestamp: number;
      }> = [
        ...images.map((img) => ({
          type: "image" as const,
          data: img,
          timestamp: parseInt(img.id.split("-")[1] || "0"),
        })),
        ...texts.map((txt) => ({
          type: "text" as const,
          data: txt,
          timestamp: parseInt(txt.id.split("-")[1] || "0"),
        })),
        ...shapes.map((shp) => ({
          type: "shape" as const,
          data: shp,
          timestamp: parseInt(shp.id.split("-")[1] || "0"),
        })),
      ];

      // Sort by timestamp to maintain creation order (z-index)
      allElements.sort((a, b) => a.timestamp - b.timestamp);

      // Process all elements in order
      for (const element of allElements) {
        if (element.type === "image") {
          const image = element.data;
          const page = pdfDoc.getPages()[image.pageNumber - 1];
          if (!page) {
            console.warn(
              `Page ${image.pageNumber} not found for image ${image.id}`,
            );
            continue;
          }

          try {
            // Convert data URL to ArrayBuffer
            let imageBytes: ArrayBuffer;
            if (image.src.startsWith("data:")) {
              // Extract base64 data from data URL
              const base64Data = image.src.split(",")[1];
              const binaryString = atob(base64Data);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }
              imageBytes = bytes.buffer;
            } else {
              imageBytes = await fetch(image.src).then((res) =>
                res.arrayBuffer(),
              );
            }

            let embeddedImage;
            if (image.src.includes("image/png") || image.src.includes("png")) {
              embeddedImage = await pdfDoc.embedPng(imageBytes);
            } else {
              embeddedImage = await pdfDoc.embedJpg(imageBytes);
            }

            const { height: pageHeight } = page.getSize();

            const drawX = image.x / scale;
            const drawY = pageHeight - image.y / scale - image.height / scale;
            const drawWidth = image.width / scale;
            const drawHeight = image.height / scale;

            page.drawImage(embeddedImage, {
              x: drawX,
              y: drawY,
              width: drawWidth,
              height: drawHeight,
            });
          } catch (error) {
            console.error(`Failed to embed image ${image.id}:`, error);
          }
        } else if (element.type === "text") {
          const text = element.data;
          const page = pdfDoc.getPages()[text.pageNumber - 1];
          if (!page) {
            console.warn(
              `Page ${text.pageNumber} not found for text ${text.id}`,
            );
            continue;
          }

          try {
            const { height: pageHeight } = page.getSize();

            const drawX = (text.x + 1.5) / scale;
            const textAscent = (text.fontSize / scale) * 1.2;
            const drawY = pageHeight - text.y / scale - textAscent;

            let font;
            const fontFamily = text.fontFamily.toLowerCase();
            const isBold = text.isBold || false;
            const isItalic = text.isItalic || false;

            // Try to load custom font with bold/italic support
            const customFontData = await loadCustomFont(
              text.fontFamily,
              isBold,
              isItalic,
            );
            if (customFontData) {
              font = await pdfDoc.embedFont(customFontData);
            } else {
              let fontName: string;

              if (fontFamily.includes("times")) {
                if (isBold && isItalic)
                  fontName = StandardFonts.TimesRomanBoldItalic;
                else if (isBold) fontName = StandardFonts.TimesRomanBold;
                else if (isItalic) fontName = StandardFonts.TimesRomanItalic;
                else fontName = StandardFonts.TimesRoman;
              } else if (fontFamily.includes("courier")) {
                if (isBold && isItalic)
                  fontName = StandardFonts.CourierBoldOblique;
                else if (isBold) fontName = StandardFonts.CourierBold;
                else if (isItalic) fontName = StandardFonts.CourierOblique;
                else fontName = StandardFonts.Courier;
              } else {
                // Helvetica for Arial, Verdana, and others
                if (isBold && isItalic)
                  fontName = StandardFonts.HelveticaBoldOblique;
                else if (isBold) fontName = StandardFonts.HelveticaBold;
                else if (isItalic) fontName = StandardFonts.HelveticaOblique;
                else fontName = StandardFonts.Helvetica;
              }

              font = await pdfDoc.embedFont(fontName);
            }

            // Parse color from hex to RGB
            const hexColor = text.color.replace("#", "");
            const r = parseInt(hexColor.substring(0, 2), 16) / 255;
            const g = parseInt(hexColor.substring(2, 4), 16) / 255;
            const b = parseInt(hexColor.substring(4, 6), 16) / 255;

            // Draw text with the selected font and color
            page.drawText(text.content, {
              x: drawX,
              y: drawY,
              size: text.fontSize / scale,
              color: rgb(r, g, b),
              font: font,
            });

            // Draw underline if needed
            if (text.isUnderline) {
              const textWidth = font.widthOfTextAtSize(
                text.content,
                text.fontSize / scale,
              );
              page.drawLine({
                start: { x: drawX, y: drawY - 2 },
                end: { x: drawX + textWidth, y: drawY - 2 },
                thickness: 1,
                color: rgb(r, g, b),
              });
            }
          } catch (error) {
            console.error(`Failed to embed text ${text.id}:`, error);
          }
        } else if (element.type === "shape") {
          const shape = element.data;
          const page = pdfDoc.getPages()[shape.pageNumber - 1];
          if (!page) {
            console.warn(
              `Page ${shape.pageNumber} not found for shape ${shape.id}`,
            );
            continue;
          }

          try {
            const { height: pageHeight } = page.getSize();

            // Calculate position (PDF coordinates start from bottom-left)
            const drawX = shape.x / scale;
            const drawY = pageHeight - shape.y / scale - shape.height / scale;
            const drawWidth = shape.width / scale;
            const drawHeight = shape.height / scale;

            // Parse color from hex to RGB
            const parseColor = shape.backgroundColor.replace("#", "");
            const r = parseInt(parseColor.substring(0, 2), 16) / 255;
            const g = parseInt(parseColor.substring(2, 4), 16) / 255;
            const b = parseInt(parseColor.substring(4, 6), 16) / 255;

            // Draw shape based on type
            if (shape.shapeType === "rectangle") {
              // Draw filled rectangle
              page.drawRectangle({
                x: drawX,
                y: drawY,
                width: drawWidth,
                height: drawHeight,
                color: rgb(r, g, b),
              });
            } else if (shape.shapeType === "circle") {
              // Draw filled ellipse (circle)
              const centerX = drawX + drawWidth / 2;
              const centerY = drawY + drawHeight / 2;
              page.drawEllipse({
                x: centerX,
                y: centerY,
                xScale: drawWidth / 2,
                yScale: drawHeight / 2,
                color: rgb(r, g, b),
              });
            } else if (shape.shapeType === "triangle") {
              // Draw triangle using lines to form a filled triangle
              // Triangle points: top-center, bottom-left, bottom-right
              const topX = drawX + drawWidth / 2;
              const topY = drawY + drawHeight;
              const bottomLeftX = drawX;
              const bottomLeftY = drawY;
              const bottomRightX = drawX + drawWidth;

              // Draw filled triangle by drawing multiple horizontal lines
              // from bottom to top to create a filled effect
              const steps = Math.ceil(drawHeight);
              for (let i = 0; i <= steps; i++) {
                const ratio = i / steps;
                const currentY = bottomLeftY + (topY - bottomLeftY) * ratio;
                const currentLeftX = bottomLeftX + (topX - bottomLeftX) * ratio;
                const currentRightX =
                  bottomRightX + (topX - bottomRightX) * ratio;

                page.drawLine({
                  start: { x: currentLeftX, y: currentY },
                  end: { x: currentRightX, y: currentY },
                  color: rgb(r, g, b),
                  thickness: 1,
                });
              }
            }
          } catch (error) {
            console.error(`Failed to embed shape ${shape.id}:`, error);
          }
        }
      }

      const pdfBytes = await pdfDoc.save();

      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], {
        type: "application/pdf",
      });

      // Use provided fileName, or default to "edited-pdf.pdf"
      let downloadFileName = fileName || "edited-pdf.pdf";

      // Ensure .pdf extension
      if (!downloadFileName.toLowerCase().endsWith(".pdf")) {
        downloadFileName = `${downloadFileName}.pdf`;
      }

      // Download the file
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = downloadFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 100);

      // Show success toast
      toast.success(`Berhasil mendownload ${downloadFileName}`);

      return true;
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Terjadi kesalahan saat mendownload PDF");
      return false;
    } finally {
      setIsDownloading(false);
    }
  };

  return { downloadPDF, isDownloading };
};
