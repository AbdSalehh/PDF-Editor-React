import { Button } from "@/shared/ui/button";
import {
  Upload,
  Image as ImageIcon,
  Type,
  Square,
  Circle,
  Triangle,
} from "lucide-react";
import { usePDFEditorStore } from "@/entities/pdf-editor";

export default function SidebarTools() {
  const pdfFile = usePDFEditorStore((s) => s.pdfFile);
  const fileInputRef = usePDFEditorStore((s) => s.fileInputRef);
  const imageInputRef = usePDFEditorStore((s) => s.imageInputRef);
  const onPDFUpload = usePDFEditorStore((s) => s.handlePDFUpload);
  const onImageUpload = usePDFEditorStore((s) => s.handleImageUpload);
  const onAddText = usePDFEditorStore((s) => s.addText);
  const onAddShape = usePDFEditorStore((s) => s.addShape);

  return (
    <div className="space-y-2">
      {/* PDF Upload */}
      <div>
        <input
          type="file"
          accept="application/pdf"
          onChange={onPDFUpload}
          ref={fileInputRef}
          className="hidden"
        />
        <Button
          onClick={() => fileInputRef?.current?.click()}
          className="w-full bg-slate-900! text-white hover:text-white dark:bg-neutral-100! dark:text-neutral-900 dark:hover:text-neutral-900"
          variant="outline"
        >
          <Upload className="mr-2 h-4 w-4 text-white dark:text-neutral-900" />
          {pdfFile ? "Ganti PDF" : "Upload PDF"}
        </Button>
      </div>

      {pdfFile && (
        <>
          {/* Image Upload */}
          <input
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            ref={imageInputRef}
            className="hidden"
          />
          <Button
            onClick={() => imageInputRef?.current?.click()}
            className="w-full bg-slate-900! text-sm! text-white hover:text-white dark:bg-neutral-200! dark:text-neutral-900 dark:hover:text-neutral-900"
            variant="default"
          >
            <ImageIcon className="mr-1 h-4 w-4" />
            Tambah Gambar
          </Button>

          {/* Add Text */}
          <Button
            onClick={() => onAddText()}
            className="w-full bg-blue-600! text-sm! text-white hover:bg-blue-700"
            variant="default"
          >
            <Type className="mr-1 h-4 w-4" />
            Tambah Teks
          </Button>

          {/* Shape Buttons */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-600 dark:text-neutral-300">
              Tambah Shape:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={() => onAddShape?.("rectangle")}
                className="bg-pink-600! text-xs! text-white hover:bg-pink-700!"
                variant="default"
                size="sm"
              >
                <Square className="h-3 w-3" />
              </Button>
              <Button
                onClick={() => onAddShape?.("circle")}
                className="bg-pink-600! text-xs! text-white hover:bg-pink-700!"
                variant="default"
                size="sm"
              >
                <Circle className="h-3 w-3" />
              </Button>
              <Button
                onClick={() => onAddShape?.("triangle")}
                className="bg-pink-600! text-xs! text-white hover:bg-pink-700!"
                variant="default"
                size="sm"
              >
                <Triangle className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
