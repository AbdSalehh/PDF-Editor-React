import { create } from "zustand";
import type {
  ImageElement,
  TextElement,
  ShapeElement,
} from "../model/pdf-editor.types";

interface PDFEditorState {
  // PDF state
  pdfFile: File | null;
  pdfData: Uint8Array | null;
  originalFileName: string;
  numPages: number;
  currentPage: number;

  // Elements
  images: ImageElement[];
  texts: TextElement[];
  shapes: ShapeElement[];

  // Selection
  selectedImage: string | null;
  selectedText: string | null;
  selectedShape: string | null;

  // Interaction
  isDragging: boolean;
  isResizing: boolean;
  dragOffset: { x: number; y: number };
  resizeStart: { x: number; y: number; width: number; height: number };
  scale: number;

  // Refs (stored as mutable containers)
  canvasRef: { current: HTMLDivElement | null };
  fileInputRef: { current: HTMLInputElement | null };
  imageInputRef: { current: HTMLInputElement | null };
  pageRefs: { current: Map<number, HTMLDivElement> };
}

interface PDFEditorActions {
  // PDF actions
  setPdfFile: (file: File | null) => void;
  setPdfData: (data: Uint8Array | null) => void;
  setOriginalFileName: (name: string) => void;
  setNumPages: (num: number) => void;
  setCurrentPage: (page: number) => void;

  // Element actions
  setImages: (
    updater: ImageElement[] | ((prev: ImageElement[]) => ImageElement[]),
  ) => void;
  setTexts: (
    updater: TextElement[] | ((prev: TextElement[]) => TextElement[]),
  ) => void;
  setShapes: (
    updater: ShapeElement[] | ((prev: ShapeElement[]) => ShapeElement[]),
  ) => void;

  // Selection actions
  setSelectedImage: (id: string | null) => void;
  setSelectedText: (id: string | null) => void;
  setSelectedShape: (id: string | null) => void;
  clearSelection: () => void;

  // Interaction actions
  setIsDragging: (isDragging: boolean) => void;
  setIsResizing: (isResizing: boolean) => void;
  setDragOffset: (offset: { x: number; y: number }) => void;
  setResizeStart: (start: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => void;
  setScale: (updater: number | ((prev: number) => number)) => void;

  // High-level actions
  onDocumentLoadSuccess: (params: { numPages: number }) => void;
  handlePDFUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handlePDFDrop: (file: File) => Promise<void>;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  deleteImage: (imageId: string) => void;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  scrollToPage: (pageNumber: number) => void;
  handlePrevPage: () => void;
  handleNextPage: () => void;

  // Text actions
  addText: (content?: string) => void;
  updateText: (id: string, updates: Partial<TextElement>) => void;
  deleteText: (id: string) => void;

  // Shape actions
  addShape: (shapeType: "rectangle" | "circle" | "triangle") => void;
  updateShape: (id: string, updates: Partial<ShapeElement>) => void;
  deleteShape: (id: string) => void;

  // Mouse handlers
  handleMouseDown: (e: React.MouseEvent, imageId: string) => void;
  handleResizeMouseDown: (e: React.MouseEvent, imageId: string) => void;
  handleTextMouseDown: (e: React.MouseEvent, textId: string) => void;
  handleShapeMouseDown: (e: React.MouseEvent, shapeId: string) => void;
  handleShapeResizeMouseDown: (e: React.MouseEvent, shapeId: string) => void;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseUp: () => void;
  handleCanvasClick: (e: React.MouseEvent) => void;

  // Reset
  resetPDF: () => void;
}

export type PDFEditorStore = PDFEditorState & PDFEditorActions;

const loadPDFData = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  return new Uint8Array(arrayBuffer);
};

