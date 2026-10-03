/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Eye, ShoppingCart, Heart, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { Product, ProductColor, HomeContent } from '../types';
import { DEFAULT_HOME_CONTENT } from '../data/homeContent';

interface NewArrivalsProps {
  onProductClick: (id: string) => void;
  onAddToCart: (product: Product, color: ProductColor) => void;
  onToggleFavorite: (product: Product) => void;
  favorites: Product[];
  products: Product[];
  homeContent?: HomeContent;
}

export default function NewArrivals({
  onProductClick,
  onAddToCart,
  onToggleFavorite,
  favorites,
  products,
  homeContent = DEFAULT_HOME_CONTENT,
}: NewArrivalsProps) {
  // Filter only featured products, or show the first 4 premium ones
  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  const isFavorite = (productId: string) => {
    return favorites.some((f) => f.id === productId);
  };

  return (
    <section className="py-24 bg-[#ffffff]" id="new-arrivals">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div className="max-w-md">
            <span className="text-[10px] tracking-[0.45em] text-black font-semibold uppercase block mb-3">
              {homeContent.arrivalsTag || 'LANZAMIENTOS RECIENTES'}
            </span>
            <h2 className="font-serif-elegant text-3xl sm:text-4xl font-bold text-black leading-tight">
              {homeContent.arrivalsTitle || 'New Arrivals'}
            </h2>
            <div className="w-12 h-[1.5px] bg-black mt-4" />
          </div>
          <p className="text-xs text-black/60 font-light max-w-sm mt-4 md:mt-0 leading-relaxed">
            {homeContent.arrivalsDescription || 'La última expresión de la artesanía Sunns. Perfiles tallados con precisión extrema y acabados con pulido de espejo.'}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((p, idx) => {
            const hasAltImage = p.images && p.images.length > 1;
            const currentImage = (hoveredProduct === p.id && hasAltImage) ? p.images[1] : p.image;
            const fav = isFavorite(p.id);

            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="group flex flex-col h-full"
                id={`new-arrival-${p.id}`}
                onMouseEnter={() => setHoveredProduct(p.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                {/* Image Container with Actions overlay */}
                <div className="relative aspect-square w-full bg-[#faf9f6] border border-[#f0ebe1] rounded-lg overflow-hidden flex items-center justify-center p-4 group-hover:border-[#e5dfd5] transition-all duration-300">
                  
                  {/* Badge */}
                  <div className="absolute top-4 left-4 z-10 bg-black text-[#f5f0e6] text-[8px] tracking-[0.15em] uppercase font-bold px-2.5 py-1">
                    Nuevo
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={() => onToggleFavorite(p)}
                    className="absolute top-4 right-4 z-10 bg-white hover:bg-[#faf9f6] text-black hover:text-black p-2 rounded-full border border-[#f0ebe1] transition-all duration-300 shadow-sm focus:outline-none cursor-pointer"
                    aria-label="Agregar a favoritos"
                    id={`fav-btn-${p.id}`}
                  >
                    <Heart 
                      className={`w-4 h-4 transition-transform group-hover:scale-110 duration-200 ${
                        fav ? 'fill-black text-black' : ''
                      }`} 
                    />
                  </button>

                  {/* Product Image */}
                  <div 
                    onClick={() => onProductClick(p.id)}
                    className="w-full h-full flex items-center justify-center cursor-pointer transition-all duration-500 transform group-hover:scale-105"
                  >
                    <img
                      src={currentImage}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="max-h-[220px] w-auto object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.06)]"
                    />
                  </div>

                  {/* Bottom Quick-add Button (Slide up overlay) */}
                  <div className="absolute bottom-4 inset-x-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
                    <button
                      onClick={() => onAddToCart(p, p.colors[0])}
                      className="w-full bg-black hover:bg-zinc-800 text-[#f5f0e6] hover:text-white text-[10px] tracking-widest font-bold uppercase py-3 transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                      id={`quick-add-${p.id}`}
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Agregar Rápido
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="pt-4 flex flex-col flex-1">
                  <span className="text-[9px] tracking-widest text-black/70 uppercase font-semibold mb-1">
                    {p.category}
                  </span>
                  
                  <button
                    onClick={() => onProductClick(p.id)}
                    className="text-left font-serif-elegant text-base font-light text-black hover:text-[#f59e0b] transition-colors focus:outline-none cursor-pointer mb-1.5"
                    id={`title-btn-${p.id}`}
                  >
                    {p.name}
                  </button>

                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex text-black">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3.5 h-3.5 ${i < Math.floor(p.rating) ? 'fill-black' : ''}`} 
                        />
                      ))}
                    </div>
                    <span className="text-xs text-black/50 font-semibold">({p.reviewsCount})</span>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-2 border-t border-[#efeae0]/50">
                    <span 
                      className="text-xl sm:text-2xl font-serif-elegant text-black"
                      style={{ fontWeight: 950 }}
                    >
                      ${p.price.toFixed(2)} USD
                    </span>
                    <button
                      onClick={() => onProductClick(p.id)}
                      className="text-[10px] tracking-wider uppercase font-semibold text-black/60 hover:text-black transition-colors flex items-center gap-1 cursor-pointer"
                      id={`detail-btn-${p.id}`}
                    >
                      Ver detalle
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
