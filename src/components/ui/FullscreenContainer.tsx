// src/components/ui/FullscreenContainer.tsx
import React from 'react';
import { useFullscreen } from '../../hooks/useFullscreen';

interface FullscreenContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const FullscreenContainer: React.FC<FullscreenContainerProps> = ({
  children,
  className = '',
}) => {
  const { isFullscreen } = useFullscreen();

  return (
    <div
      id="photosynthese"
      className={`w-full ${className} ${isFullscreen ? 'min-h-screen overflow-y-auto' : ''}`}
    >
      {children}
    </div>
  );
};