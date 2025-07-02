// src/components/ui/button.tsx
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export const Button = ({
  variant = 'default',
  size = 'default',
  className,
  children,
  ...props
}: ButtonProps) => {
  const variantClasses = {
    default: 'bg-blue-500 hover:bg-blue-600',
    secondary: 'bg-gray-200 hover:bg-gray-300',
    destructive: 'bg-red-500 hover:bg-red-600',
    ghost: 'bg-transparent hover:bg-gray-100 text-black'
  }[variant];

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    default: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }[size];

  return (
    <button
      className={`
        rounded-md font-medium transition-colors
        focus:outline-none focus:ring-2 focus:ring-offset-2
        focus:ring-blue-500 disabled:opacity-50
        ${variantClasses}
        ${sizeClasses}
        ${className || ''}
      `}
      {...props}
    >
      {children}
    </button>
  );
};