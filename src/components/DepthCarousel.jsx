import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, Sparkles, MoveHorizontal } from 'lucide-react';
import { soundFx } from '../utils/audio';

/**
 * DepthCarousel Component (Bright Luxury Portrait Gallery Theme)
 * 3D Depth Photo Stack for Zeelu's 7 Photos.
 * Supports both scroll-driven active index updates and manual touch/drag/arrow controls.
 */
export default function DepthCarousel({ photos = [], externalActiveIndex = null }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragStartX, setDragStartX] = useState(null);
  const [heartAnim, setHeartAnim] = useState(false);

  // Sync external index if provided (e.g. from ScrollTrigger scrub)
  useEffect(() => {
    if (externalActiveIndex !== null && externalActiveIndex !== undefined) {
      setCurrentIndex((prev) => {
        if (prev !== externalActiveIndex) {
          return externalActiveIndex;
        }
        return prev;
      });
    }
  }, [externalActiveIndex]);

  const prevPhoto = () => {
    soundFx.playPopSound();
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
    triggerHeart();
  };

  const nextPhoto = () => {
    soundFx.playPopSound();
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
    triggerHeart();
  };

  const triggerHeart = () => {
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 800);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prevPhoto();
      if (e.key === 'ArrowRight') nextPhoto();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [photos.length]);

  // Touch drag handlers
  const handleTouchStart = (e) => setDragStartX(e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    if (dragStartX === null) return;
    const diff = e.changedTouches[0].clientX - dragStartX;
    if (diff > 50) prevPhoto();
    if (diff < -50) nextPhoto();
    setDragStartX(null);
  };

  const handleMouseDown = (e) => setDragStartX(e.clientX);
  const handleMouseUp = (e) => {
    if (dragStartX === null) return;
    const diff = e.clientX - dragStartX;
    if (diff > 50) prevPhoto();
    if (diff < -50) nextPhoto();
    setDragStartX(null);
  };

  if (!photos || photos.length === 0) return null;

  return (
    <div className="relative w-full py-4 flex flex-col items-center justify-center overflow-hidden select-none">
      {/* Soft Ambient Reaction Glow based on active card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-96 h-80 sm:h-96 bg-rose-300/30 rounded-full blur-[110px] pointer-events-none transition-all duration-1000" />

      {/* Drag instruction badge */}
      <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-rose-200 text-rose-800 text-xs font-bold tracking-wider uppercase shadow-sm backdrop-blur-md">
        <MoveHorizontal className="w-3.5 h-3.5 animate-pulse text-rose-500" />
        <span>Swipe / Drag to view photos ✨</span>
      </div>

      {/* 3D Perspective Stage Container */}
      <div
        className="relative w-full max-w-4xl h-[380px] sm:h-[450px] md:h-[500px] flex items-center justify-center perspective-1500"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {photos.map((photo, index) => {
          // Calculate relative offset dynamically for 7 photos
          const total = photos.length;
          let offset = index - currentIndex;
          if (offset > total / 2) offset -= total;
          if (offset < -total / 2) offset += total;

          const isActive = offset === 0;

          // 3D positioning logic based on offset
          let transformStyle = {};
          let zIndex = 10;
          let opacity = 0;
          let filter = 'blur(10px)';

          if (isActive) {
            transformStyle = {
              transform: 'translateX(0px) translateZ(100px) rotateY(0deg) scale(1)',
            };
            zIndex = 30;
            opacity = 1;
            filter = 'blur(0px)';
          } else if (offset === -1) {
            transformStyle = {
              transform: 'translateX(-55%) translateZ(-150px) rotateY(25deg) scale(0.82)',
            };
            zIndex = 20;
            opacity = 0.75;
            filter = 'blur(2px)';
          } else if (offset === 1) {
            transformStyle = {
              transform: 'translateX(55%) translateZ(-150px) rotateY(-25deg) scale(0.82)',
            };
            zIndex = 20;
            opacity = 0.75;
            filter = 'blur(2px)';
          } else if (offset === -2) {
            transformStyle = {
              transform: 'translateX(-90%) translateZ(-350px) rotateY(40deg) scale(0.65)',
            };
            zIndex = 10;
            opacity = 0.35;
            filter = 'blur(5px)';
          } else if (offset === 2) {
            transformStyle = {
              transform: 'translateX(90%) translateZ(-350px) rotateY(-40deg) scale(0.65)',
            };
            zIndex = 10;
            opacity = 0.35;
            filter = 'blur(5px)';
          } else {
            transformStyle = {
              transform: `translateX(${offset * 40}%) translateZ(-500px) scale(0.5)`,
            };
            zIndex = 0;
            opacity = 0;
            filter = 'blur(10px)';
          }

          return (
            <div
              key={photo.id || index}
              onClick={() => {
                if (!isActive) {
                  soundFx.playPopSound();
                  setCurrentIndex(index);
                  triggerHeart();
                }
              }}
              className="absolute w-[260px] sm:w-[320px] md:w-[380px] h-[340px] sm:h-[400px] md:h-[450px] rounded-3xl overflow-hidden cursor-pointer transition-all duration-700 ease-out shadow-[0_20px_50px_rgba(244,63,94,0.18)] border-4 sm:border-8 border-white preserve-3d group bg-white"
              style={{
                ...transformStyle,
                zIndex,
                opacity,
                filter,
              }}
            >
              {/* Photo Image */}
              <img
                src={photo.image}
                alt={photo.caption}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />

              {/* Photo Shadow Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/25 to-transparent" />

              {/* Sparkle badge for active card */}
              {isActive && (
                <div className="absolute top-4 right-4 p-2 rounded-full bg-white/40 backdrop-blur-md border border-white/60 text-white shadow-sm">
                  <Sparkles className="w-5 h-5 animate-spin text-rose-100" style={{ animationDuration: '6s' }} />
                </div>
              )}

              {/* Caption & Description Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-left transform transition-transform duration-300">
                <span className="text-[11px] font-extrabold tracking-widest text-rose-300 uppercase block mb-1">
                  {photo.tag || `Photo ${index + 1}`}
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-heading text-white tracking-tight leading-snug drop-shadow-md">
                  {photo.caption}
                </h3>
                {photo.subCaption && (
                  <p className="mt-1 text-xs sm:text-sm text-rose-100/95 font-serif-title italic leading-relaxed">
                    "{photo.subCaption}"
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Burst Heart Animation on Card Change */}
      <AnimatePresence>
        {heartAnim && (
          <motion.div
            initial={{ scale: 0, opacity: 1, y: 0 }}
            animate={{ scale: 2, opacity: 0, y: -60 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.8)]"
          >
            <Heart className="w-16 h-16 fill-rose-500" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Controls */}
      <div className="mt-6 flex items-center justify-center gap-5 z-40">
        <button
          onClick={prevPhoto}
          aria-label="Previous photo"
          className="p-3 rounded-full bg-white/90 hover:bg-rose-600 text-rose-800 hover:text-white border border-rose-200 transition-all transform hover:scale-110 active:scale-95 shadow-md backdrop-blur-md"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Counter Pills */}
        <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/90 border border-rose-200 shadow-md backdrop-blur-md">
          {photos.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                soundFx.playPopSound();
                setCurrentIndex(idx);
                triggerHeart();
              }}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-7 bg-rose-600' : 'w-2.5 bg-rose-200 hover:bg-rose-400'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextPhoto}
          aria-label="Next photo"
          className="p-3 rounded-full bg-white/90 hover:bg-rose-600 text-rose-800 hover:text-white border border-rose-200 transition-all transform hover:scale-110 active:scale-95 shadow-md backdrop-blur-md"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </div>
  );
}
