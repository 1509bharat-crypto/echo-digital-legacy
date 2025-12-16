'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X } from 'lucide-react';
import Image from 'next/image';

export default function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="relative">
      {/* Video Thumbnail */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative aspect-video rounded-xl overflow-hidden bg-gray-900 cursor-pointer group"
        onClick={() => setIsPlaying(true)}
      >
        <Image
          src="/images/video-thumbnail.svg"
          alt="Echo experience preview"
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
        
        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center play-button"
          >
            <Play className="w-8 h-8 lg:w-10 lg:h-10 text-white ml-1" fill="white" />
          </motion.div>
        </div>

        {/* Corner accent */}
        <div className="absolute bottom-4 right-4 lg:bottom-6 lg:right-6">
          <span className="text-xs text-white/60 font-mono">PLAY VIDEO</span>
        </div>
      </motion.div>

      {/* Video Modal */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setIsPlaying(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsPlaying(false)}
                className="absolute -top-12 right-0 text-white/60 hover:text-white transition-colors"
              >
                <X size={32} />
              </button>
              
              {/* Replace with your actual video */}
              <video
                autoPlay
                controls
                className="w-full h-full rounded-lg"
                src="/videos/echo-preview.mp4"
              >
                Your browser does not support the video tag.
              </video>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
