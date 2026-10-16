import type { InputHTMLAttributes } from "react";

export type InputVariant = "default" | "filled" | "outlined" | "ghost";
export type InputSize = "sm" | "md" | "lg";
export type InputColor =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "error";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  variant?: InputVariant;
  size?: InputSize;
  color?: InputColor;
}
