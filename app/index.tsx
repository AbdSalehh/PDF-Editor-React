import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { ErrorBoundary } from "@/shared/components/error-boundary/ErrorBoundary";
import { AppProviders } from "./provider/AppProviders";

import routes from "./provider/routes";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <AppProviders>
      <RouterProvider router={routes} />
    </AppProviders>
  </ErrorBoundary>,
);
