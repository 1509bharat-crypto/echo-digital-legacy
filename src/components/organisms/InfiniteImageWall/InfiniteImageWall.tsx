'use client';

import { useRef } from 'react';
import { ImagePixel } from '@/components/atoms/ImagePixel';
import { InfiniteImageWallProps } from './InfiniteImageWall.types';

export const InfiniteImageWall = ({
  pixelSize = 40,
  className = ''
}: InfiniteImageWallProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const gap = pixelSize * 0.4; // 40% of pixelSize for gap
  const cols = Math.floor(window.innerWidth / (pixelSize + gap));
  const rows = Math.floor(window.innerHeight / (pixelSize + gap));

  // Calculate scaled size to fill viewport with gaps
  const scaledWidth = (window.innerWidth - gap * (cols - 1)) / cols;
  const scaledHeight = (window.innerHeight - gap * (rows - 1)) / rows;

  const totalCells = cols * rows;

  return (
    <div className={`w-screen h-screen overflow-hidden ${className}`}>
      <div
        ref={containerRef}
        className="grid w-full h-full"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${scaledWidth}px)`,
          gridTemplateRows: `repeat(${rows}, ${scaledHeight}px)`,
          gap: `${gap}px`
        }}
      >
        {Array.from({ length: totalCells }).map((_, i) => (
          <ImagePixel
            key={i}
            src=""
            size={Math.min(scaledWidth, scaledHeight)}
            alt=""
          />
        ))}
      </div>
    </div>
  );
};
