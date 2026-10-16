import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { GripVertical, Trash2 } from "lucide-react";
import { useDrag, useDrop } from "react-dnd";
import { useRef } from "react";

interface ImageCardProps {
  id: string;
  preview: string;
  index: number;
  onRemove: () => void;
  onMove: (fromIndex: number, toIndex: number) => void;
  disabled?: boolean;
  fileName?: string;
}

export default function ImageCard({
  preview,
  index,
  onRemove,
  onMove,
  disabled = false,
  fileName,
}: ImageCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: "IMAGE_ITEM",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: () => !disabled,
  });

  const [, drop] = useDrop({
    accept: "IMAGE_ITEM",
    hover: (item: { index: number }) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      onMove(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <Card
      ref={ref}
      className={`relative overflow-hidden transition-all ${isDragging ? "opacity-50" : "opacity-100"} cursor-move`}
    >
      <div className="relative">
        {/* Drag Handle */}
        <div className="absolute top-2 left-2 z-10 rounded bg-white/80! p-1 text-slate-600 shadow-sm">
          <GripVertical className="h-4 w-4" />
        </div>

        {/* Delete Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          disabled={disabled}
          className="! absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-white/80! p-0 hover:bg-red-50!"
        >
          <Trash2 className="h-4 w-4 text-red-600!" />
        </Button>

        {/* Image Preview */}
        <img
          src={preview}
          alt={`Preview ${index + 1}`}
          className="h-32! w-full! object-cover"
          width={128}
          height={128}
        />

        {/* File Name */}
        {fileName && (
          <div className="absolute right-0 bottom-0 left-0 bg-black/60 px-2 py-1">
            <p className="truncate text-[10px] text-white">{fileName}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
