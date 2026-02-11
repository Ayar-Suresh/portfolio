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
  MessageSquare,
  Workflow,
  Activity,
  Cpu,
  Database,
  Shield
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

function SkillNode({ skill, index, isActive, position }: { skill: Skill; index: number; isActive: boolean; position: { x: number; y: number } }) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const Icon = skill.icon;
  const { x, y } = position;

  // Smart Positioning Logic
  const isBottom = y > 50; // slightly offset from center
  const isRight = x > 100; // far right
  const isLeft = x < -100; // far left

  // Base classes
  let popoverClasses = "absolute w-48 z-50 pointer-events-none mb-4 ";
  let originY = 0;

  // Vertical Position (Flip if too close to bottom/top)
  if (isBottom) {
    popoverClasses = popoverClasses.replace("mb-4", "mb-4 bottom-full"); // Show Above
    originY = 10;
  } else {
    popoverClasses = popoverClasses.replace("mb-4", "mt-4 top-full"); // Show Below
    originY = -10;
  }

  // Horizontal Position (Shift if too close to edge)
  if (isRight) {
    popoverClasses += "right-0 translate-x-4"; // Shift Left
  } else if (isLeft) {
    popoverClasses += "left-0 -translate-x-4"; // Shift Right
  } else {
    popoverClasses += "left-1/2 -translate-x-1/2"; // Center
  }

  return (
    <motion.div
      ref={nodeRef}
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: isActive ? 1 : 0.1, scale: isActive ? 1 : 0.8 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`absolute group ${isHovered ? 'z-50' : 'z-10'}`} // Elevate z-index on hover
      style={{
        x: '-50%',
        y: '-50%',
      }}
      data-cursor-hover
    >
      {/* Hexagonal Node Shape */}
      <div
        className={`relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center transition-all duration-300 ${isHovered ? 'scale-110' : ''}`}
      >
        {/* Hexagon Background */}
        <div
          className="absolute inset-0 bg-[#161b22] border border-[#30363d] clip-path-hexagon transition-colors duration-300 group-hover:border-[#00f0ff]/50 md:group-hover:bg-[#1f242c]"
          style={{
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            boxShadow: isHovered ? `0 0 20px ${skill.color}40` : 'none'
          }}
        />

        {/* Inner Glow */}
        <div
          className="absolute inset-1 bg-[#0d1117] clip-path-hexagon flex items-center justify-center"
          style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
        >
          <Icon size={24} color={skill.color} className={`transition-all duration-300 ${isHovered ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : ''}`} />
        </div>

        {/* Level Ring (Circular Pulse) */}
        {isHovered && (
          <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: skill.color }} />
        )}
      </div>

      {/* Label */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap z-20">
        <span className={`text-[10px] md:text-xs font-mono font-medium tracking-wider transition-colors duration-300 ${isHovered ? 'text-[#00f0ff]' : 'text-[#8b949e]'}`}>
          {skill.name.toUpperCase()}
        </span>
      </div>

      {/* Tech Spec Popover - Only on Hover */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: originY }}
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.9,
          y: isHovered ? 0 : originY,
        }}
        className={popoverClasses}
      >
        <div className="ide-panel p-3 bg-[#0d1117]/95 backdrop-blur-md border border-[#30363d] shadow-2xl relative">
          {/* Connector Line Logic based on position */}
          {isBottom ? (
            <div className={`absolute -bottom-4 w-[1px] h-4 bg-[#30363d] ${isRight ? 'right-4' : isLeft ? 'left-4' : 'left-1/2 -translate-x-1/2'}`} />
          ) : (
            <div className={`absolute -top-4 w-[1px] h-4 bg-[#30363d] ${isRight ? 'right-4' : isLeft ? 'left-4' : 'left-1/2 -translate-x-1/2'}`} />
          )}

          <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#30363d]">
            <span className="text-[10px] text-[#8b949e] font-mono">SYS.MODULE</span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#2ea043] animate-pulse" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#00f0ff]">Load</span>
              <span className="text-white">{skill.level}%</span>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-[#161b22] rounded-full overflow-hidden border border-[#30363d]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${skill.level}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-[#7e6ee3] to-[#00f0ff]"
              />
            </div>

            <div className="text-[10px] text-[#8b949e] font-mono leading-tight mt-1">
              {'>'} {skill.description}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function SkillsGalaxy() {
  const [activeCategory, setActiveCategory] = useState('All');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Animated connections canvas (Cyberpunk Grid)
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

      time += 0.05;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;

      // Draw Grid Background
      ctx.strokeStyle = '#1e2329'; // Very subtle grid color
      ctx.lineWidth = 1;
      const gridSize = 40;

      // Vertical Lines (Perspective effect)
      ctx.beginPath();
      for (let x = 0; x <= width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y <= height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Scanline Effect
      const scanY = (time * 50) % height;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(width, scanY);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.1)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Rotating Radar Line
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      const radarAngle = time * 0.02;
      const rx = cx + Math.cos(radarAngle) * Math.max(width, height);
      const ry = cy + Math.sin(radarAngle) * Math.max(width, height);
      ctx.lineTo(rx, ry);

      const gradient = ctx.createLinearGradient(cx, cy, rx, ry);
      gradient.addColorStop(0, 'rgba(126, 110, 227, 0)');
      gradient.addColorStop(1, 'rgba(126, 110, 227, 0.1)');
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 50; // Wide beam look
      ctx.stroke();

      // Central Hub Pulse
      ctx.beginPath();
      ctx.arc(cx, cy, 50 + Math.sin(time * 0.1) * 5, 0, Math.PI * 2);
      ctx.strokeStyle = '#7e6ee3';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
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
    <section id="skills" className="relative py-24 overflow-hidden bg-[#0d1117]">
      {/* Background Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(48,54,61,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(48,54,61,0.2)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161b22] border border-[#30363d] text-[#00f0ff] font-mono text-xs mb-4">
            <Activity size={12} className="animate-pulse" />
            <span>SYSTEM_DIAGNOSTICS</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold mb-6 font-mono">
            Tech <span className="gradient-text">Matrix</span>
          </h2>
          <p className="text-[#8b949e] text-lg max-w-2xl mx-auto font-mono">
            // Core competencies and active modules.<br />
            // Hover nodes for detailed status.
          </p>
        </motion.div>

        {/* Category Filter - Terminal Tabs Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-16"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 text-xs font-mono border transition-all duration-300 ${activeCategory === category
                ? 'bg-[#161b22] border-[#00f0ff] text-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                : 'bg-transparent border-[#30363d] text-[#8b949e] hover:border-[#8b949e] hover:text-white'
                }`}
              data-cursor-hover
            >
              [{category.toUpperCase()}]
            </button>
          ))}
        </motion.div>

        {/* Skills Constellation Container */}
        <div ref={containerRef} className="relative h-[500px] md:h-[600px] w-full border-y border-[#30363d] bg-[#0d1117]/50 backdrop-blur-sm">
          {/* Canvas for connections */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none"
          />

          {/* Skill Nodes */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full max-w-2xl max-h-2xl">
              {/* Center Hub */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
              >
                <div className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center relative">
                  <div className="absolute inset-0 border-2 border-[#7e6ee3] rounded-full animate-[spin_10s_linear_infinite]" />
                  <div className="absolute inset-2 border border-[#00f0ff] rounded-full animate-[spin_15s_linear_infinite_reverse] opacity-50" />
                  <div className="w-16 h-16 rounded-full bg-[#161b22] border border-[#30363d] flex items-center justify-center shadow-[0_0_30px_rgba(126,110,227,0.3)]">
                    <Cpu size={32} className="text-[#00f0ff]" />
                  </div>

                  {/* Data streams radiating out */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full animate-ping opacity-10 bg-[#7e6ee3] rounded-full -z-10" />
                </div>
              </motion.div>

              {/* Orbital nodes Layout - Spiraling out */}
              {filteredSkills.map((skill, index) => {
                const total = filteredSkills.length;
                const angle = (index / total) * Math.PI * 2;
                // Spiral effect: radius increases slightly with index to prevent perfect circle look
                const spiralOffset = (index % 2 === 0 ? 0 : 40);
                const radius = 160 + spiralOffset + (window.innerWidth < 768 ? -60 : 60);

                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                return (
                  <div
                    key={skill.name}
                    className="absolute"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                    }}
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
        </div>

        {/* System Stats Footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#30363d] mt-16 border border-[#30363d] max-w-4xl mx-auto">
          {[
            { label: 'MODULES', value: '18 ACTIVE' },
            { label: 'UPTIME', value: '2.5 YRS' },
            { label: 'DEPLOYMENTS', value: '17 TOTAL' },
            { label: 'COMMITS', value: '1K+ LOGGED' },
          ].map((stat, i) => (
            <div key={i} className="bg-[#0d1117] p-4 text-center group hover:bg-[#161b22] transition-colors">
              <div className="text-lg font-bold text-[#e2e8f0] font-mono group-hover:text-[#00f0ff] transition-colors">{stat.value}</div>
              <div className="text-[10px] text-[#8b949e] font-mono tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

