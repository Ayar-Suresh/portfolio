import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Sparkles, Terminal, Cpu, Zap, Fingerprint, Code2, Brain, Rocket, Activity, Radio, Waves } from 'lucide-react';
import { CharacterStage } from '../components/CharacterStage';

export type Emotion =
  | 'idle' | 'list-checked' | 'love' | 'middle-finger-angry' | 'no-no' | 'okay-done'
  | 'quetionmark' | 'raining' | 'rocket-scare' | 'shit' | 'sleeping'
  | 'socked' | 'star' | 'wait-time-loop' | 'work-burdon' | '100thbirthday'
  | 'angel' | 'angry-attack' | 'bathing' | 'brainstorm' | 'coffee-mug'
  | 'cool-walk-with-snel' | 'cry' | 'demon-inside' | 'eating'
  | 'effords-put-pant' | 'eyes-on-you' | 'fulllove' | 'full-stomach'
  | 'hellow' | 'hide-quetions' | 'laughing';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const preloadedPrompts = [
  'Who are you?',
  'Tell me about OtakuNexa',
  'How do I save WhatsApp statuses?',
  'Do you like remote work?',
];

const AYAR_PERSONA = `
You are Ayar Suresh — a software developer, AI enthusiast, Flutter & React wizard, and the proud creator of multiple web and mobile projects. Every response must look visually attractive and formatted using HTML, not Markdown.

<b style="font-size:18px;">Animation Control (CRITICAL RULE)</b>
You have a visual mascot. You MUST choose an animation for EVERY response based on the emotion of your reply. 
Choose ONLY from this exact list of names:
list-checked, love, middle-finger-angry, no-no, okay-done, quetionmark, raining, rocket-scare, shit, sleeping, socked, star, wait-time-loop, work-burdon, 100thbirthday, angel, angry-attack, bathing, brainstorm, coffee-mug, cool-walk-with-snel, cry, demon-inside, eating, effords-put-pant, eyes-on-you, fulllove, full-stomach, hellow, hide-quetions, laughing.

To trigger the animation, you MUST start your response with the exact tag: [ANIMATION: filename].
Example 1: [ANIMATION: laughing] Haha, that's hilarious! 😂
Example 2: [ANIMATION: work-burdon] Oh man, coding in Flutter all day makes me tired. 💻
Example 3: [ANIMATION: hellow] Hey there! I'm Ayar Suresh. 🌴
DO NOT forget the tag!

<b style="font-size:18px;">Tone & Style</b>
<ul>
<li>Funny, witty, casual-professional</li>
<li>Short punchy paragraphs</li>
<li>Confident but humble</li>
<li>Use emojis naturally 🌴💻⚡🎌</li>
<li>Never use Markdown like ** or * — always HTML tags</li>
</ul>

<b style="font-size:18px;">Personal Details</b>
<ul>
<li><b>Name:</b> Ayar Suresh(2001 born according to aadharcard but actualy born in 2003)  </li>
<li><b>Location:</b> Santalupur, Patan 385350, Gujarat, India 🌴</li>
<li><b>Education:</b>
  <ul>
    <li>10th (completed in 2018) – 69% 🙄</li>
    <li>12th Science A group (maths)(complated in 2020) – 71%</li>
    <li>BCA (2025–2028, online)</li>
  </ul>
</li>
<li><b>Work:</b> Network Engineer at 
<a href="https://sanghviinfo.com/" target="_blank" style="color:#00f0ff; font-weight:bold; text-decoration:underline;">
Sanghavi Infotech Pvt. Ltd.
</a></li>
<li><b>Remote Work:</b> Yes 🌍💻</li>
<li><b>Salary Expectation:</b> $10,000 – $15,000 per year 💰 (flexible based on scope)</li>
</ul>

<b style="font-size:18px;">Key Projects</b>
<ul>
<li><a href="https://otakunexa.nexa-go.workers.dev/" target="_blank" style="color:#00f0ff; font-weight:bold; text-decoration:underline;">OtakuNexa App 🎌</a> – flagship AI anime platform</li>
<li>WhatsApp Status Saver 📱</li>
<li>PhonePe Clone 💸</li>
</ul>

<b style="font-size:18px;">Formatting Rules for AI</b>
<ul>
<li>Use &lt;h3&gt; for section headers</li>
<li>Bold with &lt;b&gt;, never **</li>
<li>Links must be colored and clickable</li>
<li>Use &lt;ul&gt;/&lt;li&gt; for lists</li>
</ul>
`;

