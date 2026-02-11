import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Code2,
  Server,
  Palette,
  Layers,
  Terminal,
  Smartphone,
  Bot,
  Sparkles,
  MessageSquare,
  Workflow,
  Wifi,
  Activity
} from 'lucide-react';

interface Skill {
  name: string;
  icon: React.ComponentType<{ size?: number; color?: string; className?: string }>;
  level: number;
  category: string;
  color: string;
  description?: string;
}

const skills: Skill[] = [
  // Frontend
  { name: 'React', icon: Code2, level: 95, category: 'Frontend', color: '#61dafb', description: 'Modern UI development' },
  { name: 'TypeScript', icon: Terminal, level: 92, category: 'Frontend', color: '#3178c6', description: 'Type-safe code' },
  { name: 'Next.js', icon: Layers, level: 88, category: 'Frontend', color: '#ffffff', description: 'Full-stack solutions' },
  { name: 'Tailwind CSS', icon: Palette, level: 95, category: 'Frontend', color: '#38bdf8', description: 'Rapid layout styling' },

  // App Development
  { name: 'Flutter', icon: Smartphone, level: 90, category: 'App Dev', color: '#42a5f5', description: 'Cross-platform apps' },
  { name: 'Dart', icon: Terminal, level: 85, category: 'App Dev', color: '#0175c2', description: 'App logic & optimized UI' },

  // AI Integration
  { name: 'OpenAI API', icon: Bot, level: 85, category: 'AI Integration', color: '#10a37f', description: 'AI integration into real-world applications' },
  { name: 'AI Features', icon: Sparkles, level: 82, category: 'AI Integration', color: '#a855f7', description: 'AI integration into real-world applications' },
  { name: 'Prompt Eng', icon: MessageSquare, level: 88, category: 'AI Integration', color: '#ec4899', description: 'AI integration into real-world applications' },
  { name: 'Automation', icon: Workflow, level: 80, category: 'AI Integration', color: '#f43f5e', description: 'AI integration into real-world applications' },

  // Programming
  { name: 'Python', icon: Terminal, level: 85, category: 'Programming', color: '#f59e0b', description: 'Scripting & backend logic' },
  { name: 'C', icon: Code2, level: 75, category: 'Programming', color: '#9ca3af', description: 'Systems programming' },
  { name: 'C++', icon: Code2, level: 78, category: 'Programming', color: '#00599c', description: 'Performance critical code' },
  { name: 'Java', icon: Code2, level: 80, category: 'Programming', color: '#b07219', description: 'Enterprise applications' },

  // Networking & Systems
  { name: 'Net T-shoot', icon: Wifi, level: 80, category: 'Networking', color: '#10b981', description: 'Network troubleshooting' },
  { name: 'Infrastructure', icon: Server, level: 75, category: 'Networking', color: '#3b82f6', description: 'System infrastructure support' },
  { name: 'Diagnostics', icon: Activity, level: 78, category: 'Networking', color: '#ef4444', description: 'System diagnostics & health' },
];

const categories = ['All', 'Frontend', 'App Dev', 'AI Integration', 'Programming', 'Networking'];

