import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MaskHeading from '../MaskHeading';
import Particles from '../Particles';
import { ArrowRight, Sparkles, Heart } from 'lucide-react';
import { soundFx } from '../../utils/audio';

/**
 * Scene 1 — Cinematic Intro (Bright Soft Pink Theme)
 * Cream/soft pink background with subtle floating particles. Includes Vaibhav Vora best friend attribution.
 */
export default function BirthdayIntro({ onNext }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Timed sequence progression
    const timer1 = setTimeout(() => setStep(1), 1800); // "I MADE SOMETHING FOR YOU."
    const timer2 = setTimeout(() => setStep(2), 4000); // "BECAUSE TODAY..."
    const timer3 = setTimeout(() => setStep(3), 6200); // "IS YOUR DAY." -> "HAPPY BIRTHDAY ZEE LU"

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleEnter = () => {
    soundFx.playPopSound();
    onNext();
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden select-none bg-gradient-to-b from-[#fff5f8] via-[#ffe4e9] to-[#fff0f4]">
      {/* Background Floating Particles */}
      <Particles heartMode={true} count={40} />

      {/* Soft Ambient Rose Glow Orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-pink-300/30 rounded-full blur-[140px] pointer-events-none animate-pulse" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[70vh]">
        {/* Step 0: "HEY ZEE LU..." */}
        <div className="mb-4">
          <MaskHeading
            text="HEY ZEELU..."
            size="text-3xl sm:text-5xl md:text-6xl font-black"
            textColor="text-rose-950"
            delay={0.2}
          />
        </div>

        {/* Step 1: "I MADE SOMETHING FOR YOU." */}
        {step >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <MaskHeading
              text="I MADE SOMETHING FOR YOU."
              size="text-2xl sm:text-4xl md:text-5xl font-bold"
              textColor="text-rose-800"
              serif={true}
              delay={0.1}
            />
          </motion.div>
        )}

        {/* Step 2: "BECAUSE TODAY..." */}
        {step >= 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="my-6"
          >
            <span className="text-rose-600 text-lg sm:text-xl font-bold uppercase tracking-widest block mb-2">
              BECAUSE TODAY...
            </span>
          </motion.div>
        )}

        {/* Step 3: "IS YOUR DAY." & "HAPPY BIRTHDAY ZEE LU ❤️" */}
        {step >= 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            <h3 className="text-xl sm:text-3xl font-extrabold text-rose-700 tracking-wider uppercase mb-3">
              IS YOUR DAY.
            </h3>

            {/* Main Grand Masked Title */}
            <MaskHeading
              text="HAPPY BIRTHDAY ZEELU ❤️"
              size="text-4xl sm:text-7xl md:text-8xl font-black uppercase tracking-tight"
              textColor="bg-gradient-to-r from-rose-700 via-pink-600 to-rose-900 bg-clip-text text-transparent drop-shadow-sm"
              delay={0.2}
            />

            {/* Vaibhav Vora Attribution */}
            <p className="mt-6 text-rose-900 text-base sm:text-xl font-serif-title italic max-w-lg">
              A little surprise created specially by your best friend, <strong className="font-bold text-rose-700 not-italic">Vaibhav Vora ❤️</strong>
            </p>

            {/* Enter Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              onClick={handleEnter}
              data-cursor="enter"
              className="mt-10 group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-rose-600 via-pink-500 to-rose-600 text-white font-bold text-base sm:text-lg shadow-[0_10px_35px_rgba(244,63,94,0.35)] hover:shadow-[0_15px_45px_rgba(244,63,94,0.55)] transition-all transform hover:scale-105 active:scale-95 border border-rose-200"
            >
              <Sparkles className="w-5 h-5 text-rose-100 animate-spin" style={{ animationDuration: '4s' }} />
              <span>ENTER THE SURPRISE</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
