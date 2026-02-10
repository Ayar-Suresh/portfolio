import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trail1Ref = useRef<HTMLDivElement>(null);
  const trail2Ref = useRef<HTMLDivElement>(null);
  const trail3Ref = useRef<HTMLDivElement>(null);
  const trail4Ref = useRef<HTMLDivElement>(null);
  const trail5Ref = useRef<HTMLDivElement>(null);
  const trailRefs = [trail1Ref, trail2Ref, trail3Ref, trail4Ref, trail5Ref];
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Check for touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const cursor = cursorRef.current;
    if (!cursor) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      
      // Main cursor follows immediately
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.08,
        ease: 'power2.out',
      });

      // Trails follow with delay
      trailRefs.forEach((trailRef, i) => {
        const trail = trailRef.current;
        if (trail) {
          gsap.to(trail, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.15 + i * 0.05,
            ease: 'power2.out',
          });
        }
      });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    // Magnetic effect for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [data-cursor-hover]');
    
    const handleElementEnter = () => setIsHovering(true);
    const handleElementLeave = () => setIsHovering(false);

    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleElementEnter);
      el.addEventListener('mouseleave', handleElementLeave);
    });

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleElementEnter);
        el.removeEventListener('mouseleave', handleElementLeave);
      });
    };
  }, []);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      {/* Trail dots */}
      {trailRefs.map((_, i) => (
        <div
          key={i}
          ref={trailRefs[i]}
          className="fixed pointer-events-none z-[9998] mix-blend-screen"
          style={{
            width: 8 - i,
            height: 8 - i,
            borderRadius: '50%',
            backgroundColor: `rgba(126, 110, 227, ${0.3 - i * 0.05})`,
            transform: 'translate(-50%, -50%)',
            filter: `blur(${i}px)`,
          }}
        />
      ))}
      
      {/* Main cursor */}
      <div
        ref={cursorRef}
        className={`fixed pointer-events-none z-[9999] transition-all duration-150 ${
          isHovering ? 'scale-150' : ''
        } ${isClicking ? 'scale-75' : ''}`}
        style={{
          width: isHovering ? 40 : 16,
          height: isHovering ? 40 : 16,
          borderRadius: '50%',
          backgroundColor: isHovering ? 'transparent' : 'white',
          border: isHovering ? '2px solid rgba(0, 240, 255, 0.8)' : 'none',
          boxShadow: isHovering 
            ? '0 0 20px rgba(0, 240, 255, 0.5), 0 0 40px rgba(0, 240, 255, 0.3)' 
            : '0 0 10px rgba(255, 255, 255, 0.5)',
          transform: 'translate(-50%, -50%)',
          mixBlendMode: isHovering ? 'normal' : 'difference',
        }}
      />
    </>
  );
}
