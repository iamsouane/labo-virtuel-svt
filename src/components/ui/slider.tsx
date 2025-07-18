// src/components/ui/slider.tsx
import type { InputHTMLAttributes } from 'react';

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
        w-full h-2 appearance-none cursor-pointer rounded-full
        bg-light
        accent-primary
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
        [&::-webkit-slider-thumb]:appearance-none
        [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4
        [&::-webkit-slider-thumb]:rounded-full
        [&::-webkit-slider-thumb]:bg-primary
        [&::-webkit-slider-thumb]:shadow
        [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4
        [&::-moz-range-thumb]:rounded-full
        [&::-moz-range-thumb]:bg-primary
        [&::-moz-range-thumb]:border-none
        ${className || ''}
      `}
      {...props}
    />
  );
};