export const usePDFEditorStore = create<PDFEditorStore>((set, get) => ({
  // Initial state
  pdfFile: null,
  pdfData: null,
  originalFileName: "",
  numPages: 0,
  currentPage: 1,
  images: [],
  texts: [],
  shapes: [],
  selectedImage: null,
  selectedText: null,
  selectedShape: null,
  isDragging: false,
  isResizing: false,
  dragOffset: { x: 0, y: 0 },
  resizeStart: { x: 0, y: 0, width: 0, height: 0 },
  scale: 1.0,

  // Refs
  canvasRef: { current: null },
  fileInputRef: { current: null },
  imageInputRef: { current: null },
  pageRefs: { current: new Map() },

  // Basic setters
  setPdfFile: (file) => set({ pdfFile: file }),
  setPdfData: (data) => set({ pdfData: data }),
  setOriginalFileName: (name) => set({ originalFileName: name }),
  setNumPages: (num) => set({ numPages: num }),
  setCurrentPage: (page) => set({ currentPage: page }),

  setImages: (updater) =>
    set((state) => ({
      images: typeof updater === "function" ? updater(state.images) : updater,
    })),
  setTexts: (updater) =>
    set((state) => ({
      texts: typeof updater === "function" ? updater(state.texts) : updater,
    })),
  setShapes: (updater) =>
    set((state) => ({
      shapes: typeof updater === "function" ? updater(state.shapes) : updater,
    })),

  setSelectedImage: (id) => set({ selectedImage: id }),
  setSelectedText: (id) => set({ selectedText: id }),
  setSelectedShape: (id) => set({ selectedShape: id }),
  clearSelection: () =>
    set({ selectedImage: null, selectedText: null, selectedShape: null }),

  setIsDragging: (isDragging) => set({ isDragging }),
  setIsResizing: (isResizing) => set({ isResizing }),
  setDragOffset: (offset) => set({ dragOffset: offset }),
  setResizeStart: (start) => set({ resizeStart: start }),
  setScale: (updater) =>
    set((state) => ({
      scale: typeof updater === "function" ? updater(state.scale) : updater,
    })),

  // High-level actions
  onDocumentLoadSuccess: ({ numPages }) => {
    set({ numPages, currentPage: 1 });
  },

  handlePDFUpload: async (event) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      const data = await loadPDFData(file);
      set({
        pdfFile: file,
        pdfData: data,
        originalFileName: file.name.replace(/\.pdf$/i, ""),
        images: [],
        texts: [],
        shapes: [],
        selectedImage: null,
        selectedText: null,
        selectedShape: null,
        currentPage: 1,
        numPages: 0,
      });
      get().pageRefs.current.clear();
    }
    event.target.value = "";
  },

  handlePDFDrop: async (file) => {
    if (file && file.type === "application/pdf") {
      const data = await loadPDFData(file);
      set({
        pdfFile: file,
        pdfData: data,
        originalFileName: file.name.replace(/\.pdf$/i, ""),
        images: [],
        texts: [],
        shapes: [],
        selectedImage: null,
        selectedText: null,
        selectedShape: null,
        currentPage: 1,
        numPages: 0,
      });
      get().pageRefs.current.clear();
    }
  },

  handleImageUpload: (event) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const { currentPage, pageRefs } = get();
          const aspectRatio = img.width / img.height;
          const maxSize = 200;
          let width = img.width;
          let height = img.height;

          if (width > maxSize || height > maxSize) {
            if (width > height) {
              width = maxSize;
              height = maxSize / aspectRatio;
            } else {
              height = maxSize;
              width = maxSize * aspectRatio;
            }
          }

          const pageElement = pageRefs.current.get(currentPage);
          let initialX = 50;
          let initialY = 50;

          if (pageElement) {
            const pageWidth = pageElement.offsetWidth;
            const pageHeight = pageElement.offsetHeight;
            initialX = Math.max(0, pageWidth / 2 - width / 2);
            initialY = Math.max(0, pageHeight / 2 - height / 2);
          }

          /**
           * Normalisasi ke PNG lewat canvas agar semua format (webp, gif, bmp)
           * dapat di-embed oleh pdf-lib (embedPng), sehingga gambar selalu
           * muncul saat PDF didownload.
           */
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const context = canvas.getContext("2d");
          const normalizedSrc = context
            ? (context.drawImage(img, 0, 0), canvas.toDataURL("image/png"))
            : (e.target?.result as string);

          const newImage: ImageElement = {
            id: `img-${Date.now()}`,
            src: normalizedSrc,
            x: initialX,
            y: initialY,
            width,
            height,
            pageNumber: currentPage,
          };

          set((state) => ({
            images: [...state.images, newImage],
            selectedImage: newImage.id,
          }));
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
    event.target.value = "";
  },

  deleteImage: (imageId) => {
    set((state) => ({
      images: state.images.filter((img) => img.id !== imageId),
      selectedImage:
        state.selectedImage === imageId ? null : state.selectedImage,
    }));
  },

  handleZoomIn: () => {
    set((state) => ({ scale: Math.min(3, state.scale + 0.1) }));
  },

  handleZoomOut: () => {
    set((state) => ({ scale: Math.max(0.5, state.scale - 0.1) }));
  },

  scrollToPage: (pageNumber) => {
    const { pageRefs, canvasRef } = get();
    const pageElement = pageRefs.current.get(pageNumber);
    if (pageElement && canvasRef.current) {
      const container = canvasRef.current;
      const scrollTop = pageElement.offsetTop - 20;
      container.scrollTop = scrollTop;
      set({ currentPage: pageNumber });
    }
  },

  handlePrevPage: () => {
    const { currentPage } = get();
    const newPage = Math.max(1, currentPage - 1);
    get().scrollToPage(newPage);
  },

  handleNextPage: () => {
    const { currentPage, numPages } = get();
    const newPage = Math.min(numPages, currentPage + 1);
    get().scrollToPage(newPage);
  },

  // Text actions
  addText: (content?: string) => {
    const { currentPage, pageRefs } = get();
    const pageElement = pageRefs.current.get(currentPage);
    let x = 100;
    let y = 100;

    if (pageElement) {
      const pageWidth = pageElement.offsetWidth;
      const pageHeight = pageElement.offsetHeight;
      x = Math.max(0, pageWidth / 2 - 50);
      y = Math.max(0, pageHeight / 2 - 10);
    }

    const newText: TextElement = {
      id: `text-${Date.now()}`,
      type: "text",
      content: content && content.trim() ? content : "Double-click to edit",
      x,
      y,
      fontSize: 16,
      fontFamily: "Arial, sans-serif",
      color: "#000000",
      pageNumber: currentPage,
    };

    set((state) => ({
      texts: [...state.texts, newText],
      selectedText: newText.id,
      selectedImage: null,
    }));
  },

  updateText: (id, updates) => {
    set((state) => ({
      texts: state.texts.map((text) =>
        text.id === id ? { ...text, ...updates } : text,
      ),
    }));
  },

  deleteText: (id) => {
    set((state) => ({
      texts: state.texts.filter((text) => text.id !== id),
      selectedText: state.selectedText === id ? null : state.selectedText,
    }));
  },

  // Shape actions
  addShape: (shapeType) => {
    const { currentPage, pageRefs } = get();
    const pageElement = pageRefs.current.get(currentPage);
    let x = 100;
    let y = 100;

    if (pageElement) {
      const pageWidth = pageElement.offsetWidth;
      const pageHeight = pageElement.offsetHeight;
      x = Math.max(0, pageWidth / 2 - 50);
      y = Math.max(0, pageHeight / 2 - 50);
    }

    const newShape: ShapeElement = {
      id: `shape-${Date.now()}`,
      type: "shape",
      shapeType,
      x,
      y,
      width: 100,
      height: 100,
      backgroundColor: "#3b82f6",
      pageNumber: currentPage,
    };

    set((state) => ({
      shapes: [...state.shapes, newShape],
      selectedShape: newShape.id,
      selectedImage: null,
      selectedText: null,
    }));
  },

  updateShape: (id, updates) => {
    set((state) => ({
      shapes: state.shapes.map((shape) =>
        shape.id === id ? { ...shape, ...updates } : shape,
      ),
    }));
  },

  deleteShape: (id) => {
    set((state) => ({
      shapes: state.shapes.filter((shape) => shape.id !== id),
      selectedShape: state.selectedShape === id ? null : state.selectedShape,
    }));
  },

  // Mouse handlers
  handleMouseDown: (e, imageId) => {
    e.preventDefault();
    e.stopPropagation();
    const { images } = get();
    const image = images.find((img) => img.id === imageId);
    if (!image) return;

    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();

    set({
      selectedImage: imageId,
      isDragging: true,
      dragOffset: {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      },
    });
  },

  handleResizeMouseDown: (e, imageId) => {
    e.preventDefault();
    e.stopPropagation();
    const { images } = get();
    const image = images.find((img) => img.id === imageId);
    if (!image) return;

    set({
      selectedImage: imageId,
      isResizing: true,
      resizeStart: {
        x: e.clientX,
        y: e.clientY,
        width: image.width,
        height: image.height,
      },
    });
  },

  handleTextMouseDown: (e, textId) => {
    e.preventDefault();
    e.stopPropagation();
    const { texts } = get();
    const text = texts.find((t) => t.id === textId);
    if (!text) return;

    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();

    set({
      selectedText: textId,
      selectedImage: null,
      isDragging: true,
      dragOffset: {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      },
    });
  },

  handleShapeMouseDown: (e, shapeId) => {
    e.preventDefault();
    e.stopPropagation();
    const { shapes } = get();
    const shape = shapes.find((s) => s.id === shapeId);
    if (!shape) return;

    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();

    set({
      selectedShape: shapeId,
      selectedImage: null,
      selectedText: null,
      isDragging: true,
      dragOffset: {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      },
    });
  },

  handleShapeResizeMouseDown: (e, shapeId) => {
    e.preventDefault();
    e.stopPropagation();
    const { shapes } = get();
    const shape = shapes.find((s) => s.id === shapeId);
    if (!shape) return;

    set({
      selectedShape: shapeId,
      isResizing: true,
      resizeStart: {
        x: e.clientX,
        y: e.clientY,
        width: shape.width,
        height: shape.height,
      },
    });
  },

  handleMouseMove: (e) => {
    const {
      isDragging,
      isResizing,
      selectedImage,
      selectedText,
      selectedShape,
      dragOffset,
      resizeStart,
      pageRefs,
    } = get();

    if (isDragging && selectedImage) {
      set((state) => {
        const image = state.images.find((img) => img.id === selectedImage);
        if (!image) return state;

        let targetPageNumber = image.pageNumber;
        let targetPageElement = pageRefs.current.get(image.pageNumber);

        for (const [pageNum, pageEl] of pageRefs.current.entries()) {
          const rect = pageEl.getBoundingClientRect();
          if (
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom
          ) {
            targetPageNumber = pageNum;
            targetPageElement = pageEl;
            break;
          }
        }

        if (!targetPageElement) return state;

        const pageRect = targetPageElement.getBoundingClientRect();
        const newX = e.clientX - pageRect.left - dragOffset.x;
        const newY = e.clientY - pageRect.top - dragOffset.y;
        const maxX = targetPageElement.offsetWidth - image.width;
        const maxY = targetPageElement.offsetHeight - image.height;
        const clampedX = Math.max(0, Math.min(newX, maxX));
        const clampedY = Math.max(0, Math.min(newY, maxY));

        return {
          images: state.images.map((img) =>
            img.id === selectedImage
              ? { ...img, x: clampedX, y: clampedY, pageNumber: targetPageNumber }
              : img,
          ),
        };
      });
    } else if (isDragging && selectedText) {
      set((state) => {
        const text = state.texts.find((t) => t.id === selectedText);
        if (!text) return state;

        let targetPageNumber = text.pageNumber;
        let targetPageElement = pageRefs.current.get(text.pageNumber);

        for (const [pageNum, pageEl] of pageRefs.current.entries()) {
          const rect = pageEl.getBoundingClientRect();
          if (
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom
          ) {
            targetPageNumber = pageNum;
            targetPageElement = pageEl;
            break;
          }
        }

        if (!targetPageElement) return state;

        const pageRect = targetPageElement.getBoundingClientRect();
        const newX = e.clientX - pageRect.left - dragOffset.x;
        const newY = e.clientY - pageRect.top - dragOffset.y;
        const maxX = targetPageElement.offsetWidth - 50;
        const maxY = targetPageElement.offsetHeight - 20;
        const clampedX = Math.max(0, Math.min(newX, maxX));
        const clampedY = Math.max(0, Math.min(newY, maxY));

        return {
          texts: state.texts.map((t) =>
            t.id === selectedText
              ? { ...t, x: clampedX, y: clampedY, pageNumber: targetPageNumber }
              : t,
          ),
        };
      });
    } else if (isDragging && selectedShape) {
      set((state) => {
        const shape = state.shapes.find((s) => s.id === selectedShape);
        if (!shape) return state;

        let targetPageNumber = shape.pageNumber;
        let targetPageElement = pageRefs.current.get(shape.pageNumber);

        for (const [pageNum, pageEl] of pageRefs.current.entries()) {
          const rect = pageEl.getBoundingClientRect();
          if (
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom
          ) {
            targetPageNumber = pageNum;
            targetPageElement = pageEl;
            break;
          }
        }

        if (!targetPageElement) return state;

        const pageRect = targetPageElement.getBoundingClientRect();
        const newX = e.clientX - pageRect.left - dragOffset.x;
        const newY = e.clientY - pageRect.top - dragOffset.y;
        const maxX = targetPageElement.offsetWidth - shape.width;
        const maxY = targetPageElement.offsetHeight - shape.height;
        const clampedX = Math.max(0, Math.min(newX, maxX));
        const clampedY = Math.max(0, Math.min(newY, maxY));

        return {
          shapes: state.shapes.map((s) =>
            s.id === selectedShape
              ? { ...s, x: clampedX, y: clampedY, pageNumber: targetPageNumber }
              : s,
          ),
        };
      });
    } else if (isResizing && selectedImage) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      const aspectRatio = resizeStart.width / resizeStart.height;
      const delta = Math.max(deltaX, deltaY);
      const newWidth = Math.max(1, resizeStart.width + delta);
      const newHeight = newWidth / aspectRatio;

      set((state) => ({
        images: state.images.map((img) =>
          img.id === selectedImage
            ? { ...img, width: newWidth, height: newHeight }
            : img,
        ),
      }));
    } else if (isResizing && selectedShape) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      const newWidth = Math.max(1, resizeStart.width + deltaX);
      const newHeight = Math.max(1, resizeStart.height + deltaY);

      set((state) => ({
        shapes: state.shapes.map((shape) =>
          shape.id === selectedShape
            ? { ...shape, width: newWidth, height: newHeight }
            : shape,
        ),
      }));
    }
  },

  handleMouseUp: () => {
    set({ isDragging: false, isResizing: false });
  },

  handleCanvasClick: (e) => {
    if (e.target === e.currentTarget) {
      set({ selectedImage: null, selectedText: null, selectedShape: null });
    }
  },

  resetPDF: () => {
    set({
      pdfFile: null,
      pdfData: null,
      originalFileName: "",
      numPages: 0,
      currentPage: 1,
      images: [],
      texts: [],
      shapes: [],
      selectedImage: null,
      selectedText: null,
      selectedShape: null,
    });
    get().pageRefs.current.clear();
  },
}));
