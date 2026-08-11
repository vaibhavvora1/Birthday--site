import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import MaskHeading from '../MaskHeading';
import Particles from '../Particles';
import { RotateCcw, Heart, Cake, PartyPopper } from 'lucide-react';
import { soundFx } from '../../utils/audio';

/**
 * Scene 8 — Final Celebration Scene (Bright Soft Pink Theme)
 * Grand finale with fireworks, exploding confetti, huge masked typography,
 * P.S. joke, and Replay button.
 */
export default function BirthdayFinale({ onReplay }) {
  const [psStep, setPsStep] = useState(0);

  useEffect(() => {
    soundFx.playCelebrationChime();
    const interval = setInterval(() => {
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#fb7185', '#fda4af', '#f472b6', '#ffffff', '#fbbf24'],
      });
    }, 2500);

    const timer1 = setTimeout(() => setPsStep(1), 2500); // "P.S. — You better appreciate..."
    const timer2 = setTimeout(() => setPsStep(2), 5500); // "Okay bye..."
    const timer3 = setTimeout(() => setPsStep(3), 7800); // "HAPPY BIRTHDAY AGAIN, ZEELU ❤️🎂"

    return () => {
      clearInterval(interval);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleReplay = () => {
    soundFx.playPopSound();
    onReplay();
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-4 py-16 bg-gradient-to-b from-[#fff5f8] via-[#ffe4e9] to-[#fff0f4] text-slate-900 overflow-hidden select-none">
      {/* Floating Particles Engine */}
      <Particles heartMode={true} count={60} />

      {/* Ambient Glow Circles */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-rose-200/60 rounded-full blur-[140px] pointer-events-none animate-pulse" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center justify-center">
        {/* Grand Typography Masked Reveals */}
        <div className="space-y-1 sm:space-y-3">
          <MaskHeading
            text="HAPPY"
            size="text-5xl sm:text-8xl md:text-9xl font-black tracking-tight uppercase"
            textColor="text-rose-950"
            delay={0.1}
          />
          <MaskHeading
            text="BIRTHDAY"
            size="text-5xl sm:text-8xl md:text-9xl font-black tracking-tight uppercase"
            textColor="bg-gradient-to-r from-rose-700 via-pink-600 to-rose-900 bg-clip-text text-transparent"
            delay={0.2}
          />
          <MaskHeading
            text="ZEELU ❤️"
            size="text-5xl sm:text-8xl md:text-9xl font-black tracking-tight uppercase"
            textColor="text-rose-800"
            delay={0.3}
          />
        </div>

        {/* Celebration Wish */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-8 text-rose-900 text-lg sm:text-2xl font-serif-title italic max-w-2xl"
        >
          Here's to another year of happiness, laughter, adventures and unforgettable memories.
        </motion.p>

        {/* Animated Icons */}
        <div className="my-8 flex items-center justify-center gap-6 text-rose-600">
          <PartyPopper className="w-8 h-8 animate-bounce" />
          <Cake className="w-10 h-10 text-rose-500" />
          <Heart className="w-8 h-8 fill-rose-500 text-rose-500 animate-pulse" />
        </div>

        {/* Timed P.S. Joke Section */}
        <div className="min-h-[140px] flex flex-col items-center justify-center my-4">
          {psStep >= 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="p-4 rounded-2xl bg-white/90 border border-rose-300 shadow-md backdrop-blur-md max-w-lg mb-3"
            >
              <p className="text-rose-900 text-base sm:text-lg font-bold">
                P.S. — You better appreciate all the effort I put into this 😂❤️
              </p>
              <span className="text-xs text-rose-600 font-semibold block mt-1">
                — Vaibhav Vora ❤️
              </span>
            </motion.div>
          )}

          {psStep >= 2 && psStep < 3 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-rose-700 font-serif-title italic text-lg"
            >
              Okay bye...
            </motion.p>
          )}

          {psStep >= 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="flex flex-col items-center"
            >
              <MaskHeading
                text="HAPPY BIRTHDAY AGAIN, ZEELU ❤️🎂"
                size="text-3xl sm:text-5xl font-black uppercase"
                textColor="text-rose-950"
                delay={0.1}
              />
            </motion.div>
          )}
        </div>

        {/* Replay Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          onClick={handleReplay}
          data-cursor="replay"
          className="mt-6 group inline-flex items-center gap-3 px-9 py-4 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 text-white font-extrabold text-base sm:text-lg shadow-[0_10px_35px_rgba(244,63,94,0.4)] hover:shadow-[0_15px_50px_rgba(244,63,94,0.65)] transition-all transform hover:scale-105 active:scale-95 border border-rose-200"
        >
          <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700" />
          <span>REPLAY THE SURPRISE ↻</span>
        </motion.button>
      </div>
    </section>
  );
}
