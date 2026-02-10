import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ArrowDown, Sparkles, MessageSquare } from 'lucide-react';

const roles = ['Full Stack Developer', 'Creative Technologist', 'Problem Solver', 'UI/UX Enthusiast'];

export function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [currentRole, setCurrentRole] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  // Kinetic typography animation
  useEffect(() => {
    if (!titleRef.current) return;

    const chars = titleRef.current.querySelectorAll('.char');
    gsap.fromTo(
      chars,
      { opacity: 0, y: 40, rotateX: -90 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: 'back.out(1.7)',
        delay: 0.4,
      }
    );
  }, []);

  // Role rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // 3D tilt effect for glass card
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(cardRef.current, {
      rotateY: x * 10,
      rotateX: -y * 10,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const nameChars = 'Ayar Suresh'.split('');

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10 md:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Text Content */}
          <div className="text-center lg:text-left">
            {/* Pre-title */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/60 text-xs sm:text-sm uppercase tracking-widest mb-4"
            >
              Hello, I&apos;m
            </motion.p>

            {/* Main Title with Kinetic Typography */}
            <h1
              ref={titleRef}
              className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 perspective-1000"
            >
              {nameChars.map((char, i) => (
                <span
                  key={i}
                  className="char inline-block gradient-text"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </h1>

            {/* Morphing Subtitle */}
            <div className="h-10 mb-6 overflow-hidden">
              <motion.p
                key={currentRole}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-xl sm:text-2xl text-[#00f0ff] font-medium"
              >
                {roles[currentRole]}
              </motion.p>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-white/70 text-lg max-w-lg mx-auto lg:mx-0 mb-8"
            >
              I build immersive digital experiences that push the boundaries of web technology.
              Turning complex problems into elegant, performant solutions.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <button
                onClick={() => scrollToSection('#projects')}
                className="group relative px-8 py-4 bg-gradient-to-r from-[#7e6ee3] to-[#5b6ee3] rounded-xl text-white font-medium overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#7e6ee3]/40 hover:scale-105"
                data-cursor-hover
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Sparkles size={18} />
                  View Projects
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#5b6ee3] to-[#7e6ee3] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>

              <button
                onClick={() => scrollToSection('#about')}
                className="group px-8 py-4 glass rounded-xl text-white font-medium transition-all duration-300 hover:bg-white/10 hover:scale-105 flex items-center gap-2"
                data-cursor-hover
              >
                <MessageSquare size={18} />
                Chat with AI
              </button>
            </motion.div>
          </div>

          {/* Right: Floating Glass Card */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="hidden lg:flex justify-center perspective-1000"
          >
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative preserve-3d animate-float"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Glow effect behind card */}
              <div className="absolute -inset-4 bg-gradient-to-r from-[#7e6ee3]/30 to-[#5b6ee3]/30 rounded-3xl blur-2xl opacity-60" />

              {/* Main Card */}
              <div className="relative glass-strong rounded-3xl p-8 max-w-sm">
                {/* Avatar */}
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#7e6ee3] to-[#5b6ee3] rounded-full blur-lg opacity-50" />
                  <img
                    src={`${import.meta.env.BASE_URL}avatar.jpg`}
                    alt="Ayar Suresh"
                    className="w-full h-full object-cover -rotate-3 scale-110"
                  />

                  {/* Status indicator */}
                  <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-black animate-pulse" />
                </div>

                {/* Card Content */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-2">Ayar Suresh</h3>
                  <p className="text-[#00f0ff] text-sm mb-4">Available for work</p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold gradient-text">2.5+</div>
                      <div className="text-xs text-white/60">Years Exp.</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold gradient-text">17+</div>
                      <div className="text-xs text-white/60">Projects</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold gradient-text">10+</div>
                      <div className="text-xs text-white/60">Clients</div>
                    </div>
                  </div>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap justify-center gap-2">
                    {['Flutter', 'Dart', 'Node.js', 'React', '+6'].map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-xs bg-white/10 rounded-full text-white/80"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Decorative corner accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#7e6ee3]/50 rounded-tl-3xl" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#5b6ee3]/50 rounded-tr-3xl" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#5b6ee3]/50 rounded-bl-3xl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#7e6ee3]/50 rounded-br-3xl" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <button
          onClick={() => scrollToSection('#about')}
          className="flex flex-col items-center gap-2 text-white/50 hover:text-white/80 transition-colors"
          data-cursor-hover
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowDown size={20} />
          </motion.div>
        </button>
      </motion.div>
    </section>
  );
}
