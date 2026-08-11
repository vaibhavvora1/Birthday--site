import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sparkles, Heart, Play, Volume2, VolumeX } from 'lucide-react';
import MaskHeading from './MaskHeading';
import Petals from './Petals';
import { personalityGallery } from '../data/personalityGallery';
import { soundFx } from '../utils/audio';

/**
 * "Your Beauty & Personality" Accordion Gallery Section
 * Speaks directly to Zeel ("You", "Your") highlighting all sides of her personality.
 */
export default function PersonalityAccordionSection({ onComplete }) {
  const [openIndex, setOpenIndex] = useState(0); // Default to first item open
  const videoRefs = useRef({});

  // Pause playing videos when active accordion item changes
  useEffect(() => {
    Object.values(videoRefs.current).forEach((videoEl) => {
      if (videoEl && !videoEl.paused) {
        videoEl.pause();
      }
    });
  }, [openIndex]);

  const handleToggle = (index) => {
    soundFx.playPopSound?.();
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const handleVideoPlay = (activeKey) => {
    Object.entries(videoRefs.current).forEach(([key, videoEl]) => {
      if (key !== activeKey && videoEl && !videoEl.paused) {
        videoEl.pause();
      }
    });
  };

  return (
    <section className="relative w-full min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#fff5f8] via-[#fdf2f5] to-[#fff0f4] text-slate-800 overflow-hidden select-none">
      {/* Background Petals & Ambient Glow Orbs */}
      <Petals count={25} />

      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-rose-200/40 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-[500px] h-[500px] bg-pink-200/30 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        {/* ── Section Introduction Header ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 max-w-3xl flex flex-col items-center"
        >
          {/* Small Label */}
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 border border-rose-200 text-rose-800 text-xs sm:text-sm font-extrabold uppercase tracking-widest shadow-sm mb-4">
            <Sparkles className="w-4 h-4 text-rose-500 animate-pulse" />
            A LITTLE MORE ABOUT YOU
          </span>

          {/* Main Heading */}
          <MaskHeading
            text="The Many Sides of You"
            size="text-3xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight"
            textColor="bg-gradient-to-r from-rose-950 via-rose-800 to-pink-900 bg-clip-text text-transparent"
            delay={0.1}
          />

          {/* Direct Address Subtitle */}
          <div className="mt-5 space-y-2 text-rose-900/90 text-base sm:text-xl font-serif-title italic leading-relaxed">
            <p>
              “You aren't just one personality. You are a little bit of everything.”
            </p>
            <p className="text-rose-950 font-bold not-italic text-sm sm:text-lg">
              You can be the most caring person one moment and the most naughty person the next — talking a lot, laughing a lot, feeling deeply, and somehow making ordinary moments memorable.
            </p>
          </div>
        </motion.div>

        {/* ── Accordion List ─────────────────────────────────────────────────── */}
        <div className="w-full space-y-4">
          {personalityGallery.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className={`w-full rounded-3xl transition-all duration-500 overflow-hidden border ${
                  isOpen
                    ? 'bg-white/95 border-rose-300 shadow-[0_15px_45px_rgba(244,63,94,0.18)] ring-2 ring-rose-200/60'
                    : 'bg-white/70 hover:bg-white/90 border-rose-100/80 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Accordion Header (Closed / Collapsed Bar) */}
                <button
                  onClick={() => handleToggle(index)}
                  className="w-full px-5 sm:px-8 py-5 flex items-center justify-between gap-4 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                    {/* Index Number */}
                    <span
                      className={`font-black text-2xl sm:text-3xl tracking-tighter transition-colors ${
                        isOpen ? 'text-rose-600' : 'text-rose-300 group-hover:text-rose-500'
                      }`}
                    >
                      {item.number}
                    </span>

                    {/* Small Preview Thumbnail */}
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden shadow-inner flex-shrink-0 border border-rose-200/60 group-hover:scale-105 transition-transform duration-300">
                      <img
                        src={item.previewImage}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>

                    {/* Title and Category Tag */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3
                          className={`text-lg sm:text-2xl font-extrabold tracking-tight transition-colors ${
                            isOpen ? 'text-rose-950' : 'text-slate-800 group-hover:text-rose-900'
                          }`}
                        >
                          {item.title}
                        </h3>
                      </div>
                      <span className="text-xs font-semibold text-rose-500 tracking-wider uppercase">
                        {item.categoryTag}
                      </span>
                    </div>
                  </div>

                  {/* Toggle Chevron */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                      isOpen
                        ? 'bg-rose-500 text-white rotate-180 shadow-md shadow-rose-200'
                        : 'bg-rose-100/70 text-rose-700 group-hover:bg-rose-200'
                    }`}
                  >
                    <ChevronDown className="w-5 h-5 transition-transform duration-300" />
                  </div>
                </button>

                {/* Accordion Content (Expanded State) */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-5 sm:px-8 pb-8 pt-2 border-t border-rose-100/60 space-y-6">
                        {/* Traits Badges */}
                        {item.traits && item.traits.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-2">
                            {item.traits.map((trait, tIdx) => (
                              <span
                                key={tIdx}
                                className="px-3 py-1 rounded-full bg-rose-100/80 text-rose-800 text-xs font-bold border border-rose-200/80 shadow-2xs"
                              >
                                ✨ {trait}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Description */}
                        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-rose-50/80 via-pink-50/40 to-white border border-rose-200/70 shadow-inner">
                          <p className="text-rose-950 font-serif-title text-base sm:text-xl italic leading-relaxed whitespace-pre-line">
                            “{item.description}”
                          </p>
                        </div>

                        {/* Media Gallery Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {item.media.map((med, idx) => (
                            <MediaCard
                              key={idx}
                              media={med}
                              mediaKey={`${item.id}-${idx}`}
                              onPlay={() => handleVideoPlay(`${item.id}-${idx}`)}
                              registerVideoRef={(el) => {
                                videoRefs.current[`${item.id}-${idx}`] = el;
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* ── Best Friend Emotional Conclusion Block ──────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-14 max-w-2xl text-center space-y-4"
        >
          <div className="p-6 sm:p-8 rounded-3xl bg-white/90 border border-rose-200 shadow-md space-y-3">
            <p className="text-rose-900 font-serif-title text-lg sm:text-2xl italic leading-relaxed">
              “You are stronger than you think, smarter than you realize, and more special than you probably know. And honestly... I wouldn't change the person you are.”
            </p>
            <p className="text-rose-950 font-bold text-base sm:text-xl not-italic pt-2">
              This is you. And you are the person I am lucky enough to call my best friend. ❤️
            </p>
          </div>

          <button
            onClick={() => {
              soundFx.playPopSound?.();
              onComplete();
            }}
            data-cursor="the letter"
            className="mt-6 group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 text-white font-extrabold text-base sm:text-lg shadow-[0_10px_35px_rgba(244,63,94,0.35)] hover:shadow-[0_15px_45px_rgba(244,63,94,0.55)] transition-all transform hover:scale-105 active:scale-95 border border-rose-200 cursor-pointer"
          >
            <Heart className="w-5 h-5 fill-white text-rose-200 group-hover:scale-110 transition-transform" />
            <span>ONE LAST THING... →</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}

/**
 * MediaCard Component: Renders Image or Responsive Video Player
 */
function MediaCard({ media, mediaKey, onPlay, registerVideoRef }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  const toggleVideo = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      onPlay();
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  if (media.type === 'video') {
    return (
      <div className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-rose-200/80 shadow-md flex flex-col justify-between">
        <div className="relative w-full aspect-[4/5] sm:aspect-square bg-black overflow-hidden flex items-center justify-center">
          <video
            ref={(el) => {
              videoRef.current = el;
              registerVideoRef(el);
            }}
            src={media.src}
            preload="metadata"
            muted={isMuted}
            playsInline
            controls={false}
            onPlay={() => {
              setIsPlaying(true);
              onPlay();
            }}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            className="w-full h-full object-cover cursor-pointer"
            onClick={toggleVideo}
          />

          {!isPlaying && (
            <button
              onClick={toggleVideo}
              className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg hover:scale-110 hover:bg-rose-500 transition-all cursor-pointer z-10"
              aria-label="Play video"
            >
              <Play className="w-6 h-6 fill-white translate-x-0.5" />
            </button>
          )}

          <button
            onClick={toggleMute}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black/80 transition-colors z-20"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-rose-400" />}
          </button>
        </div>

        {media.caption && (
          <div className="p-3 bg-white border-t border-rose-100 flex items-center justify-between">
            <p className="text-xs font-semibold text-rose-950 truncate">
              {media.caption}
            </p>
            <span className="text-[10px] uppercase font-bold text-rose-500 px-2 py-0.5 rounded bg-rose-50 border border-rose-200">
              VIDEO
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-white border border-rose-200/70 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      <div className="relative w-full aspect-[4/5] sm:aspect-square overflow-hidden bg-rose-50">
        <img
          src={media.src}
          alt={media.caption || 'Personality photo'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {media.caption && (
        <div className="p-3 bg-white border-t border-rose-100">
          <p className="text-xs font-semibold text-rose-950 truncate">
            {media.caption}
          </p>
        </div>
      )}
    </div>
  );
}
