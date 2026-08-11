import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import MaskHeading from '../MaskHeading';
import { Mic, Wind, Sparkles } from 'lucide-react';
import { soundFx } from '../../utils/audio';

/**
 * Scene 3 — The Cake & Candle Blow Scene (Bright Soft Pink Theme)
 * Features 3D SVG cake, real mic blow detection with Web Audio API,
 * flame extinction, smoke particles, shake animation, and canvas-confetti burst.
 */
export default function BirthdayCake({ onComplete }) {
  const [blownOut, setBlownOut] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [blowVolume, setBlowVolume] = useState(0);

  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);

  // Initialize Microphone Blow Detection
  const enableMic = async () => {
    try {
      soundFx.initContext();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      setMicActive(true);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const checkBlow = () => {
        if (!analyserRef.current || blownOut) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        setBlowVolume(Math.min(100, Math.round(average)));

        if (average > 45 && !blownOut) {
          triggerBlowOut();
          return;
        }
        requestAnimationFrame(checkBlow);
      };
      checkBlow();
    } catch (err) {
      console.warn("Mic access denied or unavailable", err);
      setMicActive(false);
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const triggerBlowOut = () => {
    if (blownOut) return;
    soundFx.playBlowSound();
    setBlownOut(true);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    setTimeout(() => {
      soundFx.playCelebrationChime();
      fireConfetti();
    }, 500);
  };

  const fireConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#f43f5e', '#fb7185', '#fda4af', '#f472b6', '#ffffff', '#fbbf24'],
    };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-4 py-12 bg-gradient-to-b from-[#fff0f4] via-[#ffe4e9] to-[#fff5f8] overflow-hidden select-none">
      {/* Background Soft Pink Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-rose-200/50 rounded-full blur-[130px] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center justify-center">
        {!blownOut ? (
          <>
            <p className="text-rose-800 text-sm sm:text-base font-bold uppercase tracking-widest mb-1">
              Now it's starting to feel like a birthday...
            </p>
            <span className="text-rose-600 font-serif-title italic text-lg sm:text-xl block mb-4">
              But wait...
            </span>

            <MaskHeading
              text="MAKE A WISH."
              size="text-4xl sm:text-6xl font-black uppercase"
              textColor="text-rose-950"
              delay={0.1}
            />
            <p className="text-rose-900 text-base sm:text-lg font-medium mt-1 mb-8">
              Blow the candles below!
            </p>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <MaskHeading
              text="HAPPY BIRTHDAY ZEELU ❤️"
              size="text-4xl sm:text-7xl font-black uppercase tracking-tight"
              textColor="bg-gradient-to-r from-rose-700 via-pink-600 to-rose-900 bg-clip-text text-transparent"
              delay={0.2}
            />
            <p className="mt-3 text-rose-900 font-serif-title italic text-lg sm:text-xl">
              May all your secret wishes come true today and always ✨
            </p>
          </motion.div>
        )}

        {/* 3D SVG Birthday Cake */}
        <motion.div
          animate={
            blownOut
              ? { scale: [1, 1.05, 1], rotate: [0, -2, 2, 0] }
              : { y: [0, -10, 0] }
          }
          transition={
            blownOut
              ? { duration: 0.6 }
              : { duration: 4, repeat: Infinity, ease: 'easeInOut' }
          }
          className="relative w-72 sm:w-80 h-72 sm:h-80 my-4 flex items-center justify-center"
        >
          <svg
            viewBox="0 0 300 300"
            className="w-full h-full filter drop-shadow-[0_20px_40px_rgba(244,63,94,0.3)]"
          >
            <defs>
              <linearGradient id="cakeGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="50%" stopColor="#e11d48" />
                <stop offset="100%" stopColor="#9f1239" />
              </linearGradient>
              <linearGradient id="frostingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fff1f2" />
                <stop offset="100%" stopColor="#fecdd3" />
              </linearGradient>
              <linearGradient id="flameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#ea580c" />
                <stop offset="50%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#fef08a" />
              </linearGradient>
            </defs>

            {/* Cake Base Plate */}
            <ellipse cx="150" cy="250" rx="130" ry="25" fill="#fbcfe8" opacity="0.9" />
            <ellipse cx="150" cy="245" rx="120" ry="20" fill="#ffffff" opacity="0.9" />

            {/* Cake Bottom Layer */}
            <path
              d="M 50 180 L 50 230 Q 150 265 250 230 L 250 180 Z"
              fill="url(#cakeGrad1)"
            />
            <ellipse cx="150" cy="180" rx="100" ry="22" fill="#be123c" />

            {/* Cream Frosting Drips */}
            <path
              d="M 50 180 Q 70 200 90 180 Q 110 205 130 180 Q 160 210 190 180 Q 220 205 250 180 Q 250 175 150 160 Q 50 175 50 180 Z"
              fill="url(#frostingGrad)"
            />

            {/* Cake Top Layer */}
            <path
              d="M 70 120 L 70 170 Q 150 200 230 170 L 230 120 Z"
              fill="url(#cakeGrad1)"
            />
            <ellipse cx="150" cy="120" rx="80" ry="18" fill="url(#frostingGrad)" />

            {/* Cake Flowers */}
            <circle cx="110" cy="125" r="7" fill="#f43f5e" />
            <circle cx="150" cy="130" r="8" fill="#fda4af" />
            <circle cx="190" cy="125" r="7" fill="#f43f5e" />

            {/* Candles */}
            <rect x="110" y="80" width="8" height="40" rx="3" fill="#fef08a" />
            <line x1="114" y1="75" x2="114" y2="80" stroke="#475569" strokeWidth="2" />

            <rect x="146" y="70" width="8" height="50" rx="3" fill="#fda4af" />
            <line x1="150" y1="65" x2="150" y2="70" stroke="#475569" strokeWidth="2" />

            <rect x="182" y="80" width="8" height="40" rx="3" fill="#fef08a" />
            <line x1="186" y1="75" x2="186" y2="80" stroke="#475569" strokeWidth="2" />

            {/* Candle Flames */}
            {!blownOut ? (
              <g className="animate-flame">
                <ellipse cx="114" cy="65" rx="6" ry="12" fill="url(#flameGrad)" />
                <ellipse cx="150" cy="55" rx="8" ry="15" fill="url(#flameGrad)" />
                <ellipse cx="186" cy="65" rx="6" ry="12" fill="url(#flameGrad)" />
              </g>
            ) : (
              <g>
                <motion.path
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: [0.8, 0], y: [-5, -35], x: [-5, 5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  d="M 114 70 Q 110 50 120 30"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  fill="none"
                />
                <motion.path
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: [0.8, 0], y: [-5, -45], x: [0, -10] }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: 0.2 }}
                  d="M 150 60 Q 155 40 145 20"
                  stroke="#64748b"
                  strokeWidth="2.5"
                  fill="none"
                />
                <motion.path
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: [0.8, 0], y: [-5, -35], x: [5, -5] }}
                  transition={{ duration: 1.6, repeat: Infinity, delay: 0.4 }}
                  d="M 186 70 Q 180 50 190 30"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  fill="none"
                />
              </g>
            )}
          </svg>
        </motion.div>

        {/* Action Controls */}
        {!blownOut ? (
          <div className="mt-6 flex flex-col items-center gap-4">
            <div className="flex flex-wrap items-center justify-center gap-4">
              {!micActive ? (
                <button
                  onClick={enableMic}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-rose-50 text-rose-800 text-sm font-semibold border border-rose-300 shadow-md backdrop-blur-md transition-all hover:scale-105"
                >
                  <Mic className="w-4 h-4 text-rose-500" />
                  <span>Enable Mic to Blow 🎙️</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Mic Listening (Blow into mic!)</span>
                  {blowVolume > 0 && <span className="ml-1 text-emerald-700">[{blowVolume}%]</span>}
                </div>
              )}

              <button
                onClick={triggerBlowOut}
                data-cursor="blow"
                className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-base shadow-[0_8px_25px_rgba(244,63,94,0.35)] hover:shadow-[0_12px_35px_rgba(244,63,94,0.55)] transition-all transform hover:scale-105 active:scale-95 border border-rose-200"
              >
                <Wind className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>BLOW CANDLES 💨</span>
              </button>
            </div>
          </div>
        ) : (
          <motion.button
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            onClick={onComplete}
            data-cursor="next"
            className="mt-8 inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 text-white font-bold text-base sm:text-lg shadow-[0_10px_30px_rgba(244,63,94,0.4)] hover:shadow-[0_15px_45px_rgba(244,63,94,0.6)] transition-all transform hover:scale-105 active:scale-95"
          >
            <span>CONTINUE THE SURPRISE →</span>
          </motion.button>
        )}
      </div>
    </section>
  );
}
