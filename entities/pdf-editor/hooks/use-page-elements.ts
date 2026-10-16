import { useShallow } from "zustand/react/shallow";
import { usePDFEditorStore } from "../store/pdf-editor.store";

export const usePageElements = (pageNumber: number) => {
  const images = usePDFEditorStore((s) => s.images);
  const texts = usePDFEditorStore((s) => s.texts);
  const shapes = usePDFEditorStore((s) => s.shapes);

  return {
    pageImages: images.filter((img) => img.pageNumber === pageNumber),
    pageTexts: texts.filter((t) => t.pageNumber === pageNumber),
    pageShapes: shapes.filter((s) => s.pageNumber === pageNumber),
  };
};

export const useSelectionState = () => {
  return usePDFEditorStore(
    useShallow((s) => ({
      selectedImage: s.selectedImage,
      selectedText: s.selectedText,
      selectedShape: s.selectedShape,
      isDragging: s.isDragging,
    })),
  );
};

export const useElementActions = () => {
  return usePDFEditorStore(
    useShallow((s) => ({
      onImageMouseDown: s.handleMouseDown,
      onResizeMouseDown: s.handleResizeMouseDown,
      onTextMouseDown: s.handleTextMouseDown,
      onShapeMouseDown: s.handleShapeMouseDown,
      onShapeResizeMouseDown: s.handleShapeResizeMouseDown,
      onUpdateText: s.updateText,
      onUpdateShape: s.updateShape,
      onDeleteText: s.deleteText,
      onDeleteShape: s.deleteShape,
      onDeleteImage: s.deleteImage,
    })),
  );
};

export const useCanvasState = () => {
  return usePDFEditorStore(
    useShallow((s) => ({
      pdfFile: s.pdfFile,
      numPages: s.numPages,
      scale: s.scale,
      canvasRef: s.canvasRef,
      pageRefs: s.pageRefs,
      onDocumentLoadSuccess: s.onDocumentLoadSuccess,
      handleMouseMove: s.handleMouseMove,
      handleMouseUp: s.handleMouseUp,
      handleCanvasClick: s.handleCanvasClick,
      handlePDFDrop: s.handlePDFDrop,
    })),
  );
};

export const useZoomState = () => {
  return usePDFEditorStore(
    useShallow((s) => ({
      scale: s.scale,
      pdfFile: s.pdfFile,
      currentPage: s.currentPage,
      numPages: s.numPages,
      handleZoomIn: s.handleZoomIn,
      handleZoomOut: s.handleZoomOut,
      handlePrevPage: s.handlePrevPage,
      handleNextPage: s.handleNextPage,
      resetPDF: s.resetPDF,
    })),
  );
};
