import React from "react";

interface DraggableImageProps {
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected: boolean;
  isDragging: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onResizeMouseDown: (e: React.MouseEvent) => void;
}

export default function DraggableImage({
  src,
  x,
  y,
  width,
  height,
  isSelected,
  isDragging,
  onMouseDown,
  onResizeMouseDown,
}: DraggableImageProps) {
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        cursor: isDragging && isSelected ? "grabbing" : "move",
        border: isSelected ? "2px solid #3b82f6" : "2px solid transparent",
        zIndex: isSelected ? 10 : 1,
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        onMouseDown(e);
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <img
        src={src}
        alt="overlay"
        width={width}
        height={height}
        className="pointer-events-none h-full! w-full!"
        style={{ objectFit: "contain" }}
        draggable={false}
      />
      {isSelected && (
        <div
          style={{
            position: "absolute",
            right: "-6px",
            bottom: "-6px",
            width: "12px",
            height: "12px",
            backgroundColor: "#3b82f6",
            border: "2px solid white",
            borderRadius: "50%",
            cursor: "nwse-resize",
            zIndex: 20,
          }}
          onMouseDown={onResizeMouseDown}
        />
      )}
    </div>
  );
}
