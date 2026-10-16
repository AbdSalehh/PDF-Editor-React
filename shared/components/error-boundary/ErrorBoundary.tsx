import { Component, type ErrorInfo } from "react";
import { Button } from "../button/Button";
import type {
  ErrorBoundaryProps,
  ErrorBoundaryState,
} from "./error-boundary.type";

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
          <div className="w-full max-w-md text-center animate-fade-in">
            {/* Icon */}
            <div className="mb-8">
              <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <svg
                  className="h-8 w-8 text-destructive"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              {/* Title */}
              <h1 className="mb-2">Oops! Something went wrong</h1>

              {/* Description */}
              <p className="mb-4 text-muted-foreground">
                We're sorry, but something unexpected happened.
              </p>

              {/* Error Details */}
              {this.state.error && (
                <details className="mb-4 rounded-lg bg-muted p-4 text-left">
                  <summary className="mb-2 cursor-pointer font-medium text-foreground">
                    Error Details
                  </summary>
                  <pre className="overflow-auto text-xs text-destructive">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                variant="primary"
                size="lg"
                onClick={this.handleReset}
                className="w-full"
              >
                Try Again
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => (window.location.href = "/home")}
                className="w-full"
              >
                Go to Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
