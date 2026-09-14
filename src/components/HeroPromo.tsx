import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';

interface HeroPromoProps {
  setView: (view: string) => void;
  setSelectedCategory: (category: string) => void;
}

export default function HeroPromo({ setView, setSelectedCategory }: HeroPromoProps) {
  const { scrollY } = useScroll();
  
  // Efecto de parallax suave para el texto gigante del fondo
  const bgTextY = useTransform(scrollY, [200, 1500], [-30, 30]);

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
    <section className="relative w-full bg-[#070403] py-24 lg:py-36 overflow-hidden border-y border-[#1a100d] my-16">
      
      {/* 1. Fondo Atmosférico de Lujo (Spotlight y destellos dorados) */}
      <div className="absolute top-0 right-1/4 w-[700px] h-[500px] bg-gradient-to-br from-[#f59e0b]/8 via-[#f59e0b]/1 to-transparent blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[400px] bg-white/[0.01] blur-[120px] pointer-events-none rounded-full" />
      
      {/* Rejilla fina de precisión */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff02_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none opacity-80" />

      {/* 2. TEXTO COLOSAL DE FONDO (Watermark "SUNNS" en Outline / Baja opacidad) */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none z-[1]">
        <motion.div 
          style={{ y: bgTextY }}
          className="text-[20vw] font-serif tracking-[0.15em] font-black text-transparent bg-clip-text bg-gradient-to-b from-white/[0.03] to-transparent uppercase leading-none opacity-40"
        >
          SUNNS
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 overflow-visible">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center overflow-visible">
          
          {/* LADO IZQUIERDO: Gafas Gigantes Flotantes sin fondo entre las letras gigantes */}
          <div className="lg:col-span-6 flex justify-center items-center relative overflow-visible h-[300px] sm:h-[400px] lg:h-[500px] z-20">
            {/* Halo dorado detrás de las gafas */}
            <div className="absolute w-72 h-72 bg-[#f59e0b]/15 blur-[100px] rounded-full pointer-events-none scale-125" />
            
            {/* Contenedor del lente con inclinación en perspectiva 3D real y flotabilidad suave */}
            <motion.div 
              className="relative w-full max-w-[440px] z-30 select-none cursor-pointer"
              animate={{ 
                y: [0, -12, 0],
                rotate: [-2, 1, -2]
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              whileHover={{ scale: 1.08, rotate: 2 }}
            >
              {/* Imagen PNG transparente sin fondo en altísima definición de gafas premium */}
              <img
                src="https://pngimg.com/d/sunglasses_PNG150.png"
                alt="Lentes de Sol de Alta Costura"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-contain filter brightness-[1.05] contrast-[1.1] drop-shadow-[0_20px_25px_rgba(0,0,0,0.95)] drop-shadow-[0_45px_60px_rgba(0,0,0,0.85)] drop-shadow-[0_5px_15px_rgba(245,158,11,0.2)]"
              />
              
              {/* Reflejo cristalino simulado */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent opacity-80 pointer-events-none rounded-full" />
            </motion.div>
          </div>
          
          {/* LADO DERECHO: Tarjeta Cristal (GLASS) con Texto Hermoso de Lujo */}
          <div className="lg:col-span-6 z-10 relative overflow-visible">
            
            {/* Tarjeta de Vidrio Esmerilado (Glassmorphism premium) que se solapa sutilmente */}
            <motion.div 
              className="relative overflow-hidden rounded-3xl bg-white/[0.02] sm:bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] p-8 sm:p-12 lg:p-14 shadow-[0_50px_100px_rgba(0,0,0,0.85)]"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Brillo dinámico superior de la tarjeta */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
              
              <div className="space-y-6 relative z-10">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-[1px] bg-[#f59e0b]/70" />
                    <span className="text-[9px] tracking-[0.5em] text-[#f59e0b] font-bold uppercase block">
                      SUNNS SIGNATURE SERIES
                    </span>
                  </div>
                  
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-serif-elegant font-bold tracking-tight text-[#f5f0e6] leading-[1.15]">
                    Esculpidos por la luz,{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f59e0b] to-[#f5f0e6]">
                      definidos por el carácter.
                    </span>
                  </h3>
                </div>
                
                <p className="text-xs sm:text-sm text-[#f5f0e6]/75 leading-relaxed font-light">
                  Descubre nuestra serie de autor donde el acetato biodegradable de algodón se funde con detalles de metal noble esculpidos individualmente. Una silueta atemporal que redefine las proporciones de la elegancia clásica con un aire contemporáneo y un alma puramente mediterránea.
                </p>
                
                {/* Botones Estilo Glass de Lujo */}
                <div className="flex flex-wrap gap-4 pt-4">
                  <button
                    onClick={() => handleCategoryClick('Sol')}
                    className="group relative px-6 py-4 bg-[#f59e0b]/10 hover:bg-[#f59e0b]/20 backdrop-blur-md border border-[#f59e0b]/30 hover:border-[#f59e0b]/60 text-[#f5f0e6] text-[9px] tracking-[0.3em] font-bold uppercase transition-all duration-300 cursor-pointer shadow-lg flex items-center gap-2.5"
                  >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    Explorar Colección
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#f59e0b]" />
                  </button>
                  
                  <button
                    onClick={() => handleNavClick('about')}
                    className="px-6 py-4 bg-white/[0.01] hover:bg-white/[0.04] border border-white/5 hover:border-white/15 text-[#f5f0e6]/60 hover:text-[#f5f0e6] text-[9px] tracking-[0.3em] font-bold uppercase transition-all duration-300 cursor-pointer"
                  >
                    Nuestra Historia
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
