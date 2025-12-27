'use client';

import { InfiniteImageWall } from '@/components/organisms/InfiniteImageWall';

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-black overflow-hidden">
      <InfiniteImageWall pixelSize={80} />
    </div>
  );
}
