import { Page } from "react-pdf";
import {
  DraggableImage,
  DraggableText,
  DraggableShape,
} from "@/widgets/draggable";
import {
  usePDFEditorStore,
  usePageElements,
  useSelectionState,
  useElementActions,
} from "@/entities/pdf-editor";

interface PDFPageLayerProps {
  pageNumber: number;
  pageRef: (el: HTMLDivElement | null) => void;
}

export default function PDFPageLayer({
  pageNumber,
  pageRef,
}: PDFPageLayerProps) {
  const scale = usePDFEditorStore((s) => s.scale);
  const { pageImages, pageTexts, pageShapes } = usePageElements(pageNumber);
  const { selectedImage, selectedText, selectedShape, isDragging } =
    useSelectionState();
  const {
    onImageMouseDown,
    onResizeMouseDown,
    onTextMouseDown,
    onShapeMouseDown,
    onShapeResizeMouseDown,
    onUpdateText,
    onUpdateShape,
    onDeleteText,
    onDeleteShape,
  } = useElementActions();

  return (
    <div className="relative mb-4" ref={pageRef}>
      <Page
        pageNumber={pageNumber}
        scale={scale}
        renderTextLayer={false}
        renderAnnotationLayer={false}
      />

      {pageImages.map((image: any) => (
        <DraggableImage
          key={image.id}
          src={image.src}
          x={image.x}
          y={image.y}
          width={image.width}
          height={image.height}
          isSelected={selectedImage === image.id}
          isDragging={isDragging}
          onMouseDown={(e) => onImageMouseDown(e, image.id)}
          onResizeMouseDown={(e) => onResizeMouseDown(e, image.id)}
        />
      ))}

      {pageTexts.map((text: any) => (
        <DraggableText
          key={text.id}
          id={text.id}
          content={text.content}
          x={text.x}
          y={text.y}
          fontSize={text.fontSize}
          fontFamily={text.fontFamily}
          color={text.color}
          isBold={text.isBold}
          isItalic={text.isItalic}
          isUnderline={text.isUnderline}
          isSelected={selectedText === text.id}
          isDragging={isDragging && selectedText === text.id}
          onMouseDown={(e) => onTextMouseDown(e, text.id)}
          onUpdate={(updates) => onUpdateText(text.id, updates)}
          onDelete={() => onDeleteText(text.id)}
        />
      ))}

      {pageShapes.map((shape: any) => (
        <DraggableShape
          key={shape.id}
          id={shape.id}
          shapeType={shape.shapeType}
          x={shape.x}
          y={shape.y}
          width={shape.width}
          height={shape.height}
          backgroundColor={shape.backgroundColor}
          isSelected={selectedText ? false : selectedShape === shape.id}
          isDragging={isDragging && selectedShape === shape.id}
          onMouseDown={(e) => onShapeMouseDown(e, shape.id)}
          onResizeMouseDown={(e) => onShapeResizeMouseDown(e, shape.id)}
          onUpdate={(updates) => onUpdateShape(shape.id, updates)}
          onDelete={() => onDeleteShape(shape.id)}
        />
      ))}
    </div>
  );
}
