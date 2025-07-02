import React, { type InputHTMLAttributes } from 'react';

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = ({
  label,
  className,
  onCheckedChange,
  onChange,
  ...props
}: CheckboxProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCheckedChange?.(e.target.checked);
    onChange?.(e); // garde le comportement natif si besoin
  };

  return (
    <label className="flex items-center space-x-3 cursor-pointer">
      <input
        type="checkbox"
        className={`
          w-4 h-4 border-2 rounded
          transition-colors
          focus:outline-none focus:ring-2 focus:ring-offset-2
          focus:ring-blue-500
          ${className || ''}
        `}
        onChange={handleChange}
        {...props}
      />
      {label && (
        <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </span>
      )}
    </label>
  );
};
