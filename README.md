# PDF Editor

> **Modern, Privacy-First, Zero-Server Client-Side PDF Suite**  
> Built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS 4**, **pdf-lib**, and **Feature-Sliced Design (FSD)**.

---

## 1. Project Overview & Architecture

### High-Level Overview
**PDF Editor** is an open-source, local-first web application designed for comprehensive PDF manipulation. Unlike traditional document workflows that rely on server-side processing, this application executes **100% of document rendering, transformation, and generation directly inside the user's browser sandbox**. 

The suite provides four core utilities in a unified, editorial-grade workspace:
1. **Interactive PDF Editor**: Annotate documents with custom typography, scalable shapes, and images with real-time viewport manipulation.
2. **Merge PDF**: Combine multiple PDF files with intuitive drag-and-drop sequencing.
3. **Split PDF**: Partition, reorganize, delete, and rotate pages with support for custom split boundaries and ZIP bundling.
4. **Image to PDF**: Convert and normalize raster graphics (PNG, JPEG, WebP, GIF, BMP) into standardized PDF documents with configurable margins, orientation, and dimensions.

### Architecture: Feature-Sliced Design (FSD)
The project strictly implements the **Feature-Sliced Design (FSD)** architectural methodology. All layer directories reside at the project root (`/`) rather than nested within `src/`, enforcing strict unidirectional dependencies:

$$\text{app} \longrightarrow \text{pages} \longrightarrow \text{widgets} \longrightarrow \text{features} \longrightarrow \text{entities} \longrightarrow \text{shared}$$

```
pdf-editor/
├── app/                      # Application bootstrap, routing, and global styles
│   ├── provider/             # React providers (DndProvider, Toaster, Router)
│   ├── styles/               # Global Tailwind CSS 4, OKLCH theme tokens, font faces
│   └── index.tsx             # Root React DOM entry point
├── pages/                    # Route-level composable views
│   ├── home/                 # Main SPA landing and dashboard view
│   └── NotFound/             # Fallback route handler
├── widgets/                  # Self-contained composite UI assemblies
│   ├── canvas/               # PDF rendering canvas, page layers, and zoom controls
│   ├── draggable/            # Interactive overlay elements (text, images, shapes)
│   ├── sidebar/              # Primary toolbars, upload handlers, and thumbnail strips
│   ├── preview/              # Multi-page thumbnail navigator and page-count loaders
│   ├── tab-bar/              # Navigation bar with layoutId active indicator
│   ├── tab-component/        # Page modules (PDFEditor, MergePDF, SplitPDF, ImageToPDF)
│   ├── tab-content/          # Lazy-loaded tab switcher with skeleton fallbacks
│   ├── dialog/               # Modal dialogs for download and naming options
│   ├── hero-section/         # Editorial typography header with dynamic calendar date
│   └── background-effects/   # Subtle ledger layout margin guidelines
├── features/                 # User-centric interaction slices
│   └── theme-toggle/         # Dark/Light mode toggle with View Transitions clip-path
├── entities/                 # Domain business models, stores, and PDF pipelines
│   ├── pdf-editor/           # Zustand store, element mutations, coordinate engine
│   ├── pdf-merge/            # Multi-file aggregation, page extraction, copyPages logic
│   ├── pdf-split/            # Page rotation, partitioning, size estimation, JSZip engine
│   ├── image-to-pdf/         # Transcoding pipeline, aspect-ratio scaling, page sizing
│   └── tab/                  # Navigation configuration and active state constants
├── shared/                   # Generic, domain-agnostic reusables
│   ├── ui/                   # Atomic UI primitives (Button, Card, Dialog, FileUpload)
│   ├── hooks/                # Custom hooks (useTheme, useMobile, useDebounce)
│   ├── lib/                  # Utilities (encryption, storage, confetti, cn helper)
│   └── components/           # Generic compound components (ErrorBoundary)
└── public/                   # Static TrueType fonts and public assets
```

