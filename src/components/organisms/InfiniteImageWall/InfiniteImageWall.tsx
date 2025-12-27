'use client';

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ImagePixel } from '@/components/atoms/ImagePixel';
import { InfiniteImageWallProps } from './InfiniteImageWall.types';

export const InfiniteImageWall = ({
  pixelSize = 40,
  className = ''
}: InfiniteImageWallProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    // Calculate actual cell size to fill viewport
    const generateImages = () => {
      const cols = Math.floor(window.innerWidth / pixelSize);
      const rows = Math.floor(window.innerHeight / pixelSize);
      const totalImages = cols * rows;

      const imageList = Array.from({ length: totalImages }, (_, i) => {
        const seed = Math.floor(Math.random() * 1000);
        return `https://picsum.photos/seed/${seed}/100/100`;
      });

      setImages(imageList);
    };

    generateImages();
    window.addEventListener('resize', generateImages);

    return () => window.removeEventListener('resize', generateImages);
  }, [pixelSize]);

  const cols = Math.floor(window.innerWidth / pixelSize);
  const rows = Math.floor(window.innerHeight / pixelSize);

  // Calculate scaled size to fill viewport
  const scaledWidth = window.innerWidth / cols;
  const scaledHeight = window.innerHeight / rows;

  return (
    <div className={`w-screen h-screen overflow-hidden ${className}`}>
      <div
        ref={containerRef}
        className="grid gap-0 w-full h-full"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${scaledWidth}px)`,
          gridTemplateRows: `repeat(${rows}, ${scaledHeight}px)`
        }}
      >
        {images.map((src, i) => (
          <ImagePixel
            key={i}
            src={src}
            size={Math.min(scaledWidth, scaledHeight)}
            alt={`Image ${i}`}
          />
        ))}
      </div>
    </div>
  );
};
