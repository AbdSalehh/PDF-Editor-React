import { Expand, Trash2 } from "lucide-react";
import { useRef } from "react";

interface DraggableShapeProps {
  id: string;
  shapeType: "rectangle" | "circle" | "triangle";
  x: number;
  y: number;
  width: number;
  height: number;
  backgroundColor: string;
  isSelected: boolean;
  isDragging: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onResizeMouseDown?: (e: React.MouseEvent) => void;
  onUpdate: (updates: {
    width?: number;
    height?: number;
    backgroundColor?: string;
  }) => void;
  onDelete: () => void;
}

export default function DraggableShape({
  shapeType,
  x,
  y,
  width,
  height,
  backgroundColor,
  isSelected,
  isDragging,
  onMouseDown,
  onResizeMouseDown,
  onUpdate,
  onDelete,
}: DraggableShapeProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  const renderShape = () => {
    const commonStyle = {
      width: "100%",
      height: "100%",
      backgroundColor,
    };

    switch (shapeType) {
      case "circle":
        return <div style={{ ...commonStyle, borderRadius: "50%" }} />;
      case "triangle":
        return (
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: `${width / 2}px solid transparent`,
              borderRight: `${width / 2}px solid transparent`,
              borderBottom: `${height}px solid ${backgroundColor}`,
              position: "relative",
            }}
          />
        );
      case "rectangle":
      default:
        return <div style={commonStyle} />;
    }
  };

  return (
    <div
      ref={elementRef}
      style={{
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        cursor: isDragging ? "grabbing" : "grab",
        border: isSelected ? "2px dashed #3b82f6" : "none",
        zIndex: isSelected ? 50 : 5,
        touchAction: "none",
        userSelect: "none",
        opacity: isDragging ? 0.5 : 1,
        padding: isSelected ? "2px" : "0",
      }}
      onMouseDown={onMouseDown}
      onClick={(e) => e.stopPropagation()}
      title="Drag to move"
    >
      {renderShape()}

      {/* Resize handle */}
      {isSelected && onResizeMouseDown && (
        <div
          className="absolute right-0 bottom-0 cursor-nwse-resize rounded-xs bg-slate-900! p-1"
          onMouseDown={(e) => {
            e.stopPropagation();
            onResizeMouseDown(e);
          }}
          title="Drag to resize"
        >
          <Expand className="size-2 text-white" />
        </div>
      )}

      {/* Controls panel */}
      {isSelected && (
        <div
          className="absolute -bottom-16 left-0 flex gap-2 rounded border bg-white p-2 shadow-lg dark:border-neutral-700 dark:bg-neutral-800"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Size controls */}
          <div className="flex items-center gap-1 border-r pr-2">
            <span className="text-xs text-gray-600 dark:text-neutral-300">
              Size:
            </span>
            <button
              className="rounded bg-slate-100 px-2 py-1 text-xs dark:text-neutral-900"
              onClick={() =>
                onUpdate({
                  width: Math.max(30, width - 10),
                  height: Math.max(30, height - 10),
                })
              }
            >
              -
            </button>
            <span className="flex items-center px-1 text-xs">{width}</span>
            <button
              className="rounded bg-slate-100 px-2 py-1 text-xs dark:text-neutral-900"
              onClick={() =>
                onUpdate({
                  width: Math.min(300, width + 10),
                  height: Math.min(300, height + 10),
                })
              }
            >
              +
            </button>
          </div>

          {/* Background color */}
          <div className="flex items-center gap-1 border-r pr-2">
            <span className="text-xs text-gray-600 dark:text-neutral-300">
              BG:
            </span>
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
              className="h-7 w-10 cursor-pointer rounded border"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Delete */}
          <button
            className="cursor-pointer rounded bg-slate-100 px-2 py-1 text-xs"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </button>
        </div>
      )}
    </div>
  );
}
