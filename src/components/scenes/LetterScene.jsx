import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MaskHeading from '../MaskHeading';
import { Heart, Sparkles } from 'lucide-react';
import { soundFx } from '../../utils/audio';

// ─── Typography ───────────────────────────────────────────────────────────────
// Times New Roman is used for the ENTIRE letter — no cursive or handwriting fonts.
const TN = "'Times New Roman', Times, serif";

// ─── Timing ───────────────────────────────────────────────────────────────────
// INTER_DELAY = total gap from when block[n] starts animating to when block[n+1] starts
// CLIP_DURATION = seconds it takes for the left→right wipe to finish
// Visible cursor blink window per block = INTER_DELAY − CLIP_DURATION*1000 ms
const INTER_DELAY   = 1600;   // ms between block reveals
const CLIP_DURATION = 0.85;   // seconds for clip-path wipe animation

// ─── Letter content blocks ────────────────────────────────────────────────────
// Each block is one "writing unit" — revealed one at a time with a left→right wipe.
// Types control typography; 'spacer' is a small visual gap with no animation delay.
const MAIN_BLOCKS = [
  { id: 0,  text: 'To My Dearest Friend, Zeelu,',                                                                                                                                                      type: 'salutation' },
  { id: 1,  text: 'Happy Birthday to someone who is truly, genuinely special to me.',                                                                                                                  type: 'body' },
  { id: 2,  text: 'Some people come into our lives for a moment, and some become a beautiful part of our story. You are one of those people I will always be thankful for.',                            type: 'poetic' },
  { id: 3,  text: "I don't always have the right words to say it, but you have made so many ordinary days feel a little more bright, a little more fun, and a little more worth remembering.",          type: 'body' },
  { id: 4,  text: 'We have shared laughs that made no sense to anyone else. Conversations that went nowhere and meant everything. Moments of silence that felt completely comfortable.',                 type: 'body' },
  { id: 5,  text: 'I may not always say it, but your presence has made many ordinary days feel a little more special.',                                                                                 type: 'poetic' },
  { id: 6,  text: 'Some memories may become old with time, but the feeling behind them never really fades.',                                                                                            type: 'poetic' },
  { id: 7,  text: 'Life keeps changing, people keep growing, but I hope our friendship always finds its way back to the same laughter, the same comfort, and the same crazy conversations.',            type: 'poetic' },
  { id: 8,  text: 'I want you to know, without making it complicated...',                                                                                                                              type: 'italic' },
  { id: 9,  text: 'I love you so so much as a friend. ❤️',                                                                                                                                            type: 'highlight' },
  { id: 10, text: 'You deserve all the happiness, success, and beautiful things your heart quietly hopes for.',                                                                                        type: 'body' },
  { id: 11, text: 'Thank you for being a beautiful part of my life.',                                                                                                                                  type: 'body' },
  { id: 12, text: 'May your smile always stay brighter than your worries, and may every new chapter of your life bring you something beautiful.',                                                       type: 'poetic' },
  { id: 13, text: 'Happy Birthday once again, my dear friend. ❤️',                                                                                                                                    type: 'closing' },
];

const SIG_BLOCKS = [
  { id: 14, text: 'With all my love and friendship,', type: 'sig-label' },
  { id: 15, text: 'Vaibhav Vora',                    type: 'sig-name'  },
  { id: 16, text: 'Your Best Friend',                type: 'sig-title' },
];

const ALL_BLOCKS = [...MAIN_BLOCKS, ...SIG_BLOCKS];
const TOTAL = ALL_BLOCKS.length;

