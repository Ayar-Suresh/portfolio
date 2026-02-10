import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import {
  Send,
  Mail,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Dribbble,
  Check,
  Loader2
} from 'lucide-react';

const socialLinks = [
  { name: 'GitHub', icon: Github, url: 'https://github.com/Ayar-Suresh/Ayar-Suresh', color: '#333' },
  { name: 'LinkedIn', icon: Linkedin, url: 'https://in.linkedin.com/in/ayar-suresh-itpro', color: '#0077b5' },
  { name: 'Twitter', icon: Twitter, url: 'https://twitter.com', color: '#1da1f2' },
  { name: 'Dribbble', icon: Dribbble, url: 'https://dribbble.com', color: '#ea4c89' },
];

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
}

function ParticleBurst({ trigger }: { trigger: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);

  const createBurst = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const colors = ['#7e6ee3', '#5b6ee3', '#00f0ff', '#ff00aa'];

    particlesRef.current = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: centerX,
      y: centerY,
      vx: (Math.random() - 0.5) * 15,
      vy: (Math.random() - 0.5) * 15,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 4 + 2,
    }));

    animate();
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesRef.current = particlesRef.current.filter((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.3; // gravity
      p.size *= 0.98; // shrink

      if (p.size > 0.5) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        return true;
      }
      return false;
    });

    if (particlesRef.current.length > 0) {
      requestAnimationFrame(animate);
    }
  };

  if (trigger) {
    setTimeout(createBurst, 100);
  }

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={400}
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    />
  );
}

export function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Construct mailto link
    const subject = `Portfolio Contact from ${formData.name}`;
    const body = `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`;
    const mailtoLink = `mailto:ahir385350@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Open email client
    window.location.href = mailtoLink;

    // Simulate API call for UI feedback
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setShowBurst(true);

    // Reset burst trigger
    setTimeout(() => setShowBurst(false), 100);

    // Reset form after delay
    setTimeout(() => {
      setFormData({ name: '', email: '', message: '' });
      setIsSubmitted(false);
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Magnetic button effect
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(buttonRef.current, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    if (!buttonRef.current) return;
    gsap.to(buttonRef.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.3)',
    });
  };

  return (
    <section id="contact" className="relative py-24 overflow-hidden">
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
            Get In Touch
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Let&apos;s Build Something{' '}
            <span className="gradient-text">Amazing</span>
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Have a project in mind? I&apos;d love to hear about it. Send me a message
            and let&apos;s create something extraordinary together.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative glass-strong rounded-2xl p-8">
              <ParticleBurst trigger={showBurst} />

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                {/* Name Field */}
                <div className="relative">
                  <label className="block text-sm text-white/60 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#7e6ee3] focus:ring-1 focus:ring-[#7e6ee3] transition-all duration-300"
                    placeholder="Your name"
                  />
                </div>

                {/* Email Field */}
                <div className="relative">
                  <label className="block text-sm text-white/60 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#7e6ee3] focus:ring-1 focus:ring-[#7e6ee3] transition-all duration-300"
                    placeholder="your@email.com"
                  />
                </div>

                {/* Message Field */}
                <div className="relative">
                  <label className="block text-sm text-white/60 mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#7e6ee3] focus:ring-1 focus:ring-[#7e6ee3] transition-all duration-300 resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  ref={buttonRef}
                  type="submit"
                  disabled={isSubmitting || isSubmitted}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  className={`w-full relative py-4 rounded-xl font-medium text-white overflow-hidden transition-all duration-300 ${isSubmitted
                    ? 'bg-green-500'
                    : 'bg-gradient-to-r from-[#7e6ee3] to-[#5b6ee3] hover:shadow-lg hover:shadow-[#7e6ee3]/40'
                    }`}
                  data-cursor-hover
                >
                  <span className={`flex items-center justify-center gap-2 transition-all duration-300 ${isSubmitting || isSubmitted ? 'opacity-0' : 'opacity-100'
                    }`}>
                    <Send size={18} />
                    Send Message
                  </span>

                  {isSubmitting && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <Loader2 size={24} className="animate-spin" />
                    </span>
                  )}

                  {isSubmitted && (
                    <span className="absolute inset-0 flex items-center justify-center gap-2">
                      <Check size={24} />
                      Message Sent!
                    </span>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-8"
          >
            {/* Contact Details */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#7e6ee3]/20 to-[#5b6ee3]/20 flex items-center justify-center">
                  <Mail size={20} className="text-[#7e6ee3]" />
                </div>
                <div>
                  <p className="text-sm text-white/50">Email</p>
                  <a
                    href="mailto:ahir385350@gmail.com"
                    className="text-white hover:text-[#00f0ff] transition-colors"
                    data-cursor-hover
                  >
                    ahir385350@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#7e6ee3]/20 to-[#5b6ee3]/20 flex items-center justify-center">
                  <MapPin size={20} className="text-[#7e6ee3]" />
                </div>
                <div>
                  <p className="text-sm text-white/50">Location</p>
                  <p className="text-white">Gujarat, India</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <p className="text-sm text-white/50 mb-4">Connect with me</p>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      whileHover={{ scale: 1.1, y: -5 }}
                      className="w-12 h-12 rounded-xl glass flex items-center justify-center text-white/70 hover:text-white transition-all duration-300"
                      style={{
                        boxShadow: `0 0 0 ${social.color}00`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = `0 0 20px ${social.color}40`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = `0 0 0 ${social.color}00`;
                      }}
                      data-cursor-hover
                    >
                      <Icon size={20} />
                    </motion.a>
                  );
                })}
              </div>
            </div>

            {/* Availability Card */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                <span className="text-green-400 font-medium">Available for work</span>
              </div>
              <p className="text-white/70 text-sm">
                I&apos;m currently open to new opportunities and interesting projects.
                Let&apos;s discuss how we can work together!
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
