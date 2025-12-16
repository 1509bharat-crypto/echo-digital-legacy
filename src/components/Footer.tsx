import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Logo & Tagline */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <span className="font-serif text-3xl font-light tracking-wide">
                Echo
              </span>
            </Link>
            <p className="mt-4 text-gray-500 text-sm max-w-md leading-relaxed">
              Shape how you&apos;ll be remembered. Your digital life tells your story — 
              preserve it with intention for those you love.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
              Navigate
            </h4>
            <nav className="flex flex-col gap-3">
              <Link href="/about" className="text-gray-500 hover:text-white transition-colors text-sm">
                About us
              </Link>
              <Link href="/locations" className="text-gray-500 hover:text-white transition-colors text-sm">
                Echo Portal locations
              </Link>
              <Link href="/form" className="text-gray-500 hover:text-white transition-colors text-sm">
                Create your Echo
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
              Legal
            </h4>
            <nav className="flex flex-col gap-3">
              <Link href="#" className="text-gray-500 hover:text-white transition-colors text-sm">
                Terms
              </Link>
              <Link href="#" className="text-gray-500 hover:text-white transition-colors text-sm">
                Privacy
              </Link>
              <Link href="#" className="text-gray-500 hover:text-white transition-colors text-sm">
                Cookies
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">
            © 2077 Echo. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-gray-600 hover:text-white transition-colors text-sm">
              Terms
            </Link>
            <Link href="#" className="text-gray-600 hover:text-white transition-colors text-sm">
              Privacy
            </Link>
            <Link href="#" className="text-gray-600 hover:text-white transition-colors text-sm">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