function SkillNode({ skill, index, isActive }: { skill: Skill; index: number; isActive: boolean }) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const Icon = skill.icon;

  return (
    <motion.div
      ref={nodeRef}
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: isActive ? 1 : 0.3, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group"
      data-cursor-hover
    >
      {/* Glow effect */}
      <div
        className={`absolute inset-0 rounded-full blur-xl transition-opacity duration-300 ${isHovered ? 'opacity-60' : 'opacity-0'
          }`}
        style={{ backgroundColor: skill.color }}
      />

      {/* Node */}
      <div
        className={`relative w-14 h-14 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all duration-300 ${isHovered ? 'scale-110' : ''
          }`}
        style={{
          background: `linear-gradient(135deg, ${skill.color}20, ${skill.color}10)`,
          border: `2px solid ${isHovered ? skill.color : skill.color + '40'}`,
          boxShadow: isHovered ? `0 0 30px ${skill.color}40` : 'none',
        }}
      >
        <Icon size={20} className="md:w-7 md:h-7" color={skill.color} />
      </div>

      {/* Label */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <span className="text-xs text-white/70 font-medium">{skill.name}</span>
      </div>

      {/* Hover Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.8,
          y: isHovered ? 0 : 10,
        }}
        className="absolute -top-36 left-1/2 -translate-x-1/2 w-56 z-20 pointer-events-none"
      >
        <div className="glass-strong rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon size={16} color={skill.color} />
            <span className="font-semibold text-white">{skill.name}</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-white/60">
              <span>Proficiency</span>
              <span>{skill.level}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${skill.level}%` }}
                transition={{ duration: 1, delay: 0.2 }}
                className="h-full rounded-full"
                style={{ backgroundColor: skill.color }}
              />
            </div>
          </div>
          <div className="mt-2 text-xs text-white/40 font-medium">
            {skill.category}
          </div>
          {skill.description && (
            <div className="mt-1 text-xs text-white/60 italic border-t border-white/10 pt-1">
              {skill.description}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function SkillsGalaxy() {
  const [activeCategory, setActiveCategory] = useState('All');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Animated connections canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let animationId: number;
    let time = 0;
    let isVisible = false;

    // Use IntersectionObserver to start/stop animation
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(container);

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (!isVisible) return;

      time += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw constellation lines
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) * 0.35;

      // Draw orbital rings
      for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * (i / 3), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(126, 110, 227, ${0.05 * i})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw connecting lines between random points
      const numLines = 8;
      for (let i = 0; i < numLines; i++) {
        const angle1 = (i / numLines) * Math.PI * 2 + time * 0.2;
        const angle2 = ((i + 2) / numLines) * Math.PI * 2 + time * 0.15;

        const x1 = centerX + Math.cos(angle1) * radius * 0.8;
        const y1 = centerY + Math.sin(angle1) * radius * 0.8;
        const x2 = centerX + Math.cos(angle2) * radius * 0.6;
        const y2 = centerY + Math.sin(angle2) * radius * 0.6;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(126, 110, 227, ${0.2 + Math.sin(time + i) * 0.1})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw glowing dots at endpoints
        ctx.beginPath();
        ctx.arc(x1, y1, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 240, 255, 0.6)';
        ctx.fill();
      }
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
      observer.disconnect();
    };
  }, []);

  const filteredSkills = activeCategory === 'All'
    ? skills
    : skills.filter(s => s.category === activeCategory);

  return (
    <section id="skills" className="relative py-24 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#7e6ee3] text-sm font-medium uppercase tracking-wider mb-4 block">
            My Expertise
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Skills <span className="gradient-text">Galaxy</span>
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            A constellation of technologies I work with. Hover over each node to explore my proficiency.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === category
                ? 'bg-gradient-to-r from-[#7e6ee3] to-[#5b6ee3] text-white shadow-lg shadow-[#7e6ee3]/30'
                : 'glass text-white/70 hover:text-white hover:bg-white/10'
                }`}
              data-cursor-hover
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Skills Constellation */}
        <div ref={containerRef} className="relative h-[400px] md:h-[500px]">
          {/* Canvas for connections */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none"
          />

          {/* Skill Nodes */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full max-w-md max-h-md">
              {/* Center node */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-r from-[#7e6ee3] to-[#5b6ee3] flex items-center justify-center glow-purple">
                  <Code2 size={40} className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
              </motion.div>

              {/* Orbital nodes */}
              {filteredSkills.map((skill, index) => {
                const angle = (index / filteredSkills.length) * Math.PI * 2 - Math.PI / 2;
                const radius = 180;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                return (
                  <div
                    key={skill.name}
                    className="absolute top-1/2 left-1/2"
                    style={{
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                    }}
                  >
                    <SkillNode
                      skill={skill}
                      index={index}
                      isActive={activeCategory === 'All' || skill.category === activeCategory}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
        >
          {[
            { label: 'Technologies', value: '10+' },
            { label: 'Years Experience', value: '2.5+' },
            { label: 'Projects Completed', value: '17+' },
            { label: 'Code Commits', value: '1K+' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">{stat.value}</div>
              <div className="text-sm text-white/60">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

