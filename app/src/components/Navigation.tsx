import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Experience', href: '#experience' },
  { name: 'Contact', href: '#contact' },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${isScrolled
          ? 'bg-[#0d1117]/80 backdrop-blur-xl border-[#30363d] shadow-[0_1px_0_0_rgba(255,255,255,0.05)]'
          : 'bg-transparent border-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo - Terminal Style */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="group flex items-center gap-2 text-sm font-mono font-bold"
            data-cursor-hover
          >
            <span className="text-[#00f0ff]">{'>'}</span>
            <span className="text-white group-hover:text-[#00f0ff] transition-colors">~/ayar.dev</span>
            <span className="w-2 h-4 bg-[#7e6ee3] animate-pulse ml-0.5" />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                className="relative px-4 py-1.5 text-xs text-[#8b949e] hover:text-white transition-colors duration-300 font-mono group rounded-md hover:bg-[#161b22]"
                data-cursor-hover
              >
                <span className="text-[#7e6ee3] opacity-0 group-hover:opacity-100 transition-opacity mr-1">./</span>
                {link.name}
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); scrollToSection('#contact'); }}
            className="hidden md:flex items-center gap-2 px-4 py-2 text-xs font-mono font-medium bg-[#1f6feb]/10 border border-[#1f6feb]/50 text-[#58a6ff] rounded hover:bg-[#1f6feb]/20 transition-all duration-300 hover:shadow-[0_0_15px_rgba(31,111,235,0.2)]"
            data-cursor-hover
          >
            <span className="text-lg leading-none">@</span>
            <span>Connect</span>
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-[#161b22] rounded-md transition-colors"
            data-cursor-hover
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#0d1117]/98 backdrop-blur-xl md:hidden pt-20 border-t border-[#30363d]"
          >
            <div className="flex flex-col items-start gap-6 p-8 font-mono">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-lg text-[#c9d1d9] hover:text-[#00f0ff] transition-colors flex items-center gap-3"
                >
                  <span className="text-[#30363d] text-sm">0{index + 1}</span>
                  <span>{link.name}</span>
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                onClick={(e) => { e.preventDefault(); scrollToSection('#contact'); }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-6 w-full text-center py-3 text-sm font-bold bg-[#238636] text-white rounded border border-[#2ea043] hover:bg-[#2ea043] transition-colors"
              >
                git commit -m "Contact Me"
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
