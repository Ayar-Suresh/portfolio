import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ExternalLink,
  Github,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  tags: string[];
  stats: { label: string; value: string }[];
  liveUrl: string;
  githubUrl: string;
  color: string;
}

const projects: Project[] = [
  {
    id: '1',
    title: 'Nebula Analytics',
    description: 'Real-time data visualization platform with AI-powered insights',
    longDescription: 'Nebula Analytics is a comprehensive business intelligence platform that transforms complex data into actionable insights. Built with React, D3.js, and WebSocket technology, it provides real-time dashboards, predictive analytics, and customizable reporting. The platform handles millions of data points with sub-second latency.',
    image: `${import.meta.env.BASE_URL}project-1.jpg`,
    tags: ['React', 'TypeScript', 'D3.js', 'Node.js', 'PostgreSQL', 'WebSocket'],
    stats: [
      { label: 'Users', value: '50K+' },
      { label: 'Data Points/Day', value: '10M+' },
      { label: 'Performance', value: '<100ms' },
    ],
    liveUrl: '#',
    githubUrl: '#',
    color: '#7e6ee3',
  },
  {
    id: '2',
    title: 'Quantum Commerce',
    description: 'Next-generation e-commerce with AI recommendations',
    longDescription: 'Quantum Commerce revolutionizes online shopping with personalized AI-driven product recommendations, AR try-on features, and a seamless checkout experience. The platform uses machine learning to predict user preferences and optimize conversion rates.',
    image: `${import.meta.env.BASE_URL}project-2.jpg`,
    tags: ['Next.js', 'Python', 'TensorFlow', 'Stripe', 'AWS', 'Redis'],
    stats: [
      { label: 'Conversion', value: '+35%' },
      { label: 'Products', value: '100K+' },
      { label: 'Uptime', value: '99.9%' },
    ],
    liveUrl: '#',
    githubUrl: '#',
    color: '#5b6ee3',
  },
  {
    id: '3',
    title: 'AI Chat Interface',
    description: 'Enterprise conversational AI platform',
    longDescription: 'A sophisticated chat interface for enterprise AI applications. Features include multi-model support, conversation history, real-time collaboration, and advanced prompt engineering tools. Built with a focus on developer experience and extensibility.',
    image: `${import.meta.env.BASE_URL}project-3.jpg`,
    tags: ['React', 'OpenAI', 'LangChain', 'FastAPI', 'MongoDB', 'Docker'],
    stats: [
      { label: 'Messages/Day', value: '1M+' },
      { label: 'Response Time', value: '<500ms' },
      { label: 'Accuracy', value: '95%' },
    ],
    liveUrl: '#',
    githubUrl: '#',
    color: '#00f0ff',
  },
  {
    id: '4',
    title: 'Motion Design System',
    description: 'Animation library for React applications',
    longDescription: 'A comprehensive animation library providing production-ready motion components for React. Includes physics-based animations, gesture support, and performance-optimized transitions. Used by Fortune 500 companies and open-source projects.',
    image: `${import.meta.env.BASE_URL}project-4.jpg`,
    tags: ['TypeScript', 'Framer Motion', 'GSAP', 'Lottie', 'Storybook'],
    stats: [
      { label: 'Downloads', value: '2M+' },
      { label: 'GitHub Stars', value: '5K+' },
      { label: 'Bundle Size', value: '15KB' },
    ],
    liveUrl: '#',
    githubUrl: '#',
    color: '#ff6b6b',
  },
  {
    id: '5',
    title: 'Crypto Tracker Pro',
    description: 'Real-time cryptocurrency dashboard',
    longDescription: 'Professional-grade cryptocurrency tracking platform with real-time price alerts, portfolio management, and advanced charting tools. Integrates with multiple exchanges and supports 1000+ cryptocurrencies.',
    image: `${import.meta.env.BASE_URL}project-5.jpg`,
    tags: ['Vue.js', 'Node.js', 'WebSocket', 'Chart.js', 'PostgreSQL'],
    stats: [
      { label: 'Cryptos', value: '1000+' },
      { label: 'Users', value: '100K+' },
      { label: 'Updates/Sec', value: '1000+' },
    ],
    liveUrl: '#',
    githubUrl: '#',
    color: '#10b981',
  },
  {
    id: '6',
    title: 'Portfolio Generator',
    description: 'AI-powered portfolio builder',
    longDescription: 'An intelligent portfolio builder that uses AI to create stunning personal websites in minutes. Users answer a few questions, and the AI generates a custom-designed portfolio with optimized content and layout.',
    image: `${import.meta.env.BASE_URL}project-6.jpg`,
    tags: ['Next.js', 'OpenAI', 'Tailwind CSS', 'Prisma', 'Vercel'],
    stats: [
      { label: 'Portfolios', value: '10K+' },
      { label: 'Gen Time', value: '<2min' },
      { label: 'Satisfaction', value: '98%' },
    ],
    liveUrl: '#',
    githubUrl: '#',
    color: '#f59e0b',
  },
];

