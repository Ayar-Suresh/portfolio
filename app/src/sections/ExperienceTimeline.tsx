import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Briefcase,
  Calendar,
  MapPin,
  ChevronDown,
  Code2,
  Users,
  Rocket,
  GraduationCap
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  description: string[];
  achievements: string[];
  techStack: string[];
  icon: React.ComponentType<{ size?: number; color?: string; className?: string }>;
  color: string;
}

const experiences: Experience[] = [
  {
    id: '1',
    role: 'Network Support Engineer',
    company: 'Sanghvi Infotech Pvt. Ltd.',
    location: 'India',
    period: '2025 - Present',
    description: [
      'Manage and troubleshoot enterprise network infrastructure',
      'Configure routers, switches, and client network environments',
      'Provide real-time issue resolution for connectivity and system failures',
    ],
    achievements: [
      'Resolved critical outages with minimal downtime',
      'Improved troubleshooting workflow efficiency',
      'Handled multi-client infrastructure support',
    ],
    techStack: ['Networking', 'Router Config', 'System Diagnostics', 'Infrastructure Support'],
    icon: Rocket,
    color: '#7e6ee3',
  },
  {
    id: '2',
    role: 'Freelance Developer',
    company: 'Independent',
    location: 'Remote',
    period: '2023 - Present',
    description: [
      'Build websites and lightweight applications for clients',
      'Integrate modern UI frameworks and responsive design',
      'Implement AI-powered features using APIs',
    ],
    achievements: [
      'Delivered multiple client websites',
      'Built production-ready frontend systems',
      'Integrated AI features into real-world apps',
    ],
    techStack: ['React', 'Next.js', 'TypeScript', 'Flutter', 'AI Integration'],
    icon: Code2,
    color: '#5b6ee3',
  },
  {
    id: '3',
    role: 'Founder & App Developer',
    company: 'OtakuNexa',
    location: 'Self-initiated Project',
    period: '2025 - Present',
    description: [
      'Designed and developed anime streaming platform',
      'Built both web and mobile versions of the application',
      'Handled UI, backend logic, and deployment',
    ],
    achievements: [
      'Launched public web + app platform',
      'Implemented custom UI/UX system',
      'Managed hosting and infrastructure',
    ],
    techStack: ['Flutter', 'Dart', 'Web Development', 'API Integration'],
    icon: Briefcase,
    color: '#00f0ff',
  },
  {
    id: '4',
    role: 'Self-Taught Programmer',
    company: 'Independent Learning',
    location: 'Personal Development',
    period: '2022 - 2024s',
    description: [
      'Learned core programming languages and app development',
      'Practiced building real-world projects',
      'Explored networking and system fundamentals',
    ],
    achievements: [
      'Built multiple experimental apps',
      'Developed strong problem-solving foundation',
      'Transitioned into professional IT work',
    ],
    techStack: ['Python', 'C', 'C++', 'Java', 'Networking Basics'],
    icon: GraduationCap,
    color: '#10b981',
  },
];

