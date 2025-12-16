'use client';

import { motion } from 'framer-motion';
import { Gem, ShieldCheck, PenLine, Sparkles, LucideIcon } from 'lucide-react';

interface ProcessStepProps {
  number: string;
  title: string;
  description: string;
  tags: { icon: string; label: string }[];
  index: number;
}

const iconMap: { [key: string]: LucideIcon } = {
  'hands-holding-diamond': Gem,
  'shield-check': ShieldCheck,
  'pen': PenLine,
  'stars': Sparkles,
};

export default function ProcessStep({ 
  number, 
  title, 
  description, 
  tags,
  index 
}: ProcessStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1] 
      }}
      className="group"
    >
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 py-10 lg:py-14 border-b border-white/10">
        {/* Number */}
        <div className="flex-shrink-0">
          <span className="text-gray-500 text-sm font-mono">
            /{number}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="font-serif text-2xl lg:text-3xl font-light mb-4 group-hover:text-gray-300 transition-colors">
            {title}
          </h3>
          <p className="text-gray-400 leading-relaxed max-w-xl">
            {description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap lg:flex-col gap-3 lg:gap-2 lg:items-end">
          {tags.map((tag) => {
            const Icon = iconMap[tag.icon] || Sparkles;
            return (
              <div 
                key={tag.label}
                className="flex items-center gap-2 text-gray-500 text-sm"
              >
                <Icon size={14} className="text-gray-600" />
                <span>{tag.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
