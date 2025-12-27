'use client';

import { useRef, useState, useEffect } from 'react';
import { ImagePixel } from '@/components/atoms/ImagePixel';
import { InfiniteImageWallProps } from './InfiniteImageWall.types';

export const InfiniteImageWall = ({
  pixelSize = 40,
  className = ''
}: InfiniteImageWallProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  if (dimensions.width === 0 || dimensions.height === 0) {
    return null;
  }

  const gap = pixelSize * 0.25; // 25% of pixelSize for gap
  const padding = gap; // Same padding as gap

  const availableWidth = dimensions.width - (padding * 2);
  const availableHeight = dimensions.height - (padding * 2);

  const cols = Math.floor(availableWidth / (pixelSize + gap));
  const rows = Math.floor(availableHeight / (pixelSize + gap));

  // Calculate scaled size to fill viewport with gaps and padding
  const scaledWidth = (availableWidth - gap * (cols - 1)) / cols;
  const scaledHeight = (availableHeight - gap * (rows - 1)) / rows;

  const totalCells = cols * rows;

  return (
    <div className={`w-screen h-screen overflow-hidden ${className}`}>
      <div
        ref={containerRef}
        className="grid w-full h-full"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${scaledWidth}px)`,
          gridTemplateRows: `repeat(${rows}, ${scaledHeight}px)`,
          gap: `${gap}px`,
          padding: `${padding}px`
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
