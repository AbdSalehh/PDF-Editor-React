import { useEffect } from "react";
import { usePDFEditorStore } from "../store/pdf-editor.store";

/**
 * Hook to set up PDF editor side effects (wheel zoom, scroll tracking).
 * Call this once in the top-level PDF editor widget.
 */
export const usePDFEditorEffects = () => {
  const canvasRef = usePDFEditorStore((s) => s.canvasRef);
  const pageRefs = usePDFEditorStore((s) => s.pageRefs);
  const numPages = usePDFEditorStore((s) => s.numPages);
  const currentPage = usePDFEditorStore((s) => s.currentPage);
  const selectedImage = usePDFEditorStore((s) => s.selectedImage);
  const deleteImage = usePDFEditorStore((s) => s.deleteImage);
  const setScale = usePDFEditorStore((s) => s.setScale);
  const setCurrentPage = usePDFEditorStore((s) => s.setCurrentPage);

  // Ctrl+Wheel zoom
  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.05 : 0.05;
        setScale((prevScale) => Math.max(0.5, Math.min(3, prevScale + delta)));
      }
    };

    canvasElement.addEventListener("wheel", handleWheel, { passive: false });
    return () => canvasElement.removeEventListener("wheel", handleWheel);
  }, [canvasRef, setScale]);

  // Track current page based on scroll position
  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (!canvasElement || numPages === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let maxRatio = 0;
        let maxPage = currentPage;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            const pageNumber = Array.from(pageRefs.current.entries()).find(
              ([_, element]) => element === entry.target,
            )?.[0];
            if (pageNumber) {
              maxRatio = entry.intersectionRatio;
              maxPage = pageNumber;
            }
          }
        });

        if (maxRatio > 0.3 && maxPage !== currentPage) {
          setCurrentPage(maxPage);
        }
      },
      {
        root: canvasElement,
        threshold: [0, 0.1, 0.3, 0.5, 0.7, 1.0],
      },
    );

    const timeoutId = setTimeout(() => {
      pageRefs.current.forEach((element) => {
        observer.observe(element);
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [numPages, currentPage, canvasRef, pageRefs, setCurrentPage]);

  // Delete selected image on keyboard Delete key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage && e.key === "Delete") {
        e.preventDefault();
        deleteImage(selectedImage);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, deleteImage]);
};