function TimelineItem({
  experience,
  index,
  isExpanded,
  onToggle
}: {
  experience: Experience;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const itemRef = useRef<HTMLDivElement>(null);
  const Icon = experience.icon;
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      ref={itemRef}
      initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className={`relative grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 ${isLeft ? '' : 'md:text-right'
        }`}
    >
      {/* Timeline node */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 hidden md:block">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.15 + 0.3, type: 'spring' }}
          className="w-12 h-12 rounded-full flex items-center justify-center z-10"
          style={{
            backgroundColor: `${experience.color}20`,
            border: `2px solid ${experience.color}`,
            boxShadow: `0 0 20px ${experience.color}40`,
          }}
        >
          <Icon size={20} color={experience.color} />
        </motion.div>
      </div>

      {/* Content */}
      <div className={`${isLeft ? 'md:pr-16' : 'md:col-start-2 md:pl-16'}`}>
        <div
          className="glass rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:bg-white/10"
          onClick={onToggle}
          data-cursor-hover
        >
          {/* Header */}
          <div className={`flex items-start gap-4 mb-4 ${isLeft ? '' : 'md:flex-row-reverse'}`}>
            <div className="md:hidden w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: `${experience.color}20`,
                border: `2px solid ${experience.color}`,
              }}
            >
              <Icon size={18} color={experience.color} />
            </div>
            <div className={isLeft ? '' : 'md:text-right'}>
              <h3 className="text-xl font-bold text-white mb-1">{experience.role}</h3>
              <p className="text-lg" style={{ color: experience.color }}>{experience.company}</p>
            </div>
          </div>

          {/* Meta */}
          <div className={`flex flex-wrap gap-4 mb-4 text-sm text-white/60 ${isLeft ? '' : 'md:justify-end'}`}>
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{experience.period}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              <span>{experience.location}</span>
            </div>
          </div>

          {/* Description */}
          <ul className={`space-y-2 mb-4 ${isLeft ? '' : 'md:text-right'}`}>
            {experience.description.map((item, i) => (
              <li key={i} className="text-white/70 text-sm flex items-start gap-2">
                <span
                  className="w-1 h-1 rounded-full mt-2 flex-shrink-0"
                  style={{ backgroundColor: experience.color }}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* Expandable content */}
          <motion.div
            initial={false}
            animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
            className="overflow-hidden"
          >
            {/* Achievements */}
            <div className={`pt-4 border-t border-white/10 mb-4 ${isLeft ? '' : 'md:text-right'}`}>
              <p className="text-sm text-white/50 mb-2">Key Achievements</p>
              <ul className="space-y-1">
                {experience.achievements.map((achievement, i) => (
                  <li key={i} className="text-white/80 text-sm flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack */}
            <div className={`${isLeft ? '' : 'md:text-right'}`}>
              <p className="text-sm text-white/50 mb-2">Tech Stack</p>
              <div className={`flex flex-wrap gap-2 ${isLeft ? '' : 'md:justify-end'}`}>
                {experience.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 text-xs bg-white/5 rounded-md text-white/70"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Expand button */}
          <div className={`mt-4 flex items-center gap-2 text-sm ${isLeft ? '' : 'md:flex-row-reverse'}`}>
            <span className="text-white/50">{isExpanded ? 'Show less' : 'Show more'}</span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown size={16} className="text-white/50" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ExperienceTimeline() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!lineRef.current || !timelineRef.current) return;

    const triggers: ScrollTrigger[] = [];

    const trigger = ScrollTrigger.create({
      trigger: timelineRef.current,
      start: 'top 60%',
      end: 'bottom 40%',
      onUpdate: (self) => {
        if (lineRef.current) {
          gsap.to(lineRef.current, {
            scaleY: self.progress,
            duration: 0.1,
            ease: 'none',
          });
        }
      },
    });

    triggers.push(trigger);

    return () => {
      triggers.forEach(t => t.kill());
    };
  }, []);

  return (
    <section id="experience" className="relative py-12 md:py-24 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-[#7e6ee3] text-sm font-medium uppercase tracking-wider mb-4 block">
            Professional Journey
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Work <span className="gradient-text">Experience</span>
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            A timeline of my professional growth, from junior developer to senior engineer.
          </p>
        </motion.div>

        {/* Timeline */}
        <div ref={timelineRef} className="relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 hidden md:block -translate-x-1/2">
            <div
              ref={lineRef}
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#7e6ee3] to-[#00f0ff] origin-top"
              style={{ height: '100%', transform: 'scaleY(0)' }}
            />
          </div>

          {/* Timeline Items */}
          <div className="relative">
            {experiences.map((experience, index) => (
              <TimelineItem
                key={experience.id}
                experience={experience}
                index={index}
                isExpanded={expandedId === experience.id}
                onToggle={() => setExpandedId(
                  expandedId === experience.id ? null : experience.id
                )}
              />
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { label: 'Years Experience', value: '2+', icon: Calendar },
            { label: 'Companies', value: '1', icon: Briefcase },
            { label: 'Projects Built', value: '17+', icon: Rocket },
            { label: 'Clients / Deployments', value: '5+', icon: Users },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-6 glass rounded-2xl">
              <stat.icon size={24} className="mx-auto mb-3 text-[#7e6ee3]" />
              <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
              <div className="text-sm text-white/60">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
