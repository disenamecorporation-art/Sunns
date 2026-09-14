/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, Award, Flame, RotateCcw, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  setView: (view: string) => void;
}

export default function Hero({ setView }: HeroProps) {
  const pillars = [
    {
      icon: ShieldCheck,
      title: 'UV 400 Protection',
      desc: 'Protección ocular total certificada',
    },
    {
      icon: Award,
      title: 'Premium Quality',
      desc: 'Materiales nobles y acetatos italianos',
    },
    {
      icon: Flame,
      title: 'Timeless Design',
      desc: 'Estilos duraderos que trascienden modas',
    },
    {
      icon: RotateCcw,
      title: 'Easy Returns',
      desc: 'Garantía de devolución de 30 días',
    },
  ];

  return (
    <section 
      className="relative w-full h-screen sm:min-h-[850px] min-h-[700px] flex flex-col justify-between pt-24 pb-6 overflow-hidden bg-gradient-to-b from-[#1a110e] via-[#110a08] to-[#080504]"
      id="hero-section"
    >
      {/* Studio Spotlight Effect (Radial gradient overlay) */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 25%, rgba(68, 44, 34, 0.25) 0%, rgba(17, 10, 8, 0) 70%)'
        }}
      />

      {/* Sunbeam Light Effect (Elegant straight volumetric beam from top-right behind the model) */}
      <div 
        className="absolute inset-0 pointer-events-none z-[1] overflow-hidden mix-blend-screen opacity-75"
        style={{
          background: `
            radial-gradient(circle at 90% 10%, rgba(255, 220, 170, 0.4) 0%, transparent 50%),
            linear-gradient(115deg, transparent 35%, rgba(255, 230, 185, 0.18) 46%, rgba(255, 242, 215, 0.28) 50%, rgba(255, 230, 185, 0.18) 54%, transparent 65%)
          `,
          maskImage: 'linear-gradient(to bottom, black 15%, transparent 95%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 15%, transparent 95%)'
        }}
      />

      {/* Decorative vertical branding */}
      <div className="absolute left-6 top-1/3 hidden xl:block text-[#f5f0e6]/25 text-[10px] tracking-[0.4em] uppercase [writing-mode:vertical-lr] select-none">
        ESTABLISHED IN 2026 • BARCELONA
      </div>

      {/* Main Editorial Layout (Overlapping model and "SUNNS" typography) */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center relative">
        
        {/* Floating Call to Action on Left (Desktop) */}
        <div className="absolute left-4 sm:left-8 top-[28%] md:top-[35%] z-30 max-w-xs text-[#f5f0e6]">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="space-y-4"
          >
            <span className="text-[10px] tracking-[0.4em] text-[#efeae0]/80 font-semibold uppercase block">
              NUEVA COLECCIÓN COUTURE
            </span>
            <h1 className="font-serif-elegant text-3xl sm:text-4xl font-bold leading-tight">
              Diseño puro. <br />
              Mirada eterna.
            </h1>
            <p className="text-xs text-[#f5f0e6]/65 leading-relaxed font-light">
              Lentes esculpidos artesanalmente en finos acetatos y metales de alta pureza para quienes habitan el estilo.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setView('shop')}
                className="group flex items-center gap-3 bg-[#efeae0] hover:bg-white text-[#150d0a] text-xs font-semibold tracking-widest uppercase px-6 py-3.5 rounded-none transition-all duration-300 shadow-lg cursor-pointer hover:shadow-white/5"
                id="hero-cta-btn"
              >
                Comprar Ahora
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Floating Editorial Text on Right (Desktop) */}
        <div className="absolute right-4 sm:right-8 top-[35%] z-30 hidden lg:flex flex-col items-end text-right text-[#f5f0e6]">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="space-y-3"
          >
            <span className="text-[10px] tracking-[0.35em] text-[#efeae0]/80 uppercase font-semibold">
              SEE THE WORLD THROUGH STYLE
            </span>
            <div className="w-16 h-[1px] bg-[#efeae0]/30 my-2 self-end" />
            <p className="text-sm font-serif-elegant italic text-[#f5f0e6]/80 max-w-[180px]">
              "Un accesorio de lujo no grita, define la atmósfera."
            </p>
            <span className="text-[9px] tracking-[0.25em] text-[#f5f0e6]/40 uppercase">
              PREMIUM EYEWEAR
            </span>
          </motion.div>
        </div>

        {/* Central visual stack: Giant Text "SUNNS" + Model Image */}
        <div className="relative w-full h-[380px] sm:h-[480px] lg:h-[550px] flex items-center justify-center">
          
          {/* BACKGROUND TEXT "SUNNS" (Giant, behind everything, 40% opacity) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 0.4, scale: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full select-none z-0"
          >
            <span className="font-hero-brand font-bold text-[36vw] sm:text-[33vw] lg:text-[30vw] leading-none tracking-widest text-[#efeae0] uppercase block">
              SUNNS
            </span>
          </motion.div>

          {/* LAYER 2: MODEL PHOTOGRAPHY (Removed from here, moved to section level for full bottom length) */}
          
        </div>

      </div>

      {/* Floating features bar in the bottom (Glassmorphism design) */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-30">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="bg-[#1a110e]/40 backdrop-blur-md border border-[#f5f0e6]/10 rounded-xl p-4 sm:p-6 lg:p-7 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-4 shadow-2xl"
        >
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div 
                key={idx} 
                className="flex items-start gap-3 sm:gap-3.5 border-r border-[#f5f0e6]/5 last:border-0 pr-2"
              >
                <div className="bg-[#f5f0e6]/10 p-2 rounded-lg shrink-0">
                  <Icon className="w-5 h-5 text-[#f5f0e6]" />
                </div>
                <div>
                  <h3 className="text-[#f5f0e6] text-xs font-semibold tracking-wide uppercase">
                    {p.title}
                  </h3>
                  <p className="text-[#f5f0e6]/60 text-[10px] leading-tight mt-1 font-light">
                    {p.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* CENTRAL MODEL PHOTOGRAPHY (Absolute bottom of the entire hero section, full size) */}
      <div className="absolute inset-x-0 bottom-0 flex justify-center pointer-events-none z-10 h-[65vh] sm:h-[72vh] lg:h-[80vh] xl:h-[85vh] max-h-[500px] sm:max-h-[660px] lg:max-h-[820px] xl:max-h-[900px] overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1, ease: 'easeOut' }}
          className="h-full flex items-end justify-center"
        >
          <img
            src="https://i.postimg.cc/brPrBKHX/SUNNS1.png"
            alt="Modelo Sunns Shop"
            referrerPolicy="no-referrer"
            className="h-full object-contain object-bottom drop-shadow-[0_25px_50px_rgba(0,0,0,0.85)] filter contrast-[1.05]"
          />
        </motion.div>
      </div>
    </section>
  );
}
