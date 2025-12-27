'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ImagePixelProps } from './ImagePixel.types';

export const ImagePixel = ({
  src,
  alt = '',
  size = 40,
  onClick
}: ImagePixelProps) => {
  const pixelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pixel = pixelRef.current;
    if (!pixel) return;

    const handleMouseEnter = () => {
      gsap.to(pixel, {
        scale: 1.5,
        zIndex: 10,
        duration: 0.3,
        ease: 'back.out(1.7)'
      });
    };

    const handleMouseLeave = () => {
      gsap.to(pixel, {
        scale: 1,
        zIndex: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    pixel.addEventListener('mouseenter', handleMouseEnter);
    pixel.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      pixel.removeEventListener('mouseenter', handleMouseEnter);
      pixel.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={pixelRef}
      onClick={onClick}
      className="relative cursor-pointer"
      style={{ width: size, height: size }}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </div>
  );
};
