import React, { useEffect, useRef } from 'react';
import { useTheme } from '../lib/ThemeContext.tsx';

interface AmbientParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  pulsePhase: number;
  color: string;
}

export const RevenueFlowCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const mouseRef = useRef<{
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    isHovered: boolean;
    velocity: number;
  }>({
    x: -1000,
    y: -1000,
    targetX: -1000,
    targetY: -1000,
    isHovered: false,
    velocity: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const handleResize = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    let lastMoveTime = performance.now();
    let lastX = -1000;
    let lastY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      const dt = Math.max(1, now - lastMoveTime);
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      mouseRef.current.velocity = Math.min(40, (dist / dt) * 12);
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
      mouseRef.current.isHovered = true;

      lastX = e.clientX;
      lastY = e.clientY;
      lastMoveTime = now;
    };

    const handleMouseLeave = () => {
      mouseRef.current.isHovered = false;
    };

    // Attach to window so mouse events are tracked anywhere over cards, header, and body
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // Particle Colors tailored for dark and light modes
    const particleColorsDark = [
      '#F59E0B', // Vibrant Amber
      '#FCD34D', // Gold Accent
      '#06B6D4', // Cyan Light
      '#10B981', // Emerald
      '#8B5CF6', // Purple Glow
    ];

    const particleColorsLight = [
      '#D97706', // Rich Amber
      '#B45309', // Deep Gold
      '#2563EB', // Sapphire Blue
      '#059669', // Emerald Green
      '#7C3AED', // Violet Accent
    ];

    const isMobile = width < 768;
    const particleCount = isMobile ? 24 : 48;
    const particles: AmbientParticle[] = [];

    const activeColors = isDark ? particleColorsDark : particleColorsLight;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2.8 + 1.5,
        baseAlpha: Math.random() * 0.4 + 0.2,
        pulsePhase: Math.random() * Math.PI * 2,
        color: activeColors[i % activeColors.length],
      });
    }

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;
      // Fluid cursor lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.15;
      mouse.y += (mouse.targetY - mouse.y) * 0.15;
      mouse.velocity *= 0.92;

      // 1. DYNAMIC INTERACTIVE HOVER SPOTLIGHT & ILLUMINATION (Clearly visible on Dark and Light modes)
      if (mouse.isHovered && mouse.x > -100 && mouse.y > -100) {
        const spotRadius = 280 + mouse.velocity * 4;

        if (isDark) {
          // Dark Mode Vibrant Ambient Spotlight (Gold / Cyan / Purple)
          const aura = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, spotRadius);
          aura.addColorStop(0, 'rgba(245, 158, 11, 0.18)');
          aura.addColorStop(0.35, 'rgba(6, 182, 212, 0.10)');
          aura.addColorStop(0.65, 'rgba(139, 92, 246, 0.04)');
          aura.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.fillStyle = aura;
          ctx.beginPath();
          ctx.arc(mouse.x, mouse.y, spotRadius, 0, Math.PI * 2);
          ctx.fill();

          // Subtle inner intense core light
          const innerCore = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 60);
          innerCore.addColorStop(0, 'rgba(252, 211, 77, 0.25)');
          innerCore.addColorStop(1, 'rgba(245, 158, 11, 0)');
          ctx.fillStyle = innerCore;
          ctx.beginPath();
          ctx.arc(mouse.x, mouse.y, 60, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Light Mode Rich Warm Illumination (Gold / Sapphire / Emerald Sheen)
          const aura = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, spotRadius);
          aura.addColorStop(0, 'rgba(217, 119, 6, 0.16)');
          aura.addColorStop(0.4, 'rgba(37, 99, 235, 0.09)');
          aura.addColorStop(0.7, 'rgba(5, 150, 105, 0.04)');
          aura.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.fillStyle = aura;
          ctx.beginPath();
          ctx.arc(mouse.x, mouse.y, spotRadius, 0, Math.PI * 2);
          ctx.fill();

          // Inner warm glow core
          const innerCore = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 70);
          innerCore.addColorStop(0, 'rgba(217, 119, 6, 0.20)');
          innerCore.addColorStop(1, 'rgba(217, 119, 6, 0)');
          ctx.fillStyle = innerCore;
          ctx.beginPath();
          ctx.arc(mouse.x, mouse.y, 70, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 2. RENDER GENTLE FLOATING AMBIENT PARTICLES (NO graph nodes, NO connecting network lines)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.pulsePhase += 0.022;

        // Wrap around boundaries smoothly
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        let alpha = p.baseAlpha + Math.sin(p.pulsePhase) * 0.15;
        let scale = 1;

        // Reactive interaction when cursor hovers near
        if (mouse.isHovered) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 220) {
            const proximity = (220 - dist) / 220;
            alpha = Math.min(0.95, alpha + proximity * 0.55);
            scale = 1 + proximity * 0.8;
            // Organic magnetic shift
            p.x -= (dx / dist) * proximity * 1.2;
            p.y -= (dy / dist) * proximity * 1.2;
          }
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * scale, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Soft Background Ambient Lighting Circles */}
      <div
        className={`absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full pointer-events-none blur-[140px] transition-opacity duration-700 ${
          isDark ? 'opacity-25' : 'opacity-15'
        }`}
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(245,158,11,0.35) 0%, rgba(6,182,212,0.18) 60%, transparent 80%)'
            : 'radial-gradient(circle, rgba(217,119,6,0.3) 0%, rgba(37,99,235,0.15) 60%, transparent 80%)',
        }}
      />
      <div
        className={`absolute top-1/3 -right-32 w-[550px] h-[550px] rounded-full pointer-events-none blur-[150px] transition-opacity duration-700 ${
          isDark ? 'opacity-20' : 'opacity-15'
        }`}
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, rgba(16,185,129,0.15) 60%, transparent 80%)'
            : 'radial-gradient(circle, rgba(124,58,237,0.25) 0%, rgba(5,150,105,0.15) 60%, transparent 80%)',
        }}
      />

      {/* Interactive Cursor Spotlight Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
