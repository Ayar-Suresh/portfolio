import { useRef, useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import {
  ExternalLink,
  Github,
  ChevronLeft,
  ChevronRight,
  X,
  Code2,
  Terminal,
  Folder
} from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

// --- Types ---
interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  images?: string[];
  tags: string[];
  stats: { label: string; value: string }[];
  liveUrl: string;
  githubUrl: string;
  isPrivate?: boolean;
  color: string;
}

// --- Data ---
const projects: Project[] = [
  {
    id: '1',
    title: 'OtakuNexa Anime App',
    description: 'A high-performance anime streaming and discovery ecosystem',
    longDescription: 'OtakuNexa is a cross-platform mobile application built with Flutter that redefines how fans interact with anime. It features a custom-built Telegram bot backend for seamless file delivery from private channels, real-time updates, and a curated database of titles. Designed for efficiency, it provides a smooth UI even on low-end devices.',
    image: `${import.meta.env.BASE_URL}otakunexa-hero.jpg`,
    images: [
      `${import.meta.env.BASE_URL}otakunexa-hero.jpg`,
      `${import.meta.env.BASE_URL}otaku.png`,
      `${import.meta.env.BASE_URL}otaku2.png`,
      `${import.meta.env.BASE_URL}otaku3.png`,
    ],
    tags: ['Flutter', 'Dart', 'Python', 'Telegram API', 'Firebase', 'GitHub'],
    stats: [
      { label: 'Anime Titles', value: '400+' },
      { label: 'App Size', value: '60MB+' },
      { label: 'Delivery/Ad', value: '10' },
    ],
    liveUrl: 'https://otakunexa.nexa-go.workers.dev/',
    githubUrl: '',
    isPrivate: true,
    color: '#3de40aff',
  },
  {
    id: '2',
    title: 'OtakuNexa Web',
    description: 'Cross-platform anime streaming engine with automated delivery.',
    longDescription: 'The web implementation of OtakuNexa, built to extend the ecosystem to desktop and mobile browsers. It utilizes a custom-built Telegram bot backend to automate media file retrieval and delivery, ensuring high availability and low-latency streaming across environments.',
    image: `${import.meta.env.BASE_URL}web_version.jpg`,
    images: [
      `${import.meta.env.BASE_URL}web_version.jpg`,
      `${import.meta.env.BASE_URL}web_app.jpeg`,
      `${import.meta.env.BASE_URL}web_bar.jpeg`,
      `${import.meta.env.BASE_URL}web_details.jpeg`,
      `${import.meta.env.BASE_URL}web_home.jpeg`,
      `${import.meta.env.BASE_URL}web_profile.jpeg`,

    ],
    tags: ['Flutter', 'Dart', 'Telegram API', 'Firebase', 'GitHub Pages'],
    stats: [
      { label: 'Frame Rate', value: '60fps' },
      { label: 'Uptime', value: '99.9%' },
      { label: 'Load Time', value: '<2s' },
    ],
    liveUrl: 'https://otakunexa-web.pages.dev/#/home',
    githubUrl: '',
    isPrivate: true,
    color: '#6366f1',
  },
  {
    id: '3',
    title: 'OtakuNexa Landing Page',
    description: 'The Next-Gen anime distribution and community hub.',
    longDescription: 'A high-performance landing page designed for the OtakuNexa ecosystem. It serves as the primary distribution point for the mobile application, featuring deep integration with GitHub and Google Drive for secure file delivery, a responsive design for mobile-first users, and an interactive showcase of core platform features like Otaku Shorts and the Nakama Guild.',
    image: `${import.meta.env.BASE_URL}landingpage1.png`,
    images: [
      `${import.meta.env.BASE_URL}landingpage1.png`,
      `${import.meta.env.BASE_URL}landingpage2.png`,
      `${import.meta.env.BASE_URL}landingpage3.png`,
      `${import.meta.env.BASE_URL}landingpage4.png`,

    ],
    tags: ['HTML5', 'Tailwind CSS', 'JavaScript', 'Cloudflare Workers', 'GitHub API'],
    stats: [
      { label: 'Download Speed', value: '100%' },
      { label: 'Latency', value: '<40ms' },
      { label: 'Uptime', value: '99.9%' },
    ],
    liveUrl: 'https://otakunexa.nexa-go.workers.dev/',
    githubUrl: 'https://github.com/Ayar-Suresh/OtaKuNexaStore.git',
    color: '#ff4d4d',
  },
  {
    id: '4',
    title: 'Status Saver Pro',
    description: 'High-performance WhatsApp status management tool.',
    longDescription: 'A robust utility application designed to save, manage, and repost WhatsApp statuses instantly. Features a clean glassmorphic UI, an intelligent file caching system to manage storage efficiently, and a built-in media player for seamless previewing of videos and images.',
    image: `${import.meta.env.BASE_URL}whatsapp1.jpg`,
    images: [
      `${import.meta.env.BASE_URL}whatsapp1.jpg`,
      `${import.meta.env.BASE_URL}whatsapp2.jpg`,

    ],
    tags: ['Flutter', 'Dart', 'Android Storage API', 'Provider', 'AdMob'],
    stats: [
      { label: 'APK Size', value: '8MB' },
      { label: 'Scan Time', value: '<0.5s' },
      { label: 'Frame Rate', value: '60fps' },
    ],
    liveUrl: 'https://raw.githubusercontent.com/Ayar-Suresh/WhatsApp_Status_Saver/main/WhatsApp_byAhir.apk',
    githubUrl: '',
    color: '#25D366',
    isPrivate: true,
  },
  {
    id: '5',
    title: 'Construction Corp Site',
    description: 'High-performance corporate portfolio with SEO optimization.',
    longDescription: 'A technically optimized static website engineered for maximum search visibility and speed. Built with semantic HTML5 and compressed CSS assets to achieve sub-second load times. Features a fully responsive grid system and image optimization pipeline for instant rendering on mobile devices.',
    image: `${import.meta.env.BASE_URL}ganesh (2).png`,
    images: [
      `${import.meta.env.BASE_URL}ganesh (1).png`,
      `${import.meta.env.BASE_URL}ganesh (2).png`,
      `${import.meta.env.BASE_URL}ganesh (3).png`,

    ],
    tags: ['HTML5', 'CSS3', 'JavaScript', 'SEO', 'Asset Optimization'],
    stats: [
      { label: 'Lighthouse', value: '98/100' },
      { label: 'SEO Score', value: '70%' },
      { label: 'Load Time', value: '<2s' },
    ],
    liveUrl: 'https://ayar-suresh.github.io/construction-co/',
    githubUrl: 'git@github.com:Ayar-Suresh/construction-co.git ',
    color: '#f59e0b',
  },
  {
    id: '6',
    title: 'Radhe Krishna Transport',
    description: 'Logistics & heavy machinery rental platform.',
    longDescription: 'A digital gateway for a logistics company specializing in heavy machinery transport and Ajax Fiori concrete mixer rentals. The site features a detailed fleet showcase, service breakdowns for construction support, and a direct "Book Now" integration for equipment leasing.',
    image: `${import.meta.env.BASE_URL}rk (1).png`,
    images: [
      `${import.meta.env.BASE_URL}rk (1).png`,
      `${import.meta.env.BASE_URL}rk (2).png`,
      `${import.meta.env.BASE_URL}rk (3).png`,
      `${import.meta.env.BASE_URL}rk (4).png`,
      `${import.meta.env.BASE_URL}rk (5).png`,

    ],
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap', 'Google Maps API'],
    stats: [
      { label: 'Download Speed', value: '100%' },
      { label: 'Latency', value: '<40ms' },
      { label: 'Uptime', value: '99.9%' },
    ],
    liveUrl: 'https://ayar-suresh.github.io/transport/',
    githubUrl: 'git@github.com:Ayar-Suresh/transport.git',
    color: '#dc2626',
  }
];

