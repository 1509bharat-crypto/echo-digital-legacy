'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/AnimatedSection';
import ProcessStep from '@/components/ProcessStep';
import VideoSection from '@/components/VideoSection';

const processSteps = [
  {
    number: '001',
    title: 'Curate your digital legacy',
    description: 'Select the moments and memories that matter most. Echo guides you through your digital world, helping you decide what feels right for your story - shaping it with care and intention.',
    tags: [
      { icon: 'hands-holding-diamond', label: 'Autonomy' },
      { icon: 'shield-check', label: 'Curation' },
    ],
  },
  {
    number: '002',
    title: 'Create your Legacy Key',
    description: 'Preserve what matters most in your Legacy Key - a secure, private collection of the digital pieces that reflect who you are.',
    tags: [
      { icon: 'pen', label: 'Creation' },
    ],
  },
  {
    number: '003',
    title: 'Share your Echo',
    description: 'Let your loved ones experience your Echo - an immersive journey where they can reconnect with your story, finding comfort and connection through shared memories.',
    tags: [
      { icon: 'stars', label: 'Result' },
    ],
  },
];

export default function Home() {
  return (
    <div className="page-transition">
      {/* Hero Section */}
      <section className="min-h-[90vh] flex flex-col justify-center px-6 lg:px-12 py-20">
        <div className="max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-gray-500 text-sm font-mono mb-6 block">
              __How this works
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl font-light leading-[1.1] max-w-4xl">
              Turn your digital presence into a{' '}
              <span className="italic">lasting legacy</span>
            </h1>
            <p className="mt-8 text-lg lg:text-xl text-gray-400 max-w-2xl leading-relaxed">
              Echo guides you to curate, preserve and share the story you want to leave behind.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Image Grid */}
      <AnimatedSection className="px-6 lg:px-12 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gradient-to-br from-gray-800 to-gray-900"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Process Steps */}
      <AnimatedSection className="px-6 lg:px-12 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto">
          {processSteps.map((step, index) => (
            <ProcessStep
              key={step.number}
              {...step}
              index={index}
            />
          ))}
        </div>
      </AnimatedSection>

      {/* Story Section */}
      <AnimatedSection className="px-6 lg:px-12 py-20 lg:py-32 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="font-serif text-3xl lg:text-5xl font-light leading-tight">
                How would you like to be remembered?
              </h2>
              <div className="mt-8 space-y-6 text-gray-400 leading-relaxed">
                <p>
                  Your digital life tells your story - a story that deserves to be preserved, 
                  shaped by you, for those you love.
                </p>
                <p>
                  We each create a unique presence in the digital world, where so much of our 
                  lives lives on. Photos and videos of cherished moments, the books we read, 
                  the music we love and the messages we share - all of it reflects who we are.
                </p>
                <p>
                  Each piece holds meaning, memory, and connection. With Echo, you take control 
                  of how your story will be remembered - ensuring your legacy reflects the life 
                  you lived.
                </p>
              </div>
            </div>
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="aspect-[4/5] rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </motion.div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Video Section */}
      <AnimatedSection className="px-6 lg:px-12 py-20 lg:py-32">
        <div className="max-w-5xl mx-auto">
          <VideoSection />
        </div>
      </AnimatedSection>

      {/* Journey Section */}
      <AnimatedSection className="px-6 lg:px-12 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-gray-500 text-lg mb-4">Share your journey from</p>
            <h2 className="font-serif text-4xl lg:text-6xl font-light mb-4">
              the beginning{' '}
              <span className="text-gray-600">__</span>
            </h2>
            <h2 className="font-serif text-4xl lg:text-6xl font-light italic">
              <span className="text-gray-600">__</span>
              to now
            </h2>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Final CTA */}
      <AnimatedSection className="px-6 lg:px-12 py-20 lg:py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
            <div>
              <p className="text-gray-500 mb-2">Preserve your digital story, eternally</p>
              <h2 className="font-serif text-3xl lg:text-4xl font-light">
                Shape how you&apos;ll be remembered
              </h2>
            </div>
            <Link
              href="/form"
              className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full hover:bg-gray-200 transition-colors text-lg"
            >
              Create your digital echo
            </Link>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
