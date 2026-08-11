import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * CustomCursor Component (Bright Soft Pink Theme)
 * Subtle desktop magnetic custom cursor with contextual labels.
 * Automatically hidden on touch / mobile devices.
 */
export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [cursorText, setCursorText] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const onMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });

      const target = e.target.closest('[data-cursor]');
      if (target) {
        setCursorText(target.getAttribute('data-cursor') || '');
        setIsHovered(true);
      } else if (e.target.closest('button') || e.target.closest('a')) {
        setCursorText('');
        setIsHovered(true);
      } else {
        setCursorText('');
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  if (isMobile) return null;

  return (
    <>
      {/* Outer Cursor Follow Ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border-2 border-rose-500 bg-rose-500/20 backdrop-blur-[2px] flex items-center justify-center text-center font-bold text-[11px] text-rose-950 shadow-[0_0_15px_rgba(244,63,94,0.4)] transform -translate-x-1/2 -translate-y-1/2"
        animate={{
          x: position.x - (cursorText ? 42 : isHovered ? 24 : 16),
          y: position.y - (cursorText ? 42 : isHovered ? 24 : 16),
          width: cursorText ? 84 : isHovered ? 48 : 32,
          height: cursorText ? 84 : isHovered ? 48 : 32,
          scale: isHovered ? 1.15 : 1,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 250, mass: 0.2 }}
      >
        {cursorText && (
          <span className="leading-tight px-1 font-extrabold uppercase tracking-wider text-rose-950 bg-white/80 rounded-full py-0.5 shadow-sm">
            {cursorText}
          </span>
        )}
      </motion.div>

      {/* Inner Pin Dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] w-2.5 h-2.5 rounded-full bg-rose-600 shadow-[0_0_10px_#f43f5e] transform -translate-x-1/2 -translate-y-1/2"
        animate={{
          x: position.x - 5,
          y: position.y - 5,
        }}
        transition={{ type: 'spring', damping: 35, stiffness: 450, mass: 0.05 }}
      />
    </>
  );
}
