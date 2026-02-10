import { motion } from 'framer-motion';
import { Heart, Code, Terminal } from 'lucide-react';
import { useState, useEffect } from 'react';

interface DebugPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

function DebugPanel({ isOpen, onClose }: DebugPanelProps) {
  const [fps, setFps] = useState(60);
  const quotes = [
    "It's not a bug, it's a feature.",
    "Works on my machine.",
    "Have you tried turning it off and on again?",
    "console.log('everything is fine')",
    "Ship it! 🚀",
    "404: Sleep not found",
    "There are 10 types of people...",
    "git commit -m 'fix stuff'",
  ];
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    // Simulate FPS counter
    const fpsInterval = setInterval(() => {
      setFps(Math.floor(58 + Math.random() * 4));
    }, 500);

    // Rotate quotes
    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 5000);

    return () => {
      clearInterval(fpsInterval);
      clearInterval(quoteInterval);
    };
  }, [isOpen, quotes.length]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="fixed bottom-20 right-6 w-80 glass-strong rounded-xl p-4 z-50"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-[#00f0ff]" />
          <span className="text-sm font-mono text-white/80">Debug Console</span>
        </div>
        <button
          onClick={onClose}
          className="text-white/50 hover:text-white transition-colors"
          data-cursor-hover
        >
          ×
        </button>
      </div>

      <div className="space-y-3 font-mono text-xs">
        <div className="flex justify-between">
          <span className="text-white/50">FPS:</span>
          <span className={fps >= 60 ? 'text-green-400' : fps >= 30 ? 'text-yellow-400' : 'text-red-400'}>
            {fps}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/50">Renderer:</span>
          <span className="text-white/80">WebGL 2.0</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/50">Particles:</span>
          <span className="text-white/80">120 active</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/50">Animations:</span>
          <span className="text-white/80">GSAP + Framer</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/50">Cursor:</span>
          <span className="text-white/80">Custom (magnetic)</span>
        </div>

        <div className="border-t border-white/10 pt-3 mt-3">
          <p className="text-white/40 italic">&ldquo;{quotes[currentQuote]}&rdquo;</p>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={() => { }}
            className="flex-1 px-3 py-2 bg-white/5 rounded-lg text-white/70 hover:bg-white/10 transition-colors"
            data-cursor-hover
          >
            Toggle Particles
          </button>
          <button
            onClick={() => { }}
            className="flex-1 px-3 py-2 bg-white/5 rounded-lg text-white/70 hover:bg-white/10 transition-colors"
            data-cursor-hover
          >
            Matrix Mode
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function Footer() {
  const [debugOpen, setDebugOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Debug panel toggle
      if (e.key === '`' || e.key === '~') {
        setDebugOpen((prev) => !prev);
        return;
      }

      // Konami code detection
      if (e.key === 'ArrowUp') {
        // Simple easter egg - just check for the key
        if (e.shiftKey && e.ctrlKey) {
          // Trigger confetti
          const colors = ['#7e6ee3', '#5b6ee3', '#00f0ff', '#ff00aa', '#10b981'];
          for (let i = 0; i < 50; i++) {
            setTimeout(() => {
              const el = document.createElement('div');
              el.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                left: 50%;
                top: 50%;
                pointer-events: none;
                z-index: 9999;
              `;
              document.body.appendChild(el);

              const angle = (Math.random() * Math.PI * 2);
              const velocity = 10 + Math.random() * 20;
              let x = 0, y = 0;
              let vx = Math.cos(angle) * velocity;
              let vy = Math.sin(angle) * velocity;

              const animate = () => {
                x += vx;
                y += vy;
                vy += 0.5;
                el.style.transform = `translate(${x}px, ${y}px)`;
                el.style.opacity = String(1 - Math.abs(y) / 500);

                if (Math.abs(y) < 500) {
                  requestAnimationFrame(animate);
                } else {
                  el.remove();
                }
              };
              animate();
            }, i * 30);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <footer className="relative py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-2"
            >
              <Code size={20} className="text-[#7e6ee3]" />
              <span className="text-lg font-bold gradient-text">Ayar.dev</span>
            </motion.div>

            {/* Copyright */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-sm text-white/50 flex items-center gap-1"
            >
              Made with <Heart size={14} className="text-red-500 fill-red-500" /> by Ayar Suresh
            </motion.p>

            {/* Easter Egg Hint */}
            <motion.button
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              onClick={() => setDebugOpen(true)}
              className="text-xs text-white/30 hover:text-white/50 transition-colors font-mono"
              data-cursor-hover
            >
              Press ~ for debug
            </motion.button>
          </div>
        </div>
      </footer>

      {/* Debug Panel */}
      <DebugPanel isOpen={debugOpen} onClose={() => setDebugOpen(false)} />
    </>
  );
}
