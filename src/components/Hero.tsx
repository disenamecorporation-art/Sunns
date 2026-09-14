/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, Gem, Glasses, Package, ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';

interface HeroProps {
  setView: (view: string) => void;
}

export default function Hero({ setView }: HeroProps) {
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 800], [0, 90]);
  const scaleParallax = useTransform(scrollY, [0, 800], [1, 1.03]);

  // Seguimiento interactivo del movimiento del ratón para crear un efecto parallax ultra premium
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springX = useSpring(mouseX, { stiffness: 70, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 70, damping: 22 });

  const moveX = useTransform(springX, [0, 1], [-18, 18]);
  const moveY = useTransform(springY, [0, 1], [-20, 20]);

  // Combinación de scroll y movimiento del cursor
  const combinedY = useTransform([yParallax, moveY], ([latestY, latestMoveY]) => {
    return (latestY as number) + (latestMoveY as number);
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const pillars = [
    {
      icon: ShieldCheck,
      title: 'Protección UV400',
      desc: 'Bloqueo 100% rayos solares',
    },
    {
      icon: Gem,
      title: 'Calidad Premium',
      desc: 'Materiales de alta gama',
    },
    {
      icon: Glasses,
      title: 'Diseño Atemporal',
      desc: 'Siluetas que perduran',
    },
    {
      icon: Package,
      title: 'Devolución Fácil',
      desc: '30 días de garantía',
    },
  ];

  return (
    <section 
      className="relative w-full min-h-screen sm:min-h-[850px] lg:min-h-[920px] flex flex-col justify-between pt-24 pb-8 overflow-hidden bg-[#070504]"
      id="hero-section"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 1. DEEP BLACK / OBSIDIAN STUDIO SPOTLIGHT EFFECT */}
      {/* Focused subtle warm amber spotlight behind the model with deep black falloff */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(ellipse 55% 50% at 64% 34%, rgba(140, 95, 65, 0.26) 0%, rgba(70, 42, 28, 0.18) 35%, rgba(10, 7, 5, 0.85) 70%, #070504 100%),
            radial-gradient(circle at 18% 45%, rgba(60, 40, 30, 0.12) 0%, transparent 55%),
            linear-gradient(180deg, rgba(7, 5, 4, 0.6) 0%, rgba(7, 5, 4, 0.15) 40%, rgba(7, 5, 4, 0.95) 100%)
          `
        }}
      />

      {/* Subtle directional studio shimmer overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-[1] opacity-40 mix-blend-screen"
        style={{
          background: 'radial-gradient(circle at 66% 28%, rgba(255, 225, 190, 0.45) 0%, rgba(120, 80, 50, 0.15) 40%, transparent 70%)'
        }}
      />

      {/* 2. GIANT EDITORIAL LETTERS "SUNNSHOP" BEHIND THE MODEL */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[2] select-none overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="w-full max-w-[1550px] px-2 sm:px-6 flex items-center justify-between text-center font-hero-editorial leading-none tracking-[-0.04em] sm:tracking-[-0.02em]"
          style={{
            fontSize: 'clamp(3.8rem, 12.8vw, 15.5rem)',
          }}
        >
          {/* S: Solid Ivory */}
          <span className="text-hero-solid inline-block transform hover:scale-[1.01] transition-transform">
            S
          </span>
          {/* U: Outline */}
          <span className="text-hero-outline inline-block transform hover:scale-[1.01] transition-transform">
            U
          </span>
          {/* N: Solid Ivory */}
          <span className="text-hero-solid inline-block transform hover:scale-[1.01] transition-transform">
            N
          </span>
          {/* N: Outline */}
          <span className="text-hero-outline inline-block transform hover:scale-[1.01] transition-transform">
            N
          </span>
          {/* S: Solid Ivory */}
          <span className="text-hero-solid inline-block transform hover:scale-[1.01] transition-transform">
            S
          </span>
          {/* H: Outline */}
          <span className="text-hero-outline inline-block transform hover:scale-[1.01] transition-transform">
            H
          </span>
          {/* O: Solid Ivory */}
          <span className="text-hero-solid inline-block transform hover:scale-[1.01] transition-transform">
            O
          </span>
          {/* P: Outline */}
          <span className="text-hero-outline inline-block transform hover:scale-[1.01] transition-transform">
            P
          </span>
        </motion.div>
      </div>

      {/* 3. EDITORIAL FLOATING TEXT ELEMENTS */}
      <div className="relative flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-between z-20 pointer-events-none pt-4 pb-2">
        
        {/* Right side floating editorial text in Spanish */}
        <div className="self-end pt-4 sm:pt-6 text-right text-[#f5f0e6] pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="space-y-3"
          >
            <div className="space-y-0.5">
              <span className="text-[10px] sm:text-[11px] tracking-[0.3em] text-[#efeae0]/85 uppercase font-medium block">
                MIRA EL MUNDO
              </span>
              <span className="text-[10px] sm:text-[11px] tracking-[0.3em] text-[#efeae0]/85 uppercase font-medium block">
                A TRAVÉS DEL ESTILO
              </span>
            </div>
            
            <div>
              <span className="text-[9px] sm:text-[10px] tracking-[0.25em] text-[#f5f0e6]/50 uppercase font-light block">
                ALTA ÓPTICA DE AUTOR
              </span>
            </div>
          </motion.div>
        </div>

        {/* Left side editorial text positioned WAY LOWER near the bottom, with compact elegant typography so it NEVER touches SUNNSHOP */}
        <div className="self-start max-w-xs text-[#f5f0e6] pointer-events-auto pb-4 sm:pb-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="space-y-1.5 bg-black/40 sm:bg-black/20 backdrop-blur-md p-3.5 sm:p-4 rounded-xl border border-white/10"
          >
            <span className="text-[9px] sm:text-[10px] tracking-[0.35em] text-[#efeae0]/80 font-semibold uppercase block">
              NUEVA COLECCIÓN
            </span>
            <h1 className="font-serif-elegant text-base sm:text-lg lg:text-xl font-bold leading-tight">
              Diseño puro. <br />
              Mirada eterna.
            </h1>
            <p className="text-[11px] sm:text-xs text-[#f5f0e6]/75 leading-relaxed font-light max-w-[260px]">
              Lentes esculpidos artesanalmente en finos acetatos y metales puros para quienes habitan el estilo.
            </p>
          </motion.div>
        </div>

      </div>

      {/* 4. CENTRAL MODEL PHOTOGRAPHY (CLEAN, NO ARTIFACTS) */}
      <div className="absolute inset-x-0 bottom-0 flex justify-center pointer-events-none z-10 h-[84vh] sm:h-[78vh] lg:h-[86vh] xl:h-[90vh] max-h-[640px] sm:max-h-[720px] lg:max-h-[860px] xl:max-h-[940px] overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1, ease: 'easeOut' }}
          className="h-full w-full flex items-end justify-center"
        >
          <motion.div
            style={{ y: combinedY, x: moveX, scale: scaleParallax }}
            className="h-full w-full flex items-end justify-center"
          >
            <div className="relative h-full aspect-[480/800] max-w-full flex items-end justify-center">
              <img
                src="https://i.postimg.cc/yxxBDwph/modelo.png"
                alt="Modelo Sunnshop Alta Óptica"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain object-bottom filter contrast-[1.04] brightness-[1.02] drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)] drop-shadow-[0_35px_60px_rgba(0,0,0,0.7)] select-none"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* 5. BOTTOM CTA & DISCOVER BUTTON WITH RADIANT GLIMMER / SHINE SWEEP EFFECT */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-30 mb-3 pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4"
        >
          <span className="text-[10px] tracking-[0.4em] text-[#efeae0]/80 font-semibold uppercase block">
            ALTA ÓPTICA 2026
          </span>
          <motion.button
            onClick={() => setView('shop')}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="group relative overflow-hidden inline-flex items-center gap-3 bg-white/[0.08] hover:bg-white/[0.16] text-[#f5f0e6] hover:text-white text-[10px] font-bold tracking-[0.25em] uppercase px-8 py-3.5 rounded-full backdrop-blur-2xl border border-white/40 hover:border-white/70 transition-all duration-300 cursor-pointer shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)]"
            id="hero-quick-shop-btn"
          >
            {/* Super Glass Internal Ambient Reflection */}
            <motion.div
              animate={{
                opacity: [0.35, 0.7, 0.35],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/10 pointer-events-none rounded-full"
            />

            {/* Radiant Crystal Sheen / Lens Beam Sweep Effect */}
            <motion.div
              animate={{
                x: ['-220%', '240%'],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1.2,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="absolute -inset-y-6 -inset-x-10 w-24 bg-gradient-to-r from-transparent via-white via-cyan-100/90 to-transparent transform -skew-x-35 pointer-events-none filter blur-[1px] shadow-[0_0_20px_rgba(255,255,255,0.95)]"
            />

            {/* Laser-Sharp Specular Reflection Edge */}
            <motion.div
              animate={{
                x: ['-220%', '240%'],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1.2,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="absolute -inset-y-3 -inset-x-4 w-5 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-35 pointer-events-none"
            />

            {/* Upper Glass Specular Curve / Top Rim Glow */}
            <div className="absolute top-0 inset-x-4 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />

            <span className="relative z-10 font-semibold drop-shadow-sm">Descubrir Colección</span>
            <ArrowRight className="relative z-10 w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-300 drop-shadow-sm text-white" />
          </motion.button>
        </motion.div>
      </div>

      {/* 6. BOTTOM CONTINUOUS GLASS FEATURE BAR */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-30">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="bg-white/[0.05] backdrop-blur-2xl border border-white/20 rounded-2xl md:rounded-3xl p-5 sm:p-6 lg:py-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        >
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div 
                key={idx} 
                className="flex items-center gap-3.5 sm:gap-4 border-r border-white/15 last:border-0 pr-2 sm:pr-4"
              >
                <div className="p-2 sm:p-2.5 rounded-xl shrink-0 text-white/90">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5]" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-white text-xs sm:text-sm font-semibold tracking-wide">
                    {p.title}
                  </h3>
                  <p className="text-white/60 text-[11px] sm:text-xs leading-tight font-light">
                    {p.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

