// src/components/ui/slider.tsx
import { InputHTMLAttributes } from 'react';

interface SliderProps extends InputHTMLAttributes<HTMLInputElement> {
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export const Slider = ({
  min = 0,
  max = 100,
  step = 1,
  className,
  ...props
}: SliderProps) => {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      className={`
        w-full h-2 bg-gray-200 rounded-lg
        appearance-none cursor-pointer
        transition-colors
        focus:outline-none focus:ring-2 focus:ring-offset-2
        focus:ring-blue-500
        ${className || ''}
      `}
      {...props}
    />
  );
};