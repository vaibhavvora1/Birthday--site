import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import MaskHeading from '../MaskHeading';
import { Heart, Laugh } from 'lucide-react';
import { soundFx } from '../../utils/audio';

/**
 * Scene 4 — The Question & Escaping NO Button (Bright Soft Pink Theme)
 * Features runaway NO button that smoothly dodges cursor with funny phrase changes.
 */
export default function GiftQuestion({ onYes }) {
  const [answeredYes, setAnsweredYes] = useState(false);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [noTextIndex, setNoTextIndex] = useState(0);
  const noBtnRef = useRef(null);

  const noTexts = [
    'NO 😏',
    'NOPE 😂',
    'TRY AGAIN 😜',
    'TOO SLOW 🏃‍♂️',
    'CATCH ME FIRST 💨',
    'YES IS THE ANSWER ❤️',
  ];

  const handleNoHover = (e) => {
    soundFx.playPopSound();

    const padding = 100;
    const maxX = Math.min(window.innerWidth / 2 - padding, 220);
    const maxY = Math.min(window.innerHeight / 2 - padding, 180);

    const randomX = (Math.random() - 0.5) * maxX * 2;
    const randomY = (Math.random() - 0.5) * maxY * 2;

    setNoPos({ x: randomX, y: randomY });
    setNoTextIndex((prev) => (prev + 1) % noTexts.length);
  };

  const handleYes = () => {
    soundFx.playCelebrationChime();
    setAnsweredYes(true);
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-4 py-12 bg-gradient-to-b from-[#fff5f8] via-[#ffe4e9] to-[#fff0f4] overflow-hidden select-none">
      {/* Background Soft Pink Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-300/40 rounded-full blur-[130px] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center justify-center">
        {!answeredYes ? (
          <>
            <p className="text-rose-700 text-sm sm:text-base font-extrabold uppercase tracking-widest mb-2">
              ONE VERY IMPORTANT QUESTION...
            </p>

            <MaskHeading
              text="DO YOU LIKE THIS GIFT? 👀"
              size="text-3xl sm:text-6xl font-black uppercase tracking-tight"
              textColor="text-rose-950"
              delay={0.1}
            />

            {/* Interactive Buttons Container */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 min-h-[140px] relative w-full">
              {/* YES Button */}
              <button
                onClick={handleYes}
                data-cursor="YES!"
                className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 text-white font-extrabold text-lg sm:text-xl shadow-[0_10px_35px_rgba(244,63,94,0.4)] hover:shadow-[0_15px_50px_rgba(244,63,94,0.65)] transition-all transform hover:scale-110 active:scale-95 border border-rose-200 z-20"
              >
                <Heart className="w-6 h-6 fill-white text-rose-200 group-hover:scale-125 transition-transform" />
                <span>YES ❤️</span>
              </button>

              {/* Runaway Escaping NO Button */}
              <motion.button
                ref={noBtnRef}
                onMouseEnter={handleNoHover}
                onTouchStart={handleNoHover}
                animate={{
                  x: noPos.x,
                  y: noPos.y,
                  rotate: (Math.random() - 0.5) * 20,
                }}
                transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-rose-800 font-bold text-base border border-rose-300 shadow-md backdrop-blur-md cursor-pointer transition-colors hover:bg-rose-50 z-10"
              >
                <span>{noTexts[noTextIndex]}</span>
              </motion.button>
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center"
          >
            <div className="p-4 rounded-full bg-rose-100 text-rose-600 mb-4 border border-rose-300 shadow-md animate-bounce">
              <Laugh className="w-12 h-12" />
            </div>

            <MaskHeading
              text="I KNEW IT 😂❤️"
              size="text-4xl sm:text-7xl font-black uppercase"
              textColor="bg-gradient-to-r from-rose-700 via-pink-600 to-rose-900 bg-clip-text text-transparent"
              delay={0.1}
            />

            <p className="mt-4 text-rose-900 text-lg sm:text-xl font-serif-title italic">
              Now let's talk about you...
            </p>

            <motion.button
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              onClick={onYes}
              data-cursor="about you"
              className="mt-10 inline-flex items-center gap-3 px-9 py-4 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 text-white font-extrabold text-base sm:text-lg shadow-[0_10px_35px_rgba(244,63,94,0.4)] hover:shadow-[0_15px_50px_rgba(244,63,94,0.65)] transition-all transform hover:scale-105 active:scale-95"
            >
              <span>SHOW ME →</span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
