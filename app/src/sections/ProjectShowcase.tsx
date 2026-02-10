import { useRef, useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import {
  ExternalLink,
  Github,
  ChevronLeft,
  ChevronRight,
  X,
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
    color: '#ff4d4d', // Bold red to match the "Unleash Your Otaku Soul" energy
  },
  {
    id: '4',
    title: 'Status Saver Pro',
    description: 'High-performance WhatsApp status management tool.',
    longDescription: 'A robust utility application designed to save, manage, and repost WhatsApp statuses instantly. Features a clean glassmorphic UI, an intelligent file caching system to manage storage efficiently, and a built-in media player for seamless previewing of videos and images.',
    image: `${import.meta.env.BASE_URL}whatsapp1.jpg`, // Ensure you have a matching image
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
    liveUrl: 'https://raw.githubusercontent.com/Ayar-Suresh/WhatsApp_Status_Saver/main/WhatsApp_byAhir.apk', // Add Play Store link if available
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
      { label: 'Lighthouse', value: '98/100' }, // Google's Dev Performance Score
      { label: 'SEO Score', value: '70%' },     // Technical SEO implementation
      { label: 'Load Time', value: '<2s' },    // Render speed
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
    color: '#dc2626', // Truck Red/Industrial Red
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
      // NO MARGIN OR PADDING HERE. This keeps the card size consistent.
      className="group relative flex-shrink-0 w-[85vw] sm:w-[600px] md:w-[800px] cursor-pointer"
      data-cursor-hover
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, ${project.color}20 0%, transparent 50%)`,
        }}
      />

      <div className="relative aspect-[4/3] sm:aspect-[2/1] rounded-2xl overflow-hidden glass border border-white/10 group-hover:border-white/20 transition-all duration-500">
        <div className="absolute inset-0">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end pointer-events-none">
          <div className="hidden sm:flex flex-wrap gap-2 mb-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-[10px] bg-white/10 backdrop-blur-sm rounded-md text-white/80"
              >
                {tag}
              </span>
            ))}
          </div>

          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#00f0ff] transition-colors duration-300 shadow-lg">
            {project.title}
          </h3>

          <p className="text-white/80 text-xs line-clamp-2 mb-0 opacity-90">
            {project.description}
          </p>

          <div className="absolute top-4 right-4 flex gap-2 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-auto">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <ExternalLink size={14} className="text-white" />
            </a>

            {project.isPrivate ? (
              <div
                className="w-8 h-8 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center cursor-not-allowed opacity-50"
                onClick={(e) => {
                  e.stopPropagation();
                  alert("This project is private.");
                }}
              >
                <Github size={14} className="text-white" />
              </div>
            ) : (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Github size={14} className="text-white" />
              </a>
            )}
          </div>
        </div>

        <div className="absolute top-4 left-4 w-8 h-8 rounded-full glass flex items-center justify-center pointer-events-none">
          <span className="text-xs font-bold" style={{ color: project.color }}>
            0{index + 1}
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
    const scrollAmount = window.innerWidth < 640 ? window.innerWidth * 0.92 : 824;
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
              <span className="text-[#7e6ee3] text-sm font-medium uppercase tracking-wider mb-2 md:mb-4 block">
                Featured Work
              </span>
              <h2 className="text-3xl md:text-4xl sm:text-5xl font-bold">
                Project <span className="gradient-text">Showcase</span>
              </h2>
            </div>

            <div className="flex gap-3 relative z-20">
              <button
                onClick={() => scroll('left')}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full glass flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 cursor-pointer"
                data-cursor-hover
              >
                <ChevronLeft size={20} className="md:w-6 md:h-6" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full glass flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 cursor-pointer"
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
          // No padding on the container to prevent shrinking.
          className="flex gap-4 md:gap-6 overflow-x-auto hide-scrollbar pb-4"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {projects.map((project, index) => (
            <div
              key={project.id}
              style={{ scrollSnapAlign: 'start' }}
              // --- THIS WRAPPER FIXES IT ---
              // first:pl-6 = Padding Left ONLY on the first item
              // last:pr-6 = Padding Right ONLY on the last item
              // flex-shrink-0 = Prevents shrinking
              className="flex-shrink-0 first:pl-6 md:first:pl-12 last:pr-6 md:last:pr-12"
            >
              <ProjectCard
                project={project}
                index={index}
                onClick={() => openModal(project)}
              />
            </div>
          ))}
        </div>

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

      {/* --- Project Detail Modal --- */}
      <Dialog open={!!selectedProject} onOpenChange={() => closeModal()}>
        <DialogContent className="block w-[95vw] max-h-[90vh] overflow-y-auto overflow-x-hidden p-0 bg-black/95 backdrop-blur-xl border border-white/10 sm:max-w-4xl">
          {selectedProject && (
            <div className="grid md:grid-cols-2">
              <div className="relative w-full aspect-[1920/1227] md:h-full md:aspect-auto overflow-hidden group">
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
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent md:bg-gradient-to-l pointer-events-none" />
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => scrollModal('left')}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300 opacity-0 group-hover:opacity-100 hidden md:flex"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => scrollModal('right')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300 opacity-0 group-hover:opacity-100 hidden md:flex"
                >
                  <ChevronRight size={20} />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-[10px] text-white/70 border border-white/10 md:hidden pointer-events-none">
                  Tap to expand
                </div>
              </div>

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

                <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                  <a
                    href={selectedProject.liveUrl}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2.5 bg-gradient-to-r from-[#7e6ee3] to-[#5b6ee3] rounded-lg text-white font-medium hover:shadow-lg hover:shadow-[#7e6ee3]/30 transition-all duration-300"
                  >
                    <ExternalLink size={17} />
                    Live Demo
                  </a>
                  <a
                    href={selectedProject.githubUrl}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2.5 glass rounded-lg text-white font-medium hover:bg-white/10 transition-all duration-300"
                  >
                    <Github size={17} />
                    {selectedProject.isPrivate ? "Private Repo 🔐" : "View Code"}
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
          className="fixed inset-0 z-[20000] bg-black/95 backdrop-blur-md flex flex-col cursor-default"
          style={{ pointerEvents: 'auto' }}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={closeModal}
        >
          <button
            onClick={(e) => { e.stopPropagation(); closeModal(); }}
            className="absolute top-4 right-4 z-[20001] text-white/70 hover:text-white p-2 bg-black/20 rounded-full backdrop-blur-sm cursor-pointer transition-colors"
          >
            <X size={32} />
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
                  className="max-w-full max-h-full object-contain shadow-2xl select-none"
                  draggable={false}
                />
              </div>
            ))}
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); handleFullScreenNav('left'); }}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all backdrop-blur-sm hidden md:flex z-[20001] cursor-pointer"
          >
            <ChevronLeft size={36} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleFullScreenNav('right'); }}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all backdrop-blur-sm hidden md:flex z-[20001] cursor-pointer"
          >
            <ChevronRight size={36} />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-sm font-medium tracking-widest pointer-events-none">
            {fullScreenImageIndex + 1} / {(selectedProject.images && selectedProject.images.length > 0 ? selectedProject.images : [selectedProject.image]).length}
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}