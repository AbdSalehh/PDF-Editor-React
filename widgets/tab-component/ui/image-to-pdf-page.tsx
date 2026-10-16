import { useState, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import {
  Upload,
  Download,
  X,
  Loader2,
  Plus,
  Image as ImageIcon,
  RotateCcw,
} from "lucide-react";
import { FileUpload } from "@/shared/ui/file-upload";
import ImageCard from "@/shared/ui/image-card";
import { DownloadDialog } from "@/widgets/dialog";
import { triggerConfetti } from "@/shared/lib/confetti";
import {
  useImageToPDF,
  type PageOrientation,
  type PageSize,
  type PageMargin,
} from "@/entities/image-to-pdf";

export default function ImageToPDFPage() {
  const {
    images,
    addImages,
    removeImage,
    reorderImages,
    convertToPDF,
    clearAll,
    isConverting,
  } = useImageToPDF();

  const [orientation, setOrientation] = useState<PageOrientation>("portrait");
  const [pageSize, setPageSize] = useState<PageSize>("fit");
  const [margin, setMargin] = useState<PageMargin>("none");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [useCustomName, setUseCustomName] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);

  const handleDownload = async (fileName: string) => {
    await convertToPDF(
      orientation,
      pageSize,
      margin,
      fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`,
    );
    triggerConfetti();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addImages(e.target.files);
    if (e.target) {
      e.target.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageDrop = (file: File) => {
    if (file.type.startsWith("image/")) {
      const fileList = new DataTransfer();
      fileList.items.add(file);
      addImages(fileList.files);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-screen overflow-hidden md:px-12">
        <div className="relative flex w-full items-center justify-center">
          <div className="z-10 w-full max-w-5xl px-4 md:px-0">
            <div className="gap-6 md:grid lg:grid-cols-3">
              {/* Settings Section */}
              <div className="w-full lg:col-span-1">
                <Card className="pb-5">
                  <CardHeader>
                    <CardTitle className="text-lg">Upload Images</CardTitle>
                    <CardDescription>
                      Pilih minimal 1 gambar untuk diubah menjadi PDF
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      className="hidden"
                    />

                    {images.length > 0 ? (
                      <>
                        <Button
                          onClick={handleUploadClick}
                          className="w-full bg-slate-900! text-white hover:text-white dark:bg-neutral-100! dark:text-neutral-900 dark:hover:text-neutral-900"
                          variant="default"
                        >
                          <Plus className="mr-2 h-4 w-4 dark:text-neutral-900" />
                          Tambah Gambar Lagi
                        </Button>

                        {/* Page Settings */}
                        <div className="space-y-4 border-t pt-4">
                          {/* Page Orientation */}
                          <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-neutral-300">
                              Page orientation
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              <Button
                                variant={
                                  orientation === "portrait"
                                    ? "default"
                                    : "outline"
                                }
                                className={`flex h-auto flex-col items-center gap-2 bg-blue-400 py-4 ${orientation === "portrait" ? "bg-blue-400!" : "bg-slate-50! dark:bg-neutral-700!"}`}
                                onClick={() => setOrientation("portrait")}
                              >
                                <div
                                  className={`h-12 w-8 rounded border-2 ${orientation === "portrait" ? "border-white" : "border-slate-400"}`}
                                />
                                <span className="text-xs">Portrait</span>
                              </Button>
                              <Button
                                variant={
                                  orientation === "landscape"
                                    ? "default"
                                    : "outline"
                                }
                                className={`flex h-auto flex-col items-center gap-2 bg-blue-400 py-4 ${orientation === "landscape" ? "bg-blue-400!" : "bg-slate-50! dark:bg-neutral-700!"}`}
                                onClick={() => setOrientation("landscape")}
                              >
                                <div
                                  className={`h-8 w-12 rounded border-2 ${orientation === "landscape" ? "border-white" : "border-slate-400"}`}
                                />
                                <span className="text-xs">Landscape</span>
                              </Button>
                            </div>
                          </div>

                          {/* Page Size */}
                          <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-neutral-300">
                              Page size
                            </label>
                            <select
                              value={pageSize}
                              onChange={(
                                e: React.ChangeEvent<HTMLSelectElement>,
                              ) => setPageSize(e.target.value as PageSize)}
                              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 focus:outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:focus:border-neutral-800 dark:focus:ring-neutral-700"
                            >
                              <option value="fit">
                                Fit (Same page size as image)
                              </option>
                              <option value="a4">A4 (297x210 mm)</option>
                              <option value="letter">
                                US Letter (215x279.4 mm)
                              </option>
                            </select>
                          </div>

                          {/* Page Margin */}
                          <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-neutral-300">
                              Margin
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                              <Button
                                variant={
                                  margin === "none" ? "default" : "outline"
                                }
                                className={`flex h-auto flex-col items-center gap-2 bg-blue-400 py-4 ${margin === "none" ? "bg-blue-400!" : "bg-slate-50! dark:bg-neutral-700!"}`}
                                onClick={() => setMargin("none")}
                              >
                                <ImageIcon
                                  className={`h-6 w-6 ${margin === "none" ? "text-white" : "text-slate-600"}`}
                                />
                                <span className="text-xs">No margin</span>
                              </Button>
                              <Button
                                variant={
                                  margin === "small" ? "default" : "outline"
                                }
                                className={`flex h-auto flex-col items-center gap-2 bg-blue-400 py-4 ${margin === "small" ? "bg-blue-400!" : "bg-slate-50! dark:bg-neutral-700!"}`}
                                onClick={() => setMargin("small")}
                              >
                                <div
                                  className={`h-6 w-6 rounded border-4 ${margin === "small" ? "border-white" : "border-slate-400"} border-dashed`}
                                />
                                <span className="text-xs">Small</span>
                              </Button>
                              <Button
                                variant={
                                  margin === "big" ? "default" : "outline"
                                }
                                className={`flex h-auto flex-col items-center gap-2 bg-blue-400 py-4 ${margin === "big" ? "bg-blue-400!" : "bg-slate-50! dark:bg-neutral-700!"}`}
                                onClick={() => setMargin("big")}
                              >
                                <div
                                  className={`h-6 w-6 rounded border-[6px] ${margin === "big" ? "border-white" : "border-slate-400"} border-dashed`}
                                />
                                <span className="text-xs">Big</span>
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Convert Button */}
                        <div className="border-t pt-4">
                          <div className="mb-3 flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="custom-convert-name"
                              checked={useCustomName}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>,
                              ) => setUseCustomName(e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300"
                            />
                            <label
                              htmlFor="custom-convert-name"
                              className="cursor-pointer text-sm leading-none font-medium"
                            >
                              Ubah nama file
                            </label>
                          </div>
                          <Button
                            onClick={() => {
                              if (useCustomName) {
                                setShowDownloadDialog(true);
                              } else {
                                handleDownload("images-to-pdf.pdf");
                              }
                            }}
                            className="w-full bg-slate-900! text-white hover:text-white dark:bg-neutral-100! dark:text-neutral-900 dark:hover:text-neutral-900"
                            variant="default"
                            disabled={images.length === 0 || isConverting}
                          >
                            {isConverting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Converting...
                              </>
                            ) : (
                              <>
                                <Download className="mr-2 h-4 w-4" />
                                Convert & Download
                              </>
                            )}
                          </Button>
                        </div>
                      </>
                    ) : (
                      <Button
                        onClick={handleUploadClick}
                        className="w-full bg-slate-900! text-white hover:text-white dark:bg-neutral-100! dark:text-neutral-900 dark:hover:text-neutral-900"
                        variant="outline"
                      >
                        <Upload className="mr-2 h-4 w-4 text-white dark:text-neutral-900" />
                        Pilih Gambar
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Images List Section */}
              <div className="mt-4 w-full md:mt-0 lg:col-span-2">
                <Card className="pb-5">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      <div className="flex items-center justify-between">
                        <p>Images ({images.length})</p>
                        {images.length > 0 && (
                          <Button
                            onClick={clearAll}
                            className="w-fit bg-red-500! text-white hover:bg-red-600!"
                            variant="outline"
                          >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Reset Gambar
                          </Button>
                        )}
                      </div>
                    </CardTitle>
                    {images.length > 0 && (
                      <CardDescription>
                        Drag gambar untuk mengubah urutan atau mengubah posisi
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    {images.length === 0 ? (
                      <FileUpload onChange={handleImageDrop} accept="image" />
                    ) : (
                      <>
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                          {images.map((image, index) => (
                            <ImageCard
                              key={image.id}
                              id={image.id}
                              preview={image.preview}
                              index={index}
                              onRemove={() => removeImage(image.id)}
                              onMove={reorderImages}
                              disabled={isConverting}
                              fileName={image.file.name}
                            />
                          ))}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearAll}
                          disabled={isConverting}
                          className="mt-3 w-full bg-slate-900! text-white hover:text-white dark:bg-neutral-100! dark:text-neutral-900 dark:hover:text-neutral-900"
                        >
                          <X className="mr-2 h-4 w-4 dark:text-neutral-900" />
                          Clear All
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        <DownloadDialog
          open={showDownloadDialog}
          onOpenChange={setShowDownloadDialog}
          defaultFileName="images-to-pdf.pdf"
          onDownload={handleDownload}
          isProcessing={isConverting}
          title="Download PDF"
          description="Ubah nama file PDF hasil konversi"
        />
      </div>
    </DndProvider>
  );
}
