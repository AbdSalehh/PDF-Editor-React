import { lazy, Suspense } from "react";
import { TABS_CONFIG } from "@/entities/tab";
import { Skeleton } from "@/shared/ui/skeleton";

const PDFEditor = lazy(() =>
  import("@/widgets/tab-component").then((mod) => ({ default: mod.PDFEditor })),
);

const SplitPDFPage = lazy(() =>
  import("@/widgets/tab-component").then((mod) => ({
    default: mod.SplitPDF,
  })),
);

const MergePDFPage = lazy(() =>
  import("@/widgets/tab-component").then((mod) => ({
    default: mod.MergePDF,
  })),
);

const ImageToPDFPage = lazy(() =>
  import("@/widgets/tab-component").then((mod) => ({
    default: mod.ImageToPDFPage,
  })),
);

const PAGE_COMPONENTS: Record<
  string,
  React.LazyExoticComponent<React.ComponentType>
> = {
  "pdf-editor": PDFEditor,
  "split-pdf": SplitPDFPage,
  "merge-pdf": MergePDFPage,
  "image-to-pdf": ImageToPDFPage,
};

interface TabContentProps {
  activeTab: string;
}

function TabFallback() {
  return (
    <div className="flex gap-6 p-4 pt-0">
      {/* Sidebar skeleton */}
      <div className="h-70 w-75 shrink-0 space-y-4 rounded-xl border border-[#1a1917]/15 p-5 dark:border-[#ece8df]/15">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
      {/* Main content skeleton */}
      <div className="flex h-110 w-200 flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[#1a1917]/15 p-16 dark:border-[#ece8df]/15">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-3 w-64" />
        <div className="mt-6 grid w-full grid-cols-4 gap-3 opacity-30">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
}

function PlaceholderPage({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-gray-300 p-16 dark:border-neutral-700">
      <p className="text-lg font-medium text-gray-500 dark:text-neutral-400">
        {label}
      </p>
      <p className="text-sm text-gray-400 dark:text-neutral-500">
        Halaman ini sedang dalam proses migrasi
      </p>
    </div>
  );
}

export default function TabContent({ activeTab }: TabContentProps) {
  return (
    <div className="z-999 mx-auto py-8">
      {TABS_CONFIG.map((tab) => {
        const Component = PAGE_COMPONENTS[tab.id];

        return (
          <div
            key={tab.id}
            id={`panel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
            className={activeTab === tab.id ? "block" : "hidden"}
          >
            {Component ? (
              <Suspense fallback={<TabFallback />}>
                <Component />
              </Suspense>
            ) : (
              <PlaceholderPage label={tab.label} />
            )}
          </div>
        );
      })}
    </div>
  );
}
