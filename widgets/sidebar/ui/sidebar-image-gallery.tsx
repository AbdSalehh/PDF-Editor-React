import ImageThumbnail from "./image-thumbnail";
import { usePDFEditorStore } from "@/entities/pdf-editor";
import type { ImageElement } from "@/entities/pdf-editor";

export default function SidebarImageGallery() {
  const images = usePDFEditorStore((s) => s.images);
  const currentPage = usePDFEditorStore((s) => s.currentPage);
  const selectedImage = usePDFEditorStore((s) => s.selectedImage);
  const onDeleteImage = usePDFEditorStore((s) => s.deleteImage);
  if (images.length === 0) return null;

  const imagesByPage = images.reduce(
    (acc, img) => {
      if (!acc[img.pageNumber]) acc[img.pageNumber] = [];
      acc[img.pageNumber].push(img);
      return acc;
    },
    {} as Record<number, ImageElement[]>,
  );

  const pageNumbers = Object.keys(imagesByPage)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="border-t py-4">
      <p className="mb-2 text-sm font-medium">Semua Gambar</p>
      <div className="space-y-3">
        {pageNumbers.map((pageNum) => (
          <div key={pageNum}>
            <p className="mb-1 text-xs font-medium text-slate-500 dark:text-neutral-300">
              Halaman {pageNum}
              {pageNum === currentPage && (
                <span className="ml-1 text-blue-500">(Aktif)</span>
              )}
            </p>
            <div className="space-y-2">
              {imagesByPage[pageNum].map((img) => (
                <ImageThumbnail
                  key={img.id}
                  id={img.id}
                  src={img.src}
                  isSelected={selectedImage === img.id}
                  onDelete={() => onDeleteImage(img.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
