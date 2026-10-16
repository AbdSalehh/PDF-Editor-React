import { Trash2, Bold, Italic, Underline } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/shared/ui/input";
import ColorPicker from "./color-picker";

interface DraggableTextProps {
  id: string;
  content: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  isSelected: boolean;
  isDragging: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onUpdate: (updates: {
    content?: string;
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    isBold?: boolean;
    isItalic?: boolean;
    isUnderline?: boolean;
  }) => void;
  onDelete: () => void;
}

export default function DraggableText({
  content,
  x,
  y,
  fontSize,
  fontFamily,
  color,
  isBold = false,
  isItalic = false,
  isUnderline = false,
  isSelected,
  isDragging,
  onMouseDown,
  onUpdate,
  onDelete,
}: DraggableTextProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(content);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Update local state when content changes externally
  useEffect(() => {
    setEditValue(content);
  }, [content]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editValue.trim() && editValue !== content) {
      onUpdate({ content: editValue });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleBlur();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditValue(content);
    } else if (e.key === "Delete" && e.ctrlKey) {
      onDelete();
    }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  return (
    <div
      ref={elementRef}
      style={{
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        cursor: isDragging ? "grabbing" : "grab",
        border: isSelected ? "2px solid #3b82f6" : "2px solid transparent",
        zIndex: isSelected ? 100 : 10,
        minWidth: "50px",
        backgroundColor: isSelected
          ? "rgba(59, 130, 246, 0.1)"
          : "rgba(255, 255, 255, 0.7)",
        touchAction: "none",
        userSelect: "none",
        opacity: isDragging ? 0.5 : 1,
        display: "flex",
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        onMouseDown(e);
      }}
      onDoubleClick={handleDoubleClick}
      onClick={(e) => e.stopPropagation()}
      title="Drag to move, double-click to edit"
    >
      {isEditing ? (
        <textarea
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          rows={Math.max(1, editValue.split("\n").length)}
          style={{
            fontSize: `${fontSize}px`,
            fontFamily,
            color,
            border: "1px solid #3b82f6",
            padding: "2px 4px",
            outline: "none",
            background: "white",
            minWidth: "100px",
            resize: "none",
            whiteSpace: "pre-wrap",
          }}
        />
      ) : (
        <span
          style={{
            fontSize: `${fontSize}px`,
            fontFamily,
            color,
            fontWeight: isBold ? "bold" : "normal",
            fontStyle: isItalic ? "italic" : "normal",
            textDecoration: isUnderline ? "underline" : "none",
            userSelect: "none",
            whiteSpace: "pre-wrap",
          }}
        >
          {content}
        </span>
      )}

      {/* Controls panel */}
      {isSelected && !isEditing && (
        <div
          className="absolute -bottom-12 left-0 flex gap-2 rounded border bg-white p-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-800"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Font size controls */}
          <div className="flex items-center gap-1 border-r pr-2">
            <button
              className="cursor-pointer rounded bg-slate-100 px-2 py-1 text-xs dark:text-neutral-900"
              onClick={() => onUpdate({ fontSize: Math.max(8, fontSize - 1) })}
            >
              -
            </button>
            <Input
              type="number"
              min={8}
              max={72}
              value={fontSize}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (!Number.isNaN(value)) {
                  onUpdate({ fontSize: Math.min(72, Math.max(8, value)) });
                }
              }}
              onClick={(e) => e.stopPropagation()}
              className="h-6 w-12 [appearance:textfield] px-1 py-0 text-center text-xs [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <button
              className="cursor-pointer rounded bg-slate-100 px-2 py-1 text-xs dark:text-neutral-900"
              onClick={() => onUpdate({ fontSize: Math.min(72, fontSize + 1) })}
            >
              +
            </button>
          </div>

          {/* Font family selector */}
          <div className="flex items-center border-r pr-2">
            <select
              className="rounded border px-1 py-1 text-xs dark:border-neutral-700 dark:bg-neutral-900"
              value={fontFamily}
              onChange={(e) => onUpdate({ fontFamily: e.target.value })}
              onClick={(e) => e.stopPropagation()}
              style={{ fontFamily }}
            >
              <option
                value="Arial, sans-serif"
                style={{ fontFamily: "Arial, sans-serif" }}
              >
                Arial
              </option>
              <option
                value="'Times New Roman', sans-serif"
                style={{ fontFamily: "'Times New Roman', sans-serif" }}
              >
                Times New Roman
              </option>
              <option
                value="'Courier New', monospace"
                style={{ fontFamily: "'Courier New', monospace" }}
              >
                Courier New
              </option>
              <option
                value="Calibri, sans-serif"
                style={{ fontFamily: "Calibri, sans-serif" }}
              >
                Calibri
              </option>
              <option
                value="Georgia, sans-serif"
                style={{ fontFamily: "Georgia, sans-serif" }}
              >
                Georgia
              </option>
              <option
                value="Roboto, sans-serif"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                Roboto
              </option>
              <option
                value="'Open Sans', sans-serif"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                Open Sans
              </option>
              <option
                value="Lato, sans-serif"
                style={{ fontFamily: "Lato, sans-serif" }}
              >
                Lato
              </option>
            </select>
          </div>

          {/* Text styling buttons */}
          <div className="flex items-center gap-1 border-r pr-2">
            <button
              className={`rounded p-1 text-xs ${isBold ? "bg-blue-100 text-blue-600" : "bg-slate-100 dark:text-neutral-900"}`}
              onClick={() => onUpdate({ isBold: !isBold })}
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </button>
            <button
              className={`rounded p-1 text-xs ${isItalic ? "bg-blue-100 text-blue-600" : "bg-slate-100 dark:text-neutral-900"}`}
              onClick={() => onUpdate({ isItalic: !isItalic })}
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </button>
            <button
              className={`rounded p-1 text-xs ${isUnderline ? "bg-blue-100 text-blue-600" : "bg-slate-100 dark:text-neutral-900"}`}
              onClick={() => onUpdate({ isUnderline: !isUnderline })}
              title="Underline"
            >
              <Underline className="h-4 w-4" />
            </button>
          </div>

          {/* Color Picker */}
          <div className="flex items-center border-r pr-2">
            <ColorPicker
              value={color}
              onChange={(newColor) => onUpdate({ color: newColor })}
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
