import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import SidebarTools from "./sidebar-tools";
import SidebarDownload from "./sidebar-download";
import SidebarImageGallery from "./sidebar-image-gallery";
import { usePDFEditorStore } from "@/entities/pdf-editor";

interface PDFSidebarProps {
  onDownloadPDF: () => void;
  isDownloading?: boolean;
  useCustomName?: boolean;
  onCustomNameChange?: (checked: boolean) => void;
}

export default function PDFSidebar({
  onDownloadPDF,
  isDownloading = false,
  useCustomName = false,
  onCustomNameChange,
}: PDFSidebarProps) {
  const pdfFile = usePDFEditorStore((s) => s.pdfFile);
  const images = usePDFEditorStore((s) => s.images);
  const texts = usePDFEditorStore((s) => s.texts);
  const shapes = usePDFEditorStore((s) => s.shapes);

  const hasElements =
    images.length > 0 || texts.length > 0 || shapes.length > 0;

  return (
    <Card className="pb-5 lg:col-span-1">
      <CardHeader>
        <CardTitle>Tools</CardTitle>
        <CardDescription>Unggah dan kelola file</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SidebarTools />

        {pdfFile && (
          <SidebarDownload
            hasElements={hasElements}
            isDownloading={isDownloading}
            useCustomName={useCustomName}
            onCustomNameChange={onCustomNameChange}
            onDownloadPDF={onDownloadPDF}
          />
        )}

        <SidebarImageGallery />
      </CardContent>
    </Card>
  );
}