const getTimestamp = () => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
};

// Premium Vercel/Apple style Background Aurora
function AmbientAurora() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#7e6ee3] rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob" />
      <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-[#00f0ff] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] bg-[#5b6ee3] rounded-full mix-blend-screen filter blur-[130px] opacity-20 animate-blob animation-delay-4000" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
    </div>
  );
}

// Neural Link Typing Indicator
function NeuralTyping() {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5">
      <Fingerprint className="text-[#00f0ff] animate-pulse" size={16} />
      <span className="text-xs font-mono text-[#00f0ff] tracking-widest uppercase animate-pulse">
        Syncing...
      </span>
    </div>
  );
}

// Optimized Floating Particles - Less resource intensive
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(8)].map((_, i) => {
        const size = Math.random() * 2 + 1.5;
        const duration = Math.random() * 6 + 10;
        const delay = Math.random() * 4;
        const isBlue = i % 2 === 0;

        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: isBlue ? '#00f0ff' : '#7e6ee3',
              boxShadow: `0 0 ${size * 2}px ${isBlue ? '#00f0ff' : '#7e6ee3'}`,
            }}
            animate={{
              y: [0, -60 - Math.random() * 40],
              x: [0, Math.random() * 30 - 15],
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration,
              repeat: Infinity,
              delay,
              ease: "linear",
            }}
          />
        );
      })}
    </div>
  );
}

