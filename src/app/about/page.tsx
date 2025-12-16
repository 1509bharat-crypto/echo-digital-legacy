'use client';

import { motion } from 'framer-motion';
import AnimatedSection from '@/components/AnimatedSection';

const teamMembers = [
  { name: 'Dr. Sarah Chen', role: 'Founder & CEO', bio: 'Former neuroscientist turned digital preservation advocate.' },
  { name: 'Marcus Webb', role: 'CTO', bio: 'Pioneer in secure, long-term digital storage solutions.' },
  { name: 'Yuki Tanaka', role: 'Head of Experience', bio: 'Designing meaningful ways to connect with digital memories.' },
];

const values = [
  {
    title: 'Autonomy',
    description: 'Your story, your choices. We believe everyone deserves complete control over how they are remembered.',
  },
  {
    title: 'Privacy',
    description: 'Your memories are sacred. End-to-end encryption and zero-knowledge architecture protect your legacy.',
  },
  {
    title: 'Permanence',
    description: 'Built to last generations. Our infrastructure is designed for digital preservation across centuries.',
  },
  {
    title: 'Compassion',
    description: 'Grief and memory deserve gentle handling. Every feature is designed with empathy at its core.',
  },
];

export default function AboutPage() {
  return (
    <div className="page-transition">
      {/* Hero */}
      <section className="px-6 lg:px-12 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-gray-500 text-sm font-mono mb-6 block">
              __About Echo
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl font-light leading-[1.1] max-w-4xl">
              Preserving what makes us{' '}
              <span className="italic">human</span>
            </h1>
            <p className="mt-8 text-lg lg:text-xl text-gray-400 max-w-2xl leading-relaxed">
              Echo was founded on a simple belief: our digital lives hold immense value, 
              and everyone deserves the ability to shape their own legacy.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <AnimatedSection className="px-6 lg:px-12 py-20 lg:py-32 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <h2 className="font-serif text-3xl lg:text-4xl font-light mb-8">
                Our story
              </h2>
              <div className="space-y-6 text-gray-400 leading-relaxed">
                <p>
                  In 2071, our founder Dr. Sarah Chen lost her grandmother - along with decades 
                  of digital memories scattered across platforms that no longer existed. Photo 
                  libraries locked behind defunct services. Messages lost to company acquisitions.
                </p>
                <p>
                  That loss sparked a question: in an age where so much of who we are exists 
                  digitally, why do we have so little control over our digital legacies?
                </p>
                <p>
                  Echo was born from that question. We&apos;ve assembled a team of technologists, 
                  ethicists, and designers united by a single mission: to give everyone the 
                  power to preserve and share their digital story on their own terms.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Values */}
      <AnimatedSection className="px-6 lg:px-12 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-3xl lg:text-4xl font-light mb-12 lg:mb-16">
            What we believe
          </h2>
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-8 border border-white/10 rounded-xl hover:border-white/20 transition-colors"
              >
                <h3 className="font-serif text-2xl font-light mb-4">{value.title}</h3>
                <p className="text-gray-400 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Team */}
      <AnimatedSection className="px-6 lg:px-12 py-20 lg:py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-3xl lg:text-4xl font-light mb-12 lg:mb-16">
            The team
          </h2>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 mb-6">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <h3 className="font-serif text-xl font-light">{member.name}</h3>
                <p className="text-gray-500 text-sm mt-1">{member.role}</p>
                <p className="text-gray-400 text-sm mt-3 leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
