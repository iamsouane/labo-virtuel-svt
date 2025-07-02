// src/components/ui/card.tsx
import type { HTMLAttributes } from 'react';


interface CardProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  className?: string;
}

export const Card = ({ className, children, ...props }: CardProps) => {
  return (
    <div 
      className={`
        bg-white rounded-lg shadow-sm
        border border-gray-200
        ${className || ''}
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
        p-4 border-b border-gray-200
        ${className || ''}
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
        p-4
        ${className || ''}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardTitle = ({ className, children, ...props }: CardTitleProps) => {
  return (
    <h1 
      className={`
        text-2xl font-bold
        ${className || ''}
      `}
      {...props}
    >
      {children}
    </h1>
  );
};