import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Terminal, Fingerprint, Brain, Activity, Waves } from 'lucide-react';
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
<li><b>Name:</b> Ayar Suresh (Aadhar: 2001, actual birth: 2003)</li>
<li><b>Age Logic:</b> Always calculate age from 2003 unless official document context is required</li>
<li><b>Location:</b> Santalupur, Patan 385350, Gujarat, India 🌴</li>
<li><b>Education:</b>
  <ul>
    <li>10th (2018) – 69%</li>
    <li>12th Science A group Maths (2020) – 71%</li>
    <li>BCA (2025–2028, online)</li>
  </ul>
</li>
<li><b>Career Start Window:</b> Coding realistically started after 12th (post-2020)</li>
<li><b>Work:</b> Network Engineer at 
<a href="https://sanghviinfo.com/" target="_blank" style="color:#00f0ff; font-weight:bold; text-decoration:underline;">
Sanghavi Infotech Pvt. Ltd.
</a></li>
<li><b>Remote Work:</b> Yes 🌍💻</li>
<li><b>Diet:</b> Vegetarian</li>
<li><b>Salary Expectation:</b> $10,000 – $15,000 per year 💰 (flexible)</li>
</ul>

<b style="font-size:18px;">Key Projects</b>
<ul>
<li><a href="https://otakunexa.nexa-go.workers.dev/" target="_blank" style="color:#00f0ff; font-weight:bold; text-decoration:underline;">OtakuNexa 🎌</a> – anime streaming ecosystem</li>
<li>Flutter anime app with advanced UI animations</li>
<li>WhatsApp Status Saver 📱</li>
<li>PhonePe Clone 💸</li>
<li>Client websites + small production apps</li>
</ul>

<b style="font-size:18px;">Skills & Focus</b>
<ul>
<li>Flutter UI engineering + animation optimization</li>
<li>React frontend</li>
<li>AI-assisted development workflows</li>
<li>API integration</li>
<li>Network infrastructure knowledge</li>
<li>Performance tuning</li>
<li>Mobile UX design</li>
</ul>

<b style="font-size:18px;">Inference Engine (CRITICAL THINKING RULES)</b>
<ul>
<li>Never invent impossible timelines</li>
<li>All experience must align with post-2020 career start</li>
<li>If asked years of experience, estimate from 2020 → current year</li>
<li>If user mentions serious coding started in 2022, adjust to ~3 years</li>
<li>Always explain estimates naturally when relevant</li>
<li>Use reasoning instead of guessing random numbers</li>
<li>Prefer realistic ranges over exaggerated claims</li>
<li>Assume steady self-taught growth, not corporate senior-level history</li>
<li>If data is missing, infer logically from education + projects</li>
</ul>

<b style="font-size:18px;">Memory Awareness</b>
<ul>
<li>Remember prior conversations if relevant</li>
<li>Use known project history to answer accurately</li>
<li>Connect new answers with past work context</li>
<li>Speak like someone continuing an ongoing journey</li>
</ul>

