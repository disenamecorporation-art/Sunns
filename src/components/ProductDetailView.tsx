/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, Plus, Minus, Star, Heart, ShoppingBag, ShieldCheck, 
  Truck, RefreshCw, Maximize2, X, ZoomIn, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, ProductColor } from '../types';
import { normalizeProduct } from '../lib/dbService';

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
  // Find current product safely with defensive normalization
  const rawProduct = products.find((p) => p.id === productId) || products[0];
  const product = useMemo(() => normalizeProduct(rawProduct), [rawProduct]);

  const defaultColor: ProductColor = product.colors && product.colors.length > 0
    ? product.colors[0]
    : { name: 'Negro', value: '#1A1A1A' };

  const [selectedColor, setSelectedColor] = useState<ProductColor>(defaultColor);
  const [activeMedia, setActiveMedia] = useState<'image' | 'video'>('image');
  const [quantity, setQuantity] = useState(1);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

  // Gallery images: combine selected color photos, general model images, and other variants so thumbnails always show all model photos
  const currentGalleryImages = useMemo(() => {
    const list: string[] = [];
    if (selectedColor && selectedColor.images && selectedColor.images.length > 0) {
      list.push(...selectedColor.images);
    }
    if (product.images && product.images.length > 0) {
      list.push(...product.images);
    }
    if (product.image) {
      list.push(product.image);
    }
    if (product.colors && product.colors.length > 0) {
      for (const col of product.colors) {
        if (col.images && col.images.length > 0) {
          list.push(...col.images);
        }
      }
    }
    const deduplicated = Array.from(new Set(list.filter(Boolean)));
    return deduplicated.length > 0 ? deduplicated : [product.image];
  }, [selectedColor, product]);

  const [mainImage, setMainImage] = useState<string>(currentGalleryImages[0] || product.image);

  // Sync state if current product ID shifts
  useEffect(() => {
    const activeCol = product.colors && product.colors.length > 0 ? product.colors[0] : { name: 'Negro', value: '#1A1A1A' };
    setSelectedColor(activeCol);
    const initialImages = (activeCol.images && activeCol.images.length > 0) 
      ? activeCol.images 
      : (product.images && product.images.length > 0 ? product.images : [product.image]);
    setMainImage(initialImages[0] || product.image);
    setActiveMedia('image');
    setQuantity(1);
    setIsZoomModalOpen(false);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [productId, product]);

  // Handler when selecting a color: update gallery to that color's photos!
  const handleSelectColor = (color: ProductColor) => {
    setSelectedColor(color);
    if (color.images && color.images.length > 0) {
      setMainImage(color.images[0]);
    } else if (product.images && product.images.length > 0) {
      setMainImage(product.images[0]);
    } else {
      setMainImage(product.image);
    }
    setActiveMedia('image');
  };

  const incrementQuantity = () => setQuantity((q) => q + 1);
  const decrementQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const isFavorite = favorites.some((f) => f.id === product.id);

  // Calculate related products (same category, different id)
  const relatedProducts = products.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 3);

  // Two dedicated description bullet points
  const descriptionPoint1 = product.details?.[0] || 'Montura de alta ingeniería con distribución de peso balanceada para máxima comodidad';
  const descriptionPoint2 = product.details?.[1] || 'Lentes de claridad óptica de grado editorial con protección UV400 certificada';

  return (
    <div className="pt-28 pb-24 bg-[#faf9f6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#1a120e]/60 hover:text-black transition-colors mb-8 focus:outline-none cursor-pointer"
          id="detail-back-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a la Tienda
        </button>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT: IMAGE & VIDEO GALLERY (lg:col-span-7) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-12 gap-4">
            
            {/* Thumbnails (Left side on desktop) */}
            <div className="sm:col-span-2 flex sm:flex-col gap-3 order-2 sm:order-1 overflow-x-auto sm:overflow-x-visible py-1">
              {currentGalleryImages.map((imgUrl, idx) => (
                <button
                  key={`${imgUrl}-${idx}`}
                  onClick={() => { setMainImage(imgUrl); setActiveMedia('image'); }}
                  className={`aspect-square w-16 sm:w-full bg-white border-2 rounded-2xl flex items-center justify-center p-1.5 transition-all focus:outline-none cursor-pointer overflow-hidden ${
                    activeMedia === 'image' && mainImage === imgUrl 
                      ? 'border-[#1a120e] ring-2 ring-[#1a120e]/20 shadow-sm' 
                      : 'border-[#efeae0] hover:border-[#1a120e]/40'
                  }`}
                  id={`thumbnail-${idx}`}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.name} vista ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.includes('photo-1511499767150-a48a237f0083')) {
                        target.src = 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80';
                      }
                    }}
                    className="max-h-full max-w-full object-contain filter drop-shadow-sm"
                  />
                </button>
              ))}

              {/* Video Thumbnail Button if present */}
              {product.videoUrl && (
                <button
                  onClick={() => setActiveMedia('video')}
                  className={`aspect-square w-16 sm:w-full bg-neutral-900 text-white border-2 rounded-2xl flex flex-col items-center justify-center p-2 transition-all focus:outline-none cursor-pointer ${
                    activeMedia === 'video' ? 'border-amber-400 ring-2 ring-amber-400' : 'border-neutral-700 hover:border-white'
                  }`}
                  id="thumbnail-video"
                >
                  <span className="text-base sm:text-lg">▶️</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-amber-300 mt-0.5">Video</span>
                </button>
              )}
            </div>

            {/* Main Image/Video Viewport - EXPANDED, EXTRA LARGE VISUAL CONTAINER */}
            <div className="sm:col-span-10 order-1 sm:order-2 bg-white border border-[#efeae0] rounded-3xl p-4 sm:p-8 min-h-[500px] sm:min-h-[620px] lg:min-h-[660px] w-full flex items-center justify-center relative shadow-sm overflow-hidden group">
              {activeMedia === 'video' && product.videoUrl ? (
                product.videoUrl.includes('youtube.com') || product.videoUrl.includes('youtu.be') ? (
                  <iframe
                    src={product.videoUrl.replace('watch?v=', 'embed/')}
                    title={`Video ${product.name}`}
                    className="w-full h-full min-h-[500px] rounded-2xl border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={product.videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full max-h-[620px] object-contain rounded-2xl bg-black"
                  />
                )
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center cursor-zoom-in"
                  onClick={() => setIsZoomModalOpen(true)}
                  title="Haz clic para ver en pantalla completa y zoom"
                >
                  <img
                    src={mainImage}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.includes('photo-1511499767150-a48a237f0083')) {
                        target.src = 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80';
                      }
                    }}
                    className="max-h-[520px] sm:max-h-[600px] w-full h-auto object-contain filter drop-shadow-[0_20px_45px_rgba(0,0,0,0.12)] transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              {/* Tag for featured */}
              {product.featured && (
                <div className="absolute top-5 left-5 bg-[#1a120e] text-[#f5f0e6] text-[9px] tracking-[0.15em] uppercase font-bold px-3 py-1.5 rounded-lg shadow-md z-10">
                  Colección Especial
                </div>
              )}

              {/* Discount Tag Badge if on sale */}
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="absolute top-5 right-5 bg-amber-400 text-black text-[10px] tracking-wider uppercase font-black px-3 py-1.5 rounded-full shadow-md z-10 border border-amber-300">
                  OFERTA -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                </div>
              )}

              {/* Zoom Trigger Button Overlay */}
              {activeMedia === 'image' && (
                <button
                  type="button"
                  onClick={() => setIsZoomModalOpen(true)}
                  className="absolute bottom-5 right-5 bg-white/90 hover:bg-black hover:text-white text-[#1a120e] p-2.5 rounded-2xl shadow-md border border-[#efeae0] transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold backdrop-blur-sm"
                  title="Ampliar foto"
                >
                  <ZoomIn className="w-4 h-4" />
                  <span className="hidden sm:inline text-[11px]">Ampliar</span>
                </button>
              )}
            </div>

          </div>

          {/* RIGHT: CONFIG & ORDER (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6 bg-white border border-[#efeae0] rounded-3xl p-6 sm:p-8 shadow-sm">
            
            {/* Header: Category & Title */}
            <div className="space-y-2 border-b border-[#faf9f6] pb-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] tracking-[0.3em] text-[#1a120e] font-bold uppercase">
                  Lentes {product.category} / Premium
                </span>
                <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${
                  product.inStock ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'
                }`}>
                  {product.inStock ? 'En Stock' : 'Agotado'}
                </span>
              </div>
              <h1 className="font-serif-elegant text-2xl sm:text-3xl font-bold text-[#1a120e] leading-tight">
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

            {/* PRECIOS EXACTOS: PRECIO SUNNSSHOP & PRECIO ORIGINAL */}
            {(() => {
              const effectiveOriginalPrice = product.originalPrice && product.originalPrice > product.price
                ? product.originalPrice
                : Math.round(product.price * 1.35);
              const discountPct = Math.round((1 - product.price / effectiveOriginalPrice) * 100);
              return (
                <div className="space-y-2 bg-[#faf9f6] border border-[#efeae0] p-4 rounded-2xl">
                  <div className="flex items-baseline justify-between flex-wrap gap-2">
                    <div>
                      <span className="text-[10px] tracking-wider text-neutral-500 uppercase font-bold block">
                        Precio SUNNSSHOP
                      </span>
                      <div className="text-3xl sm:text-4xl font-serif-elegant text-black font-black mt-0.5">
                        ${product.price.toFixed(2)} USD
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] tracking-wider text-neutral-400 uppercase font-semibold block">
                        Precio Original
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-lg sm:text-xl font-serif-elegant text-[#1a120e]/45 line-through font-normal">
                          ${effectiveOriginalPrice.toFixed(2)} USD
                        </span>
                        <span className="bg-amber-400 text-black text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-amber-300">
                          -{discountPct}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] text-green-700 font-medium flex items-center gap-1 pt-1 border-t border-[#efeae0]/60">
                    <Truck className="w-3.5 h-3.5" /> Envíos exprés a todo el mundo (Impuestos calculados en el checkout)
                  </p>
                </div>
              );
            })()}

            {/* Description & 2 Exact Bullet Points */}
            <div className="space-y-3.5 border-t border-b border-[#faf9f6] py-4">
              <p className="text-xs text-[#1a120e]/80 leading-relaxed font-light">
                {product.description}
              </p>
              
              {/* 2 Puntos de Descripción Requeridos */}
              <div className="space-y-2 pt-1">
                <div className="flex items-start gap-2.5 text-xs text-[#1a120e]/85">
                  <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0 mt-1.5" />
                  <span className="leading-snug">{descriptionPoint1}</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-[#1a120e]/85">
                  <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0 mt-1.5" />
                  <span className="leading-snug">{descriptionPoint2}</span>
                </div>
              </div>
            </div>

            {/* Colors Variant Configurator with Multi-Photo Switch */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] tracking-widest text-[#1a120e]/50 uppercase font-bold">
                  Color de Montura
                </span>
                <span className="text-xs font-bold text-[#1a120e]">{selectedColor?.name || 'Negro'}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {(product.colors || []).map((color, idx) => {
                  const cName = color?.name || 'Negro';
                  const cValue = color?.value || '#1A1A1A';
                  const isColorActive = (selectedColor?.name || '') === cName;
                  const colorSlug = String(cName).toLowerCase().replace(/\s+/g, '-');
                  const hasColorImages = color?.images && color.images.length > 0;
                  return (
                    <button
                      key={`${cName}-${idx}`}
                      type="button"
                      onClick={() => handleSelectColor(color)}
                      className={`h-10 px-3 rounded-2xl border flex items-center gap-2 transition-all focus:outline-none cursor-pointer ${
                        isColorActive 
                          ? 'border-[#1a120e] ring-2 ring-black/10 bg-[#faf9f6] shadow-sm' 
                          : 'border-[#efeae0] bg-white hover:border-[#1a120e]/40'
                      }`}
                      title={`${cName}${hasColorImages ? ' (con fotos dedicadas)' : ''}`}
                      id={`color-option-${colorSlug}`}
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: cValue }}
                      />
                      <span className="text-xs font-semibold text-[#1a120e]">{cName}</span>
                      {isColorActive && (
                        <span className="text-xs font-bold text-black ml-0.5">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Config & Favorites Trigger */}
            <div className="space-y-3 pt-2">
              <span className="text-[10px] tracking-widest text-[#1a120e]/50 uppercase font-bold block">
                Cantidad
              </span>
              
              <div className="flex items-center gap-4">
                {/* Plus Minus Box */}
                <div className="flex items-center border border-[#efeae0] rounded-xl overflow-hidden bg-[#faf9f6]">
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
                  className={`flex-1 flex items-center justify-center gap-2 border border-[#efeae0] hover:border-[#1a120e]/30 p-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-[#1a120e] hover:text-black transition-all focus:outline-none cursor-pointer ${
                    isFavorite ? 'bg-[#efeae0]/30 border-[#1a120e] text-[#1a120e]' : ''
                  }`}
                  id="detail-fav-btn"
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#1a120e] text-[#1a120e]' : ''}`} />
                  {isFavorite ? 'Guardado' : 'Favorito'}
                </button>
              </div>
            </div>

            {/* Buy / Cart Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => onAddToCart(product, selectedColor, quantity)}
                disabled={!product.inStock}
                className="flex-1 bg-transparent border-2 border-[#1a120e] hover:bg-[#1a120e]/5 text-[#1a120e] text-xs font-bold tracking-widest uppercase py-4 transition-colors disabled:opacity-40 disabled:hover:bg-transparent flex items-center justify-center gap-2 cursor-pointer rounded-2xl"
                id="detail-add-cart-btn"
              >
                <ShoppingBag className="w-4 h-4" />
                Agregar al Carrito
              </button>
              <button
                onClick={() => onBuyNow(product, selectedColor, quantity)}
                disabled={!product.inStock}
                className="flex-1 bg-black hover:bg-neutral-800 text-white text-xs font-bold tracking-widest uppercase py-4 transition-colors disabled:opacity-40 shadow-lg shadow-black/10 cursor-pointer rounded-2xl"
                id="detail-buy-now-btn"
              >
                Comprar Ahora
              </button>
            </div>

            {/* Reassurance notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 border-t border-[#efeae0]/40 text-[10px] text-[#1a120e]/60 font-light">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#1a120e]/70 shrink-0" />
                <span>Garantía de fabricación certificada</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#1a120e]/70 shrink-0" />
                <span>Devoluciones garantizadas</span>
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
                    className="group bg-white border border-[#efeae0] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col p-4"
                    id={`related-${p.id}`}
                  >
                    {/* Visual */}
                    <div 
                      onClick={() => onProductClick(p.id)}
                      className="aspect-square bg-[#faf9f6] rounded-xl flex items-center justify-center p-6 cursor-pointer overflow-hidden relative"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="max-h-[140px] w-auto object-contain transform group-hover:scale-106 transition-transform duration-300 filter drop-shadow-[0_5px_10px_rgba(0,0,0,0.04)]"
                      />
                    </div>
                    {/* Copy */}
                    <div className="pt-4 flex flex-col flex-1">
                      <span className="text-[8px] tracking-widest text-[#1a120e] uppercase font-semibold mb-1">
                        Lentes {p.category}
                      </span>
                      <button
                        onClick={() => onProductClick(p.id)}
                        className="text-left font-serif-elegant text-sm font-semibold text-[#1a120e] hover:text-[#f59e0b] transition-colors focus:outline-none mb-1 cursor-pointer"
                        id={`related-title-${p.id}`}
                      >
                        {p.name}
                      </button>
                      <div className="mt-auto pt-2 flex items-baseline gap-2">
                        <span className="text-sm font-bold text-[#1a120e]">
                          ${p.price.toFixed(2)} USD
                        </span>
                        {p.originalPrice && p.originalPrice > p.price && (
                          <span className="text-xs text-[#1a120e]/40 line-through">
                            ${p.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

      </div>

      {/* FULLSCREEN ZOOM MODAL */}
      <AnimatePresence>
        {isZoomModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8"
          >
            <div className="w-full max-w-6xl flex items-center justify-between text-white pb-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold">{product.name}</span>
                <span className="text-xs text-neutral-400">({selectedColor?.name || 'Principal'})</span>
              </div>
              <button
                type="button"
                onClick={() => setIsZoomModalOpen(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white text-white hover:text-black transition-colors cursor-pointer"
                title="Cerrar zoom"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="relative w-full max-w-5xl h-[75vh] flex items-center justify-center bg-black/40 rounded-3xl p-6 border border-white/10 overflow-hidden">
              <img
                src={mainImage}
                alt={product.name}
                className="max-w-full max-h-full object-contain filter drop-shadow-[0_25px_60px_rgba(255,255,255,0.08)]"
              />
            </div>

            {/* Thumbnail Strip inside Modal */}
            <div className="flex gap-2 pt-4 overflow-x-auto max-w-3xl">
              {currentGalleryImages.map((img, idx) => (
                <button
                  key={`zoom-thumb-${idx}`}
                  onClick={() => setMainImage(img)}
                  className={`w-14 h-14 rounded-xl border-2 overflow-hidden bg-white/5 p-1 transition-all cursor-pointer ${
                    mainImage === img ? 'border-white scale-105' : 'border-white/20 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
