import { Button } from "@/shared/ui/button";
import { Trash2 } from "lucide-react";

interface ImageThumbnailProps {
  id: string;
  src: string;
  isSelected: boolean;
  onDelete: () => void;
}

export default function ImageThumbnail({
  id,
  src,
  isSelected,
  onDelete,
}: ImageThumbnailProps) {
  return (
    <div
      className={`flex items-center justify-between rounded-lg border p-2 dark:bg-neutral-300 ${
        isSelected ? "border-blue-500 bg-blue-50" : ""
      }`}
    >
      <div className="flex flex-1 items-center gap-2">
        <img
          src={src}
          alt="thumbnail"
          width={32}
          height={32}
          className="h-8! w-8! rounded object-cover"
        />
        <span className="truncate text-xs dark:text-neutral-900">
          Image {id.slice(-4)}
        </span>
      </div>
      <Button
        onClick={onDelete}
        variant="ghost"
        size="icon"
        className="h-6 w-6 cursor-pointer text-red-500 hover:text-red-700"
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
}
