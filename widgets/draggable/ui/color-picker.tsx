import { ALargeSmallIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

const STANDARD_COLORS = [
  "#C00000", // Dark Red
  "#FF0000", // Red
  "#FFC000", // Orange
  "#FFFF00", // Yellow
  "#92D050", // Light Green
  "#00B050", // Green
  "#00B0F0", // Light Blue
  "#0070C0", // Blue
  "#002060", // Dark Blue
  "#7030A0", // Purple
];

export default function ColorPicker({
  value,
  onChange,
  label,
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleColorSelect = (color: string) => {
    onChange(color);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={pickerRef}>
      {label && <span className="mr-1 text-xs text-gray-600">{label}</span>}

      {/* Color button */}
      <button
        type="button"
        className="flex h-7 w-10 items-center justify-center rounded border border-gray-300 bg-white hover:border-gray-400 dark:text-neutral-900"
        onClick={() => setIsOpen(!isOpen)}
        style={{ position: "relative" }}
      >
        <ALargeSmallIcon className="size-7" />
        <div
          className="absolute right-0 bottom-0 left-0 h-1.5 bg-red-600"
          style={{
            borderBottomLeftRadius: "4px",
            borderBottomRightRadius: "4px",
            backgroundColor: value,
          }}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute top-full left-0 z-50 mt-1 w-48 rounded-lg border border-gray-300 bg-white p-3 shadow-lg dark:border-neutral-700 dark:bg-neutral-800"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Standard Colors */}
          <div className="mb-2">
            <p className="mb-2 text-xs font-medium text-gray-700 dark:text-neutral-200">
              Standard Colors
            </p>
            <div className="grid grid-cols-5 gap-1">
              {STANDARD_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className="h-7 w-7 rounded border border-gray-300 transition-transform hover:scale-110 dark:border-neutral-700"
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorSelect(color)}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Default Black */}
          <div className="mb-2 border-t pt-2">
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded px-2 py-1 text-xs hover:bg-gray-100 dark:hover:bg-neutral-700"
              onClick={() => handleColorSelect("#000000")}
            >
              <div
                className="h-5 w-5 rounded border border-gray-300"
                style={{ backgroundColor: "#000000" }}
              />
              <span>Black (Default)</span>
            </button>
          </div>

          {/* More Colors */}
          <div className="relative border-t pt-2">
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded px-2 py-1 text-xs hover:bg-gray-100"
              onClick={() => colorInputRef.current?.click()}
            >
              <div className="flex h-5 w-5 items-center justify-center rounded border border-gray-300">
                <svg
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
              </div>
              <span>More Colors...</span>
            </button>
            <input
              ref={colorInputRef}
              type="color"
              value={value}
              onChange={(e) => handleColorSelect(e.target.value)}
              className={`absolute top-0 left-0 h-full w-full opacity-0 ${isOpen ? "block" : "hidden"}`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
