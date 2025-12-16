'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const images = [
  { src: '/images/landscape-1.jpg', alt: 'Ethereal mountain landscape' },
  { src: '/images/landscape-2.jpg', alt: 'Misty forest' },
  { src: '/images/landscape-3.jpg', alt: 'Ocean horizon' },
  { src: '/images/hands.jpg', alt: 'Hands reaching' },
  { src: '/images/silhouette.jpg', alt: 'Human silhouette' },
  { src: '/images/abstract.jpg', alt: 'Abstract light' },
];

export default function ImageGallery() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
      {images.map((image, index) => (
        <motion.div
          key={image.src}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ 
            duration: 0.6, 
            delay: index * 0.1,
            ease: [0.16, 1, 0.3, 1] 
          }}
          className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-900"
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover img-hover"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        </motion.div>
      ))}
    </div>
  );
}