// ─── Per-type typography ──────────────────────────────────────────────────────
function blockStyle(type) {
  switch (type) {
    case 'salutation': return {
      fontFamily: TN, fontWeight: 700, color: '#7f1d2f',
      fontSize: 'clamp(1.15rem, 3.5vw, 1.45rem)', lineHeight: 1.6,
    };
    case 'poetic': return {
      fontFamily: TN, fontStyle: 'italic', color: '#4a1c2a',
      fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)', lineHeight: 1.95,
    };
    case 'italic': return {
      fontFamily: TN, fontStyle: 'italic', color: '#64748b',
      fontSize: 'clamp(0.9rem, 2.4vw, 1.05rem)', lineHeight: 1.85,
    };
    case 'highlight': return {
      fontFamily: TN, fontWeight: 700, color: '#881337', textAlign: 'center',
      fontSize: 'clamp(1.05rem, 3vw, 1.3rem)', lineHeight: 1.7,
    };
    case 'closing': return {
      fontFamily: TN, fontWeight: 600, color: '#7f1d2f',
      fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)', lineHeight: 1.75,
    };
    case 'sig-label': return {
      fontFamily: TN, fontStyle: 'italic', color: '#78716c',
      fontSize: 'clamp(0.88rem, 2.2vw, 1rem)', lineHeight: 1.7,
    };
    case 'sig-name': return {
      fontFamily: TN, fontWeight: 700, fontStyle: 'italic', color: '#881337',
      fontSize: 'clamp(1.6rem, 5vw, 2.4rem)', lineHeight: 1.2,
    };
    case 'sig-title': return {
      fontFamily: TN, fontStyle: 'italic', color: '#9f7280',
      fontSize: 'clamp(0.82rem, 2vw, 0.92rem)', lineHeight: 1.6,
    };
    default: return {   // 'body'
      fontFamily: TN, color: '#1e1014',
      fontSize: 'clamp(0.93rem, 2.5vw, 1.07rem)', lineHeight: 1.95,
    };
  }
}

/**
 * Scene 7 — The Letter (Times New Roman Edition)
 *
 * Features:
 *  – Cream paper with ruled lines, red margin rule, layered paper-stack shadow
 *  – Times New Roman for every piece of text (no cursive / handwriting fonts)
 *  – Line-by-line left→right clip-path reveal after the envelope is opened
 *  – Blinking writing cursor inside each block; it emerges as the clip finishes
 *  – "Skip animation" link appears 3 s after the letter opens
 *  – Celebrate button shown only after animation is done (or skipped)
 *  – Floating ambient hearts in the background
 */
