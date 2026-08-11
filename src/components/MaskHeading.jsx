import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

/**
 * MaskHeading Component
 * Implements Cinematic Masked Text Reveal animation.
 * Text is clipped within an overflow-hidden wrapper, rising up with stagger, opacity & blur.
 */
export default function MaskHeading({
  children,
  text,
  tag = 'h2',
  className = '',
  delay = 0.1,
  stagger = 0.05,
  size = 'text-4xl sm:text-6xl md:text-7xl font-extrabold',
  serif = false,
  gradient = false,
  textColor = ''
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: '-10% 0px -10% 0px' });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  const textContent = text || (typeof children === 'string' ? children : '');
  const words = textContent.split(' ');

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = {
    hidden: {
      y: '120%',
      opacity: 0,
      filter: 'blur(10px)',
      scale: 1.05,
      rotateX: -15,
    },
    visible: {
      y: '0%',
      opacity: 1,
      filter: 'blur(0px)',
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.9,
        ease: [0.215, 0.61, 0.355, 1],
      },
    },
  };

  const Tag = tag;

  return (
    <div ref={ref} className={`overflow-hidden py-1.5 ${className}`}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="flex flex-wrap items-center justify-center gap-x-[0.3em] gap-y-[0.1em]"
      >
        {words.length > 0 ? (
          words.map((word, idx) => (
            <div key={idx} className="overflow-hidden inline-block py-1 px-1">
              <motion.span
                variants={itemVariants}
                className={`inline-block transform-gpu tracking-tight ${size} ${
                  serif ? 'font-serif-title italic font-normal' : 'font-heading font-extrabold'
                } ${
                  textColor
                    ? textColor
                    : gradient
                    ? 'bg-gradient-to-r from-rose-700 via-pink-600 to-rose-900 bg-clip-text text-transparent drop-shadow-sm'
                    : 'text-rose-950'
                }`}
              >
                {word}
              </motion.span>
            </div>
          ))
        ) : (
          <div className="overflow-hidden py-1">
            <motion.div variants={itemVariants} className="inline-block transform-gpu">
              <Tag className={`${size} ${className}`}>{children}</Tag>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