#### Architectural Invariants
* **Strict Encapsulation**: Cross-slice imports must only pass through slice public API barrels (`index.ts`).
* **Unidirectional Layering**: A layer can only import from layers strictly below it. `entities` cannot import from `widgets`; `shared` has zero internal application dependencies.
* **Separation of Concerns**: State and business logic are isolated within `entities/` stores and hooks, while presentation remains strictly within `widgets/` and `shared/ui`.

---

## 2. Core Problem & Solution

### The Core Problem
Conventional web-based PDF editors (e.g., Smallpdf, iLovePDF, Adobe Acrobat Web) mandate that documents be uploaded to a remote server before parsing or editing can occur:
1. **Network Bottleneck & Latency**: Users with slow or unstable internet connections must endure prolonged upload wait times for large files (10MB–100MB+) before even viewing the first page.
2. **Data Privacy & Compliance Risks**: Sensitive personal or corporate files (contracts, bank statements, legal disclosures, medical records, ID scans) leave the local machine, exposing users to server-side retention risks, data leaks, and GDPR/HIPAA compliance challenges.
3. **Session Fragility**: Network dropouts during processing often corrupt sessions, requiring users to restart the upload and configuration process from scratch.

### The Solution: Local-First Client-Side Execution
**PDF Editor** eliminates remote server dependency entirely:
* **Zero Network Uploads**: Documents are loaded directly from the filesystem into the browser's memory via `FileReader`, `ArrayBuffer`, and `Blob` APIs. Editing begins instantaneously.
* **Complete Data Privacy**: Documents never traverse the network. There is no backend service, no cloud storage bucket, and no remote telemetry capturing document contents.
* **Deterministic Performance**: Processing latency is governed exclusively by the user's local CPU/GPU hardware, unaffected by fluctuating internet speeds.
* **In-Memory Transformation**: Manipulations (merging, splitting, rotating, embedding, and re-encoding) are executed locally via WebAssembly and pure JavaScript engines (`pdfjs-dist` and `pdf-lib`).

---

## 3. Tech Stack

