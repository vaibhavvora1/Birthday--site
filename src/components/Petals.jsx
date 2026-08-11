import React, { useEffect, useRef } from 'react';

/**
 * Petals & Luxury Ambient Background Component
 * Renders slow drifting blush/peach/lavender lighting orbs, fine paper grain texture,
 * and a small number of elegant floating pink rose petals and sparkles.
 */
export default function Petals({ count = 25 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create petal objects
    const items = [];
    for (let i = 0; i < count; i++) {
      items.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 8 + 4,
        speedX: Math.random() * 0.4 - 0.2,
        speedY: Math.random() * 0.5 + 0.2, // Soft downward petal drift
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        opacity: Math.random() * 0.4 + 0.2,
        color: i % 3 === 0 ? 'rgba(253, 164, 175, ' : i % 3 === 1 ? 'rgba(254, 215, 170, ' : 'rgba(233, 213, 255, ',
      });
    }

    const drawPetal = (x, y, size, rotation, opacity, colorPrefix) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.beginPath();
      ctx.fillStyle = `${colorPrefix}${opacity})`;
      ctx.shadowColor = 'rgba(244, 63, 94, 0.2)';
      ctx.shadowBlur = 6;

      // Soft oval petal geometry
      ctx.ellipse(0, 0, size, size * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      items.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotSpeed;

        if (p.y > canvas.height + 20) p.y = -20;
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;

        drawPetal(p.x, p.y, p.size, p.rotation, p.opacity, p.color);
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [count]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Base warm luxury background */}
      <div className="absolute inset-0 bg-[#fff8fb]" />

      {/* Multi-layer Ambient Blurred Lighting Orbs */}
      {/* Orb 1: Soft Blush Pink */}
      <div className="absolute top-[10%] left-[15%] w-[450px] h-[450px] bg-rose-200/40 rounded-full blur-[130px] animate-pulse pointer-events-none" style={{ animationDuration: '9s' }} />

      {/* Orb 2: Soft Peach */}
      <div className="absolute top-[50%] right-[10%] w-[500px] h-[500px] bg-orange-100/50 rounded-full blur-[140px] animate-pulse pointer-events-none" style={{ animationDuration: '11s', animationDelay: '2s' }} />

      {/* Orb 3: Very Light Lavender */}
      <div className="absolute bottom-[10%] left-[30%] w-[420px] h-[420px] bg-purple-100/40 rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDuration: '10s', animationDelay: '4s' }} />

      {/* Subtle Paper / Grain Overlay Texture */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Floating Petals Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
    </div>
  );
}
