import { useRef, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Upload, Download, Plus, Loader2, RotateCcw } from "lucide-react";
import { FileUpload } from "@/shared/ui/file-upload";
import PDFFileCard from "@/shared/ui/pdf-file-card";
import { PageCountLoader } from "@/widgets/preview";
import { DownloadDialog } from "@/widgets/dialog";
import { triggerConfetti } from "@/shared/lib/confetti";
import { usePDFMerge } from "@/entities/pdf-merge";

export default function MergePDFPage() {
  const {
    pdfFiles,
    isMerging,
    addPDFFiles,
    removePDFFile,
    updatePageCount,
    reorderPDFFiles,
    mergePDFs,
    resetPDF,
  } = usePDFMerge();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [useCustomName, setUseCustomName] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);

  const handleDownload = async (fileName: string) => {
    const success = await mergePDFs(
      fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`,
    );
    if (!success) return;
    triggerConfetti();
  };

  const handleMovePDF = (fromIndex: number, toIndex: number) => {
    reorderPDFFiles(fromIndex, toIndex);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const pdfs = files.filter((file) => file.type === "application/pdf");
    if (pdfs.length > 0) {
      addPDFFiles(pdfs);
    }
    if (event.target) {
      event.target.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handlePDFDrop = (file: File) => {
    if (file.type === "application/pdf") {
      addPDFFiles([file]);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-screen overflow-hidden md:px-12">
        <div className="relative flex w-full items-center justify-center">
          <div className="z-10 w-full max-w-5xl px-4 md:px-0">
            <div className="gap-6 md:grid lg:grid-cols-3">
              {/* Upload Section */}
              <div className="w-full lg:col-span-1">
                <Card className="pb-5">
                  <CardHeader>
                    <CardTitle className="text-lg">Upload PDF</CardTitle>
                    <CardDescription>
                      Pilih minimal 2 PDF untuk digabungkan
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <input
                      type="file"
                      accept="application/pdf"
                      multiple
                      onChange={handleFileSelect}
                      ref={fileInputRef}
                      className="hidden"
                    />

                    {pdfFiles.length > 0 ? (
                      <>
                        <Button
                          onClick={handleUploadClick}
                          className="w-full bg-slate-900! text-white hover:text-white dark:bg-neutral-100! dark:text-neutral-900 dark:hover:text-neutral-900"
                          variant="default"
                        >
                          <Plus className="mr-2 h-4 w-4 dark:text-neutral-900!" />
                          Tambah PDF
                        </Button>

                        <div className="border-t pt-4">
                          <div className="mb-3 flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="custom-merge-name"
                              checked={useCustomName}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>,
                              ) => setUseCustomName(e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300"
                            />
                            <label
                              htmlFor="custom-merge-name"
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
                                handleDownload("merged-pdf.pdf");
                              }
                            }}
                            className="w-full bg-slate-900! text-white hover:text-white dark:bg-neutral-100! dark:text-neutral-900 dark:hover:text-neutral-900"
                            variant="default"
                            disabled={pdfFiles.length < 2 || isMerging}
                          >
                            {isMerging ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Menggabungkan ...
                              </>
                            ) : (
                              <>
                                <Download className="mr-2 h-4 w-4" />
                                Gabungkan & Download
                              </>
                            )}
                          </Button>
                          {pdfFiles.length < 2 && (
                            <p className="mt-2 text-center text-xs text-orange-400">
                              Minimal 2 PDF untuk digabungkan
                            </p>
                          )}
                        </div>
                      </>
                    ) : (
                      <Button
                        onClick={handleUploadClick}
                        className="w-full bg-slate-900! text-white hover:text-white dark:bg-neutral-100! dark:text-neutral-900 dark:hover:text-neutral-900"
                        variant="outline"
                      >
                        <Upload className="mr-2 h-4 w-4 text-white dark:text-neutral-900" />
                        Pilih PDF
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* PDF List Section */}
              <div
                className={`mt-4 w-full md:mt-0 lg:col-span-2 ${pdfFiles.length > 0 ? "mb-16" : ""}`}
              >
                <Card className="pb-5">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      <div className="flex w-full justify-between">
                        <p>File PDF ({pdfFiles.length})</p>
                        {pdfFiles.length > 0 && (
                          <Button
                            onClick={resetPDF}
                            className="w-fit bg-red-500! text-white hover:bg-red-600!"
                            variant="outline"
                          >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Reset PDF
                          </Button>
                        )}
                      </div>
                    </CardTitle>
                    {pdfFiles.length > 0 && (
                      <CardDescription>
                        Drag file PDF untuk memindahkan posisi dokumen.
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    {pdfFiles.length === 0 ? (
                      <FileUpload onChange={handlePDFDrop} />
                    ) : (
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                        {pdfFiles.map((pdfFile, index) => (
                          <div key={pdfFile.id} className="relative">
                            <PDFFileCard
                              fileName={pdfFile.file.name}
                              numPages={pdfFile.numPages}
                              onRemove={() => removePDFFile(pdfFile.id)}
                              index={index}
                              onMove={handleMovePDF}
                              fileSize={pdfFile.file.size}
                              file={pdfFile.file}
                            />
                            {pdfFile.numPages === 0 && (
                              <PageCountLoader
                                file={pdfFile.file}
                                onLoad={(numPages: number) =>
                                  updatePageCount(pdfFile.id, numPages)
                                }
                              />
                            )}
                          </div>
                        ))}
                      </div>
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
          defaultFileName="merged-pdf.pdf"
          onDownload={handleDownload}
          isProcessing={isMerging}
          title="Download Merged PDF"
          description="Ubah nama file PDF hasil penggabungan"
        />
      </div>
    </DndProvider>
  );
}