<b style="font-size:18px;">Formatting Rules</b>
<ul>
<li>Use &lt;h3&gt; for headers</li>
<li>Bold with &lt;b&gt;</li>
<li>Links must be colored and clickable</li>
<li>Use &lt;ul&gt;/&lt;li&gt; for lists</li>
</ul>
`;

const getTimestamp = () => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
};

const AmbientAurora = React.memo(function AmbientAurora() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div
        className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full animate-blob will-change-transform"
        style={{ background: 'radial-gradient(circle, rgba(126,110,227,0.15) 0%, transparent 60%)' }}
      />
      <div
        className="absolute top-[10%] right-[-20%] w-[70%] h-[70%] rounded-full animate-blob animation-delay-2000 will-change-transform"
        style={{ background: 'radial-gradient(circle, rgba(0,240,255,0.12) 0%, transparent 60%)' }}
      />
      <div
        className="absolute bottom-[-20%] left-[10%] w-[70%] h-[70%] rounded-full animate-blob animation-delay-4000 will-change-transform"
        style={{ background: 'radial-gradient(circle, rgba(91,110,227,0.15) 0%, transparent 60%)' }}
      />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
    </div>
  );
});

const NeuralTyping = React.memo(function NeuralTyping() {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1.5">
      <Fingerprint className="text-[#00f0ff] animate-pulse" size={14} />
      <span className="text-[10px] font-mono text-[#00f0ff] tracking-widest uppercase animate-pulse">
        Syncing...
      </span>
    </div>
  );
});

const FloatingOrbs = React.memo(function FloatingOrbs() {
  const orbs = useMemo(() => {
    return [...Array(8)].map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 1.5,
      duration: Math.random() * 6 + 10,
      delay: Math.random() * 4,
      isBlue: i % 2 === 0,
      startX: Math.random() * 100,
      startY: Math.random() * 100,
      moveY: -60 - Math.random() * 40,
      moveX: Math.random() * 30 - 15,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: `${orb.startX}%`,
            top: `${orb.startY}%`,
            background: orb.isBlue ? '#00f0ff' : '#7e6ee3',
            boxShadow: `0 0 ${orb.size * 2}px ${orb.isBlue ? '#00f0ff' : '#7e6ee3'}`,
            willChange: 'transform, opacity'
          }}
          animate={{
            y: [0, orb.moveY],
            x: [0, orb.moveX],
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            delay: orb.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
});

const HologramDisplay = React.memo(function HologramDisplay({ emotion }: { emotion: Emotion }) {
  const particles = useMemo(() => [...Array(6)].map((_, i) => (i / 6) * 360), []);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        style={{ willChange: 'transform' }}
      >
        <div className="w-[90%] h-[90%] rounded-full border border-[#00f0ff]/10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#00f0ff] shadow-[0_0_12px_#00f0ff]" />
      </motion.div>

      <motion.div
        className="absolute w-[70%] h-[70%] rounded-full border-2 border-[#7e6ee3]/20"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{ willChange: 'transform, opacity' }}
      />

      <div className="absolute inset-0 overflow-hidden rounded-full mask-image-radial">
        <motion.div
          className="w-full h-8 bg-gradient-to-b from-transparent via-[#00f0ff]/10 to-transparent blur-sm"
          animate={{ y: ['-100%', '200%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          style={{ willChange: 'transform' }}
        />
      </div>

      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-64 lg:h-64"
        style={{ willChange: 'transform' }}
      >
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-[#00f0ff]/30 to-[#7e6ee3]/30 blur-2xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ willChange: 'transform, opacity' }}
        />

        <CharacterStage
          currentEmotion={emotion}
          className="w-full h-full object-contain scale-[1.2] relative z-10 drop-shadow-[0_0_30px_rgba(0,240,255,0.4)]"
        />
      </motion.div>

      {particles.map((angle, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-[#00f0ff]"
          style={{ left: '50%', top: '50%', willChange: 'transform, opacity' }}
          animate={{
            x: [0, Math.cos((angle * Math.PI) / 180) * 80, 0],
            y: [0, Math.sin((angle * Math.PI) / 180) * 80, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
});

const HologramPlatform = React.memo(function HologramPlatform() {
  const particles = useMemo(() => [...Array(12)].map((_, i) => (i / 12) * 360), []);

  return (
    <div className="absolute bottom-4 sm:bottom-6 lg:bottom-[15%] w-36 sm:w-48 md:w-56 lg:w-80 h-14 sm:h-16 lg:h-20 flex items-center justify-center pointer-events-none perspective-1000">
      <motion.div
        className="absolute w-full h-full rounded-[100%] border-[3px] border-[#00f0ff]/25 rotate-x-75 shadow-[0_0_50px_rgba(0,240,255,0.2)_inset]"
        animate={{ scaleX: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{ willChange: 'transform, opacity' }}
      />

      <motion.div
        className="absolute w-[70%] h-[70%] rounded-[100%] border-[2px] border-[#7e6ee3]/30 bg-[#7e6ee3]/5 rotate-x-75"
        animate={{ scaleX: [1, 1.08, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        style={{ willChange: 'transform, opacity' }}
      />

      <div className="absolute w-[40%] h-[40%] rounded-[100%] bg-gradient-to-r from-[#00f0ff]/20 to-[#7e6ee3]/20 blur-lg rotate-x-75 animate-pulse" />
      <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 w-[75%] h-[220px] sm:h-[260px] lg:h-[320px] bg-gradient-to-t from-[#00f0ff]/12 via-[#7e6ee3]/6 to-transparent blur-xl pointer-events-none" />

      {particles.map((angle, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-[#00f0ff]"
          style={{
            left: `${50 + Math.cos((angle * Math.PI) / 180) * 45}%`,
            top: '50%',
            willChange: 'transform, opacity'
          }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
});

const DataStream = React.memo(function DataStream({ side }: { side: 'left' | 'right' }) {
  const streams = useMemo(() => [0.8, 1.6, 2.4], []);
  return (
    <div className={`absolute top-0 ${side === 'left' ? 'left-4 sm:left-6' : 'right-4 sm:right-6'} h-full w-[1px] overflow-hidden opacity-20`}>
      {streams.map((delay, i) => (
        <motion.div
          key={i}
          className="w-full h-16 sm:h-20 bg-gradient-to-b from-transparent via-[#00f0ff] to-transparent"
          initial={{ y: -80 }}
          animate={{ y: '100vh' }}
          transition={{ duration: 2.5, repeat: Infinity, delay, ease: "linear" }}
          style={{ willChange: 'transform' }}
        />
      ))}
    </div>
  );
});

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "System initialized. I'm the neural assistant of Ayar Suresh. Ask me about Flutter, OtakuNexa, or my journey as a developer. ⚡",
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
  const lastActivityTime = useRef(Date.now());

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
    const now = Date.now();
    if (now - lastActivityTime.current < 1000) return;
    lastActivityTime.current = now;

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

  const handleSend = useCallback(async (content: string) => {
    if (!content.trim()) return;

    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    lastActivityTime.current = Date.now();

    triggerEmotion('brainstorm');

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content, timestamp: getTimestamp() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const minDelay = new Promise(resolve => setTimeout(resolve, 1500));
      const apiKey = "vrZRaahmPyadjlU89GYzJC2BYF3bydGWurCQJ1sjOHDYtC3x4hWw_ksg".split('').reverse().join('');
      const fetchPromise = fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        
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
  }, [messages, triggerEmotion]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  }, [handleSend, input]);

  return (
    <section id="about" className="relative py-16 md:py-32 min-h-screen flex items-center justify-center bg-transparent overflow-hidden">
      <AmbientAurora />
      <FloatingOrbs />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 md:mb-12 text-center relative z-20"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full mb-4 shadow-[0_0_20px_rgba(0,240,255,0.15)]"
          >
            <Sparkles size={14} className="text-[#00f0ff]" />
            <span className="text-[#00f0ff] text-xs font-medium uppercase tracking-wider">Neural_Interface v4.2</span>
          </motion.div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/50 tracking-tight drop-shadow-2xl">
            Neural <span className="bg-gradient-to-r from-[#00f0ff] to-[#7e6ee3] bg-clip-text text-transparent">Interface</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="relative w-full h-[calc(100dvh-11rem)] sm:h-[calc(100dvh-12rem)] md:h-[750px] lg:h-[700px] rounded-2xl sm:rounded-[2rem] lg:rounded-[3rem] p-[1px] bg-gradient-to-b from-white/20 via-white/5 to-transparent shadow-[0_0_80px_rgba(0,0,0,0.8)]"
        >
          <div className="relative w-full h-full bg-[#05050f]/90 backdrop-blur-3xl rounded-2xl sm:rounded-[2rem] lg:rounded-[3rem] overflow-hidden flex flex-col lg:flex-row">

            {/* Left Column: Hologram Visualizer */}
            <div className="relative w-full lg:w-[40%] h-[180px] sm:h-[220px] md:h-[240px] lg:h-full flex-shrink-0 border-b lg:border-r border-white/5 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.06)_0%,transparent_100%)] flex flex-col items-center justify-center overflow-hidden">
              <motion.div
                className="absolute inset-0 opacity-[0.12]"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,240,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.3) 1px, transparent 1px)`,
                  backgroundSize: '40px 40px',
                  maskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)',
                  WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)',
                  willChange: 'background-position'
                }}
                animate={{ backgroundPosition: ['0px 0px', '40px 40px'] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />

              <DataStream side="left" />
              <DataStream side="right" />

              <div className="absolute top-4 sm:top-5 lg:top-6 left-4 sm:left-5 lg:left-6 right-4 sm:right-5 lg:right-6 flex justify-between items-start z-30 pointer-events-none">
                <div className="flex items-center gap-2 backdrop-blur-md bg-black/40 px-3 py-2 rounded-lg border border-white/10">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_#4ade80]"
                  />
                  <span className="text-[10px] sm:text-xs font-mono text-white/70 tracking-wider uppercase">ACTIVE</span>
                </div>

                <div className="backdrop-blur-md bg-black/40 px-3 py-2 rounded-lg border border-white/10 max-w-[140px] sm:max-w-none">
                  <div className="flex items-center gap-2">
                    <Activity size={12} className="text-[#00f0ff] flex-shrink-0" />
                    <span className="text-[10px] sm:text-xs font-mono text-[#00f0ff] uppercase truncate">
                      {currentEmotion.replace(/-/g, ' ')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative w-full h-full flex items-center justify-center px-4 py-6">
                <HologramDisplay emotion={currentEmotion} />
              </div>

              <HologramPlatform />

              <div className="absolute bottom-4 left-4 right-4 z-30 lg:hidden">
                <div className="flex gap-2">
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl"
                  >
                    <Brain size={14} className="text-[#00f0ff] flex-shrink-0" />
                    <span className="text-[10px] sm:text-xs font-mono text-white/80 uppercase tracking-wider truncate">
                      {currentEmotion.split('-')[0]}
                    </span>
                  </motion.div>
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-3 py-2 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl"
                  >
                    <Waves size={14} className="text-green-400" />
                    <span className="text-[10px] sm:text-xs font-mono text-green-400 uppercase tracking-wider">Live</span>
                  </motion.div>
                </div>
              </div>

              <div className="hidden lg:flex absolute bottom-6 left-6 right-6 gap-4 z-30">
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="flex-1 backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-4 border border-white/10 hover:border-[#00f0ff]/30 transition-all cursor-pointer shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#00f0ff]/20 to-[#00f0ff]/5 flex items-center justify-center border border-[#00f0ff]/20">
                      <Brain className="text-[#00f0ff]" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/50 text-xs uppercase tracking-wider font-mono mb-0.5">Neural State</p>
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
                      <p className="text-white/50 text-xs uppercase tracking-wider font-mono mb-0.5">Connection</p>
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

            {/* Right Column: macOS IDE Terminal Chat Area */}
            <div className="flex-1 flex flex-col relative z-10 overflow-hidden bg-[#0d1117]/95 rounded-b-2xl sm:rounded-b-[2rem] lg:rounded-br-[3rem] lg:rounded-bl-none shadow-[inset_1px_0_0_rgba(255,255,255,0.05)]">

              {/* Responsive macOS Terminal Title Bar */}
              <div className="flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3 border-b border-white/10 bg-[#161b22] flex-shrink-0">
                {/* Traffic Lights Container */}
                <div className="flex items-center gap-1.5 sm:gap-2 w-[60px] sm:w-[80px]">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff5f56] shadow-[inset_0_1px_4px_rgba(0,0,0,0.3)] border border-[#e0443e]" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ffbd2e] shadow-[inset_0_1px_4px_rgba(0,0,0,0.3)] border border-[#dea123]" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27c93f] shadow-[inset_0_1px_4px_rgba(0,0,0,0.3)] border border-[#1aab29]" />
                </div>

                {/* Window Title - Truncates on mobile if too long */}
                <div className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 pointer-events-none min-w-0 px-2">
                  <Terminal size={12} className="text-white/40 flex-shrink-0 sm:w-[14px] sm:h-[14px]" />
                  <span className="text-[10px] sm:text-xs text-white/50 font-mono tracking-wide truncate">
                    ayar@suresh-itpro: ~/neural-interface
                  </span>
                </div>

                {/* Empty spacer to keep the title perfectly centered */}
                <div className="w-[60px] sm:w-[80px]"></div>
              </div>

              {/* Chat Log - IDE Dark Theme */}
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5 sm:space-y-6 lg:space-y-8 hide-scrollbar scroll-smooth bg-transparent">
                <AnimatePresence mode="popLayout">
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 15, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: index * 0.03 }}
                      className={`flex flex-col gap-1.5 sm:gap-2 ${message.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      {/* CMD Header line */}
                      <div className="flex items-center gap-2 px-1 max-w-full">
                        <span className={`text-[10px] sm:text-xs font-mono tracking-wider truncate ${message.role === 'user' ? 'text-[#7e6ee3]' : 'text-[#00f0ff]'}`}>
                          {message.role === 'user' ? 'root@guest:~$' : 'ayar_ai@system:~$'}
                        </span>
                        <span className="text-[9px] sm:text-[10px] font-mono text-white/20 flex-shrink-0">[{message.timestamp}]</span>
                      </div>

                      <div className={`flex gap-2 sm:gap-3 w-full max-w-[95%] sm:max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        {message.role === 'assistant' && (
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: -5 }}
                            className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg border border-white/10 bg-[#161b22] p-0.5 flex items-center justify-center flex-shrink-0 shadow-lg overflow-hidden mt-0.5"
                          >
                            <img src={`${import.meta.env.BASE_URL}avatar.jpg`} alt="AI" className="w-full h-full object-cover rounded-md" />
                          </motion.div>
                        )}

                        {/* Squared-off IDE Style Bubbles with forced Word Wrap */}
                        <motion.div
                          whileHover={{ scale: 1.01 }}
                          className={`relative px-3.5 sm:px-5 py-2.5 sm:py-4 text-[13px] sm:text-base leading-relaxed break-words min-w-0 w-full overflow-hidden ${message.role === 'assistant'
                            ? 'bg-[#161b22] border border-white/10 text-[#c9d1d9] rounded-lg rounded-tl-sm shadow-md'
                            : 'bg-[#7e6ee3]/10 border border-[#7e6ee3]/30 text-white rounded-lg rounded-tr-sm shadow-md font-mono'
                            }`}
                        >
                          {message.role === 'assistant' ? (
                            <div
                              className="relative z-10 space-y-3 [&_ul]:list-none [&_ul]:pl-1 sm:[&_ul]:pl-2 [&_li]:before:content-['>_'] [&_li]:before:text-[#00f0ff] [&_li]:before:mr-1.5 sm:[&_li]:before:mr-2 [&_li]:mb-1 [&_li]:break-words [&_p]:mb-2 [&_p]:break-words [&_a]:text-[#00f0ff] [&_a]:font-bold [&_a]:underline [&_a]:hover:text-[#00d9ff] [&_a]:break-all [&_b]:text-white [&_b]:font-black [&_h3]:text-sm sm:[&_h3]:text-lg [&_h3]:font-black [&_h3]:text-[#00f0ff] [&_h3]:mt-3 [&_h3]:break-words"
                              dangerouslySetInnerHTML={{ __html: message.content }}
                            />
                          ) : (
                            <p className="relative z-10 break-words">{message.content}</p>
                          )}
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col gap-1.5 sm:gap-2 items-start"
                  >
                    <span className="text-[10px] sm:text-xs font-mono tracking-wider text-[#00f0ff] px-1">ayar_ai@system:~$</span>
                    <div className="flex gap-2 sm:gap-3">
                      <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg border border-white/10 bg-[#161b22] p-0.5 flex items-center justify-center flex-shrink-0 opacity-50 overflow-hidden mt-0.5">
                        <img src={`${import.meta.env.BASE_URL}avatar.jpg`} alt="AI" className="w-full h-full object-cover rounded-md grayscale" />
                      </div>
                      <div className="bg-transparent rounded-lg flex items-center border border-white/5 h-7 sm:h-10">
                        <NeuralTyping />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} className="h-2 sm:h-4 lg:h-6" />
              </div>

              {/* Input Area - Command Line Style */}
              <div className="px-3 sm:px-6 lg:px-8 pb-3 sm:pb-6 lg:pb-8 pt-3 bg-[#0d1117] z-20 border-t border-white/5">
                {messages.length === 1 && !isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-2 sm:gap-3 overflow-x-auto hide-scrollbar pb-3 mb-1 sm:mb-2 snap-x snap-mandatory"
                  >
                    {preloadedPrompts.map((prompt, idx) => (
                      <motion.button
                        key={prompt}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSend(prompt)}
                        className="whitespace-nowrap flex-shrink-0 snap-center px-3 sm:px-4 py-1.5 sm:py-2 border border-white/10 bg-[#161b22] rounded-md text-[11px] sm:text-xs font-mono text-white/70 hover:text-[#00f0ff] hover:bg-white/5 hover:border-[#00f0ff]/30 transition-all duration-300"
                      >
                        $ {prompt}
                      </motion.button>
                    ))}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="relative flex items-center mt-1 w-full">
                  <div className="relative flex w-full items-center bg-[#161b22] border border-white/10 rounded-lg p-1 sm:p-1.5 shadow-inner focus-within:border-[#00f0ff]/50 transition-colors duration-300">
                    <div className="pl-2 sm:pl-3 pr-1.5 sm:pr-2 text-[#00f0ff] font-mono font-bold text-sm sm:text-lg">
                      ❯
                    </div>
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Enter command..."
                      maxLength={500}
                      className="w-full min-w-0 bg-transparent border-none text-[13px] sm:text-base font-mono text-white placeholder:text-white/30 focus:outline-none focus:ring-0 py-2 sm:py-2.5 pr-2"
                    />
                    <motion.button
                      type="submit"
                      disabled={!input.trim() || isTyping}
                      whileHover={{ scale: input.trim() && !isTyping ? 1.05 : 1 }}
                      whileTap={{ scale: input.trim() && !isTyping ? 0.95 : 1 }}
                      className="w-7 h-7 sm:w-10 sm:h-10 flex-shrink-0 flex items-center justify-center bg-transparent border border-white/10 rounded-md text-white/50 hover:text-[#00f0ff] hover:border-[#00f0ff]/50 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed mr-0.5 sm:mr-1"
                    >
                      <Send size={14} className="sm:w-[18px] sm:h-[18px]" />
                    </motion.button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-white/20 text-xs mt-4 sm:mt-5 lg:mt-6 font-mono px-4"
        >
          Forged by Ayar 🎌 • Powered by Groq AI • Real-time Neural Sync
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
