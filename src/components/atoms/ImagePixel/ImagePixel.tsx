'use client';

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ImagePixelProps } from './ImagePixel.types';

export const ImagePixel = ({
  src,
  alt = '',
  size = 40,
  onClick
}: ImagePixelProps) => {
  const pixelRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const pixel = pixelRef.current;
    if (!pixel) return;

    const handleMouseEnter = () => {
      setIsHovered(true);
      gsap.to(pixel, {
        scale: 1.1,
        zIndex: 10,
        duration: 0.6,
        ease: 'power1.out'
      });
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      gsap.to(pixel, {
        scale: 1,
        zIndex: 1,
        duration: 0.8,
        ease: 'power1.inOut'
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
      className="relative cursor-pointer border border-white/5 transition-colors duration-300"
      style={{
        width: size,
        height: size,
        backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)'
      }}
    />
  );
};
