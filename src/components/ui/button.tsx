// src/components/ui/button.tsx
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "destructive" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
  children: ReactNode;
}

export const Button = ({
  variant = "default",
  size = "default",
  className,
  children,
  ...props
}: ButtonProps) => {
  const variantClasses = {
    default:
      "bg-primary text-white hover:bg-primary-dark shadow-md hover:shadow-lg",
    secondary:
      "bg-gray-100 text-gray-800 hover:bg-gray-200 shadow-sm hover:shadow-md",
    destructive:
      "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg",
    ghost:
      "bg-transparent text-gray-700 hover:bg-gray-100 shadow-none",
  }[variant];

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    default: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  }[size];

  return (
    <button
      className={`
        rounded-2xl font-semibold transition-all duration-200
        focus:outline-none focus:ring-offset-2 focus:ring-primary/60
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses} ${sizeClasses} ${className || ""}
      `}
      {...props}
    >
      {children}
    </button>
  );
};