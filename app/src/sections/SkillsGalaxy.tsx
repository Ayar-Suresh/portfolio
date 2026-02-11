import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  Code2, Server, Palette, Layers, Terminal, Smartphone, Bot,
  MessageSquare, Workflow, Activity, Cpu, Database, Shield, Zap, Sparkles
} from 'lucide-react';

interface Skill {
  name: string;
  icon: React.ComponentType<{ size?: number; color?: string; className?: string }>;
  level: number;
  category: string;
  color: string;
  description?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color: string; // Stored as RGB tuple for fast rgba() rendering
}

const skills: Skill[] = [
  // Frontend
  { name: 'React', icon: Code2, level: 95, category: 'Frontend', color: '#61dafb', description: 'Component Architecture' },
  { name: 'TypeScript', icon: Terminal, level: 92, category: 'Frontend', color: '#3178c6', description: 'Static Typing System' },
  { name: 'Next.js', icon: Layers, level: 88, category: 'Frontend', color: '#ffffff', description: 'SSR & Edge Runtime' },
  { name: 'Tailwind', icon: Palette, level: 95, category: 'Frontend', color: '#38bdf8', description: 'Utility-First CSS' },

  // App Development
  { name: 'Flutter', icon: Smartphone, level: 90, category: 'App Dev', color: '#42a5f5', description: 'Multi-Platform Core' },
  { name: 'Dart', icon: Terminal, level: 85, category: 'App Dev', color: '#0175c2', description: 'Optimized VM' },

  // AI Integration
  { name: 'OpenAI', icon: Bot, level: 85, category: 'AI Integration', color: '#10a37f', description: 'LLM Integration' },
  { name: 'RAG Systems', icon: Database, level: 82, category: 'AI Integration', color: '#a855f7', description: 'Vector Search' },
  { name: 'Prompt Eng', icon: MessageSquare, level: 88, category: 'AI Integration', color: '#ec4899', description: 'Context Optimization' },
  { name: 'Agents', icon: Workflow, level: 80, category: 'AI Integration', color: '#f43f5e', description: 'Autonomous Loops' },

  // Programming
  { name: 'Python', icon: Terminal, level: 85, category: 'Programming', color: '#f59e0b', description: 'Data & Scripting' },
  { name: 'C++', icon: Code2, level: 78, category: 'Programming', color: '#00599c', description: 'System Performance' },
  { name: 'Java', icon: Code2, level: 80, category: 'Programming', color: '#b07219', description: 'Enterprise Backend' },

  // Networking & Systems
  { name: 'Network Sec', icon: Shield, level: 80, category: 'Networking', color: '#10b981', description: 'Packet Analysis' },
  { name: 'DevOps', icon: Server, level: 75, category: 'Networking', color: '#3b82f6', description: 'CI/CD Pipelines' },
  { name: 'System Ops', icon: Activity, level: 78, category: 'Networking', color: '#ef4444', description: 'Monitoring & Health' },
];

const categories = ['All', 'Frontend', 'App Dev', 'AI Integration', 'Programming', 'Networking'];