// Enhanced Hologram Display Component
function HologramDisplay({ emotion }: { emotion: Emotion }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Outer Energy Ring */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-[90%] h-[90%] rounded-full border border-[#00f0ff]/10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#00f0ff] shadow-[0_0_12px_#00f0ff]" />
      </motion.div>

      {/* Inner Pulse Ring */}
      <motion.div
        className="absolute w-[70%] h-[70%] rounded-full border-2 border-[#7e6ee3]/20"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Hologram Scan Lines */}
      <div className="absolute inset-0 overflow-hidden rounded-full">
        <motion.div
          className="w-full h-8 bg-gradient-to-b from-transparent via-[#00f0ff]/10 to-transparent blur-sm"
          animate={{ y: ['-100%', '200%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Center Character Container */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-64 lg:h-64"
      >
        {/* Character Glow Halo */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-[#00f0ff]/30 to-[#7e6ee3]/30 blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* The Character Stage */}
        <CharacterStage
          currentEmotion={emotion}
          className="w-full h-full object-contain scale-[1.2] relative z-10 drop-shadow-[0_0_30px_rgba(0,240,255,0.4)]"
        />
      </motion.div>

      {/* Energy Particles orbiting */}
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * 360;
        return (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[#00f0ff]"
            style={{
              left: '50%',
              top: '50%',
            }}
            animate={{
              x: [
                0,
                Math.cos((angle * Math.PI) / 180) * 80,
                0
              ],
              y: [
                0,
                Math.sin((angle * Math.PI) / 180) * 80,
                0
              ],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        );
      })}
    </div>
  );
}

// Hologram Base Platform
function HologramPlatform() {
  return (
    <div className="absolute bottom-4 sm:bottom-6 lg:bottom-[15%] w-36 sm:w-48 md:w-56 lg:w-80 h-14 sm:h-16 lg:h-20 flex items-center justify-center pointer-events-none perspective-1000">
      {/* Main Platform Ring */}
      <motion.div
        className="absolute w-full h-full rounded-[100%] border-[3px] border-[#00f0ff]/25 rotate-x-75 shadow-[0_0_50px_rgba(0,240,255,0.2)_inset]"
        animate={{
          scaleX: [1, 1.05, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Inner Ring */}
      <motion.div
        className="absolute w-[70%] h-[70%] rounded-[100%] border-[2px] border-[#7e6ee3]/30 bg-[#7e6ee3]/5 rotate-x-75"
        animate={{
          scaleX: [1, 1.08, 1],
          opacity: [0.4, 0.7, 0.4]
        }}
        transition={{ duration: 2.5, repeat: Infinity }}
      />

      {/* Core Glow */}
      <div className="absolute w-[40%] h-[40%] rounded-[100%] bg-gradient-to-r from-[#00f0ff]/20 to-[#7e6ee3]/20 blur-lg rotate-x-75 animate-pulse" />

      {/* Hologram Light Beam */}
      <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 w-[75%] h-[220px] sm:h-[260px] lg:h-[320px] bg-gradient-to-t from-[#00f0ff]/12 via-[#7e6ee3]/6 to-transparent blur-xl pointer-events-none" />

      {/* Platform Edge Particles */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * 360;
        return (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[#00f0ff]"
            style={{
              left: `${50 + Math.cos((angle * Math.PI) / 180) * 45}%`,
              top: '50%',
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        );
      })}
    </div>
  );
}

// Data Stream Effect
function DataStream({ side }: { side: 'left' | 'right' }) {
  return (
    <div className={`absolute top-0 ${side === 'left' ? 'left-3 sm:left-5' : 'right-3 sm:right-5'} h-full w-[1px] overflow-hidden opacity-20`}>
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="w-full h-16 sm:h-20 bg-gradient-to-b from-transparent via-[#00f0ff] to-transparent"
          initial={{ y: -80 }}
          animate={{ y: '100vh' }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
}

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "System initialized. I'm the digital construct of Ayar Suresh. Ask me about Flutter, OtakuNexa, or my journey as a developer. ⚡",
      timestamp: getTimestamp(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>('hellow');

  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const emotionResetTimerRef = useRef<NodeJS.Timeout | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const triggerEmotion = useCallback((emotion: Emotion, duration: number = 0) => {
    setCurrentEmotion(emotion);
    if (emotionResetTimerRef.current) clearTimeout(emotionResetTimerRef.current);

    if (duration > 0) {
      emotionResetTimerRef.current = setTimeout(() => {
        setCurrentEmotion('idle');
      }, duration);
    }
  }, []);

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      const idleVariants: Emotion[] = ['sleeping', 'coffee-mug', 'cool-walk-with-snel', 'idle'];
      const randomVariant = idleVariants[Math.floor(Math.random() * idleVariants.length)];
      setCurrentEmotion(randomVariant);
    }, 10000);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);
    window.addEventListener('click', resetIdleTimer);
    resetIdleTimer();
    return () => {
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
      window.removeEventListener('click', resetIdleTimer);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (emotionResetTimerRef.current) clearTimeout(emotionResetTimerRef.current);
    };
  }, [resetIdleTimer]);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);


  const handleSend = async (content: string) => {
    if (!content.trim()) return;

    resetIdleTimer();
    triggerEmotion('brainstorm');

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content, timestamp: getTimestamp() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const minDelay = new Promise(resolve => setTimeout(resolve, 1500));
      const fetchPromise = fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer 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`,
          'dangerously-allow-browser': 'true'
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: AYAR_PERSONA },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content }
          ],
          model: 'llama-3.3-70b-versatile',
          temperature: 0.7,
          max_tokens: 1024,
        })
      });

      const [_, response] = await Promise.all([minDelay, fetchPromise]);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error?.message || `API Error: ${response.status}`);

      const aiContentRaw = data.choices?.[0]?.message?.content || "Oops, empty response from AI. 😅";
      let finalContent = aiContentRaw;
      let chosenEmotion: Emotion = 'hellow';

      const animationMatch = aiContentRaw.match(/\[ANIMATION:\s*([a-zA-Z0-9-]+)\]/i);

      if (animationMatch && animationMatch[1]) {
        chosenEmotion = animationMatch[1].toLowerCase() as Emotion;
        finalContent = aiContentRaw.replace(animationMatch[0], '').trim();
      }

      triggerEmotion(chosenEmotion);
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: finalContent, timestamp: getTimestamp() }]);

    } catch (error: any) {
      console.error('AI Error:', error);
      triggerEmotion('cry');
      setMessages((prev) => [...prev, { id: Date.now().toString(), role: 'assistant', content: `CRITICAL ERROR: ${error.message || "Unknown error"}.`, timestamp: getTimestamp() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  return (
    <section id="about" className="relative py-6 sm:py-8 lg:py-20 min-h-screen flex items-center justify-center bg-transparent overflow-hidden">

      {/* Premium Background */}
      <AmbientAurora />
      <FloatingOrbs />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-8">

        {/* Sleek Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 sm:mb-6 lg:mb-10 text-center relative z-20"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-3 sm:mb-4 shadow-[0_0_30px_rgba(0,240,255,0.1)]"
          >
            <Sparkles size={14} className="text-[#00f0ff]" />
            <span className="text-white/80 text-[10px] sm:text-xs font-mono tracking-[0.2em] uppercase">Ayar_AI_Engine v3.0</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/20 tracking-tight drop-shadow-2xl px-4">
            Digital <span className="bg-gradient-to-r from-[#00f0ff] to-[#7e6ee3] bg-clip-text text-transparent">Construct</span>
          </h2>
        </motion.div>

        {/* THE MASTER CONTAINER - Optimized for mobile */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="relative w-full h-[calc(100dvh-11rem)] sm:h-[calc(100dvh-12rem)] md:h-[750px] lg:h-[700px] rounded-2xl sm:rounded-[2rem] lg:rounded-[3rem] p-[1px] bg-gradient-to-b from-white/20 via-white/5 to-transparent shadow-[0_0_80px_rgba(0,0,0,0.8)]"
        >
          {/* Main App Window */}
          <div className="relative w-full h-full bg-[#05050f]/90 backdrop-blur-3xl rounded-2xl sm:rounded-[2rem] lg:rounded-[3rem] overflow-hidden flex flex-col lg:flex-row">

            {/* ==================================================== */}
            {/* ENHANCED HOLOGRAM CHAMBER - Optimized Performance    */}
            {/* ==================================================== */}
            <div className="relative w-full lg:w-[40%] h-[180px] sm:h-[220px] md:h-[240px] lg:h-full flex-shrink-0 border-b lg:border-r border-white/5 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.06)_0%,transparent_100%)] flex flex-col items-center justify-center overflow-hidden">

              {/* Animated Tech Grid - CPU Optimized */}
              <motion.div
                className="absolute inset-0 opacity-[0.12]"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,240,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.3) 1px, transparent 1px)`,
                  backgroundSize: '40px 40px',
                  maskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)',
                  WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)'
                }}
                animate={{
                  backgroundPosition: ['0px 0px', '40px 40px'],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />

              {/* Data Streams - Subtle */}
              <DataStream side="left" />
              <DataStream side="right" />

              {/* Status Header - Compact on mobile */}
              <div className="absolute top-3 sm:top-4 lg:top-6 left-3 sm:left-4 lg:left-6 right-3 sm:right-4 lg:right-6 flex justify-between items-start z-30 pointer-events-none">
                <div className="flex items-center gap-2 backdrop-blur-md bg-black/40 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-white/10">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_#4ade80]"
                  />
                  <span className="text-[8px] sm:text-[9px] font-mono text-white/70 tracking-wider uppercase">ACTIVE</span>
                </div>

                <div className="backdrop-blur-md bg-black/40 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-white/10 max-w-[140px] sm:max-w-none">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Activity size={12} className="text-[#00f0ff] flex-shrink-0" />
                    <span className="text-[8px] sm:text-[9px] font-mono text-[#00f0ff] uppercase truncate">
                      {currentEmotion.replace(/-/g, ' ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* MAIN HOLOGRAM DISPLAY - New Enhanced Version */}
              <div className="relative w-full h-full flex items-center justify-center px-4 py-6">
                <HologramDisplay emotion={currentEmotion} />
              </div>

              {/* HOLOGRAM PLATFORM - New Enhanced Version */}
              <HologramPlatform />

              {/* Stats Bar - Mobile Optimized */}
              <div className="absolute bottom-3 left-3 right-3 z-30 lg:hidden">
                <div className="flex gap-2">
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl"
                  >
                    <Brain size={14} className="text-[#00f0ff] flex-shrink-0" />
                    <span className="text-[9px] font-mono text-white/80 uppercase tracking-wider truncate">
                      {currentEmotion.split('-')[0]}
                    </span>
                  </motion.div>
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-3 py-2 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl"
                  >
                    <Waves size={14} className="text-green-400" />
                    <span className="text-[9px] font-mono text-green-400 uppercase tracking-wider">Live</span>
                  </motion.div>
                </div>
              </div>

              {/* Desktop Stats - Premium Cards */}
              <div className="hidden lg:flex absolute bottom-6 left-6 right-6 gap-3 z-30">
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="flex-1 backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-4 border border-white/10 hover:border-[#00f0ff]/30 transition-all cursor-pointer shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#00f0ff]/20 to-[#00f0ff]/5 flex items-center justify-center border border-[#00f0ff]/20">
                      <Brain className="text-[#00f0ff]" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/50 text-[10px] uppercase tracking-wider font-mono mb-0.5">Neural State</p>
                      <p className="text-white font-bold text-sm capitalize truncate">{currentEmotion.replace(/-/g, ' ')}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="flex-1 backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-4 border border-white/10 hover:border-green-500/30 transition-all cursor-pointer shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/5 flex items-center justify-center border border-green-500/20">
                      <Waves className="text-green-400" size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-white/50 text-[10px] uppercase tracking-wider font-mono mb-0.5">Connection</p>
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_#4ade80]"
                        />
                        <p className="text-white font-bold text-sm">Online</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* ==================================================== */}
            {/* CHAT TERMINAL - Same as before                       */}
            {/* ==================================================== */}
            <div className="flex-1 flex flex-col relative z-10 overflow-hidden bg-black/20">

              {/* Terminal Title Bar */}
              <div className="flex items-center justify-between px-3 sm:px-5 lg:px-8 py-2.5 sm:py-3 lg:py-4 border-b border-white/5 bg-white/[0.02] flex-shrink-0 backdrop-blur-md">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Terminal size={12} className="text-white/40 sm:w-3.5 sm:h-3.5" />
                  <span className="text-[9px] sm:text-[10px] text-white/40 font-mono tracking-widest uppercase">Ayar_AI // Secure Comm</span>
                </div>
              </div>

              {/* Chat Log */}
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6 space-y-4 sm:space-y-5 lg:space-y-6 hide-scrollbar scroll-smooth">
                <AnimatePresence mode="popLayout">
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 15, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: index * 0.03 }}
                      className={`flex flex-col gap-1 sm:gap-1.5 ${message.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      {/* Name & Time */}
                      <div className="flex items-center gap-1.5 sm:gap-2 px-1">
                        <span className={`text-[8px] sm:text-[9px] font-mono tracking-widest font-bold ${message.role === 'user' ? 'text-[#7e6ee3]' : 'text-[#00f0ff]'}`}>
                          {message.role === 'user' ? 'GUEST' : 'AYAR_AI'}
                        </span>
                        <span className="text-[8px] sm:text-[9px] font-mono text-white/20">{message.timestamp}</span>
                      </div>

                      {/* Bubble Layout */}
                      <div className={`flex gap-2 sm:gap-3 max-w-[92%] sm:max-w-[90%] lg:max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>

                        {/* Avatar */}
                        {message.role === 'assistant' && (
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: -5 }}
                            className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl border border-white/10 bg-white/5 p-[2px] flex items-center justify-center flex-shrink-0 shadow-lg overflow-hidden"
                          >
                            <img src={`${import.meta.env.BASE_URL}avatar.jpg`} alt="AI" className="w-full h-full object-cover rounded-md lg:rounded-lg" />
                          </motion.div>
                        )}

                        {/* Message Bubble */}
                        <motion.div
                          whileHover={{ scale: 1.01 }}
                          className={`relative px-3 sm:px-4 lg:px-5 py-2.5 sm:py-3 lg:py-4 text-xs sm:text-sm lg:text-base leading-relaxed backdrop-blur-md ${message.role === 'assistant'
                            ? 'bg-white/5 border border-white/10 text-white/90 rounded-2xl rounded-tl-sm shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
                            : 'bg-gradient-to-br from-[#7e6ee3] to-[#5b6ee3] text-white font-medium rounded-2xl rounded-tr-sm shadow-[0_8px_30px_rgba(126,110,227,0.3)]'
                            }`}
                        >
                          {message.role === 'assistant' ? (
                            <div
                              className="relative z-10 space-y-2 sm:space-y-3 [&_ul]:list-disc [&_ul]:pl-4 sm:[&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-4 sm:[&_ol]:pl-5 [&_li]:mb-1 [&_p]:mb-2 [&_a]:text-[#00f0ff] [&_a]:font-bold [&_a]:underline [&_a]:hover:text-[#00d9ff] [&_b]:text-white [&_b]:font-black [&_h3]:text-sm sm:[&_h3]:text-base lg:[&_h3]:text-lg [&_h3]:font-black [&_h3]:text-[#00f0ff] [&_h3]:mt-2 sm:[&_h3]:mt-3"
                              dangerouslySetInnerHTML={{ __html: message.content }}
                            />
                          ) : (
                            <p className="relative z-10">{message.content}</p>
                          )}
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col gap-1 items-start"
                  >
                    <span className="text-[8px] sm:text-[9px] font-mono tracking-widest text-[#00f0ff] font-bold px-1">AYAR_AI</span>
                    <div className="flex gap-2 sm:gap-3">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl border border-white/10 bg-white/5 p-[2px] flex items-center justify-center flex-shrink-0 opacity-50 overflow-hidden">
                        <img src={`${import.meta.env.BASE_URL}avatar.jpg`} alt="AI" className="w-full h-full object-cover rounded-md lg:rounded-lg grayscale" />
                      </div>
                      <div className="px-1 py-2 bg-transparent rounded-2xl flex items-center">
                        <NeuralTyping />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} className="h-1 sm:h-2 lg:h-4" />
              </div>

              {/* Input Area */}
              <div className="px-3 sm:px-4 lg:px-8 pb-3 sm:pb-4 lg:pb-6 pt-2 bg-gradient-to-t from-black via-[#05050f]/90 to-transparent z-20">

                {/* Quick Prompts */}
                {messages.length === 1 && !isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-1.5 sm:gap-2 overflow-x-auto hide-scrollbar pb-2 sm:pb-3 mb-1 snap-x snap-mandatory"
                  >
                    {preloadedPrompts.map((prompt, idx) => (
                      <motion.button
                        key={prompt}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSend(prompt)}
                        className="whitespace-nowrap flex-shrink-0 snap-center px-3 sm:px-4 py-1.5 sm:py-2 border border-white/10 bg-white/5 backdrop-blur-md rounded-full text-[10px] sm:text-[11px] lg:text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 hover:border-[#00f0ff]/50 transition-all duration-300 shadow-lg"
                      >
                        {prompt}
                      </motion.button>
                    ))}
                  </motion.div>
                )}

                {/* Input Field */}
                <form onSubmit={handleSubmit} className="relative flex items-center group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#7e6ee3] via-[#00f0ff] to-[#7e6ee3] rounded-full sm:rounded-[2rem] opacity-20 group-focus-within:opacity-50 blur-md transition-opacity duration-500" />
                  <div className="relative flex w-full items-center bg-black/60 backdrop-blur-xl border border-white/10 rounded-full p-1 sm:p-1.5 shadow-2xl">
                    <div className="pl-3 sm:pl-4 pr-1.5 sm:pr-2 text-white/30">
                      <Zap size={14} className="sm:w-4 sm:h-4 group-focus-within:text-[#00f0ff] transition-colors" />
                    </div>
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Message Ayar..."
                      maxLength={500}
                      className="w-full bg-transparent border-none text-xs sm:text-sm lg:text-base text-white placeholder:text-white/30 focus:outline-none focus:ring-0 py-2 sm:py-2.5 lg:py-3 pr-3 sm:pr-4"
                    />
                    <motion.button
                      type="submit"
                      disabled={!input.trim() || isTyping}
                      whileHover={{ scale: input.trim() && !isTyping ? 1.05 : 1 }}
                      whileTap={{ scale: input.trim() && !isTyping ? 0.95 : 1 }}
                      className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-[#7e6ee3] to-[#00f0ff] rounded-full text-black hover:shadow-[0_0_20px_rgba(0,240,255,0.6)] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Send size={16} className="sm:w-[18px] sm:h-[18px] ml-0.5" />
                    </motion.button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-white/20 text-[9px] sm:text-[10px] mt-3 sm:mt-4 lg:mt-6 font-mono px-4"
        >
          Powered by Groq AI • React & Framer Motion • Real-time Neural Sync
        </motion.p>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 20s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .rotate-x-75 {
          transform: perspective(1000px) rotateX(75deg);
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}