'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: '/about', label: 'About us' },
    { href: '/locations', label: 'Echo portal locations' },
    { href: '#', label: 'Help' },
    { href: '#', label: 'Privacy' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-2xl lg:text-3xl font-light tracking-wide">
              Echo
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm text-gray-400 hover:text-white transition-colors underline-animation"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-6">
            <Link
              href="/login"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/form"
              className="text-sm bg-white text-black px-5 py-2.5 rounded-full hover:bg-gray-200 transition-colors"
            >
              Create your digital echo
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/5 bg-[#0a0a0a]"
          >
            <nav className="flex flex-col px-6 py-6 gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg text-gray-400 hover:text-white transition-colors py-2"
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-white/10 flex flex-col gap-4">
                <Link
                  href="/login"
                  className="text-lg text-gray-400 hover:text-white transition-colors py-2"
                >
                  Log in
                </Link>
                <Link
                  href="/form"
                  className="text-center bg-white text-black px-5 py-3 rounded-full hover:bg-gray-200 transition-colors"
                >
                  Create your digital echo
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