// OPTIMIZATION 1: Memoized the SkillNode so it doesn't re-render unless its specific props change
const SkillNode = React.memo(function SkillNode({
  skill,
  index,
  isActive,
  position,
}: {
  skill: Skill;
  index: number;
  isActive: boolean;
  position: { x: number; y: number };
}) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const Icon = skill.icon;
  const { x, y } = position;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-50, 50], [10, -10]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-50, 50], [-10, 10]), { stiffness: 300, damping: 30 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!nodeRef.current) return;
    const rect = nodeRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  }, [mouseX, mouseY]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const isBottom = y > 50;
  const isRight = x > 100;
  const isLeft = x < -100;

  let popoverClasses = "absolute w-56 z-50 pointer-events-none will-change-transform ";

  if (isBottom) popoverClasses += "bottom-full mb-6 ";
  else popoverClasses += "top-full mt-6 ";

  if (isRight) popoverClasses += "right-0 translate-x-4";
  else if (isLeft) popoverClasses += "left-0 -translate-x-4";
  else popoverClasses += "left-1/2 -translate-x-1/2";

  return (
    <motion.div
      ref={nodeRef}
      initial={{ opacity: 0, scale: 0, rotateZ: -180 }}
      whileInView={{
        opacity: isActive ? 1 : 0.15,
        scale: isActive ? 1 : 0.7,
        rotateZ: 0
      }}
      viewport={{ once: true }}
      transition={{
        duration: 0.8,
        delay: index * 0.03,
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`absolute group ${isHovered ? 'z-50' : 'z-10'}`}
      style={{
        x: '-50%',
        y: '-50%',
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        willChange: 'transform, opacity'
      }}
    >
      <div className="relative flex flex-col items-center">
        <div className="relative w-20 h-20 md:w-24 md:h-24">
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: isHovered
                ? `0 0 30px ${skill.color}80, 0 0 60px ${skill.color}40, 0 0 90px ${skill.color}20`
                : `0 0 10px ${skill.color}40, 0 0 20px ${skill.color}20`
            }}
            transition={{ duration: 0.3 }}
            style={{ willChange: 'box-shadow' }}
          />

          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            style={{ willChange: 'transform' }}
          >
            <div
              className="absolute inset-0 rounded-full border-2 border-transparent"
              style={{
                borderTopColor: skill.color,
                borderRightColor: skill.color,
                opacity: isHovered ? 0.6 : 0.3
              }}
            />
          </motion.div>

          <motion.div
            className="absolute inset-2"
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            style={{ willChange: 'transform' }}
          >
            <div
              className="absolute inset-0 rounded-full border border-dashed"
              style={{ borderColor: skill.color, opacity: isHovered ? 0.4 : 0.2 }}
            />
          </motion.div>

          <motion.div
            className="absolute inset-3 rounded-full backdrop-blur-md border-2 flex items-center justify-center overflow-hidden"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${skill.color}40, #0d111780)`,
              borderColor: isHovered ? skill.color : '#30363d',
            }}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: `linear-gradient(135deg, ${skill.color}20, transparent)` }}
              animate={{ opacity: isHovered ? [0.3, 0.6, 0.3] : 0.2 }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            <motion.div
              animate={{
                scale: isHovered ? [1, 1.2, 1] : 1,
                rotateZ: isHovered ? [0, 5, -5, 0] : 0
              }}
              transition={{ duration: 0.5 }}
            >
              <Icon
                size={window.innerWidth < 768 ? 24 : 32}
                color={skill.color}
                className="relative z-10 drop-shadow-lg"
              />
            </motion.div>

            {isHovered && (
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full"
                    style={{ background: skill.color, left: '50%', top: '50%' }}
                    animate={{
                      x: [0, (Math.cos((i / 6) * Math.PI * 2) * 30)],
                      y: [0, (Math.sin((i / 6) * Math.PI * 2) * 30)],
                      opacity: [1, 0],
                      scale: [1, 0],
                    }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                  />
                ))}
              </motion.div>
            )}
          </motion.div>

          {isHovered && (
            <motion.div
              className="absolute inset-0 rounded-full border-2"
              style={{ borderColor: skill.color }}
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </div>

        <motion.div
          className="mt-4 px-4 py-1.5 rounded-full backdrop-blur-md border flex items-center gap-2 shadow-lg"
          style={{
            background: isHovered ? `linear-gradient(135deg, ${skill.color}20, #0d111790)` : '#0d111780',
            borderColor: isHovered ? skill.color : '#30363d',
          }}
          animate={{ y: isHovered ? -2 : 0 }}
        >
          <motion.span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: skill.color, boxShadow: isHovered ? `0 0 8px ${skill.color}` : 'none' }}
            animate={{ scale: isHovered ? [1, 1.3, 1] : 1 }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className="text-xs md:text-sm font-mono font-semibold tracking-wide" style={{ color: isHovered ? '#ffffff' : '#8b949e' }}>
            {skill.name}
          </span>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: isBottom ? 10 : -10 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.85,
          y: isHovered ? 0 : (isBottom ? 10 : -10),
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className={popoverClasses}
      >
        <div
          className="relative rounded-2xl backdrop-blur-2xl border-2 p-4 shadow-2xl overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${skill.color}15, #0d1117e6)`, borderColor: skill.color }}
        >
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{ backgroundImage: `radial-gradient(circle at 2px 2px, ${skill.color} 1px, transparent 0)`, backgroundSize: '24px 24px' }}
            />
          </div>

          <div
            className="absolute w-0.5 h-6"
            style={{
              background: skill.color,
              [isBottom ? 'bottom' : 'top']: '-24px',
              [isRight ? 'right' : isLeft ? 'left' : 'left']: isRight || isLeft ? '16px' : '50%',
              transform: (isRight || isLeft) ? 'none' : 'translateX(-50%)',
            }}
          />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3 pb-2 border-b" style={{ borderColor: `${skill.color}40` }}>
              <div className="flex items-center gap-2">
                <Sparkles size={12} style={{ color: skill.color }} />
                <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: skill.color }}>
                  {skill.category}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <motion.div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: '#2ea043' }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-[9px] text-[#2ea043] font-mono">ACTIVE</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-white/90">Proficiency</span>
                <span className="text-lg font-bold font-mono" style={{ color: skill.color }}>
                  {skill.level}%
                </span>
              </div>

              <div className="relative h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ background: `linear-gradient(90deg, ${skill.color}, ${skill.color}cc)`, boxShadow: `0 0 10px ${skill.color}80` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                />
              </div>

              <div className="flex items-start gap-2 pt-1">
                <Zap size={12} className="mt-0.5 flex-shrink-0" style={{ color: skill.color }} />
                <p className="text-[11px] leading-relaxed font-mono text-white/70">
                  {skill.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

export function SkillsGalaxy() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [isMobile, setIsMobile] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: false }); // OPTIMIZATION: Disabled alpha channel on main context for speed
    if (!ctx) return;

    let beamGradient: CanvasGradient;

    const resize = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;

      // OPTIMIZATION 2: Pre-calculate gradient outside the 60fps loop
      const beamLength = Math.max(canvas.width, canvas.height) * 0.6;
      beamGradient = ctx.createLinearGradient(0, 0, beamLength, 0);
      beamGradient.addColorStop(0, 'rgba(0, 240, 255, 0)');
      beamGradient.addColorStop(0.5, 'rgba(0, 240, 255, 0.1)');
      beamGradient.addColorStop(1, 'rgba(0, 240, 255, 0)');
    };

    resize();
    window.addEventListener('resize', resize);

    let animationId: number;
    let time = 0;
    let isVisible = false;

    const observer = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting; },
      { threshold: 0 }
    );
    observer.observe(container);

    const initParticles = () => {
      particlesRef.current = [];
      const colors = ['126, 110, 227', '0, 240, 255', '236, 72, 153', '16, 163, 127']; // RGB tuples for fast manipulation
      for (let i = 0; i < 40; i++) { // Slightly reduced particle count for performance
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          life: Math.random(),
          size: Math.random() * 2 + 1,
          color: colors[Math.floor(Math.random() * 4)]
        });
      }
    };
    initParticles();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (!isVisible) return;

      time += 0.02;

      // Draw background directly instead of clearRect (because alpha: false)
      ctx.fillStyle = '#0d1117';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;

      ctx.strokeStyle = 'rgba(48, 54, 61, 0.3)';
      ctx.lineWidth = 1;
      const gridSize = 50;

      ctx.beginPath();
      for (let x = 0; x <= width; x += gridSize) {
        const offset = Math.sin(time + x * 0.01) * 5;
        ctx.moveTo(x, 0);
        ctx.lineTo(x + offset, height);
      }
      for (let y = 0; y <= height; y += gridSize) {
        const offset = Math.cos(time + y * 0.01) * 5;
        ctx.moveTo(0, y);
        ctx.lineTo(width, y + offset);
      }
      ctx.stroke();

      // OPTIMIZATION 3: Removed expensive hex conversions and string building
      particlesRef.current.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life += 0.005;

        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;

        const alpha = (Math.sin(particle.life * Math.PI) + 1) * 0.3;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particle.color}, ${alpha})`; // Much faster than toString(16)

        // Fast fake-glow (shadowBlur is highly unoptimized in 2D canvas)
        ctx.fill();
        if (particle.life > 2) particle.life = 0;
      });

      for (let i = 0; i < 3; i++) {
        const radius = ((time * 50) % 300) + i * 100;
        const alpha = 1 - (radius / 400);
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(126, 110, 227, ${alpha * 0.2})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      const beamLength = Math.max(width, height) * 0.6;
      for (let i = 0; i < 6; i++) {
        const angle = (time * 0.5) + (i * Math.PI / 3);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.fillStyle = beamGradient; // Uses pre-calculated gradient
        ctx.fillRect(0, -1, beamLength, 2);
        ctx.restore();
      }

      for (let i = 0; i < 3; i++) {
        const ringRadius = 40 + i * 15;
        const rotation = time * (0.5 + i * 0.2);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rotation);
        ctx.beginPath();
        ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(126, 110, 227, ${0.3 - i * 0.1})`;
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 10]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
      observer.disconnect();
    };
  }, []);

  const filteredSkills = useMemo(() => activeCategory === 'All'
    ? skills
    : skills.filter(s => s.category === activeCategory), [activeCategory]);

  return (
    <section id="skills" className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-[#0d1117] via-[#0a0e14] to-[#0d1117]">
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-center mb-12 md:mb-20"
        >
          <motion.div
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 backdrop-blur-xl mb-6"
            animate={{
              boxShadow: [
                '0 0 20px rgba(126, 110, 227, 0.3)',
                '0 0 40px rgba(0, 240, 255, 0.3)',
                '0 0 20px rgba(126, 110, 227, 0.3)',
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
              <Cpu size={16} className="text-purple-400" />
            </motion.div>
            <span className="text-sm font-mono text-cyan-400 font-semibold tracking-wider">
              SYSTEM CORE v2.5.0
            </span>
            <motion.div
              className="w-2 h-2 rounded-full bg-green-400"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 font-mono">
            <motion.span
              className="inline-block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{ backgroundSize: '200% 200%' }}
            >
              Skills Nexus
            </motion.span>
          </h2>

          <motion.p
            className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto font-mono leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-cyan-400">{'>'}</span> Explore the interconnected web of expertise
            <br className="hidden sm:block" />
            <span className="text-purple-400">//</span> Hover over nodes for detailed insights
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {categories.map((category, idx) => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`relative px-6 py-3 text-sm font-mono font-semibold rounded-full border-2 transition-all duration-300 overflow-hidden group ${activeCategory === category
                ? 'border-cyan-400 text-white shadow-lg'
                : 'border-gray-700 text-gray-400 hover:border-purple-500 hover:text-white'
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              {activeCategory === category && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20"
                  layoutId="activeCategory"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative z-10">{category.toUpperCase()}</span>
            </motion.button>
          ))}
        </motion.div>

        <div
          ref={containerRef}
          className="relative h-[600px] md:h-[800px] w-full rounded-3xl border-2 border-purple-500/30 bg-gradient-to-br from-[#0a0e14]/90 to-[#0d1117]/90 overflow-hidden shadow-2xl"
          style={{ transform: 'translateZ(0)' }} // Forces Hardware Acceleration
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none"
          />

          <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8">
            <div className="relative w-full h-full max-w-3xl max-h-3xl">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, type: "spring", stiffness: 100 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
              >
                <div className="relative w-28 h-28 md:w-40 md:h-40">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute inset-0 rounded-full border-2"
                      style={{ borderColor: ['#7e6ee3', '#00f0ff', '#ec4899'][i], opacity: 0.3 }}
                      animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                      transition={{
                        rotate: { duration: 10 + i * 5, repeat: Infinity, ease: "linear" },
                        scale: { duration: 3, repeat: Infinity, delay: i * 0.5 }
                      }}
                    />
                  ))}

                  <motion.div
                    className="absolute inset-4 md:inset-6 rounded-full flex items-center justify-center overflow-hidden"
                    style={{
                      background: 'radial-gradient(circle at 30% 30%, rgba(126, 110, 227, 0.6), rgba(0, 240, 255, 0.4), rgba(13, 17, 23, 0.9))',
                      boxShadow: '0 0 60px rgba(126, 110, 227, 0.6), inset 0 0 30px rgba(0, 240, 255, 0.3)'
                    }}
                    animate={{
                      boxShadow: [
                        '0 0 60px rgba(126, 110, 227, 0.6), inset 0 0 30px rgba(0, 240, 255, 0.3)',
                        '0 0 80px rgba(0, 240, 255, 0.8), inset 0 0 40px rgba(126, 110, 227, 0.4)',
                        '0 0 60px rgba(126, 110, 227, 0.6), inset 0 0 30px rgba(0, 240, 255, 0.3)',
                      ]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
                      <Cpu size={window.innerWidth < 768 ? 32 : 48} className="text-white drop-shadow-2xl" />
                    </motion.div>
                  </motion.div>

                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-purple-400"
                    animate={{ scale: [1, 1.5, 1.5], opacity: [0.6, 0, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </motion.div>

              {[0, 1, 2].map((i) => {
                const radii = isMobile ? [100, 180, 260] : [180, 300, 420];
                const radius = radii[i];

                return (
                  <motion.div
                    key={`orbit-${i}`}
                    className="absolute top-1/2 left-1/2 rounded-full border border-dashed pointer-events-none"
                    style={{
                      width: radius * 2,
                      height: radius * 2,
                      transform: 'translate(-50%, -50%)',
                      borderColor: ['#7e6ee350', '#00f0ff30', '#ec489930'][i],
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.2 }}
                  />
                );
              })}

              {filteredSkills.map((skill, index) => {
                const orbitIndex = index % 3;
                const radius = (isMobile ? [100, 180, 260] : [180, 300, 420])[orbitIndex];
                const skillsInOrbit = filteredSkills.filter((_, i) => i % 3 === orbitIndex).length;
                const indexInOrbit = Math.floor(index / 3);
                const angleOffset = (orbitIndex * Math.PI) / 3;
                const angle = (indexInOrbit / skillsInOrbit) * Math.PI * 2 + angleOffset;

                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                return (
                  <div
                    key={skill.name}
                    className="absolute"
                    style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
                  >
                    <SkillNode
                      skill={skill}
                      index={index}
                      isActive={activeCategory === 'All' || skill.category === activeCategory}
                      position={{ x, y }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="absolute top-4 left-4 flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-cyan-400"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              />
            ))}
          </div>
          <div className="absolute top-4 right-4 text-xs font-mono text-gray-500">
            [{filteredSkills.length} ACTIVE]
          </div>
        </div>

        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {[
            { label: 'TOTAL MODULES', value: '18', icon: Layers, color: '#7e6ee3' },
            { label: 'ACTIVE YEARS', value: '2.5', icon: Activity, color: '#00f0ff' },
            { label: 'DEPLOYMENTS', value: '17+', icon: Server, color: '#ec4899' },
            { label: 'CODE COMMITS', value: '1K+', icon: Terminal, color: '#10a37f' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="relative group"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700 p-6 backdrop-blur-xl overflow-hidden group-hover:border-purple-500/50 transition-all duration-300">
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  style={{ background: `radial-gradient(circle at center, ${stat.color}, transparent)` }}
                />

                <div className="relative z-10 flex flex-col items-center text-center">
                  <stat.icon size={24} style={{ color: stat.color }} className="mb-3" />
                  <div className="text-3xl font-bold font-mono mb-2" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">{stat.label}</div>
                </div>

                <div
                  className="absolute top-0 right-0 w-16 h-16 opacity-20"
                  style={{ background: `radial-gradient(circle at top right, ${stat.color}, transparent)` }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}