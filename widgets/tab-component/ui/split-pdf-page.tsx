import { useEffect, useRef, useState } from "react";
import { pdfjs, Document } from "react-pdf";
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
import {
  Upload,
  Download,
  Loader2,
  RotateCcw,
  Scissors,
  Archive,
  Edit,
} from "lucide-react";
import { FileUpload } from "@/shared/ui/file-upload";
import SplitPageThumbnail from "@/shared/ui/split-page-thumbnail";
import PagePreviewDialog from "@/shared/ui/page-preview-dialog";
import { DownloadDialog } from "@/widgets/dialog";
import RenameDialog from "@/shared/ui/rename-dialog";
import { triggerConfetti } from "@/shared/lib/confetti";
import { usePDFSplit } from "@/entities/pdf-split";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function SplitPDFPage() {
  const {
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
  } = usePDFSplit();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [width, setWidth] = useState(0);
  const [useCustomName, setUseCustomName] = useState(false);
  const [useCustomNameSingle, setUseCustomNameSingle] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [showDownloadDialogSingle, setShowDownloadDialogSingle] =
    useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [previewPageNumber, setPreviewPageNumber] = useState<number | null>(
    null,
  );
  const [renameGroupIndex, setRenameGroupIndex] = useState<number | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      handlePDFUpload(file);
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
      handlePDFUpload(file);
    }
  };

  useEffect(() => {
    const updateWidth = () => {
      setWidth(window.innerWidth);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  const activePages = pages.filter((p) => !p.isDeleted);
  const groups = getActivePagesGrouped();
  const hasModifications = hasChanges();
  const hasSplits = groups.length > 1;

  useEffect(() => {
    if (hasSplits && pdfFile) {
      calculateAllSizes();
    }
  }, [groups.length, pdfFile]);

  const handleDownloadZip = async (fileName: string) => {
    await downloadAllAsZip(
      fileName.endsWith(".zip") ? fileName : `${fileName}.zip`,
    );
    triggerConfetti();
  };

  const handleDownloadSingle = async (fileName?: string) => {
    await downloadSinglePDF(0, fileName);
    triggerConfetti();
  };

  const handleDownloadGroup = async (index: number) => {
    await downloadSinglePDF(index);
    triggerConfetti();
  };

  const handleRenameGroup = (index: number) => {
    setRenameGroupIndex(index);
    setShowRenameDialog(true);
  };

  const handleSaveGroupName = (newName: string) => {
    if (renameGroupIndex !== null) {
      setGroupName(renameGroupIndex, newName);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-screen overflow-hidden md:px-12">
        <div className="relative flex w-full items-center justify-center">
          <div className="z-10 w-full max-w-7xl px-4 md:px-0">
            <div className="gap-6 md:grid lg:grid-cols-4">
              {/* Sidebar */}
              <div className="w-full lg:col-span-1">
                <Card className="pb-5">
                  <CardHeader>
                    <CardTitle className="text-lg">Split PDF</CardTitle>
                    <CardDescription>
                      Pisahkan PDF menjadi beberapa file
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileSelect}
                      ref={fileInputRef}
                      className="hidden"
                    />
                    <Button
                      onClick={handleUploadClick}
                      className="w-full bg-slate-900! text-white hover:text-white dark:bg-neutral-100! dark:text-neutral-900 dark:hover:text-neutral-900"
                      variant="outline"
                    >
                      <Upload className="mr-2 h-4 w-4 text-white dark:text-neutral-900" />
                      {pdfFile ? "Ganti PDF" : "Upload PDF"}
                    </Button>

                    {pdfFile && (
                      <>
                        <div className="rounded-lg border bg-slate-50! p-3 dark:bg-neutral-800!">
                          <p className="text-sm font-medium">
                            Total Halaman: {numPages}
                          </p>
                          <p className="mt-1 text-xs text-slate-600 dark:text-neutral-300">
                            Aktif: {activePages.length} halaman
                          </p>
                          <p className="mt-1 text-xs text-slate-600 dark:text-neutral-300">
                            Split Groups: {groups.length}
                          </p>
                        </div>

                        <div className="space-y-2 border-t pt-4">
                          <Button
                            onClick={splitAllPages}
                            className="w-full bg-blue-500! text-white hover:bg-blue-600!"
                            variant="outline"
                          >
                            <Scissors className="mr-2 h-4 w-4" />
                            Pisahkan Semua
                          </Button>

                          <Button
                            onClick={resetAll}
                            className="w-full bg-orange-500! text-white hover:bg-orange-600!"
                            variant="outline"
                          >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Reset
                          </Button>
                        </div>

                        {hasModifications && (
                          <>
                            <div className="border-t pt-4">
                              <p className="mb-2 text-sm font-medium">
                                Download
                              </p>

                              {hasSplits && (
                                <div className="mb-3 flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id="custom-name"
                                    checked={useCustomName}
                                    onChange={(
                                      e: React.ChangeEvent<HTMLInputElement>,
                                    ) => setUseCustomName(e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300"
                                  />
                                  <label
                                    htmlFor="custom-name"
                                    className="cursor-pointer text-sm leading-none font-medium"
                                  >
                                    Ubah nama ZIP
                                  </label>
                                </div>
                              )}

                              <div className="space-y-2">
                                {hasSplits ? (
                                  <Button
                                    onClick={() => {
                                      if (useCustomName) {
                                        setShowDownloadDialog(true);
                                      } else {
                                        const defaultZipName =
                                          originalFileName || "split-pdfs";
                                        handleDownloadZip(
                                          `${defaultZipName}.zip`,
                                        );
                                      }
                                    }}
                                    className="w-full bg-pink-600! text-white shadow-sm hover:bg-pink-700!"
                                    disabled={isSplitting}
                                  >
                                    {isSplitting ? (
                                      <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                      </>
                                    ) : (
                                      <>
                                        <Archive className="mr-2 h-4 w-4" />
                                        Download All (ZIP)
                                        {totalZipSize > 0 && (
                                          <span className="ml-1 text-xs opacity-75">
                                            (
                                            {(
                                              totalZipSize /
                                              1024 /
                                              1024
                                            ).toFixed(2)}{" "}
                                            MB)
                                          </span>
                                        )}
                                      </>
                                    )}
                                  </Button>
                                ) : (
                                  <>
                                    <div className="mb-3 flex items-center space-x-2">
                                      <input
                                        type="checkbox"
                                        id="custom-name-single"
                                        checked={useCustomNameSingle}
                                        onChange={(
                                          e: React.ChangeEvent<HTMLInputElement>,
                                        ) =>
                                          setUseCustomNameSingle(
                                            e.target.checked,
                                          )
                                        }
                                        className="h-4 w-4 rounded border-gray-300"
                                      />
                                      <label
                                        htmlFor="custom-name-single"
                                        className="cursor-pointer text-sm leading-none font-medium"
                                      >
                                        Ubah nama file
                                      </label>
                                    </div>
                                    <Button
                                      onClick={() => {
                                        if (useCustomNameSingle) {
                                          setShowDownloadDialogSingle(true);
                                        } else {
                                          handleDownloadSingle();
                                        }
                                      }}
                                      className="w-full bg-pink-600! text-white hover:bg-pink-700!"
                                      disabled={isSplitting}
                                    >
                                      {isSplitting ? (
                                        <>
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                          Processing...
                                        </>
                                      ) : (
                                        <>
                                          <Download className="mr-2 h-4 w-4" />
                                          Download PDF
                                        </>
                                      )}
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>

                            {hasSplits && (
                              <div className="border-t pt-4">
                                <p className="mb-2 text-sm font-medium">
                                  Download Per Group
                                </p>
                                <div className="scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-300 max-h-40 space-y-2 overflow-y-auto">
                                  {groups.map((group, index) => (
                                    <div
                                      key={index}
                                      className="flex gap-1 pr-1"
                                    >
                                      <Button
                                        onClick={() => {
                                          handleDownloadGroup(index);
                                          calculateGroupSize(index);
                                        }}
                                        className="flex-1 bg-slate-700! text-xs text-white hover:bg-slate-800! dark:bg-neutral-800! dark:hover:bg-neutral-700!"
                                        size="sm"
                                        disabled={isSplitting}
                                      >
                                        <Download className="mr-1 h-3 w-3" />
                                        <span className="max-w-14 truncate">
                                          {getGroupName(index)}
                                        </span>
                                        <span className="text-[0.65rem]">
                                          ({group.length} hal
                                          {getGroupSize(index) > 0 && (
                                            <>
                                              ,{" "}
                                              {(
                                                getGroupSize(index) /
                                                1024 /
                                                1024
                                              ).toFixed(2)}{" "}
                                              MB
                                            </>
                                          )}
                                          )
                                        </span>
                                      </Button>
                                      <Button
                                        onClick={() => handleRenameGroup(index)}
                                        className="bg-slate-200! text-white hover:bg-slate-200!"
                                        size="sm"
                                        disabled={isSplitting}
                                      >
                                        <Edit className="h-3 w-3 text-slate-900!" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* PDF Preview Section */}
              <div className="mt-4 w-full md:mt-0 lg:col-span-3">
                <Card className="pb-5">
                  <CardHeader>
                    <CardTitle className="truncate text-lg">
                      <div className="flex w-full justify-between">
                        {pdfFile ? <p>{pdfFile.name}</p> : <p>Preview PDF</p>}
                        {pdfFile && (
                          <Button
                            onClick={resetPDF}
                            className="w-fit bg-red-500! text-white hover:bg-red-600!"
                            variant="outline"
                          >
                            <Archive className="mr-2 h-4 w-4" />
                            Reset PDF
                          </Button>
                        )}
                      </div>
                    </CardTitle>
                    {pdfFile && (
                      <CardDescription>
                        Drag halaman untuk mengatur ulang, klik tombol split
                        untuk memisahkan, atau icon sampah untuk menghapus
                      </CardDescription>
                    )}
                    {pdfFile && (
                      <p className="mt-2 w-fit rounded-md bg-pink-50 px-2.5 py-1.5 text-xs font-medium text-pink-700 dark:bg-pink-950/40 dark:text-pink-300">
                        💡 Klik halaman untuk melihat pratinjau dengan ukuran
                        besar
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    {!pdfFile ? (
                      <FileUpload onChange={handlePDFDrop} />
                    ) : (
                      <div className="scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-300 max-h-150 overflow-y-auto rounded-lg border bg-slate-50! p-4 dark:bg-neutral-800!">
                        <Document
                          file={pdfFile}
                          onLoadSuccess={onDocumentLoadSuccess}
                          loading={
                            <div className="flex h-96 items-center justify-center">
                              <p className="text-slate-600 dark:text-neutral-300">
                                Loading PDF...
                              </p>
                            </div>
                          }
                        >
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                            {activePages.map((page, index) => {
                              const nextPage = activePages[index + 1];
                              const hasSplitAfter =
                                nextPage &&
                                nextPage.splitGroup !== page.splitGroup;

                              return (
                                <SplitPageThumbnail
                                  key={page.pageNumber}
                                  pageNumber={page.pageNumber}
                                  splitGroup={page.splitGroup}
                                  isDeleted={page.isDeleted}
                                  rotation={page.rotation}
                                  scale={width < 640 ? 0.1 : 0.15}
                                  onDelete={() => deletePage(page.pageNumber)}
                                  onAddSplit={() =>
                                    addSplitAfterPage(page.pageNumber)
                                  }
                                  onRemoveSplit={() =>
                                    removeSplitAfterPage(page.pageNumber)
                                  }
                                  onRotate={() => rotatePage(page.pageNumber)}
                                  onMove={movePage}
                                  index={index}
                                  hasSplitAfter={!!hasSplitAfter}
                                  onPreview={() =>
                                    setPreviewPageNumber(page.pageNumber)
                                  }
                                />
                              );
                            })}
                          </div>
                        </Document>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DownloadDialog
        open={showDownloadDialog}
        onOpenChange={setShowDownloadDialog}
        defaultFileName={originalFileName || "split-pdfs"}
        onDownload={handleDownloadZip}
        isProcessing={isSplitting}
        title="Download ZIP"
        description="Ubah nama file ZIP jika diperlukan"
      />

      <DownloadDialog
        open={showDownloadDialogSingle}
        onOpenChange={setShowDownloadDialogSingle}
        defaultFileName={originalFileName || "modified-pdf"}
        onDownload={handleDownloadSingle}
        isProcessing={isSplitting}
        title="Download PDF"
        description="Ubah nama file PDF jika diperlukan"
      />

      <RenameDialog
        open={showRenameDialog}
        onOpenChange={setShowRenameDialog}
        defaultName={
          renameGroupIndex !== null ? getGroupName(renameGroupIndex) : ""
        }
        onSave={handleSaveGroupName}
        title="Rename Split Group"
        description="Ubah nama untuk split group ini"
      />

      <PagePreviewDialog
        open={previewPageNumber !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) setPreviewPageNumber(null);
        }}
        file={pdfFile}
        pageNumber={previewPageNumber}
        rotation={
          pages.find((page) => page.pageNumber === previewPageNumber)
            ?.rotation ?? 0
        }
      />
    </DndProvider>
  );
}
