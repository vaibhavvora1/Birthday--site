import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MaskHeading from '../MaskHeading';
import Particles from '../Particles';
import { Lightbulb, Sparkles } from 'lucide-react';
import { soundFx } from '../../utils/audio';

/**
 * Scene 2 — Lights Off Scene
 * Dark room contrast -> "TURN ON THE LIGHTS" interactive illumination to bright soft pink & white.
 */
export default function LightsScene({ onLightsOn }) {
  const [lightsOn, setLightsOn] = useState(false);

  const handleTurnOn = () => {
    soundFx.playCelebrationChime();
    setLightsOn(true);
    setTimeout(() => {
      onLightsOn();
    }, 1800);
  };

  return (
    <section className={`relative w-full min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden transition-colors duration-1000 select-none ${
      lightsOn ? 'bg-gradient-to-b from-[#fff5f8] via-[#ffe4e9] to-[#fff0f4]' : 'bg-[#14050f]'
    }`}>
      {/* Background Particles */}
      <div className={`transition-opacity duration-1000 ${lightsOn ? 'opacity-100' : 'opacity-40'}`}>
        <Particles heartMode={true} count={45} />
      </div>

      {/* Expanding Ambient Radial Light Surge */}
      <AnimatePresence>
        {lightsOn && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 3.5, opacity: 0.9 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-rose-300/40 via-pink-200/50 to-amber-100/40 rounded-full blur-[100px] pointer-events-none z-0"
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center justify-center">
        {!lightsOn ? (
          <>
            <p className="text-rose-300/80 text-sm sm:text-base font-semibold uppercase tracking-widest mb-3">
              Something feels missing...
            </p>

            <MaskHeading
              text="IT'S TOO DARK."
              size="text-4xl sm:text-6xl font-black text-rose-100"
              textColor="text-rose-100"
              delay={0.1}
            />

            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6 }}
              onClick={handleTurnOn}
              data-cursor="click"
              className="mt-10 group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-rose-900/90 hover:bg-rose-600 text-white font-bold text-base sm:text-lg border border-rose-400/50 shadow-[0_0_30px_rgba(244,63,94,0.4)] hover:shadow-[0_0_50px_rgba(244,63,94,0.8)] transition-all transform hover:scale-105 active:scale-95 backdrop-blur-md"
            >
              <Lightbulb className="w-5 h-5 text-amber-300 group-hover:animate-bounce" />
              <span>TURN ON THE LIGHTS</span>
            </motion.button>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <Sparkles className="w-12 h-12 text-rose-500 animate-spin mb-4" style={{ animationDuration: '3s' }} />
            <h2 className="text-3xl sm:text-5xl font-black text-rose-950 uppercase tracking-tight">
              Much Better! ✨
            </h2>
            <p className="mt-2 text-rose-800 font-serif-title italic text-lg sm:text-xl">
              Now let's bring out the birthday celebration...
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
