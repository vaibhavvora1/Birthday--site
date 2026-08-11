import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundFx } from '../utils/audio';

// ─────────────────────────────────────────────────────────────────────────────
// 🎵 CHANGE YOUR BACKGROUND MUSIC HERE
//    1. Drop your .mp3 file into the `public/music/` folder.
//    2. Update the filename below to match.
//    Example: "/music/my-new-song.mp3"
// ─────────────────────────────────────────────────────────────────────────────
const BACKGROUND_MUSIC_SRC = '/music/arz-kiya-hai-humne-bhi-likha-kuch-tere-bare-main-aesthetic-status-lofi-love-beats-128-ytshorts.savetube.me.mp3';

/**
 * MusicController Component (Bright Soft Pink Theme)
 * Controls background birthday music loaded from /public/music/.
 * Single audio instance — persists across scene transitions in App state.
 * Play/pause is toggled via the floating button (top-right).
 * Music starts on first user interaction (required by browser autoplay policies).
 */
export default function MusicController() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    // Create the audio element once and keep it for the lifetime of the app
    const audio = new Audio(BACKGROUND_MUSIC_SRC);
    audio.loop = true;
    audio.volume = 0.45;
    audioRef.current = audio;

    // Attempt to auto-play on first user interaction
    const handleFirstInteraction = () => {
      if (hasStartedRef.current) return;
      hasStartedRef.current = true;

      soundFx.initContext();

      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Autoplay blocked — user can manually press the button
        });

      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      // Pause and release the audio when the component unmounts
      audio.pause();
      audio.src = '';
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      soundFx.isMuted = true;
    } else {
      soundFx.initContext();
      soundFx.isMuted = false;
      audio.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.warn('Audio play failed:', err));
    }
  };

  return (
    <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
      {/* Audio Wave Visualizer Bars (shown when playing) */}
      {isPlaying && (
        <div className="flex items-end gap-1 h-5 px-3 py-1 rounded-full bg-white/90 border border-rose-300 shadow-md backdrop-blur-md">
          <span className="w-1 bg-rose-500 h-3 animate-pulse" />
          <span className="w-1 bg-rose-500 h-5 animate-pulse" style={{ animationDelay: '0.2s' }} />
          <span className="w-1 bg-rose-500 h-2 animate-pulse" style={{ animationDelay: '0.4s' }} />
          <span className="w-1 bg-rose-500 h-4 animate-pulse" style={{ animationDelay: '0.1s' }} />
        </div>
      )}

      {/* Play / Mute Floating Button */}
      <button
        onClick={toggleMusic}
        aria-label={isPlaying ? 'Mute music' : 'Play background music'}
        className="relative group p-3.5 rounded-full bg-white/90 hover:bg-rose-500 text-rose-700 hover:text-white border border-rose-300 shadow-lg transition-all transform hover:scale-105 active:scale-95 backdrop-blur-md"
      >
        {isPlaying ? (
          <Volume2 className="w-5 h-5" />
        ) : (
          <VolumeX className="w-5 h-5" />
        )}
        <span className="absolute -inset-1 rounded-full bg-rose-400/20 blur-sm group-hover:bg-rose-400/40 transition-all pointer-events-none" />
      </button>
    </div>
  );
}
