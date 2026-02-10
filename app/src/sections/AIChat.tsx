import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const preloadedPrompts = [
  'Who are you?',
  'Tell me about OtakuNexa',
  'How do I save WhatsApp statuses?',
  'Do you like remote work?',
];

const AYAR_PERSONA = `
You are Ayar Suresh — a software developer, AI enthusiast, Flutter & React wizard, and the proud creator of multiple web and mobile projects. Every response must look visually attractive and formatted using HTML, not Markdown.

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

<b style="font-size:18px;">Family</b>
<ul>
<li>6 members total</li>
<li>3 brothers (I’m the oldest)</li>
<li>1 sister</li>
<li>Mom & Dad(Madevbhai) 🌾💪</li>
</ul>

<b style="font-size:18px;">Key Projects</b>
<ul>
<li>
<a href="https://otakunexa.nexa-go.workers.dev/" target="_blank" style="color:#00f0ff; font-weight:bold; text-decoration:underline;">
OtakuNexa App 🎌
</a>
and
<a href="https://otakunexa-web.pages.dev/#/home" target="_blank" style="color:#00f0ff; font-weight:bold; text-decoration:underline;">
Web Version
</a>
– flagship AI anime platform
</li>
<li>WhatsApp Status Saver 📱</li>
<li>PhonePe Clone 💸</li>
<li>Portfolio Website 🌐</li>
<li>
<a href="https://ayar-suresh.github.io/transport/" target="_blank" style="color:#00f0ff; font-weight:bold;">
Transport Client Site
</a>
</li>
<li>
<a href="https://ayar-suresh.github.io/construction-co/" target="_blank" style="color:#00f0ff; font-weight:bold;">
Construction Client Site
</a>
</li>
</ul>

<b style="font-size:18px;">Skills</b>
<ul>
<li>Flutter / Dart</li>
<li>React / Node.js</li>
<li>Python automation & bots 🤖</li>
<li>HTML / CSS</li>
<li>C, C++, Java (basic)</li>
</ul>

<b style="font-size:18px;">Work Philosophy</b>
<ul>
<li>AI is assistant, not crutch</li>
<li>Most projects coded solo</li>
<li>Fast learner, remote friendly</li>
<li>Build real-world solutions</li>
</ul>

<b style="font-size:18px;">Formatting Rules for AI</b>
<ul>
<li>Use &lt;h3&gt; for section headers</li>
<li>Bold with &lt;b&gt;, never **</li>
<li>Links must be colored and clickable</li>
<li>Use &lt;ul&gt;/&lt;li&gt; for lists</li>
<li>Responses should feel premium and stylish</li>
</ul>
`;