export default function LetterScene({ onComplete }) {
  const [isOpen,        setIsOpen]        = useState(false);
  const [visibleCount,  setVisibleCount]  = useState(0);    // how many blocks are revealed
  const [activeIdx,     setActiveIdx]     = useState(-1);   // block currently animating
  const [animDone,      setAnimDone]      = useState(false);
  const timerRef = useRef(null);

  // Open the envelope
  const handleOpenEnvelope = () => {
    if (isOpen) return;
    soundFx.playCelebrationChime?.();
    setIsOpen(true);
  };

  // Skip the writing animation — jump straight to full letter
  const skipAnimation = () => {
    clearTimeout(timerRef.current);
    setVisibleCount(TOTAL);
    setActiveIdx(-1);
    setAnimDone(true);
  };

  // Sequential block-reveal engine
  useEffect(() => {
    if (!isOpen) return;
    let idx = 0;

    const revealNext = () => {
      setActiveIdx(idx);
      setVisibleCount(idx + 1);
      idx += 1;

      if (idx < TOTAL) {
        timerRef.current = setTimeout(revealNext, INTER_DELAY);
      } else {
        // All blocks revealed — wait for the last clip to finish, then mark done
        timerRef.current = setTimeout(() => {
          setActiveIdx(-1);
          setAnimDone(true);
        }, CLIP_DURATION * 1000 + 600);
      }
    };

    timerRef.current = setTimeout(revealNext, 550);
    return () => clearTimeout(timerRef.current);
  }, [isOpen]);

  return (
    <section
      className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-4 py-16 select-none overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #fff8f9 0%, #fde8ef 45%, #fff5f8 100%)' }}
    >
      {/* Ambient glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-100/60 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-pink-100/50 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-50/40 rounded-full blur-[80px] pointer-events-none" />

      {/* Floating hearts */}
      <FloatingHearts />

      <div className="relative z-10 max-w-3xl mx-auto w-full flex flex-col items-center">

        {/* ── Envelope (closed) ──────────────────────────────────────────────── */}
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex flex-col items-center gap-6"
          >
            <MaskHeading
              text="ONE LAST THING..."
              size="text-3xl sm:text-5xl font-black uppercase"
              textColor="text-rose-950"
              delay={0.1}
            />
            <p style={{ fontFamily: TN, fontStyle: 'italic' }} className="text-rose-700 text-lg sm:text-xl mb-4">
              I wrote something just for you.
            </p>
            <EnvelopeCard onClick={handleOpenEnvelope} />
          </motion.div>
        )}

        {/* ── Letter paper (open) ─────────────────────────────────────────────── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="letter-paper"
              initial={{ opacity: 0, scale: 0.88, y: 36 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-2xl text-left relative"
            >
              {/* ── Paper ── */}
              <div
                className="relative bg-[#fffefb] px-8 sm:px-14 py-10 sm:py-14"
                style={{
                  borderRadius: '3px 16px 16px 3px',
                  boxShadow: [
                    '1px 0 0 #f0c0ca',
                    '2px 0 0 #e8b0bc',
                    '3px 0 0 #dea0ac',
                    '0 20px 60px rgba(180,65,85,0.16)',
                    '0 6px 20px rgba(0,0,0,0.07)',
                  ].join(', '),
                }}
              >
                {/* Red margin rule */}
                <div
                  className="absolute top-0 bottom-0 pointer-events-none"
                  style={{ left: 54, width: 1, background: 'rgba(210,90,110,0.3)' }}
                />

                {/* Ruled lines */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    borderRadius: 'inherit',
                    backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 31px, rgba(240,170,185,0.28) 31px, rgba(240,170,185,0.28) 32px)',
                    backgroundPosition: '0 18px',
                  }}
                />

                {/* Corner decorations */}
                <span className="absolute top-5 right-6 text-lg opacity-25 pointer-events-none select-none">🌸</span>
                <span className="absolute bottom-16 right-7 text-base opacity-18 pointer-events-none select-none" style={{ opacity: 0.18 }}>🌷</span>

                {/* Header */}
                <div className="relative z-10 flex items-center justify-between border-b border-rose-200/60 pb-3 mb-8">
                  <span
                    className="text-[11px] uppercase tracking-widest text-rose-400 font-semibold"
                    style={{ fontFamily: TN, letterSpacing: '0.14em' }}
                  >
                    A Letter For Zeelu · From Vaibhav Vora
                  </span>
                  <Sparkles className="w-4 h-4 text-rose-300 flex-shrink-0" />
                </div>

                {/* ── Main letter blocks ── */}
                <div className="relative z-10 space-y-5">
                  {MAIN_BLOCKS.map((block, idx) => {
                    const visible   = visibleCount > idx;
                    const isActive  = activeIdx === idx && !animDone;
                    const isHighlight = block.type === 'highlight';

                    const blockEl = (
                      <LetterBlock
                        key={block.id}
                        block={block}
                        visible={visible}
                        isActive={isActive}
                        clipDuration={CLIP_DURATION}
                      />
                    );

                    return isHighlight ? (
                      <div
                        key={block.id}
                        style={{
                          background: 'linear-gradient(135deg, #fff0f5 0%, #ffe4ec 100%)',
                          borderRadius: 8,
                          padding: '13px 18px',
                          border: '1.5px solid #fbb6cc',
                          boxShadow: '0 2px 14px rgba(244,63,94,0.1)',
                          // Keep space even when invisible so layout doesn't jump
                          minHeight: visible ? undefined : '3.5rem',
                        }}
                      >
                        {blockEl}
                      </div>
                    ) : (
                      // Invisible blocks still take space — no layout shift
                      <div
                        key={block.id}
                        style={{
                          opacity: visible ? 1 : 0,
                          // Reserve minimum height so paper doesn't reflow
                          minHeight: visible ? undefined : blockStyle(block.type).lineHeight
                            ? `calc(${blockStyle(block.type).fontSize || '1rem'} * ${blockStyle(block.type).lineHeight})` : '1.9rem',
                        }}
                      >
                        {blockEl}
                      </div>
                    );
                  })}

                  {/* ── Signature section ── */}
                  <div
                    className="pt-6 border-t border-rose-200/50 space-y-0.5"
                    style={{ opacity: visibleCount > MAIN_BLOCKS.length ? 1 : 0 }}
                  >
                    {SIG_BLOCKS.map((block, idx) => (
                      <LetterBlock
                        key={block.id}
                        block={block}
                        visible={visibleCount > MAIN_BLOCKS.length + idx}
                        isActive={activeIdx === MAIN_BLOCKS.length + idx && !animDone}
                        clipDuration={CLIP_DURATION}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Skip animation link — appears after 3 s */}
              <AnimatePresence>
                {!animDone && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 3, duration: 0.5 }}
                    className="mt-4 flex justify-center"
                  >
                    <button
                      onClick={skipAnimation}
                      className="text-xs text-rose-400 hover:text-rose-600 underline underline-offset-2 transition-colors"
                      style={{ fontFamily: TN }}
                    >
                      Skip animation
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Celebrate button — only after animation finishes / is skipped */}
              <AnimatePresence>
                {animDone && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mt-10 flex justify-center"
                  >
                    <button
                      onClick={onComplete}
                      className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-extrabold text-base sm:text-lg shadow-[0_10px_35px_rgba(244,63,94,0.35)] hover:shadow-[0_15px_50px_rgba(244,63,94,0.55)] transition-all transform hover:scale-105 active:scale-95"
                    >
                      <Sparkles className="w-5 h-5 text-rose-100 group-hover:rotate-45 transition-transform" />
                      <span>CELEBRATE ZEELU! 🎉</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ─── Single letter block with left→right clip-path writing animation ─────────
function LetterBlock({ block, visible, isActive, clipDuration }) {
  const style = blockStyle(block.type);

  return (
    <motion.p
      // initial={false} so Framer Motion doesn't animate from `initial` on mount
      initial={false}
      animate={
        visible
          ? { clipPath: 'inset(-4px 0% -4px -4px)', opacity: 1 }
          : { clipPath: 'inset(-4px 100% -4px -4px)', opacity: 0 }
      }
      transition={
        visible
          ? { duration: clipDuration, ease: [0.25, 0.1, 0.25, 1] }
          : { duration: 0 }
      }
      style={{
        ...style,
        margin: 0,
      }}
    >
      {block.text}
      {/* Blinking cursor — revealed at the right edge as the clip wipe completes */}
      {isActive && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.55, repeat: Infinity, ease: 'linear' }}
          style={{
            display: 'inline-block',
            marginLeft: 3,
            fontWeight: 400,
            fontStyle: 'normal',
            color: '#be123c',
            lineHeight: 1,
            userSelect: 'none',
          }}
        >
          |
        </motion.span>
      )}
    </motion.p>
  );
}

