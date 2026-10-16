export interface ImageElement {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  pageNumber: number;
}

export interface TextElement {
  id: string;
  type: "text";
  content: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  pageNumber: number;
}

export interface ShapeElement {
  id: string;
  type: "shape";
  shapeType: "rectangle" | "circle" | "triangle";
  x: number;
  y: number;
  width: number;
  height: number;
  backgroundColor: string;
  pageNumber: number;
}

export type PDFElement = ImageElement | TextElement | ShapeElement;
