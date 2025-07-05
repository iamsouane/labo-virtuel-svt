//src/hooks/useFullscreen
import { useState, useEffect } from 'react';

export const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const active = !!document.fullscreenElement;
      setIsFullscreen(active);
      document.body.style.overflow = active ? 'hidden' : 'auto'; // Scroll body désactivé
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.body.style.overflow = 'auto';
    };
  }, []);

  const toggleFullscreen = async () => {
    const element = document.getElementById('photosynthese');
    if (!element) return;

    if (!document.fullscreenElement) {
      try {
        await element.requestFullscreen();
      } catch (err) {
        console.error('Erreur mode plein écran:', err);
      }
    } else {
      try {
        await document.exitFullscreen();
      } catch (err) {
        console.error('Erreur sortie mode plein écran:', err);
      }
    }
  };

  return { isFullscreen, toggleFullscreen };
};