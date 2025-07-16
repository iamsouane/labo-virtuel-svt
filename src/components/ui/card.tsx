// src/components/ui/card.tsx
import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: ReactNode;
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: ReactNode;
}

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: ReactNode;
}

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  className?: string;
  children: ReactNode;
}

export const Card = ({ className, children, ...props }: CardProps) => {
  return (
    <div
      className={`
        bg-white rounded-2xl border border-gray-300 shadow-sm
        transition-shadow duration-200
        hover:shadow-md
        ${className || ""}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ className, children, ...props }: CardHeaderProps) => {
  return (
    <div
      className={`
        px-6 py-4 border-b border-gray-300
        ${className || ""}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardContent = ({ className, children, ...props }: CardContentProps) => {
  return (
    <div
      className={`
        px-6 py-5
        ${className || ""}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardTitle = ({ className, children, ...props }: CardTitleProps) => {
  return (
    <h2
      className={`
        text-2xl font-bold text-primary
        ${className || ""}
      `}
      {...props}
    >
      {children}
    </h2>
  );
};