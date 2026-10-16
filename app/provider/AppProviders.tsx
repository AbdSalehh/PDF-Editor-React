import type { ReactNode } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Toaster } from "@/shared/ui/sonner";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <DndProvider backend={HTML5Backend}>
      <Toaster
        expand={true}
        position="top-center"
        richColors
        toastOptions={{
          classNames: {
            toast: ".toaster",
          },
        }}
      />
      {children}
    </DndProvider>
  );
}