| Category | Technology | Version | Purpose & Architectural Role |
| :--- | :--- | :--- | :--- |
| **Core & Framework** | [React](https://react.dev/) | `^19.2.3` | UI library utilizing modern features (`Suspense`, `flushSync`, concurrency) |
| | [TypeScript](https://www.typescriptlang.org/) | `~5.9.3` | Type safety and domain interface integrity across FSD slices |
| | [Vite](https://vitejs.dev/) | `^7.1.7` | High-speed frontend build tool and hot-module replacement (HMR) |
| **PDF Processing** | [pdf-lib](https://pdf-lib.js.org/) | `^1.17.1` | Client-side vector generation, PDF assembly, transformation, and binary encoding |
| | [@pdf-lib/fontkit](https://github.com/Hopding/fontkit) | `^1.1.1` | Font engine enabling custom TrueType (`.ttf`) font embedding into PDF binaries |
| | [react-pdf](https://github.com/wojtekmaj/react-pdf) | `^10.2.0` | React wrapper for PDF.js document rendering on HTML5 canvas |
| | `pdfjs-dist` | `10.2.0` | Mozilla PDF.js rendering worker executing client-side rasterization |
| **State Management** | [Zustand](https://github.com/pmndrs/zustand) | `^5.0.11` | Lightweight, unopinionated reactive store powering the canvas and element pipeline |
| **Styling & Design** | [Tailwind CSS](https://tailwindcss.com/) | `^4.1.16` | Next-generation utility-first CSS framework using `@theme` and OKLCH color spaces |
| | Radix UI Primitives | Latest | Accessible unstyled primitives (`@radix-ui/react-dialog`, `@radix-ui/react-slot`) |
| | `class-variance-authority` | `^0.7.1` | Structured, type-safe component variant declarations |
| | `tailwind-merge` & `clsx` | `^3.5.0` | Conflict-free dynamic utility class composition via `cn()` |
| **Animation & UX** | [Motion](https://motion.dev/) | `^12.23.26` | Hardware-accelerated transitions and shared layout animations |
| | [Lucide React](https://lucide.dev/) | `^0.577.0` | Consistent icon system across toolbars, tabs, and action dialogs |
| | [Sonner](https://sonner.emilkowal.ski/) | `^2.0.7` | Headless, stackable toast notifications with custom font integration |
| | `canvas-confetti` | `^1.9.4` | Micro-interaction celebratory particles on task completion |
| **Interaction** | [React DnD](https://react-dnd.github.io/react-dnd/) | `^16.0.1` | Drag-and-drop engine powering multi-file and page reordering |
| | [React Dropzone](https://react-dropzone.js.org/) | `^14.3.8` | File upload drop target abstraction with drag states |
| **Utilities** | [JSZip](https://stuk.github.io/jszip/) | `^3.10.1` | In-memory archive creation for multi-part PDF split downloads |
| | [CryptoJS](https://cryptojs.gitbook.io/docs/) | `^4.2.0` | Client-side AES encryption, SHA256 hashing, and Base64 operations |
| | [React Router](https://reactrouter.com/) | `^7.9.4` | Client-side browser routing and history navigation |

---

## 4. Design System & UI/UX Guidelines

### Aesthetic Direction: Editorial & Brutalist Minimalism
The visual language blends modern editorial print media with brutalist utility:
* **Backgrounds**: Warm textured light parchment (`#f5f2eb`) juxtaposed against an inky obsidian dark background (`#141311`).
* **Accent Tones**: Terracotta Vermillion (`#d9482b` light, `#ff7a59` dark) for focal points, active states, and call-to-actions.
* **Structural Borders**: Explicit border rules (`border-[#1a1917]/15` and `border-[#ece8df]/15`) reminiscent of physical ledger paper.
* **Background Guidelines**: Dual vertical margin boundaries rendered via `BackgroundEffects` to establish an architectural grid.

### Color Tokens (OKLCH Color Space)
Tailwind CSS 4 tokens configured in `app/styles/index.css`:

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --border: oklch(0.922 0 0);
  --radius: 0.625rem;
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --primary: oklch(0.922 0 0);
  --border: oklch(1 0 0 / 10%);
}
```

### Typography Hierarchy
Loaded via Google Fonts in `index.html` and bound in `index.css`:
1. **Display Serif (`--font-display: "Instrument Serif"`)**: Scaled up to `8rem` in the hero section for an editorial, literary headline feel.
2. **Body Sans (`--font-sans: "Plus Jakarta Sans"`)**: Crisp geometric sans-serif applied to body text, dialogs, inputs, and toast notifications.
3. **Functional Mono (`--font-mono: "JetBrains Mono"`)**: Applied to tab bar labels, calendar timestamps, tool counters (`01`, `02`), and byte size readouts.

### Micro-Interactions & Theme Transitions
* **Circular Radial Clip-Path View Transition**: `useTheme` leverages `document.startViewTransition` with dynamic trigonometry calculating hypotenuse distance from the clicked toggle button, producing a smooth expanding circle ripple across the DOM without layout flicker.
* **Animated Tab Indicator**: `TabBar` uses Motion's `layoutId="active-tab-line"` to smoothly glide an orange indicator line across active tab headers.
* **Lazy Loading Skeletons**: `TabContent` wraps heavy modules in `React.Suspense` with bespoke skeleton wireframes replicating sidebar and canvas geometry.

---

## 5. Key Features & Workflows

### Feature Matrix

| Module | Primary Capabilities | Technical Highlights |
| :--- | :--- | :--- |
| **PDF Editor** | • Freehand image overlays<br>• Rich text annotations<br>• Shape insertions (Rect, Circle, Triangle)<br>• Zoom (50% – 300%)<br>• Page navigation & sidebar thumbnails | • Custom font embedding via `@pdf-lib/fontkit`<br>• Timestamp-based z-index sequencing<br>• Canvas image transcoding to PNG<br>• Real-time `IntersectionObserver` page tracking |
| **Merge PDF** | • Multi-file drag & drop queue<br>• Order resequencing<br>• Per-document page count inspection<br>• Unified file export | • `react-dnd` HTML5 Backend<br>• Parallel page copy via `pdfDoc.copyPages`<br>• Client-side memory release |
| **Split PDF** | • Page reordering & deletion<br>• 90° clockwise rotation<br>• Custom split boundaries<br>• Real-time byte size estimation<br>• Single PDF or ZIP bundle export | • Absolute rotation math preservation<br>• Page group partitioning algorithms<br>• In-memory archive creation with `JSZip` |
| **Image to PDF** | • Multi-format ingestion (PNG, JPG, WebP, GIF, BMP)<br>• Reordering queue<br>• Dimensions: Fit, A4, Letter<br>• Orientation: Portrait, Landscape<br>• Margins: None (0pt), Small (20pt), Big (50pt) | • `OffscreenCanvas` & `createImageBitmap`<br>• Proportional aspect-ratio centering<br>• Pure client-side binary generation |

---

### In-Depth Technical Workflows

#### 1. PDF Editor: Coordinate Transformation & Element Rendering
Web browsers place the coordinate origin `(0, 0)` at the **top-left corner** (positive $Y$ points downward), whereas PDF specifications place `(0, 0)` at the **bottom-left corner** (positive $Y$ points upward).

```
Browser Canvas Coordinate System        PDF Document Coordinate System
(0,0) -------------> +X                 +Y ^
  |                                        |
  |                                        |   [Page Content]
  v +Y                                     |
                                         (0,0) -------------> +X
```

To accurately persist elements onto the PDF binary, `usePDFDownload` translates positions using the target page height and canvas zoom scale:

$$\text{drawX} = \frac{\text{element.x}}{\text{scale}}$$

$$\text{drawY} = \text{pageHeight} - \frac{\text{element.y}}{\text{scale}} - \frac{\text{element.height}}{\text{scale}}$$

For text elements, typography ascent is normalized using the scaled font size:

$$\text{textAscent} = \frac{\text{fontSize}}{\text{scale}} \times 1.2$$

$$\text{drawY}_{\text{text}} = \text{pageHeight} - \frac{\text{text.y}}{\text{scale}} - \text{textAscent}$$

#### 2. Vector Triangle Rasterization in PDF
`pdf-lib` lacks a native filled-polygon primitive. To render filled triangles reliably without external vector path dependencies, `use-pdf-download.ts` interpolates horizontal scanlines across the vertical triangle bounds:

```ts
const steps = Math.ceil(drawHeight);
for (let i = 0; i <= steps; i++) {
  const ratio = i / steps;
  const currentY = bottomLeftY + (topY - bottomLeftY) * ratio;
  const currentLeftX = bottomLeftX + (topX - bottomLeftX) * ratio;
  const currentRightX = bottomRightX + (topX - bottomRightX) * ratio;

  page.drawLine({
    start: { x: currentLeftX, y: currentY },
    end: { x: currentRightX, y: currentY },
    color: rgb(r, g, b),
    thickness: 1,
  });
}
```

#### 3. Split PDF Partitioning & ZIP Generation
When splitting documents:
1. `pages` array tracks active status, rotation angle, and `splitGroup` integer ID.
2. Group boundaries are toggled via `addSplitAfterPage` and `removeSplitAfterPage`.
3. To calculate estimated download size in real time, `calculateAllSizes` generates temporary in-memory PDF representations of each group without writing to disk.
4. Exporting as ZIP invokes `JSZip`, creating file entries dynamically:
   ```ts
   const zip = new JSZip();
   for (let i = 0; i < groups.length; i++) {
     const pdfBytes = await buildGroupPDF(groups[i]);
     zip.file(`${groupNames[i]}.pdf`, pdfBytes);
   }
   const zipBlob = await zip.generateAsync({ type: "blob" });
   ```

---

## 6. Critical Technical Takeaways & Insights

### 1. Cross-Format Image Normalization Pipeline
* **Challenge**: `pdf-lib` strictly supports embedding raw PNG (`embedPng`) and JPEG (`embedJpg`) byte streams. If a user uploads Modern WebP, animated GIF, or BMP graphics, `pdf-lib` throws an unsupported format exception.
* **Solution**: In both `pdf-editor.store.ts` and `use-image-to-pdf.ts`, non-standard graphics are piped through an in-memory `HTMLCanvasElement` or modern `OffscreenCanvas`. The browser decodes the source image via `createImageBitmap` and repaints it onto the canvas before extracting standard JPEG or PNG bytes. This ensures 100% image compatibility across all modern formats.

### 2. Timestamp-Based Z-Index Serialization
* **Challenge**: When elements (text, images, shapes) are added across different pages, their DOM stacking order must match their visual creation hierarchy when compiled into PDF streams.
* **Solution**: Every element receives a deterministic timestamp ID (`Date.now()`). Prior to compiling into `PDFDocument`, all elements across types are consolidated into a single flat array and sorted numerically by timestamp, ensuring strict visual z-index parity between DOM canvas and final output.

### 3. Fontkit Integration & Dynamic TrueType Embedding
Standard PDF generators restrict users to the Standard 14 PDF fonts (Helvetica, Times, Courier). To deliver rich typography:
* The editor registers `@pdf-lib/fontkit` directly with the `PDFDocument` instance.
* Custom font files (`Roboto`, `Open Sans`, `Lato`, `Georgia`, `Calibri`) with full variant matrices (Regular, Bold, Italic, Bold-Italic) are lazy-fetched as `ArrayBuffer` binaries from `/fonts/` on demand.
* Unmatched fonts cleanly fall back to appropriate Standard 14 font counterparts.

### 4. Memory Lifecycle Management (`URL.revokeObjectURL`)
Processing multi-megabyte PDFs and multi-image queues in browser RAM risks memory leaks if references persist. The codebase enforces strict object URL cleanup:
* Previews generated via `URL.createObjectURL` are systematically invalidated via `URL.revokeObjectURL` whenever an item is removed, replaced, or cleared.
* Export download anchors schedule `URL.revokeObjectURL` execution shortly after the simulated click event.

### 5. Viewport Synchronization via IntersectionObserver
Instead of attaching heavy `scroll` event listeners to the canvas container, `usePDFEditorEffects` mounts an `IntersectionObserver` with multiple thresholds (`[0, 0.1, 0.3, 0.5, 0.7, 1.0]`). The currently active page is calculated from the intersecting element with the maximum intersection ratio, keeping zoom controls and page counters synchronized with zero thread locking.

---

## 7. Getting Started

### Prerequisites
* **Node.js**: `v20.x` or higher
* **Package Manager**: `npm`, `pnpm`, or `bun`

### Installation & Local Development

```bash
# Clone the repository
git clone https://github.com/your-username/pdf-editor.git

# Navigate to the editor-react workspace
cd pdf-editor/editor-react

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

The application will be accessible at `http://localhost:5173`. No `.env` files or backend dependencies are required.

### Build & Production Deployment

```bash
# Type-check and produce optimized production build
npm run build

# Preview production build locally
npm run preview

# Run ESLint validation
npm run lint
```

Because the application is entirely client-side, the generated `dist/` directory can be deployed statically to **Vercel**, **Netlify**, **Cloudflare Pages**, **GitHub Pages**, or an **AWS S3 / CloudFront** bucket.
