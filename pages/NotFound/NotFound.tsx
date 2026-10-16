import { useNavigate } from "react-router";
import { SearchX } from "lucide-react";
import { Button } from "@/shared/components";

/**
 * 404 Not Found Page
 */
export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center animate-fade-in bg-card/50 backdrop-blur-xl layer-panel border border-border/50 dark:border-border rounded-2xl p-8 shadow-2xl">
        {/* Icon */}
        <div className="mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 border-2 border-primary/30">
            <SearchX className="h-10 w-10 text-primary" />
          </div>

          {/* Error Code */}
          <h1 className="mb-4 text-9xl font-bold text-primary">404</h1>

          {/* Title */}
          <h2 className="mb-2">Page Not Found</h2>

          {/* Description */}
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate(-1)}
            className="w-full"
          >
            Go Back
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate("/")}
            className="w-full"
          >
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  );
};
