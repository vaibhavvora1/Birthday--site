import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence, motion } from 'framer-motion';

import BirthdayIntro from './components/scenes/BirthdayIntro';
import LightsScene from './components/scenes/LightsScene';
import BirthdayCake from './components/scenes/BirthdayCake';
import GiftQuestion from './components/scenes/GiftQuestion';
import PersonalityAccordionSection from './components/PersonalityAccordionSection';
import LetterScene from './components/scenes/LetterScene';
import BestFriendQuestionScene from './components/scenes/BestFriendQuestionScene';
import BirthdayFinale from './components/scenes/BirthdayFinale';
import ProposalDashboard from './components/ProposalDashboard';

import MusicController from './components/MusicController';
import CustomCursor from './components/CustomCursor';

gsap.registerPlugin(ScrollTrigger);

/** Returns true when the current URL path is exactly /proposal-dashboard */
function isDashboardRoute() {
  return window.location.pathname === '/proposal-dashboard';
}

export default function App() {
  const [scene, setScene] = useState(1);
  const [showDashboard, setShowDashboard] = useState(isDashboardRoute);

  // React to browser back/forward navigation
  useEffect(() => {
    const onPop = () => setShowDashboard(isDashboardRoute());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Initialize Lenis Smooth Scrolling (only for the main app, not dashboard)
  useEffect(() => {
    if (showDashboard) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    return () => { lenis.destroy(); };
  }, [showDashboard]);

  // Refresh GSAP ScrollTrigger on scene change
  useEffect(() => {
    if (showDashboard) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => { ScrollTrigger.refresh(); }, 400);
  }, [scene, showDashboard]);

  // ── Private Dashboard Route ────────────────────────────────────────────────
  if (showDashboard) {
    return <ProposalDashboard />;
  }

  // ── Main Birthday Website ──────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen bg-[#fff5f8] text-slate-900 overflow-x-hidden selection:bg-rose-400 selection:text-white font-sans antialiased">
      <MusicController />
      <CustomCursor />

      <AnimatePresence mode="wait">
        <motion.div
          key={scene}
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="w-full"
        >
          {scene === 1 && <BirthdayIntro onNext={() => setScene(2)} />}
          {scene === 2 && <LightsScene onLightsOn={() => setScene(3)} />}
          {scene === 3 && <BirthdayCake onComplete={() => setScene(4)} />}
          {scene === 4 && <GiftQuestion onYes={() => setScene(5)} />}
          {scene === 5 && <PersonalityAccordionSection onComplete={() => setScene(6)} />}
          {scene === 6 && <LetterScene onComplete={() => setScene(7)} />}
          {scene === 7 && <BestFriendQuestionScene onComplete={() => setScene(8)} />}
          {scene === 8 && <BirthdayFinale onReplay={() => setScene(1)} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