// ─── Envelope card ────────────────────────────────────────────────────────────
function EnvelopeCard({ onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.04, rotate: 1 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="relative w-72 sm:w-96 h-48 sm:h-64 bg-gradient-to-br from-rose-100 via-pink-50 to-rose-200 rounded-2xl shadow-[0_20px_60px_rgba(244,63,94,0.28)] border-2 border-rose-300 flex flex-col items-center justify-center cursor-pointer group"
    >
      {/* Flap */}
      <div
        className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-rose-200 to-rose-100 border-b border-rose-300 shadow-sm group-hover:brightness-105 transition-all"
        style={{ clipPath: 'polygon(0 0, 50% 100%, 100% 0)' }}
      />
      {/* Stamp */}
      <div className="absolute top-4 right-4 w-10 h-12 rounded bg-rose-500/15 border border-rose-400/40 flex flex-col items-center justify-center text-[10px] text-rose-700 font-bold uppercase tracking-tighter">
        <span>LOVE</span>
        <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 mt-0.5" />
      </div>
      {/* Wax seal */}
      <div className="z-10 w-16 h-16 rounded-full bg-gradient-to-tr from-rose-600 via-rose-500 to-pink-400 shadow-xl border-2 border-amber-200/80 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
        <Heart className="w-8 h-8 fill-white" />
      </div>
      <h4 className="z-10 mt-3 text-lg sm:text-xl font-extrabold font-heading text-rose-950 uppercase tracking-wider">
        FOR ZEELU ❤️
      </h4>
      <span className="z-10 text-xs font-semibold text-rose-600 uppercase tracking-widest mt-1">
        From Vaibhav Vora · Tap to Open
      </span>
    </motion.div>
  );
}

// ─── Ambient floating hearts ──────────────────────────────────────────────────
const HEARTS = [
  { top: '8%',  left: '5%',  size: '1.1rem',  delay: 0   },
  { top: '22%', right: '6%', size: '0.85rem', delay: 1.2 },
  { top: '45%', left: '2%',  size: '0.7rem',  delay: 0.6 },
  { top: '70%', right: '4%', size: '1rem',    delay: 1.8 },
  { top: '85%', left: '8%',  size: '0.8rem',  delay: 0.3 },
  { top: '60%', right: '9%', size: '0.65rem', delay: 2.1 },
];

function FloatingHearts() {
  return (
    <>
      {HEARTS.map((h, i) => (
        <motion.span
          key={i}
          className="absolute pointer-events-none select-none"
          style={{ top: h.top, left: h.left, right: h.right, fontSize: h.size, color: 'rgba(244,63,94,0.25)' }}
          animate={{ y: [0, -12, 0], opacity: [0.3, 0.55, 0.3] }}
          transition={{ duration: 4.5 + i * 0.6, delay: h.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          ❤
        </motion.span>
      ))}
    </>
  );
}
