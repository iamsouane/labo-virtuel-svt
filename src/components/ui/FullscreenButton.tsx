// src/components/ui/FullscreenButton.tsx
import React from 'react';
import { useFullscreen } from '../../hooks/useFullscreen';

interface FullscreenButtonProps {
  className?: string;
}

export const FullscreenButton: React.FC<FullscreenButtonProps> = ({ className = '' }) => {
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  return (
    <button
      onClick={toggleFullscreen}
      className={`px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition ${className}`}
      title="Plein écran"
    >
      {isFullscreen ? '🗗' : '🗖'}
    </button>
  );
};