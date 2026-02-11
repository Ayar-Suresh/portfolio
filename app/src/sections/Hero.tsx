import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ArrowDown, Terminal, Command, GitBranch, Cpu } from 'lucide-react';

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

    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-x-hidden py-20 lg:py-0">


      {/* Background Elements */}
      <div className="absolute inset-0 bg-[#0d1117]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 py-10 md:py-20 w-full">
        <div className="mt-10"></div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left: Interactive Terminal Window */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            <div className="ide-panel shadow-2xl relative group overflow-hidden">
              {/* Terminal Header */}
              <div className="mac-window-header justify-between bg-[#161b22] border-b border-[#30363d]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
                <div className="text-xs text-white/40 font-mono flex items-center gap-2">
                  <Terminal size={12} />
                  <span>ayar.dev — -zsh — 80x24</span>
                </div>
                <div className="w-10" /> {/* Spacer */}
              </div>

              {/* Padded Content Area */}
              <div className="p-6 md:p-10 bg-[#0d1117]/90 min-h-[400px] flex flex-col justify-center relative">

                {/* Pre-title Prompt */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-3 mb-6 font-mono text-sm md:text-base"
                >
                  <span className="text-[#2ea043] font-bold">➜</span>
                  <span className="text-[#00f0ff]">~</span>
                  <span className="text-white/60">echo "Hello, I'm"</span>
                </motion.div>

                {/* Main Title */}
                <h1
                  ref={titleRef}
                  className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 perspective-1000 tracking-tight"
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
                <div className="flex items-center gap-3 mb-8 font-mono text-sm md:text-lg">
                  <span className="text-[#7e6ee3]">const</span>
                  <span className="text-[#cabcb1]">role</span>
                  <span className="text-[#7e6ee3]">=</span>
                  <span className="text-[#56d364]">'</span>

                  {/* Fixed-width role container */}
                  <div className="h-8 w-[12ch] overflow-hidden inline-flex items-center">
                    <motion.p
                      key={currentRole}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="text-[#56d364] whitespace-nowrap"
                    >
                      {roles[currentRole]}
                    </motion.p>
                  </div>

                  <span className="text-[#56d364]">'</span>
                  <span className="text-white/40">;</span>
                </div>


                {/* Description */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="text-white/60 text-base md:text-lg max-w-lg mb-10 leading-relaxed font-mono"
                >
                  <span className="text-[#30363d] mr-4">1</span>
                  Building immersive digital experiences.
                  <br />
                  <span className="text-[#30363d] mr-4">2</span>
                  Pushing boundaries of web technology.
                </motion.p>

                {/* CTA Buttons - Terminal Style */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <button
                    onClick={() => scrollToSection('#projects')}
                    className="px-6 py-3 bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg font-mono text-sm font-bold transition-all flex items-center gap-2 border border-[rgba(255,255,255,0.1)] shadow-lg shadow-[#2ea043]/20"
                    data-cursor-hover
                  >
                    <GitBranch size={16} />
                    git checkout projects
                  </button>

                  <button
                    onClick={() => scrollToSection('#about')}
                    className="px-6 py-3 bg-[#161b22] hover:bg-[#21262d] text-[#c9d1d9] rounded-lg font-mono text-sm font-bold transition-all border border-[#30363d] flex items-center gap-2"
                    data-cursor-hover
                  >
                    <Command size={16} />
                    ./run_ai_chat.sh
                  </button>
                </motion.div>

                {/* Status Bar */}
                <div className="mt-5"></div>

                <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#161b22] border-t border-[#30363d] flex items-center justify-between px-4 text-[10px] text-white/40 font-mono">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <GitBranch size={10} className="text-[#7e6ee3]" />
                      main
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Cpu size={10} />
                      0 errors, 0 warnings
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span>Ln 24, Col 80</span>
                    <span>UTF-8</span>

                    {/* Hidden on mobile */}
                    <span className="hidden md:inline text-[#00f0ff]">
                      TypeScript React
                    </span>
                  </div>
                </div>
              </div>  </div>
          </motion.div>

          {/* Right: Floating Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="hidden lg:flex justify-center perspective-1000 order-1 lg:order-2 w-full"
          >
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative preserve-3d animate-float"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Glow effect behind card */}
              <div className="absolute -inset-4 bg-gradient-to-r from-[#7e6ee3]/20 to-[#00f0ff]/20 rounded-3xl blur-3xl opacity-50" />

              {/* Main Card */}
              <div className="relative ide-panel p-6 md:p-8 border border-[#30363d] bg-[#0d1117]/80 backdrop-blur-xl">

                {/* Tech Corners - Re-added for "Advanced UI" look */}
                <svg className="absolute top-0 left-0 w-6 h-6 md:w-8 md:h-8 text-[#00f0ff] opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M1 1h6M1 1v6" />
                </svg>
                <svg className="absolute top-0 right-0 w-6 h-6 md:w-8 md:h-8 text-[#00f0ff] opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M23 1h-6M23 1v6" />
                </svg>
                <svg className="absolute bottom-0 left-0 w-6 h-6 md:w-8 md:h-8 text-[#00f0ff] opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M1 23h6M1 23v-6" />
                </svg>
                <svg className="absolute bottom-0 right-0 w-6 h-6 md:w-8 md:h-8 text-[#00f0ff] opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M23 23h-6M23 23v-6" />
                </svg>

                {/* Avatar */}
                <div className="relative w-40 h-40 md:w-48 md:h-48 mx-auto mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#7e6ee3] to-[#00f0ff] rounded-full blur-lg opacity-40 animate-pulse" />
                  <img
                    src={`${import.meta.env.BASE_URL}avatar.jpg`}
                    alt="Ayar Suresh"
                    className="w-full h-full object-cover rounded-full p-1 border-2 border-[#30363d] relative z-10"
                  />
                  <div className="absolute bottom-2 right-2 w-5 h-5 md:w-6 md:h-6 bg-[#238636] rounded-full border-4 border-[#0d1117] z-20" />
                </div>

                {/* Card Content */}
                <div className="text-center relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-1 font-mono">Ayar Suresh</h3>
                  <p className="text-[#7e6ee3] text-sm font-mono mb-6">@ayar.dev</p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-6 border-y border-[#30363d] py-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-white font-mono">2.5<span className="text-[#00f0ff]">+</span></div>
                      <div className="text-[10px] text-white/40 uppercase tracking-wider">Years</div>
                    </div>
                    <div className="text-center border-l border-r border-[#30363d]">
                      <div className="text-lg font-bold text-white font-mono">17<span className="text-[#00f0ff]">+</span></div>
                      <div className="text-[10px] text-white/40 uppercase tracking-wider">Projects</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white font-mono">10<span className="text-[#00f0ff]">+</span></div>
                      <div className="text-[10px] text-white/40 uppercase tracking-wider">Clients</div>
                    </div>
                  </div>

                  {/* Tech Stack Pills - Terminal Style */}
                  <div className="flex flex-wrap justify-center gap-2">
                    {['Flutter', 'React', 'Node.js', 'TypeScript'].map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-[10px] font-mono bg-[#161b22] border border-[#30363d] rounded text-[#8b949e]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Decorative lines */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#30363d] to-transparent opacity-50" />
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#30363d] to-transparent opacity-50" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mobile Identity Stripe - Visible only on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="lg:hidden w-full mt-12 order-3"
        >
          <div className="relative ide-panel p-5 bg-[#0d1117]/90 backdrop-blur-xl border-y border-[#30363d] flex items-center gap-5 overflow-hidden shadow-2xl">
            {/* Scanning Bar Animation */}
            <div className="absolute top-0 left-0 w-1 h-full bg-[#00f0ff] shadow-[0_0_15px_#00f0ff] animate-[scanheight_3s_ease-in-out_infinite]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#00f0ff]/5 to-transparent pointer-events-none" />

            {/* Avatar Box with Glitch Effect Border */}
            <div className="relative flex-shrink-0 group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#00f0ff] to-[#7e6ee3] rounded-full blur opacity-40 group-hover:opacity-75 transition duration-500 animate-pulse" />
              <div className="w-20 h-20 rounded-full border-2 border-[#30363d] overflow-hidden relative z-10 bg-[#0d1117]">
                <img
                  src={`${import.meta.env.BASE_URL}avatar.jpg`}
                  alt="Ayar Suresh"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Online Status */}
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-[#238636] rounded-full border-2 border-[#0d1117] z-20 shadow-[0_0_8px_#238636]" />
            </div>

            {/* Info Area */}
            <div className="flex-1 min-w-0 relative z-10">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-white font-bold font-mono text-xl tracking-tight">Ayar Suresh</h3>
                <Cpu size={16} className="text-[#30363d] animate-spin-slow" />
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7e6ee3] animate-ping" />
                <p className="text-[#7e6ee3] text-xs font-mono">@ayar.dev</p>
              </div>

              {/* Horizontal Scroll Tech Stack */}
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar mask-gradient-r">
                {['Flutter', 'React', 'TypeScript', 'Node.js', 'AI'].map((tech) => (
                  <span key={tech} className="text-[10px] font-mono text-[#8b949e] bg-[#161b22] px-2 py-1 rounded border border-[#30363d] whitespace-nowrap flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-[#00f0ff]/50" />
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-12 left-1/2  md:left-[55%] -translate-x-1/2"
      >
        <button
          onClick={() => scrollToSection('#about')}
          className="flex flex-col items-center gap-1 text-white/30 hover:text-white/60 transition-colors"
          data-cursor-hover
        >
          <span className="text-[10px] uppercase tracking-widest font-mono">SCROLL_DOWN</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowDown size={16} />
          </motion.div>
        </button>
      </motion.div>
    </section >
  );
}
