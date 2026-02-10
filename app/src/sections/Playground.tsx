import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Play, 
  Pause, 
  RefreshCw,
  Copy,
  Check,
  Terminal,
  Palette,
  Type,
  Box
} from 'lucide-react';

// Particle Flow Demo
function ParticleFlowDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: { x: number; y: number; vx: number; vy: number; size: number }[] = [];
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
      });
    }

    let time = 0;
    const animate = () => {
      if (!isPlaying) return;
      time += 0.01;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx + Math.sin(time + i) * 0.5;
        p.y += p.vy + Math.cos(time + i) * 0.5;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${260 + Math.sin(time + i) * 40}, 70%, 60%)`;
        ctx.fill();

        // Connect nearby particles
        particles.slice(i + 1).forEach((p2) => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(126, 110, 227, ${0.3 * (1 - dist / 80)})`;
            ctx.stroke();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <div className="space-y-4">
      <canvas
        ref={canvasRef}
        className="w-full h-48 rounded-lg bg-black/50"
      />
      <div className="flex gap-2">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center gap-2 px-4 py-2 glass rounded-lg text-sm hover:bg-white/10 transition-colors"
          data-cursor-hover
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button
          onClick={() => setIsPlaying(true)}
          className="flex items-center gap-2 px-4 py-2 glass rounded-lg text-sm hover:bg-white/10 transition-colors"
          data-cursor-hover
        >
          <RefreshCw size={14} />
          Reset
        </button>
      </div>
    </div>
  );
}

// Typewriter Effect Demo
function TypewriterDemo() {
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const fullText = 'Hello, World! Welcome to my portfolio.';

  useEffect(() => {
    if (!isTyping) return;

    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setText(fullText.slice(0, index));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isTyping]);

  return (
    <div className="space-y-4">
      <div className="h-48 rounded-lg bg-black/50 p-4 font-mono text-sm flex items-center">
        <span className="text-[#00f0ff]">{text}</span>
        <span className="w-2 h-4 bg-[#00f0ff] ml-1 animate-pulse" />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => { setText(''); setIsTyping(true); }}
          className="flex items-center gap-2 px-4 py-2 glass rounded-lg text-sm hover:bg-white/10 transition-colors"
          data-cursor-hover
        >
          <Play size={14} />
          Type
        </button>
        <button
          onClick={() => { setText(''); setIsTyping(false); }}
          className="flex items-center gap-2 px-4 py-2 glass rounded-lg text-sm hover:bg-white/10 transition-colors"
          data-cursor-hover
        >
          <RefreshCw size={14} />
          Clear
        </button>
      </div>
    </div>
  );
}

// Gradient Generator Demo
function GradientDemo() {
  const [hue1, setHue1] = useState(260);
  const [hue2, setHue2] = useState(220);
  const [angle, setAngle] = useState(135);
  const [copied, setCopied] = useState(false);

  const gradientCSS = `linear-gradient(${angle}deg, hsl(${hue1}, 70%, 60%), hsl(${hue2}, 70%, 60%))`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`background: ${gradientCSS};`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div
        className="h-48 rounded-lg transition-all duration-300"
        style={{ background: gradientCSS }}
      />
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/50 w-12">Color 1</span>
          <input
            type="range"
            min="0"
            max="360"
            value={hue1}
            onChange={(e) => setHue1(Number(e.target.value))}
            className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, hsl(0, 70%, 60%), hsl(360, 70%, 60%))` }}
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/50 w-12">Color 2</span>
          <input
            type="range"
            min="0"
            max="360"
            value={hue2}
            onChange={(e) => setHue2(Number(e.target.value))}
            className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, hsl(0, 70%, 60%), hsl(360, 70%, 60%))` }}
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/50 w-12">Angle</span>
          <input
            type="range"
            min="0"
            max="360"
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
            className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <button
          onClick={copyToClipboard}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 glass rounded-lg text-sm hover:bg-white/10 transition-colors"
          data-cursor-hover
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          {copied ? 'Copied!' : 'Copy CSS'}
        </button>
      </div>
    </div>
  );
}

// 3D Card Flip Demo
function CardFlipDemo() {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-4">
      <div className="h-48 flex items-center justify-center perspective-1000">
        <div
          ref={cardRef}
          onClick={() => setIsFlipped(!isFlipped)}
          className="relative w-32 h-40 cursor-pointer preserve-3d transition-transform duration-500"
          style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
          data-cursor-hover
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden rounded-xl bg-gradient-to-br from-[#7e6ee3] to-[#5b6ee3] flex items-center justify-center">
            <span className="text-4xl">🎴</span>
          </div>
          {/* Back */}
          <div 
            className="absolute inset-0 backface-hidden rounded-xl glass flex items-center justify-center"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <span className="text-4xl">⭐</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 glass rounded-lg text-sm hover:bg-white/10 transition-colors"
          data-cursor-hover
        >
          <RefreshCw size={14} />
          Flip Card
        </button>
      </div>
    </div>
  );
}

