/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Minus, Star, Heart, ShoppingBag, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { Product, ProductColor } from '../types';

interface ProductDetailViewProps {
  productId: string;
  onBack: () => void;
  onAddToCart: (product: Product, color: ProductColor, quantity: number) => void;
  onBuyNow: (product: Product, color: ProductColor, quantity: number) => void;
  onToggleFavorite: (product: Product) => void;
  favorites: Product[];
  onProductClick: (id: string) => void;
  products: Product[];
}

export default function ProductDetailView({
  productId,
  onBack,
  onAddToCart,
  onBuyNow,
  onToggleFavorite,
  favorites,
  onProductClick,
  products,
}: ProductDetailViewProps) {
  // Find current product
  const product = products.find((p) => p.id === productId) || products[0];

  const [mainImage, setMainImage] = useState(product.image);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [quantity, setQuantity] = useState(1);

  // Sync state if current product ID shifts (e.g. clicking a related product)
  useEffect(() => {
    setMainImage(product.image);
    setSelectedColor(product.colors[0]);
    setQuantity(1);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [productId, product]);

  const incrementQuantity = () => setQuantity((q) => q + 1);
  const decrementQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const isFavorite = favorites.some((f) => f.id === product.id);

  // Calculate related products (same category, different id)
  const relatedProducts = products.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 3);

  return (
    <div className="pt-28 pb-24 bg-[#faf9f6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#1a120e]/60 hover:text-black transition-colors mb-10 focus:outline-none cursor-pointer"
          id="detail-back-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a la Tienda
        </button>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT: IMAGE GALLERY (lg:col-span-7) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-12 gap-4">
            
            {/* Thumbnails (Left side of gallery on desktop) */}
            <div className="sm:col-span-2 flex sm:flex-col gap-3 order-2 sm:order-1 overflow-x-auto sm:overflow-x-visible py-1">
              {product.images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(imgUrl)}
                  className={`aspect-square w-16 sm:w-full bg-[#faf9f6] border rounded-lg flex items-center justify-center p-2.5 transition-all focus:outline-none cursor-pointer ${
                    mainImage === imgUrl ? 'border-[#1a120e] ring-1 ring-[#1a120e]' : 'border-[#efeae0] hover:border-[#1a120e]/30'
                  }`}
                  id={`thumbnail-${idx}`}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.name} vista ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.05)]"
                  />
                </button>
              ))}
            </div>

            {/* Main Image Viewport (Right side of gallery on desktop) */}
            <div className="sm:col-span-10 order-1 sm:order-2 bg-white border border-[#efeae0] rounded-xl aspect-square w-full flex items-center justify-center p-10 relative shadow-sm">
              <img
                src={mainImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="max-h-[380px] w-auto object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.08)] transform hover:scale-105 transition-transform duration-500"
              />

              {/* Tag for featured */}
              {product.featured && (
                <div className="absolute top-6 left-6 bg-[#1a120e] text-[#f5f0e6] text-[8px] tracking-[0.15em] uppercase font-bold px-2.5 py-1">
                  Colección Especial
                </div>
              )}
            </div>

          </div>

          {/* RIGHT: CONFIG & ORDER (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-8 bg-white border border-[#efeae0] rounded-xl p-8 shadow-sm">
            
            {/* Header: Category & Title */}
            <div className="space-y-2 border-b border-[#faf9f6] pb-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] tracking-[0.3em] text-[#1a120e] font-bold uppercase">
                  Lentes {product.category} / Premium
                </span>
                <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                  product.inStock ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                }`}>
                  {product.inStock ? 'En Stock' : 'Agotado'}
                </span>
              </div>
              <h1 className="font-serif-elegant text-2xl sm:text-3xl font-light text-[#1a120e] leading-tight">
                {product.name}
              </h1>
              
              {/* Stars & Reviews */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex text-[#1a120e]">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-[#1a120e]' : ''}`} 
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-[#1a120e]">{product.rating}</span>
                <span className="text-xs text-[#1a120e]/40 font-light">|</span>
                <span className="text-xs text-[#1a120e]/60 font-semibold">({product.reviewsCount} opiniones editoriales)</span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-1">
              <span className="text-[10px] tracking-widest text-[#1a120e]/45 uppercase font-bold">Precio Unitario</span>
              <div 
                className="text-3xl sm:text-4xl lg:text-5xl font-serif-elegant text-black mt-1"
                style={{ fontWeight: 950 }}
              >
                ${product.price.toFixed(2)} USD
              </div>
              <p className="text-[10px] text-green-700 font-medium flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" /> Envíos exprés gratuitos a todo el mundo
              </p>
            </div>

            {/* Description */}
            <div className="space-y-3 border-t border-b border-[#faf9f6] py-5">
              <p className="text-xs text-[#1a120e]/75 leading-relaxed font-light">
                {product.description}
              </p>
              
              {/* Key materials info */}
              <ul className="text-[11px] space-y-1.5 text-[#1a120e]/60 font-light">
                {product.details.slice(0, 3).map((detail, dIdx) => (
                  <li key={dIdx} className="flex items-start gap-2">
                    <span className="text-[#1a120e] font-bold text-xs leading-none">•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Colors Variant Configurator */}
            <div className="space-y-3.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] tracking-widest text-[#1a120e]/45 uppercase font-bold">Variante de Montura</span>
                <span className="text-xs font-medium text-[#1a120e]">{selectedColor.name}</span>
              </div>
              <div className="flex gap-3">
                {product.colors.map((color) => {
                  const isColorActive = selectedColor.name === color.name;
                  return (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`w-9 h-9 rounded-full border flex items-center justify-center relative transition-all focus:outline-none cursor-pointer hover:scale-105 ${
                        isColorActive ? 'border-[#1a120e] ring-2 ring-[#efeae0]' : 'border-[#efeae0]'
                      }`}
                      title={color.name}
                      id={`color-option-${color.name.toLowerCase().replace(' ', '-')}`}
                    >
                      <span
                        className="w-6.5 h-6.5 rounded-full border border-black/5"
                        style={{ backgroundColor: color.value }}
                      />
                      {isColorActive && (
                        <span className="absolute inset-0 flex items-center justify-center text-white mix-blend-difference">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Config & Favorites Trigger */}
            <div className="space-y-4">
              <span className="text-[10px] tracking-widest text-[#1a120e]/45 uppercase font-bold block">Cantidad</span>
              
              <div className="flex items-center gap-4">
                {/* Plus Minus Box */}
                <div className="flex items-center border border-[#efeae0] rounded-lg overflow-hidden bg-[#faf9f6]">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="p-3 hover:bg-[#efeae0] text-[#1a120e] disabled:opacity-30 transition-all focus:outline-none cursor-pointer"
                    id="qty-decrement"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-xs font-bold text-[#1a120e]">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    className="p-3 hover:bg-[#efeae0] text-[#1a120e] transition-all focus:outline-none cursor-pointer"
                    id="qty-increment"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Favorite Heart Box */}
                <button
                  onClick={() => onToggleFavorite(product)}
                  className={`flex-1 flex items-center justify-center gap-2 border border-[#efeae0] hover:border-[#1a120e]/30 p-3 rounded-lg text-xs font-semibold uppercase tracking-wider text-[#1a120e] hover:text-black transition-all focus:outline-none cursor-pointer ${
                    isFavorite ? 'bg-[#efeae0]/30 border-[#1a120e] text-[#1a120e]' : ''
                  }`}
                  id="detail-fav-btn"
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#1a120e] text-[#1a120e]' : ''}`} />
                  {isFavorite ? 'Favorito' : 'Guardar'}
                </button>
              </div>
            </div>

            {/* Buy / Cart Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={() => onAddToCart(product, selectedColor, quantity)}
                disabled={!product.inStock}
                className="flex-1 bg-transparent border border-[#1a120e] hover:bg-[#1a120e]/5 text-[#1a120e] text-xs font-bold tracking-widest uppercase py-4 transition-colors disabled:opacity-40 disabled:hover:bg-transparent flex items-center justify-center gap-2 cursor-pointer"
                id="detail-add-cart-btn"
              >
                <ShoppingBag className="w-4 h-4" />
                Agregar al Carrito
              </button>
              <button
                onClick={() => onBuyNow(product, selectedColor, quantity)}
                disabled={!product.inStock}
                className="flex-1 bg-[#1a120e] hover:bg-black text-[#f5f0e6] hover:text-white text-xs font-bold tracking-widest uppercase py-4 transition-colors disabled:opacity-40 disabled:hover:bg-[#1a120e] shadow-lg shadow-[#1a120e]/10 cursor-pointer"
                id="detail-buy-now-btn"
              >
                Comprar Ahora
              </button>
            </div>

            {/* Reassurance notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 border-t border-[#efeae0]/40 text-[10px] text-[#1a120e]/50 font-light">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#1a120e]/60 shrink-0" />
                <span>Bisagras garantizadas de por vida</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#1a120e]/60 shrink-0" />
                <span>Devoluciones gratuitas en 30 días</span>
              </div>
            </div>

          </div>

        </div>

        {/* RELATED PRODUCTS SECTION */}
        {relatedProducts.length > 0 && (
          <section className="mt-24 pt-16 border-t border-[#efeae0]">
            <div className="mb-10 text-center sm:text-left">
              <span className="text-[9px] tracking-[0.35em] text-[#1a120e] font-semibold uppercase block mb-1">
                COMPLETA TU ARMARIO
              </span>
              <h2 className="font-serif-elegant text-2xl font-bold text-[#1a120e]">
                Productos Relacionados
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {relatedProducts.map((p) => {
                return (
                  <div
                    key={p.id}
                    className="group bg-white border border-[#efeae0] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col p-4"
                    id={`related-${p.id}`}
                  >
                    {/* Visual */}
                    <div 
                      onClick={() => onProductClick(p.id)}
                      className="aspect-square bg-[#faf9f6] rounded-lg flex items-center justify-center p-6 cursor-pointer overflow-hidden relative"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="max-h-[110px] w-auto object-contain transform group-hover:scale-106 transition-transform duration-300 filter drop-shadow-[0_5px_10px_rgba(0,0,0,0.04)]"
                      />
                    </div>
                    {/* Copy */}
                    <div className="pt-4 flex flex-col flex-1">
                      <span className="text-[8px] tracking-widest text-[#1a120e] uppercase font-semibold mb-1">
                        Lentes {p.category}
                      </span>
                      <button
                        onClick={() => onProductClick(p.id)}
                        className="text-left font-serif-elegant text-sm font-light text-[#1a120e] hover:text-[#f59e0b] transition-colors focus:outline-none mb-1 cursor-pointer"
                        id={`related-title-${p.id}`}
                      >
                        {p.name}
                      </button>
                      <div className="mt-auto flex items-center justify-between pt-2 border-t border-[#efeae0]/40">
                        <span 
                          className="text-lg sm:text-xl font-serif-elegant text-black"
                          style={{ fontWeight: 950 }}
                        >
                          ${p.price.toFixed(2)} USD
                        </span>
                        <button
                          onClick={() => onProductClick(p.id)}
                          className="text-[9px] font-bold uppercase text-[#1a120e] hover:text-[#1a120e]/60 transition-colors cursor-pointer"
                          id={`related-btn-${p.id}`}
                        >
                          Explorar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
