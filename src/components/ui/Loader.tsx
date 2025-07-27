// components/ui/Loader.tsx
import React from "react";

type LoaderSize = "sm" | "md" | "lg";
type LoaderVariant = "primary" | "secondary" | "danger" | "success" | "light" | "dark";

interface LoaderProps {
  size?: LoaderSize;
  variant?: LoaderVariant;
  className?: string;
}

const sizeMap: Record<LoaderSize, string> = {
  sm: "h-4 w-4 border",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-[3px]",
};

const variantMap: Record<LoaderVariant, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  danger: "text-danger",
  success: "text-success",
  light: "text-gray-200",
  dark: "text-gray-800",
};

export const Loader: React.FC<LoaderProps> = ({
  size = "md",
  variant = "primary",
  className = "",
}) => {
  return (
    <div
      className={`inline-block animate-spin rounded-full border-solid border-current border-t-transparent 
      ${sizeMap[size]} ${variantMap[variant]} ${className}`}
      role="status"
      aria-label="Chargement"
    >
      <span className="sr-only">Chargement en cours...</span>
    </div>
  );
};

// Variantes prédéfinies pour un usage facile
export const PrimaryLoader = ({ size, className }: Omit<LoaderProps, "variant">) => (
  <Loader size={size} variant="primary" className={className} />
);

export const SecondaryLoader = ({ size, className }: Omit<LoaderProps, "variant">) => (
  <Loader size={size} variant="secondary" className={className} />
);