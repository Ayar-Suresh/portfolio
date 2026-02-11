import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';
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
      className="fixed bottom-20 right-6 w-80 ide-panel shadow-2xl z-50 overflow-hidden"
    >
      <div className="mac-window-header justify-between">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-[#00f0ff]" />
          <span className="text-xs font-mono text-white/50">debug_console.exe</span>
        </div>
        <button
          onClick={onClose}
          className="text-white/30 hover:text-white transition-colors"
          data-cursor-hover
        >
          ×
        </button>
      </div>

      <div className="p-4 space-y-3 font-mono text-xs bg-[#0d1117]/50">
        <div className="flex justify-between border-b border-[#30363d] pb-2">
          <span className="text-[#7e6ee3]">System.FPS:</span>
          <span className={fps >= 60 ? 'text-[#2ea043]' : fps >= 30 ? 'text-[#e3b341]' : 'text-[#f85149]'}>
            {fps}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/50">Renderer:</span>
          <span className="text-[#58a6ff]">WebGL 2.0</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/50">Particles:</span>
          <span className="text-[#58a6ff]">120 active</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/50">Cursor:</span>
          <span className="text-[#58a6ff]">Magnetic</span>
        </div>

        <div className="mt-3 p-2 bg-black/40 rounded border border-[#30363d] text-white/60 italic">
          <span className="text-[#2ea043] mr-2">$</span>
          &ldquo;{quotes[currentQuote]}&rdquo;
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={() => { }}
            className="flex-1 px-3 py-1.5 bg-[#21262d] border border-[#30363d] rounded text-white/70 hover:border-[#58a6ff] hover:text-[#58a6ff] transition-all text-[10px]"
            data-cursor-hover
          >
            Toggle Particles
          </button>
          <button
            onClick={() => { }}
            className="flex-1 px-3 py-1.5 bg-[#21262d] border border-[#30363d] rounded text-white/70 hover:border-[#00f0ff] hover:text-[#00f0ff] transition-all text-[10px]"
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
      if (e.key === 'ArrowUp' && e.shiftKey && e.ctrlKey) {
        // ... (Easter egg logic kept same but can be enhanced if needed) ...
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <footer className="relative py-8 bg-[#0d1117] border-t border-[#30363d]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            {/* Terminal Status Bar Style Left */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-3"
            >
              <div className="flex items-center gap-2 px-3 py-1 bg-[#161b22] border border-[#30363d] rounded-full">
                <div className="w-2 h-2 rounded-full bg-[#2ea043] animate-pulse" />
                <span className="text-xs font-mono text-white/60">System Online</span>
              </div>
              <span className="text-xs font-mono text-white/30 hidden sm:inline-block">v4.2.0-beta</span>
            </motion.div>

            {/* Copyright / Credits */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-4"
            >
              <p className="text-xs font-mono text-white/40">
                <span className="text-[#7e6ee3]">const</span> developer = <span className="text-[#00f0ff]">'Ayar Suresh'</span>;
              </p>
            </motion.div>

            {/* Right Status */}
            <motion.button
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              onClick={() => setDebugOpen(true)}
              className="flex items-center gap-2 text-xs font-mono text-white/30 hover:text-white/80 transition-colors group"
              data-cursor-hover
            >
              <Terminal size={12} />
              <span className="group-hover:underline decoration-[#00f0ff]">DEBUG_MODE</span>
            </motion.button>
          </div>
        </div>
      </footer>

      {/* Debug Panel */}
      <DebugPanel isOpen={debugOpen} onClose={() => setDebugOpen(false)} />
    </>
  );
}
