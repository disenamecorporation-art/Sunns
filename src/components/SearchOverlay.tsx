/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onProductClick: (id: string) => void;
  products: Product[];
}

export default function SearchOverlay({ isOpen, onClose, onProductClick, products }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input automatically on open
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 200);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Filter matching products
  const matchingProducts = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(trimmed) ||
        p.category.toLowerCase().includes(trimmed) ||
        p.description.toLowerCase().includes(trimmed)
    ).slice(0, 5);
  }, [query, products]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col pt-32 px-4 sm:px-6 lg:px-8"
        >
          {/* Close button top right */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 sm:top-10 sm:right-10 text-[#f5f0e6]/70 hover:text-white p-2 hover:scale-105 transition-all focus:outline-none cursor-pointer"
            id="close-search-overlay-btn"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Central search searchbox */}
          <div className="w-full max-w-2xl mx-auto space-y-8">
            <div className="space-y-2 text-center text-[#f5f0e6]">
              <span className="text-[10px] tracking-[0.45em] text-white/60 font-semibold uppercase block">
                BÚSQUEDA EXCLUSIVA
              </span>
              <h2 className="font-serif-elegant text-2xl font-bold">
                ¿Qué diseño tienes en mente?
              </h2>
            </div>

            <div className="relative border-b border-[#f5f0e6]/20 pb-4">
              <Search className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 text-white/80" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Busca por silueta, colección o categoría (Sol, Ópticos...)"
                className="w-full bg-transparent pl-10 pr-4 text-lg sm:text-xl text-[#f5f0e6] placeholder-[#f5f0e6]/25 border-0 focus:outline-none font-light"
              />
            </div>

            {/* Matching Results list */}
            <div className="space-y-4">
              {query && matchingProducts.length === 0 ? (
                <p className="text-center text-xs text-[#f5f0e6]/40 py-6">
                  No hemos encontrado piezas que coincidan con tu búsqueda. Intenta con "Sol" o "Vintage".
                </p>
              ) : (
                <div className="space-y-3">
                  {matchingProducts.map((p) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => {
                        onProductClick(p.id);
                        onClose();
                      }}
                      className="flex items-center gap-4 bg-white/5 border border-white/10 hover:border-white/30 p-3.5 rounded-xl cursor-pointer hover:bg-white/10 transition-all group"
                      id={`search-result-${p.id}`}
                    >
                      {/* Thumbnail */}
                      <div className="w-12 h-12 bg-white/5 rounded-lg border border-white/5 flex items-center justify-center p-2.5 shrink-0">
                        <img
                          src={p.image}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="max-h-full max-w-full object-contain filter drop-shadow-md"
                        />
                      </div>

                      {/* Detail */}
                      <div className="flex-1">
                        <h4 className="text-xs font-bold text-[#f5f0e6] uppercase tracking-wider group-hover:text-white transition-colors">
                          {p.name}
                        </h4>
                        <span className="text-[10px] text-[#f5f0e6]/45 font-medium uppercase mt-0.5 block">
                          Lentes {p.category} • ${p.price} USD
                        </span>
                      </div>

                      {/* Arrow indicator */}
                      <ArrowRight className="w-4 h-4 text-[#f5f0e6]/20 group-hover:text-white group-hover:translate-x-1.5 transition-all" />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick searches helpful tags */}
            {!query && (
              <div className="space-y-3 pt-4">
                <span className="text-[9px] tracking-widest text-[#f5f0e6]/40 uppercase font-bold block text-center">
                  Búsquedas sugeridas
                </span>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['Nox Minimal', 'Sol', 'Ópticos', 'Vintage', 'Aviador'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="px-4 py-2 bg-white/5 hover:bg-white/15 text-xs text-[#f5f0e6]/70 hover:text-white rounded-full border border-white/10 hover:border-white/30 transition-all cursor-pointer"
                      id={`search-tag-${tag.toLowerCase()}`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
