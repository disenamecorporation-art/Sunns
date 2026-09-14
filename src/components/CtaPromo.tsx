import React from 'react';
import { ArrowRight } from 'lucide-react';

interface CtaPromoProps {
  setView: (view: string) => void;
  setSelectedCategory: (category: string) => void;
}

export default function CtaPromo({ setView, setSelectedCategory }: CtaPromoProps) {
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (sectionId: string) => {
    setView('home');
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <section className="py-12 bg-[#faf9f6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* === CONTENEDOR DE LLAMADA A LA ACCIÓN (CTA) INCREÍBLE === */}
        <div className="relative overflow-hidden border border-white/10 bg-gradient-to-br from-[#111111] via-[#080808] to-black p-8 md:p-16 shadow-[0_30px_100px_rgba(0,0,0,0.95)] group">
          {/* Efectos de luz ambiental / sunbeams cruzados */}
          <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-gradient-to-bl from-[#f59e0b]/10 via-[#f59e0b]/3 to-transparent blur-[80px] pointer-events-none transition-opacity duration-700 group-hover:opacity-80" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-gradient-to-tr from-white/[0.02] via-[#f59e0b]/2 to-transparent blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto space-y-8">
            <div className="space-y-4">
              <span className="text-[9px] tracking-[0.5em] text-[#f59e0b] font-bold uppercase block animate-pulse">
                REDEFINE TU MIRADA
              </span>
              <h2 className="text-3xl md:text-5xl font-serif-elegant font-bold tracking-tight text-[#f5f0e6] leading-tight">
                Lentes artesanales con alma mediterránea
              </h2>
              <div className="w-12 h-[1px] bg-[#f59e0b]/40 mx-auto my-3" />
              <p className="text-xs md:text-base text-[#f5f0e6]/75 leading-relaxed font-light max-w-2xl">
                Artesanía de lujo diseñada y pulida individualmente en Barcelona. Cada pieza es esculpida de forma sostenible con los mejores acetatos biodegradables del mundo. Viste tu mirada con sofisticación pura.
              </p>
            </div>
            
            {/* Botones GLASS debajo con diseño adaptado a cada perspectiva (Mobile stacks vertically, desktop/tablet inline) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md pt-2">
              <button
                onClick={() => handleCategoryClick('Sol')}
                className="group relative px-6 py-4 bg-white/[0.02] hover:bg-white/[0.07] backdrop-blur-md border border-white/10 hover:border-white/20 text-[#f5f0e6] text-[10px] tracking-[0.25em] font-bold uppercase transition-all duration-300 cursor-pointer shadow-xl hover:shadow-[0_0_25px_rgba(255,255,255,0.05)] text-center flex items-center justify-center gap-2"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                Colección Sol
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#f59e0b]" />
              </button>
              
              <button
                onClick={() => handleNavClick('about')}
                className="group relative px-6 py-4 bg-white/[0.01] hover:bg-white/[0.03] backdrop-blur-sm border border-white/5 hover:border-white/10 text-[#f5f0e6]/80 hover:text-white text-[10px] tracking-[0.25em] font-bold uppercase transition-all duration-300 cursor-pointer text-center"
              >
                Nuestra Historia
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
