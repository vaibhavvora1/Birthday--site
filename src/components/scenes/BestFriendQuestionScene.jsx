import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import MaskHeading from '../MaskHeading';
import Petals from '../Petals';
import { Heart, Sparkles, Smile, Star } from 'lucide-react';
import { soundFx } from '../../utils/audio';

/**
 * Scene 7 — Best Friend Question & Appreciation Moment
 * A warm, emotional, playful, and genuine best-friend question.
 */
export default function BestFriendQuestionScene({ onComplete }) {
  const [step, setStep] = useState(1);
  const [friendshipChoice, setFriendshipChoice] = useState(null); // 'OF_COURSE' | 'ALWAYS' | null

  const handleOfCourse = () => {
    soundFx.playCelebrationChime?.();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#fb7185', '#fda4af', '#f472b6', '#ffffff'],
    });
    setFriendshipChoice('OF_COURSE');
  };

  const handleAlways = () => {
    soundFx.playCelebrationChime?.();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#fb7185', '#fda4af', '#f472b6', '#ffffff'],
    });
    setFriendshipChoice('ALWAYS');
  };

  return (
    <section className="relative w-full min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#fff5f8] via-[#ffe4e9] to-[#fff0f4] text-slate-800 flex flex-col items-center justify-center text-center overflow-hidden select-none">
      {/* Background Petals & Soft Ambient Glow */}
      <Petals count={25} />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-pink-200/40 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto w-full flex flex-col items-center">

        {/* ── STEP 1: Personal Friendship Message ───────────────────────────── */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 flex flex-col items-center w-full"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100/90 border border-rose-200 text-rose-800 text-xs sm:text-sm font-extrabold uppercase tracking-widest shadow-xs">
              <Sparkles className="w-4 h-4 text-rose-500 animate-pulse" />
              SPECIAL MESSAGE FOR YOU
            </span>

            <div className="p-6 sm:p-10 rounded-3xl bg-white/95 border border-rose-200 shadow-xl space-y-4 text-left max-w-2xl text-rose-950">
              <p className="font-serif-title italic text-base sm:text-xl leading-relaxed text-rose-900">
                “I don't need anything complicated.”
              </p>
              <p className="font-serif-title italic text-base sm:text-lg leading-relaxed">
                I just want our friendship to stay this crazy, honest, caring, and beautiful.
              </p>

              <div className="py-3 px-4 rounded-2xl bg-rose-50/80 border border-rose-100 space-y-1.5 font-bold text-sm sm:text-base text-rose-900">
                <p>✨ More stupid conversations.</p>
                <p>✨ More laughing until we can't breathe.</p>
                <p>✨ More arguments over absolutely nothing.</p>
                <p>✨ More random calls.</p>
                <p>✨ More memories.</p>
                <p>✨ More moments where we look back and say, <em>'What were we even doing?'</em></p>
              </div>

              <p className="font-bold text-base sm:text-lg text-rose-950 pt-1">
                I want you to always know that you have a very special place in my life.
              </p>

              <p className="text-rose-900 font-serif-title italic text-base sm:text-lg border-t border-rose-100 pt-3">
                Love you so so much — as my best friend, my special person, and one of the people I never want to lose. ❤️
              </p>
            </div>

            <motion.button
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onClick={() => setStep(2)}
              className="mt-4 px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-base shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
            >
              ONE LITTLE QUESTION... →
            </motion.button>
          </motion.div>
        )}

        {/* ── STEP 2: The Final Best-Friend Question ────────────────────────── */}
        {step === 2 && friendshipChoice === null && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 flex flex-col items-center w-full"
          >
            <div className="space-y-2 text-center">
              <p className="text-rose-700 text-sm sm:text-base font-extrabold uppercase tracking-widest">
                Before you leave...
              </p>
              <p className="text-rose-900 font-serif-title italic text-lg sm:text-2xl">
                I have one little question for you.
              </p>
            </div>

            {/* Best-Friend Question Card */}
            <div className="w-full p-8 sm:p-12 rounded-3xl bg-white/95 border-2 border-rose-300 shadow-[0_20px_60px_rgba(244,63,94,0.2)] flex flex-col items-center space-y-6">
              <div className="w-14 h-14 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 shadow-sm">
                <Star className="w-7 h-7 fill-rose-400 text-rose-500 animate-pulse" />
              </div>

              <MaskHeading
                text="Will you always be my bestest special person? ❤️"
                size="text-2xl sm:text-5xl font-black uppercase tracking-tight"
                textColor="bg-gradient-to-r from-rose-700 via-pink-600 to-rose-900 bg-clip-text text-transparent"
                delay={0.2}
              />

              <p className="text-rose-900 font-serif-title italic text-base sm:text-xl max-w-lg">
                “The person I can laugh with, talk with, annoy, support, and make countless memories with?”
              </p>

              <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 text-rose-800 text-xs sm:text-sm font-medium italic max-w-md">
                “Because honestly, having you as my best friend is one of the most beautiful things in my life.”
              </div>

              {/* Friendship Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-5 w-full">
                {/* Of course Button */}
                <button
                  onClick={handleOfCourse}
                  data-cursor="Of course ❤️"
                  className="w-full sm:w-auto min-w-[200px] group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 text-white font-extrabold text-lg shadow-[0_10px_35px_rgba(244,63,94,0.4)] hover:shadow-[0_15px_45px_rgba(244,63,94,0.65)] transition-all transform hover:scale-105 active:scale-95 border border-rose-200 cursor-pointer"
                >
                  <Heart className="w-5 h-5 fill-white text-rose-200 group-hover:scale-125 transition-transform" />
                  <span>Of course ❤️</span>
                </button>

                {/* Always Button */}
                <button
                  onClick={handleAlways}
                  data-cursor="Always 🤍"
                  className="w-full sm:w-auto min-w-[200px] inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-rose-900 font-bold text-lg border-2 border-rose-300 shadow-sm hover:bg-rose-50 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Smile className="w-5 h-5 text-rose-500" />
                  <span>Always 🤍</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── STEP 3: Best Friend Final Celebration Screen ──────────────────── */}
        {friendshipChoice !== null && (
          <motion.div
            key="final-screen"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full p-8 sm:p-12 rounded-3xl bg-white/95 border-2 border-rose-300 shadow-[0_25px_70px_rgba(244,63,94,0.25)] flex flex-col items-center space-y-6 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-600 shadow-md">
              <Heart className="w-9 h-9 fill-rose-500 text-rose-500 animate-bounce" />
            </div>

            {/* Playful Friendship Response */}
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 font-bold text-base sm:text-xl max-w-lg">
              {friendshipChoice === 'OF_COURSE'
                ? "“I knew it. Now come on, we have a lot more memories to make.” 😏❤️"
                : "“That's all I wanted to hear. Now our friendship contract is officially permanent.” 📜✨"}
            </div>

            <div className="space-y-2 pt-2">
              <MaskHeading
                text="Best friends. Best memories. Best chaos."
                size="text-2xl sm:text-4xl font-extrabold"
                textColor="text-rose-950"
                delay={0.1}
              />
              <p className="text-rose-800 font-serif-title italic text-lg sm:text-2xl">
                And hopefully... a lifetime of it.
              </p>
            </div>

            <div className="pt-4 space-y-1">
              <MaskHeading
                text="Thank you for being you. ❤️"
                size="text-3xl sm:text-6xl font-black uppercase tracking-tight"
                textColor="bg-gradient-to-r from-rose-700 via-pink-600 to-rose-900 bg-clip-text text-transparent"
                delay={0.2}
              />
              <p className="text-sm sm:text-base font-bold text-rose-700 pt-2">
                — Vaibhav Vora, your best friend ❤️
              </p>
            </div>

            <motion.button
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              onClick={onComplete}
              data-cursor="celebrate"
              className="mt-6 inline-flex items-center gap-3 px-9 py-4 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 text-white font-extrabold text-base sm:text-lg shadow-[0_10px_35px_rgba(244,63,94,0.4)] hover:shadow-[0_15px_50px_rgba(244,63,94,0.65)] transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>CELEBRATE ZEELU! 🎉 →</span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
