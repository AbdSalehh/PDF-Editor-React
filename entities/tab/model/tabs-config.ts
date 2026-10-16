import { FileEdit, Merge, ImagePlus, Scissors } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface TabConfig {
  id: string;
  label: string;
  labelMobile: string;
  icon: LucideIcon;
}

export const TABS_CONFIG: TabConfig[] = [
  {
    id: "pdf-editor",
    label: "PDF Editor",
    labelMobile: "Editor",
    icon: FileEdit,
  },
  {
    id: "merge-pdf",
    label: "Merge PDF",
    labelMobile: "Merge",
    icon: Merge,
  },
  {
    id: "split-pdf",
    label: "Split PDF",
    labelMobile: "Split",
    icon: Scissors,
  },
  {
    id: "image-to-pdf",
    label: "Image to PDF",
    labelMobile: "Convert",
    icon: ImagePlus,
  },
];

export const STORAGE_KEY = "pdf-editor-active-tab";
