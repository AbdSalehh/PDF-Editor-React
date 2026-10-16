import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Download, Loader2 } from "lucide-react";

interface DownloadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultFileName: string;
  onDownload: (fileName: string) => Promise<void>;
  isProcessing: boolean;
  title?: string;
  description?: string;
}

export default function DownloadDialog({
  open,
  onOpenChange,
  defaultFileName,
  onDownload,
  isProcessing,
  title = "Download File",
  description = "Ubah nama file jika diperlukan",
}: DownloadDialogProps) {
  const [fileName, setFileName] = useState(defaultFileName);

  // Update fileName when dialog opens or defaultFileName changes
  useEffect(() => {
    if (open) {
      setFileName(defaultFileName);
    }
  }, [open, defaultFileName]);

  const handleDownload = async () => {
    // Determine the appropriate extension based on current filename
    let finalFileName = fileName;

    // If it already has .pdf or .zip extension, use as is
    if (
      !fileName.toLowerCase().endsWith(".pdf") &&
      !fileName.toLowerCase().endsWith(".zip")
    ) {
      // Default to .pdf extension
      finalFileName = `${fileName}.pdf`;
    }

    await onDownload(finalFileName);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="filename" className="text-sm font-medium">
              Nama File
            </label>
            <Input
              id="filename"
              value={fileName}
              className="mt-1!"
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Masukkan nama file"
              disabled={isProcessing}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDownload}
            disabled={isProcessing || !fileName.trim()}
            className="bg-slate-900! text-white hover:bg-slate-700! hover:text-white dark:bg-neutral-100! dark:text-neutral-900 dark:hover:bg-neutral-200! dark:hover:text-neutral-900"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