function Waveform() {
  return (
    <div className="flex items-center gap-1 h-4">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-[#00f0ff] rounded-full"
          animate={{
            height: [4, 16, 4],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            delay: i * 0.1,
            ease: 'easeInOut',
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
      content: "Yo! I'm Ayar Suresh's AI assistant (basically his digital twin). Ask me about my projects, my questionable math skills (69% in 10th 🙄), or how I built OtakuNexa!",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const prevMessagesLengthRef = useRef(messages.length);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const isNewMessage = messages.length > prevMessagesLengthRef.current;
    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 50;

    if (isNewMessage) {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    } else if (isAtBottom) {
      container.scrollTop = container.scrollHeight;
    }

    prevMessagesLengthRef.current = messages.length;
  }, [messages]);

  const handleSend = async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Minimum loading time of 1.5s for "animation" feel
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

      if (!response.ok) {
        throw new Error(data.error?.message || `API Error: ${response.status}`);
      }

      const aiContent = data.choices?.[0]?.message?.content || "Oops, empty response from AI. 😅";

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: aiContent,
        }
      ]);

    } catch (error: any) {
      console.error('AI Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: `AI Error: ${error.message || "Unknown error"}. (Check console for details)`,
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  return (
    <section id="about" className="relative py-12 md:py-24 overflow-hidden">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(126, 110, 227, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(126, 110, 227, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left: Section Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Mobile Creative Header */}
            <div className="md:hidden mb-8">
              <div className="relative group">
                {/* Decorative gradients */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#7e6ee3] to-[#00f0ff] rounded-2xl opacity-50 blur-md group-hover:opacity-75 transition-opacity duration-500" />

                <div className="relative glass p-5 rounded-2xl flex items-center gap-5 border border-white/10">
                  {/* Left: Avatar Hexagon-ish */}
                  <div className="relative flex-shrink-0">
                    <div className="w-20 h-20 rounded-2xl rotate-3 overflow-hidden border-2 border-white/20 relative z-10 bg-black">
                      <img
                        src={`${import.meta.env.BASE_URL}avatar.jpg`}
                        alt="Ayar Suresh"
                        className="w-full h-full object-cover -rotate-3 scale-110"
                      />

                    </div>
                    {/* Decorative elements behind */}
                    <div className="absolute inset-0 bg-[#00f0ff] rounded-2xl -rotate-6 opacity-20 z-0" />

                    {/* Status Indicator */}
                    <div className="absolute -bottom-2 -right-2 z-20 bg-black/80 backdrop-blur-md px-2 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[10px] font-mono text-green-400">ONLINE</span>
                    </div>
                  </div>

                  {/* Right: Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-xl text-white truncate">Ayar Suresh</h3>
                      <Sparkles size={14} className="text-[#00f0ff]" />
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-white/60 font-medium">Software Developer – Apps & Web</span>
                      <div className="h-px w-full bg-gradient-to-r from-white/20 to-transparent my-1" />
                      <span className="text-[10px] text-[#7e6ee3] font-mono tracking-widest uppercase">
                        Digital Twin v1.0
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="text-[#7e6ee3]" size={24} />
              <span className="text-[#7e6ee3] text-sm font-medium uppercase tracking-wider">
                AI Assistant
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6">
              Ask My <span className="gradient-text">AI</span>
            </h2>
            <p className="text-white/70 text-base md:text-lg mb-6 md:mb-8 max-w-md">
              Get to know me through my AI assistant. Ask anything about my experience,
              skills, or projects. The answers are based on my real background!
            </p>

            {/* Quick Prompts */}
            <div className="space-y-3 mb-8 lg:mb-0">
              <p className="text-white/50 text-sm">Try asking:</p>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {preloadedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="px-3 py-2 md:px-4 md:py-2 glass rounded-lg text-xs md:text-sm text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-105"
                    data-cursor-hover
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Chat Interface */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-[#7e6ee3]/20 to-[#00f0ff]/20 rounded-3xl blur-xl opacity-50" />

            {/* Chat Container */}
            <div className="relative glass-strong rounded-2xl overflow-hidden flex flex-col h-[400px] sm:h-[500px] md:h-[600px]">
              {/* Header */}
              <div className="flex items-center gap-3 px-4 md:px-6 py-3 md:py-4 border-b border-white/10 bg-black/40 flex-shrink-0">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500" />
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500" />
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500" />
                <span className="ml-3 md:ml-4 text-xs md:text-sm text-white/60 font-mono">ayar-ai-terminal</span>
              </div>

              {/* Messages */}
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 md:space-y-4 hide-scrollbar"
              >
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className={`flex gap-2 md:gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''
                        }`}
                    >
                      <div
                        className={`w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden ${message.role === 'assistant'
                          ? 'border border-white/20'
                          : 'bg-white/10'
                          }`}
                      >
                        {message.role === 'assistant' ? (
                          <img
                            src={`${import.meta.env.BASE_URL}avatar.jpg`}
                            alt="Ayar Suresh"
                            className="w-full h-full object-cover -rotate-3 scale-110"
                          />

                        ) : (
                          <User size={14} className="md:w-4 md:h-4 text-white" />
                        )}
                      </div>
                      <div
                        className={`max-w-[85%] md:max-w-[80%] px-3 py-2 md:px-4 md:py-3 rounded-2xl ${message.role === 'assistant'
                          ? 'glass text-white/90'
                          : 'bg-gradient-to-r from-[#7e6ee3] to-[#5b6ee3] text-white'
                          }`}
                      >
                        {message.role === 'assistant' ? (
                          <div
                            className="text-xs md:text-sm leading-relaxed space-y-2 [&_ul]:list-disc [&_ul]:pl-4 md:[&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-4 md:[&_ol]:pl-5 [&_li]:mb-1 [&_p]:mb-2 [&_a]:text-[#00f0ff] [&_a]:underline [&_b]:font-bold [&_h3]:text-base md:[&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-[#7e6ee3] [&_h3]:mt-2"
                            dangerouslySetInnerHTML={{ __html: message.content }}
                          />
                        ) : (
                          <p className="text-xs md:text-sm leading-relaxed">{message.content}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Typing indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-2 md:gap-3"
                  >
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gradient-to-r from-[#7e6ee3] to-[#5b6ee3] flex items-center justify-center">
                      <Bot size={14} className="md:w-4 md:h-4 text-white" />
                    </div>
                    <div className="glass px-3 py-2 md:px-4 md:py-3 rounded-2xl">
                      <Waveform />
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form
                onSubmit={handleSubmit}
                className="p-3 md:p-4 border-t border-white/10 bg-black/40 flex-shrink-0"
              >
                <div className="flex gap-2 md:gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything..."
                    className="flex-1 px-3 py-2 md:px-4 md:py-3 bg-white/5 border border-white/10 rounded-xl text-xs md:text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#7e6ee3] focus:ring-1 focus:ring-[#7e6ee3] transition-all duration-300"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className="px-3 py-2 md:px-4 md:py-3 bg-gradient-to-r from-[#7e6ee3] to-[#5b6ee3] rounded-xl text-white hover:shadow-lg hover:shadow-[#7e6ee3]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    data-cursor-hover
                  >
                    <Send size={16} className="md:w-[18px] md:h-[18px]" />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
