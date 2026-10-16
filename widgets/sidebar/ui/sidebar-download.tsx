import { Button } from "@/shared/ui/button";
import { Download, Loader2 } from "lucide-react";

interface SidebarDownloadProps {
  hasElements: boolean;
  isDownloading?: boolean;
  useCustomName?: boolean;
  onCustomNameChange?: (checked: boolean) => void;
  onDownloadPDF: () => void;
}

export default function SidebarDownload({
  hasElements,
  isDownloading = false,
  useCustomName = false,
  onCustomNameChange,
  onDownloadPDF,
}: SidebarDownloadProps) {
  return (
    <div className="border-t pt-4">
      <h1 className="text-sm! font-medium">Download</h1>
      {hasElements ? (
        <>
          {onCustomNameChange && (
            <div className="mt-2 mb-2 flex items-center space-x-2">
              <input
                type="checkbox"
                id="custom-pdf-name"
                checked={useCustomName}
                onChange={(e) => onCustomNameChange(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label
                htmlFor="custom-pdf-name"
                className="cursor-pointer text-xs leading-none font-medium"
              >
                Ubah nama file
              </label>
            </div>
          )}
          <Button
            onClick={onDownloadPDF}
            className="mt-2 w-full bg-slate-900! text-sm! text-white dark:bg-neutral-200! dark:text-neutral-900"
            variant="default"
            disabled={isDownloading}
          >
            {isDownloading ? (
              <>
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                Mengkompresi ...
              </>
            ) : (
              <>
                <Download className="mr-1 h-4 w-4" />
                Download PDF
              </>
            )}
          </Button>
        </>
      ) : (
        <p className="mt-5 text-center text-sm! text-orange-400">
          Tambahkan gambar, teks, atau shape untuk mengunduh PDF
        </p>
      )}
    </div>
  );
}
