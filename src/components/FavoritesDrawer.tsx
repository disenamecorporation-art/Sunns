/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, ProductColor } from '../types';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Product[];
  onToggleFavorite: (product: Product) => void;
  onAddToCart: (product: Product, color: ProductColor) => void;
  onProductClick: (id: string) => void;
}

export default function FavoritesDrawer({
  isOpen,
  onClose,
  favorites,
  onToggleFavorite,
  onAddToCart,
  onProductClick,
}: FavoritesDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
            id="fav-drawer-panel"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-[#efeae0] flex items-center justify-between bg-[#faf9f6]">
              <div className="flex items-center gap-2.5">
                <Heart className="w-5 h-5 text-black fill-black" />
                <h2 className="font-serif-elegant text-lg font-bold text-black">
                  Mis Favoritos
                </h2>
                <span className="bg-black text-[#f5f0e6] text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {favorites.length}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-[#efeae0] text-black transition-colors focus:outline-none cursor-pointer"
                aria-label="Cerrar favoritos"
                id="close-favs-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Favorites Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {favorites.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-5">
                  <div className="bg-[#faf9f6] border border-[#efeae0] p-6 rounded-full w-18 h-18 flex items-center justify-center">
                    <Heart className="w-8 h-8 text-black/40" />
                  </div>
                  <div>
                    <h3 className="font-serif-elegant text-base font-bold text-black">
                      No tienes favoritos guardados
                    </h3>
                    <p className="text-[11px] text-black/60 font-light max-w-xs leading-relaxed mt-1">
                      Guarda tus siluetas y lentes preferidos haciendo clic en el icono del corazón para tenerlos listos en cualquier momento.
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="bg-black hover:bg-zinc-800 text-[#f5f0e6] hover:text-white text-[10px] tracking-widest font-bold uppercase px-6 py-3 transition-colors cursor-pointer"
                    id="fav-browse-shop-btn"
                  >
                    Ver Tienda
                  </button>
                </div>
              ) : (
                favorites.map((p, idx) => {
                  return (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-4 p-4 bg-[#faf9f6] border border-[#efeae0] rounded-xl relative hover:border-black/20 transition-all duration-300"
                      id={`fav-item-${p.id}`}
                    >
                      {/* Product Visual */}
                      <div 
                        onClick={() => { onClose(); onProductClick(p.id); }}
                        className="w-18 h-18 bg-white rounded-lg border border-[#efeae0]/50 flex items-center justify-center p-2.5 shrink-0 cursor-pointer"
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="max-h-full max-w-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.04)]"
                        />
                      </div>

                      {/* Info & Add */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between">
                            <button
                              onClick={() => { onClose(); onProductClick(p.id); }}
                              className="text-left font-serif-elegant text-xs font-bold text-black hover:text-zinc-600 transition-colors focus:outline-none cursor-pointer"
                            >
                              {p.name}
                            </button>
                            <span className="text-xs font-semibold text-black">
                              ${p.price.toFixed(2)} USD
                            </span>
                          </div>
                          
                          <span className="text-[9px] text-black/40 uppercase tracking-wider block mt-0.5 font-medium">
                            Categoría: {p.category}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-2">
                          
                          {/* Direct Cart add */}
                          <button
                            onClick={() => {
                              onAddToCart(p, p.colors[0]);
                              onToggleFavorite(p); // Optional: remove from favs when added to cart
                            }}
                            disabled={!p.inStock}
                            className="bg-black hover:bg-zinc-800 text-[#f5f0e6] hover:text-white text-[9px] tracking-widest font-bold uppercase px-3 py-2 flex items-center gap-1.5 transition-colors duration-300 cursor-pointer disabled:opacity-40"
                            id={`fav-add-to-cart-${p.id}`}
                          >
                            <ShoppingBag className="w-3 h-3" />
                            Añadir Bolsa
                          </button>

                          {/* Delete favorited */}
                          <button
                            onClick={() => onToggleFavorite(p)}
                            className="text-black/40 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-all cursor-pointer"
                            aria-label="Quitar de favoritos"
                            id={`fav-remove-${p.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Sticky bottom checkout note */}
            {favorites.length > 0 && (
              <div className="p-6 border-t border-[#efeae0] bg-[#faf9f6]">
                <button
                  onClick={onClose}
                  className="w-full border border-black hover:bg-black/5 text-black text-[10px] tracking-widest font-bold uppercase py-3.5 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  id="fav-back-to-shop-drawer"
                >
                  Seguir Buscando
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