// --- Project Card Component ---
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

  // Removed mouse move effect for cleaner IDE look, replaced with cleaner hover state
  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onClick={onClick}
      className="group relative flex-shrink-0 w-[85vw] sm:w-[500px] md:w-[600px] cursor-pointer"
      data-cursor-hover
    >
      {/* IDE Window Container */}
      <div className="ide-panel overflow-hidden transition-all duration-300 group-hover:border-[#00f0ff]/50 shadow-2xl">
        {/* Window Header */}
        <div className="mac-window-header justify-between py-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          </div>
          <div className="flex items-center gap-2">
            <Folder size={12} className="text-[#8b949e]" />
            <span className="text-[10px] font-mono text-[#8b949e]">{project.title.toLowerCase().replace(/\s+/g, '-')}</span>
          </div>
          <div className="w-8" />
        </div>

        {/* Content Area */}
        <div className="relative aspect-[16/9] overflow-hidden bg-[#0d1117]">
          {/* Image */}
          <div className="absolute inset-0">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 block"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/20 to-transparent" />
          </div>

          {/* Overlay Content */}
          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <div className="flex flex-wrap gap-2 mb-3">
                {project.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-[10px] font-mono px-2 py-1 rounded bg-[#161b22] border border-[#30363d] text-[#8b949e]">
                    {tag}
                  </span>
                ))}
              </div>

              <h3 className="text-xl font-bold text-white mb-2 font-mono group-hover:text-[#00f0ff] transition-colors">
                {project.title}
              </h3>

              <p className="text-sm text-[#8b949e] line-clamp-2 font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                {project.description}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="px-3 py-1.5 bg-[#161b22] border-t border-[#30363d] flex justify-between items-center text-[10px] text-[#8b949e] font-mono">
          <span>{project.isPrivate ? "Private" : "Public"}</span>
          <span className="flex items-center gap-1">
            <Code2 size={10} />
            TypeScript
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// --- Main Component ---
export function ProjectShowcase() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const modalScrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Full Screen Image Viewer State
  const [fullScreenImageIndex, setFullScreenImageIndex] = useState<number | null>(null);
  const fullScreenContainerRef = useRef<HTMLDivElement>(null);
  const isTouchingRef = useRef(false);

  // --- HISTORY MANAGEMENT ---
  const openModal = (project: Project) => {
    window.history.pushState({ modal: 'project' }, '', window.location.href);
    setSelectedProject(project);
  };

  const openFullScreen = (index: number) => {
    window.history.pushState({ modal: 'fullscreen' }, '', window.location.href);
    setFullScreenImageIndex(index);
  };

  const closeModal = useCallback(() => {
    window.history.back();
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      if (fullScreenImageIndex !== null) {
        setFullScreenImageIndex(null);
      }
      else if (selectedProject !== null) {
        setSelectedProject(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedProject, fullScreenImageIndex]);


  // --- Scroll Logic ---
  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = window.innerWidth < 640 ? window.innerWidth * 0.92 : 624;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };



  const scrollModal = (direction: 'left' | 'right') => {
    if (!modalScrollContainerRef.current) return;
    const scrollAmount = modalScrollContainerRef.current.clientWidth;
    modalScrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleFullScreenNav = (direction: 'left' | 'right') => {
    if (!selectedProject || fullScreenImageIndex === null) return;
    const images = selectedProject.images && selectedProject.images.length > 0 ? selectedProject.images : [selectedProject.image];

    isTouchingRef.current = false;

    if (direction === 'left') {
      setFullScreenImageIndex((prev) => (prev! - 1 + images.length) % images.length);
    } else {
      setFullScreenImageIndex((prev) => (prev! + 1) % images.length);
    }
  };

  const handleScroll = () => {
    if (!fullScreenContainerRef.current) return;
    const container = fullScreenContainerRef.current;
    const width = container.clientWidth;
    const newIndex = Math.round(container.scrollLeft / width);

    if (newIndex !== fullScreenImageIndex && fullScreenImageIndex !== null) {
      setFullScreenImageIndex(newIndex);
    }
  };

  useEffect(() => {
    if (fullScreenContainerRef.current && fullScreenImageIndex !== null) {
      if (isTouchingRef.current) return;

      const container = fullScreenContainerRef.current;
      const width = container.clientWidth;
      const targetPos = fullScreenImageIndex * width;

      if (Math.abs(container.scrollLeft - targetPos) > 10) {
        container.scrollTo({
          left: targetPos,
          behavior: 'smooth'
        });
      }
    }
  }, [fullScreenImageIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (fullScreenImageIndex === null) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') handleFullScreenNav('left');
      if (e.key === 'ArrowRight') handleFullScreenNav('right');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fullScreenImageIndex, closeModal]);

  return (
    <section id="projects" className="relative py-16 md:py-32 overflow-hidden">
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 mb-8 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6"
          >
            <div>
              <span className="text-[#00f0ff] text-xs font-mono mb-2 md:mb-4 block flex items-center gap-2">
                <Terminal size={12} />
                ~/projects
              </span>
              <h2 className="text-3xl md:text-4xl sm:text-5xl font-bold font-mono">
                Code <span className="gradient-text">Repositories</span>
              </h2>
            </div>

            <div className="flex gap-3 relative z-20">
              <button
                onClick={() => scroll('left')}
                className="w-10 h-10 md:w-12 md:h-12 rounded bg-[#161b22] border border-[#30363d] flex items-center justify-center text-[#8b949e] hover:text-[#58a6ff] hover:border-[#58a6ff] transition-all duration-300 cursor-pointer"
                data-cursor-hover
              >
                <ChevronLeft size={20} className="md:w-6 md:h-6" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-10 h-10 md:w-12 md:h-12 rounded bg-[#161b22] border border-[#30363d] flex items-center justify-center text-[#8b949e] hover:text-[#58a6ff] hover:border-[#58a6ff] transition-all duration-300 cursor-pointer"
                data-cursor-hover
              >
                <ChevronRight size={20} className="md:w-6 md:h-6" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* --- Project List Scroll Container --- */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 md:gap-8 overflow-x-auto hide-scrollbar pb-10"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {projects.map((project, index) => (
            <div
              key={project.id}
              style={{ scrollSnapAlign: 'start' }}
              className="flex-shrink-0 first:pl-6 md:first:pl-12 last:pr-6 md:last:pr-12 py-2" // Added py-2 for shadow space
            >
              <ProjectCard
                project={project}
                index={index}
                onClick={() => openModal(project)}
              />
            </div>
          ))}
        </div>

        {/* Scrollbar Indicator */}
        <div className="max-w-7xl mx-auto px-6 mt-4">
          <div className="flex gap-2 justify-center">
            {projects.map((_, index) => (
              <div
                key={index}
                className="w-8 h-1 rounded-full bg-[#30363d]"
              />
            ))}
          </div>
        </div>
      </div>

      {/* --- Project Detail Modal --- */}
      <Dialog open={!!selectedProject} onOpenChange={() => closeModal()}>
        <DialogContent className="block w-[95vw] max-h-[90vh] overflow-y-auto overflow-x-hidden p-0 bg-[#0d1117]/95 backdrop-blur-xl border border-[#30363d] text-[#c9d1d9] sm:max-w-4xl rounded-xl">

          {/* Modal Window Header */}
          <div className="mac-window-header sticky top-0 z-50 justify-between">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>
            <div className="text-xs text-white/40 font-mono">
              {selectedProject?.title.toLowerCase().replace(/\s+/g, '_')}.tsx
            </div>
            <div className="w-10" />
          </div>

          {selectedProject && (
            <div className="grid md:grid-cols-2">
              <div className="relative w-full aspect-[16/9] md:h-full md:aspect-auto overflow-hidden group bg-black">
                <div
                  ref={modalScrollContainerRef}
                  className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar h-full w-full"
                >
                  {(selectedProject.images && selectedProject.images.length > 0 ? selectedProject.images : [selectedProject.image]).map((img, idx) => (
                    <div
                      key={idx}
                      className="flex-shrink-0 w-full h-full snap-center relative cursor-zoom-in"
                      onClick={() => openFullScreen(idx)}
                    >
                      <img
                        src={img}
                        alt={`${selectedProject.title} - ${idx + 1}`}
                        className="w-full h-full object-contain md:object-cover"
                      />
                    </div>
                  ))}
                </div>

                <div className="absolute inset-0 pointer-events-none border-b md:border-b-0 md:border-r border-[#30363d]" />
              </div>

              <div className="p-6 md:p-8 font-mono">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-2 py-0.5 text-xs rounded bg-[#161b22] border border-[#30363d] text-[#00f0ff]">
                    ID: {selectedProject.id}
                  </span>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  {selectedProject.title}
                </h3>

                <p className="text-[#8b949e] mb-6 leading-relaxed text-sm">
                  {selectedProject.longDescription}
                </p>

                <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
                  {selectedProject.stats.map((stat) => (
                    <div key={stat.label} className="text-center p-3 bg-[#161b22] border border-[#30363d] rounded-lg">
                      <div className="text-lg font-bold text-[#e2e8f0]">
                        {stat.value}
                      </div>
                      <div className="text-[10px] text-[#8b949e] uppercase">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="mb-8">
                  <p className="text-xs text-[#8b949e] mb-3 uppercase tracking-wider">Dependency Graph</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-[#161b22] border border-[#30363d] rounded text-[#8b949e] hover:text-[#58a6ff] hover:border-[#58a6ff] transition-colors cursor-default"
                      >
                        import {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={selectedProject.liveUrl}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#238636] hover:bg-[#2ea043] text-white rounded-md text-sm font-bold transition-all border border-[rgba(255,255,255,0.1)]"
                  >
                    <ExternalLink size={16} />
                    View Deployment
                  </a>
                  <a
                    href={selectedProject.githubUrl}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] rounded-md text-sm font-bold transition-all border border-[#30363d]"
                  >
                    <Github size={16} />
                    {selectedProject.isPrivate ? "Private Repo" : "Source Code"}
                  </a>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* --- Full Screen Image Viewer Overlay --- */}
      {selectedProject && fullScreenImageIndex !== null && createPortal(
        <div
          className="fixed inset-0 z-[20000] bg-[#0d1117]/98 backdrop-blur-md flex flex-col cursor-default"
          style={{ pointerEvents: 'auto' }}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={closeModal}
        >
          <button
            onClick={(e) => { e.stopPropagation(); closeModal(); }}
            className="absolute top-4 right-4 z-[20001] text-white p-2 hover:bg-[#30363d] rounded transition-colors"
          >
            <X size={24} />
          </button>

          <div
            ref={fullScreenContainerRef}
            onScroll={handleScroll}
            onTouchStart={() => { isTouchingRef.current = true; }}
            onTouchEnd={() => {
              setTimeout(() => { isTouchingRef.current = false; }, 500);
            }}
            style={{ touchAction: 'pan-x' }}
            className="flex-1 w-full h-full overflow-x-auto snap-x snap-mandatory flex items-center hide-scrollbar touch-pan-x"
            onClick={(e) => e.stopPropagation()}
          >
            {(selectedProject.images && selectedProject.images.length > 0 ? selectedProject.images : [selectedProject.image]).map((img, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 min-w-full w-full h-full snap-center flex items-center justify-center p-4 md:p-10 relative"
              >
                <img
                  src={img}
                  alt={`Full Screen ${idx + 1}`}
                  className="max-w-full max-h-full object-contain border border-[#30363d] shadow-2xl bg-black"
                  draggable={false}
                />
              </div>
            ))}
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); handleFullScreenNav('left'); }}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded bg-[#161b22] border border-[#30363d] flex items-center justify-center text-white hover:border-[#58a6ff] transition-all hidden md:flex z-[20001] cursor-pointer"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleFullScreenNav('right'); }}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded bg-[#161b22] border border-[#30363d] flex items-center justify-center text-white hover:border-[#58a6ff] transition-all hidden md:flex z-[20001] cursor-pointer"
          >
            <ChevronRight size={24} />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[#8b949e] text-xs font-mono tracking-widest pointer-events-none">
            BLOCK {fullScreenImageIndex + 1} OF {(selectedProject.images && selectedProject.images.length > 0 ? selectedProject.images : [selectedProject.image]).length}
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}