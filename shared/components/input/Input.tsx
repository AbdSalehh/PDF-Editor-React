import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { InputProps } from "./input.type";

/**
 * Input Component
 * Reusable input field with label and error support
 * Supports password toggle for type="password"
 * Supports variant, size, and color customization
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      icon,
      className = "",
      type,
      variant = "default",
      size = "md",
      color = "default",
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    // Variant styles
    const variantStyles = {
      default: "bg-input border border-border",
      filled: "bg-muted border-0",
      outlined: "bg-transparent border border-border",
      ghost: "bg-transparent border-0 hover:bg-muted/50",
    };

    // Size styles
    const sizeStyles = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-3 text-base",
      lg: "px-5 py-4 text-lg",
    };

    // Color styles (focus ring)
    const colorStyles = {
      default: "focus:ring-primary focus:border-primary",
      primary: "focus:ring-blue-500 focus:border-blue-500",
      success: "focus:ring-green-500 focus:border-green-500",
      warning: "focus:ring-orange-500 focus:border-orange-500",
      error: "focus:ring-red-500 focus:border-red-500",
    };

    // Label size styles
    const labelSizeStyles = {
      sm: "text-xs mb-1",
      md: "text-sm mb-2",
      lg: "text-base mb-2",
    };

    return (
      <div className="w-full">
        {label && (
          <label
            className={`text-muted-foreground flex items-center gap-2 ${labelSizeStyles[size]}`}
          >
            {icon}
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            className={`text-foreground placeholder:text-muted-foreground duration-quick ease-smooth w-full rounded-lg transition-all outline-none focus:ring-2 ${variantStyles[variant]} ${sizeStyles[size]} ${colorStyles[color]} ${error ? "ring-destructive border-destructive ring-2" : ""} ${isPassword ? "pr-12" : ""} ${className} `}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="text-muted-foreground hover:text-foreground duration-quick absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
        {error && <p className="text-destructive mt-1 text-sm">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
