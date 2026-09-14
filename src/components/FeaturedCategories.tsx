/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface FeaturedCategoriesProps {
  setView: (view: string) => void;
  setSelectedCategory: (category: string) => void;
}

export default function FeaturedCategories({ setView, setSelectedCategory }: FeaturedCategoriesProps) {
  const categories = [
    {
      id: 'Sol',
      title: 'Lentes de Sol',
      subtitle: 'Protección con distinción',
      image: '/src/assets/images/glasses_sun_minimal_1787327499742.jpg',
      bgColor: 'bg-zinc-100',
      textColor: 'text-black',
    },
    {
      id: 'Ópticos',
      title: 'Marcos Ópticos',
      subtitle: 'Claridad intelectual',
      image: '/src/assets/images/glasses_optical_classic_1787327485566.jpg',
      bgColor: 'bg-zinc-50',
      textColor: 'text-black',
    },
    {
      id: 'Deportivos',
      title: 'Línea Deportiva',
      subtitle: 'Aerodinámica y estilo',
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600',
      bgColor: 'bg-zinc-100',
      textColor: 'text-black',
    },
  ];

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setView('shop');
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-24 bg-[#faf9f6]" id="collections">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-[10px] tracking-[0.45em] text-black font-semibold uppercase block mb-3">
            COLECCIONES EXCLUSIVAS
          </span>
          <h2 className="font-serif-elegant text-3xl sm:text-4xl font-bold text-black leading-tight">
            Diseño adaptado a cada perspectiva
          </h2>
          <div className="w-12 h-[1.5px] bg-black mx-auto mt-5" />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: idx * 0.15, duration: 0.8 }}
              className={`group relative overflow-hidden rounded-xl ${cat.bgColor} border border-[#e5dfd5] hover:shadow-xl hover:shadow-black/5 transition-all duration-500 flex flex-col justify-between h-[420px] p-8`}
              id={`category-card-${cat.id.toLowerCase()}`}
            >
              {/* Product Visual Center */}
              <div className="w-full flex-1 flex items-center justify-center relative mt-4">
                <div className="absolute inset-0 bg-radial from-[#ffffff]/35 to-transparent rounded-full filter blur-xl scale-75" />
                <img
                  src={cat.image}
                  alt={cat.title}
                  referrerPolicy="no-referrer"
                  className="max-h-[180px] w-auto object-contain transform group-hover:scale-108 group-hover:-rotate-3 transition-transform duration-500 filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.1)]"
                />
              </div>

              {/* Category Info & CTA */}
              <div className="relative z-10 pt-6">
                <span className="text-[9px] tracking-[0.25em] text-black/70 font-semibold uppercase block mb-1">
                  {cat.subtitle}
                </span>
                <h3 className="font-serif-elegant text-2xl font-bold text-black tracking-tight mb-4">
                  {cat.title}
                </h3>
                
                <button
                  onClick={() => handleCategoryClick(cat.id)}
                  className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-black hover:text-zinc-600 transition-colors cursor-pointer group/btn"
                  id={`category-btn-${cat.id.toLowerCase()}`}
                >
                  Descubrir Colección
                  <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Background elegant numbers */}
              <div className="absolute right-4 top-4 text-8xl font-serif-elegant font-bold text-black/5 select-none">
                0{idx + 1}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
