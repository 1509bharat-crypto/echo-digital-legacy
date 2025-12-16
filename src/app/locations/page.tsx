'use client';

import { motion } from 'framer-motion';
import { MapPin, Clock, Phone } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

const locations = [
  {
    city: 'Amsterdam',
    country: 'Netherlands',
    address: 'Herengracht 420, 1017 BZ',
    hours: 'Mon-Fri: 9:00 - 18:00',
    phone: '+31 20 123 4567',
    description: 'Our flagship European portal in a restored 17th-century canal house.',
  },
  {
    city: 'Tokyo',
    country: 'Japan',
    address: 'Shibuya-ku, Jingumae 6-25-8',
    hours: 'Daily: 10:00 - 20:00',
    phone: '+81 3 1234 5678',
    description: 'A serene space in the heart of Tokyo, blending tradition with technology.',
  },
  {
    city: 'San Francisco',
    country: 'United States',
    address: '450 Mission Street, Suite 2100',
    hours: 'Mon-Sat: 8:00 - 19:00',
    phone: '+1 415 123 4567',
    description: 'Our West Coast headquarters with panoramic views of the Bay.',
  },
  {
    city: 'London',
    country: 'United Kingdom',
    address: '1 Finsbury Avenue, EC2M 2PP',
    hours: 'Mon-Fri: 9:00 - 18:00',
    phone: '+44 20 1234 5678',
    description: 'Located in the historic heart of London\'s financial district.',
  },
  {
    city: 'Sydney',
    country: 'Australia',
    address: '200 George Street, Level 15',
    hours: 'Mon-Fri: 9:00 - 17:30',
    phone: '+61 2 1234 5678',
    description: 'Our Asia-Pacific hub with stunning Harbour views.',
  },
  {
    city: 'Singapore',
    country: 'Singapore',
    address: '8 Marina Boulevard, Tower 1',
    hours: 'Mon-Sat: 9:00 - 20:00',
    phone: '+65 6123 4567',
    description: 'A modern sanctuary in the heart of Marina Bay.',
  },
];

export default function LocationsPage() {
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
              __Echo Portals
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl font-light leading-[1.1] max-w-4xl">
              Visit us in{' '}
              <span className="italic">person</span>
            </h1>
            <p className="mt-8 text-lg lg:text-xl text-gray-400 max-w-2xl leading-relaxed">
              Our Echo Portals are thoughtfully designed spaces where you can begin 
              your legacy journey with personal guidance and support.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Locations Grid */}
      <AnimatedSection className="px-6 lg:px-12 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {locations.map((location, index) => (
              <motion.div
                key={location.city}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group p-6 lg:p-8 border border-white/10 rounded-xl hover:border-white/20 transition-all hover:bg-white/[0.02]"
              >
                {/* City Header */}
                <div className="mb-6">
                  <h2 className="font-serif text-2xl lg:text-3xl font-light group-hover:text-gray-300 transition-colors">
                    {location.city}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">{location.country}</p>
                </div>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {location.description}
                </p>

                {/* Details */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3 text-gray-500">
                    <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                    <span>{location.address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-500">
                    <Clock size={16} className="flex-shrink-0" />
                    <span>{location.hours}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-500">
                    <Phone size={16} className="flex-shrink-0" />
                    <span>{location.phone}</span>
                  </div>
                </div>

                {/* CTA */}
                <button className="mt-8 w-full py-3 border border-white/20 rounded-full text-sm hover:bg-white hover:text-black transition-colors">
                  Book a visit
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Virtual Option */}
      <AnimatedSection className="px-6 lg:px-12 py-20 lg:py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-serif text-3xl lg:text-4xl font-light mb-6">
            Can&apos;t visit in person?
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
            Experience Echo from anywhere. Our virtual portal provides the same 
            guided journey with personalized support via video consultation.
          </p>
          <button className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full hover:bg-gray-200 transition-colors text-lg">
            Start virtual consultation
          </button>
        </div>
      </AnimatedSection>
    </div>
  );
}