const demos = [
  {
    id: 'particles',
    title: 'Particle Flow',
    description: 'Interactive particle system with connections',
    icon: Sparkles,
    component: ParticleFlowDemo,
    color: '#7e6ee3',
  },
  {
    id: 'typewriter',
    title: 'Typewriter Effect',
    description: 'Animated text typing simulation',
    icon: Type,
    component: TypewriterDemo,
    color: '#00f0ff',
  },
  {
    id: 'gradient',
    title: 'Gradient Generator',
    description: 'Create and copy CSS gradients',
    icon: Palette,
    component: GradientDemo,
    color: '#ff6b6b',
  },
  {
    id: 'cardflip',
    title: '3D Card Flip',
    description: 'CSS 3D transforms showcase',
    icon: Box,
    component: CardFlipDemo,
    color: '#10b981',
  },
];

export function Playground() {
  return (
    <section id="playground" className="relative py-24 overflow-hidden">
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
            Interactive Demos
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Experimental <span className="gradient-text">Playground</span>
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            A collection of interactive experiments and creative coding demos. 
            Play around and get inspired!
          </p>
        </motion.div>

        {/* Demo Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {demos.map((demo, index) => {
            const DemoComponent = demo.component;
            const Icon = demo.icon;

            return (
              <motion.div
                key={demo.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass rounded-2xl p-6 hover:bg-white/5 transition-all duration-300"
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${demo.color}20` }}
                  >
                    <Icon size={20} style={{ color: demo.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{demo.title}</h3>
                    <p className="text-sm text-white/50">{demo.description}</p>
                  </div>
                </div>

                {/* Demo Content */}
                <DemoComponent />
              </motion.div>
            );
          })}
        </div>

        {/* Code Snippet Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12"
        >
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Terminal size={20} className="text-[#00f0ff]" />
              <h3 className="font-semibold text-white">Featured Code Snippet</h3>
            </div>
            <div className="relative">
              <pre className="p-4 rounded-lg bg-black/50 overflow-x-auto text-sm font-mono">
                <code className="text-white/80">
                  <span className="text-purple-400">const</span>{' '}
                  <span className="text-blue-400">createAnimation</span>{' '}
                  <span className="text-white">=</span>{' '}
                  <span className="text-purple-400">async</span>{' '}
                  <span className="text-white">()</span>{' '}
                  <span className="text-purple-400">=&gt;</span>{' '}
                  <span className="text-white">{'{'}</span>{'\n'}
                  {'  '}<span className="text-purple-400">const</span>{' '}
                  <span className="text-white">element</span>{' '}
                  <span className="text-white">=</span>{' '}
                  <span className="text-white">await</span>{' '}
                  <span className="text-blue-400">select</span>
                  <span className="text-white">(</span>
                  <span className="text-green-400">&apos;.target&apos;</span>
                  <span className="text-white">);</span>{'\n'}
                  {'\n'}
                  {'  '}<span className="text-white">gsap.</span>
                  <span className="text-blue-400">to</span>
                  <span className="text-white">(element, {'{'}</span>{'\n'}
                  {'    '}<span className="text-white">opacity:</span>{' '}
                  <span className="text-orange-400">1</span>
                  <span className="text-white">,</span>{'\n'}
                  {'    '}<span className="text-white">y:</span>{' '}
                  <span className="text-orange-400">0</span>
                  <span className="text-white">,</span>{'\n'}
                  {'    '}<span className="text-white">duration:</span>{' '}
                  <span className="text-orange-400">0.6</span>
                  <span className="text-white">,</span>{'\n'}
                  {'    '}<span className="text-white">ease:</span>{' '}
                  <span className="text-green-400">&apos;power2.out&apos;</span>
                  <span className="text-white">,</span>{'\n'}
                  {'  '}{'}'});
                  <span className="text-white">;</span>{'\n'}
                  <span className="text-white">{'}'};</span>
                </code>
              </pre>
              <button
                onClick={() => {}}
                className="absolute top-2 right-2 p-2 glass rounded-lg hover:bg-white/10 transition-colors"
                data-cursor-hover
              >
                <Copy size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