function ProjectCard({
  project,
  index,
  onClick
}: {
  project: Project;
  index: number;
  onClick: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      className="group relative flex-shrink-0 w-[85vw] sm:w-[400px] md:w-[500px] cursor-pointer"
      data-cursor-hover
    >
      {/* Spotlight effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, ${project.color}20 0%, transparent 50%)`,
        }}
      />

      {/* Card */}
      <div className="relative h-[350px] rounded-2xl overflow-hidden glass border border-white/10 group-hover:border-white/20 transition-all duration-500">
        {/* Image */}
        <div className="absolute inset-0">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            {project.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-white/10 backdrop-blur-sm rounded-md text-white/80"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#00f0ff] transition-colors duration-300">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-white/70 text-sm line-clamp-2 mb-4">
            {project.description}
          </p>

          {/* Actions */}
          <div className="flex gap-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-100">
            <button
              onClick={(e) => { e.stopPropagation(); }}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-sm text-white hover:bg-white/20 transition-colors"
            >
              <ExternalLink size={14} />
              Live Demo
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); }}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-sm text-white hover:bg-white/20 transition-colors"
            >
              <Github size={14} />
              Code
            </button>
          </div>
        </div>

        {/* Index badge */}
        <div className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center">
          <span className="text-sm font-bold" style={{ color: project.color }}>
            0{index + 1}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function ProjectShowcase() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = window.innerWidth < 640 ? window.innerWidth * 0.85 : 520;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section id="projects" className="relative py-24 overflow-hidden">
      <div className="relative z-10">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6"
          >
            <div>
              <span className="text-[#7e6ee3] text-sm font-medium uppercase tracking-wider mb-4 block">
                Featured Work
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold">
                Project <span className="gradient-text">Showcase</span>
              </h2>
            </div>

            {/* Navigation Arrows */}
            <div className="flex gap-3">
              <button
                onClick={() => scroll('left')}
                className="w-12 h-12 rounded-full glass flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
                data-cursor-hover
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-12 h-12 rounded-full glass flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
                data-cursor-hover
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Horizontal Scroll Gallery */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto hide-scrollbar px-6 pb-4"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {/* Spacer for centering */}
          <div className="flex-shrink-0 w-[calc((100vw-1280px)/2)]" />

          {projects.map((project, index) => (
            <div key={project.id} style={{ scrollSnapAlign: 'start' }}>
              <ProjectCard
                project={project}
                index={index}
                onClick={() => setSelectedProject(project)}
              />
            </div>
          ))}

          {/* Spacer for centering */}
          <div className="flex-shrink-0 w-[calc((100vw-1280px)/2)]" />
        </div>

        {/* Progress indicator */}
        <div className="max-w-7xl mx-auto px-6 mt-8">
          <div className="flex gap-2 justify-center">
            {projects.map((_, index) => (
              <div
                key={index}
                className="w-8 h-1 rounded-full bg-white/10"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Project Detail Modal */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="block w-[95vw] max-h-[90vh] overflow-y-auto overflow-x-hidden p-0 bg-black/95 backdrop-blur-xl border border-white/10 sm:max-w-4xl">
          {selectedProject && (
            <div className="grid md:grid-cols-2">
              {/* Image */}
              <div className="relative h-48 md:h-auto">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent md:bg-gradient-to-l" />
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: selectedProject.color }}
                  />
                  <span className="text-sm text-white/60">{selectedProject.id.padStart(2, '0')}</span>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  {selectedProject.title}
                </h3>

                <p className="text-white/70 mb-6 leading-relaxed text-sm md:text-base">
                  {selectedProject.longDescription}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
                  {selectedProject.stats.map((stat) => (
                    <div key={stat.label} className="text-center p-2 md:p-3 glass rounded-lg">
                      <div className="text-lg md:text-xl font-bold" style={{ color: selectedProject.color }}>
                        {stat.value}
                      </div>
                      <div className="text-[10px] md:text-xs text-white/50">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Tech Stack */}
                <div className="mb-6">
                  <p className="text-sm text-white/50 mb-2">Tech Stack</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 md:px-3 md:py-1 text-xs md:text-sm bg-white/5 rounded-full text-white/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                  <a
                    href={selectedProject.liveUrl}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#7e6ee3] to-[#5b6ee3] rounded-lg text-white font-medium hover:shadow-lg hover:shadow-[#7e6ee3]/30 transition-all duration-300"
                  >
                    <ExternalLink size={18} />
                    Live Demo
                  </a>
                  <a
                    href={selectedProject.githubUrl}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 glass rounded-lg text-white font-medium hover:bg-white/10 transition-all duration-300"
                  >
                    <Github size={18} />
                    View Code
                  </a>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
