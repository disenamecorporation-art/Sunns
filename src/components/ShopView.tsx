/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal, Heart, ShoppingCart, Star, RotateCcw, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, ProductColor, Category } from '../types';

interface ShopViewProps {
  initialCategory: string;
  onProductClick: (id: string) => void;
  onAddToCart: (product: Product, color: ProductColor) => void;
  onToggleFavorite: (product: Product) => void;
  favorites: Product[];
  onClearInitialCategory: () => void;
  products: Product[];
  categories: Category[];
}

export default function ShopView({
  initialCategory,
  onProductClick,
  onAddToCart,
  onToggleFavorite,
  favorites,
  onClearInitialCategory,
  products,
  categories,
}: ShopViewProps) {
  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(250);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState('popular'); // popular, price-asc, price-desc, rating
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  // Sync category selection from external clicks (e.g., categories section or footer)
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategories([initialCategory]);
      // Reset other filters
      setSearchQuery('');
      setMaxPrice(250);
      setSelectedColors([]);
      setOnlyInStock(false);
      onClearInitialCategory(); // Clear it so it doesn't lock state
    }
  }, [initialCategory, onClearInitialCategory]);

  const categoriesList = useMemo(() => categories.map((c) => c.name), [categories]);

  const colorsList = [
    { name: 'Negro', hex: '#1A1A1A' },
    { name: 'Oro', hex: '#D4AF37' },
    { name: 'Plata', hex: '#C0C0C0' },
    { name: 'Champaña', hex: '#EEDC82' },
    { name: 'Carey', hex: '#5C4033' },
    { name: 'Gris', hex: '#7F8C8D' },
    { name: 'Azul', hex: '#1A5F7A' },
  ];

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((item) => item !== cat) : [...prev, cat]
    );
  };

  const toggleColor = (colorName: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorName) ? prev.filter((item) => item !== colorName) : [...prev, colorName]
    );
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setMaxPrice(250);
    setSelectedColors([]);
    setOnlyInStock(false);
    setSortBy('popular');
  };

  const isFavorite = (productId: string) => {
    return favorites.some((f) => f.id === productId);
  };

  // Dynamic client-side filtering and sorting logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Search Query
      const query = searchQuery.toLowerCase().trim();
      if (query) {
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesCategory = p.category.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCategory) return false;
      }

      // 2. Categories
      if (selectedCategories.length > 0) {
        if (!selectedCategories.includes(p.category)) return false;
      }

      // 3. Price Filter
      if (p.price > maxPrice) return false;

      // 4. Color Filter
      if (selectedColors.length > 0) {
        const productColors = p.colors.map((c) => c.name.toLowerCase());
        const hasMatchingColor = selectedColors.some((colorName) =>
          productColors.some((pColor) => pColor.includes(colorName.toLowerCase()))
        );
        if (!hasMatchingColor) return false;
      }

      // 5. Stock
      if (onlyInStock && !p.inStock) return false;

      return true;
    }).sort((a, b) => {
      // Sorting
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      // Default / popular: featured products first, then reviewsCount desc
      const scoreA = (a.featured ? 100 : 0) + a.reviewsCount;
      const scoreB = (b.featured ? 100 : 0) + b.reviewsCount;
      return scoreB - scoreA;
    });
  }, [products, searchQuery, selectedCategories, maxPrice, selectedColors, onlyInStock, sortBy]);

  return (
    <div className="pt-28 pb-24 bg-[#faf9f6] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title & Stats */}
        <div className="border-b border-[#efeae0] pb-8 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] tracking-[0.45em] text-[#1a120e] font-semibold uppercase block mb-3">
              MERCADO PREMIUM
            </span>
            <h1 className="font-serif-elegant text-3xl sm:text-4xl font-bold text-[#1a120e]">
              Catálogo Completo
            </h1>
          </div>
          <div className="flex items-center gap-4 self-start md:self-end text-xs text-[#1a120e]/60">
            <span>Mostrando {filteredProducts.length} de {products.length} piezas</span>
          </div>
        </div>

        {/* Desktop Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
          
          {/* SIDEBAR FILTERS (Desktop Only) */}
          <aside className="hidden lg:block space-y-8 bg-white border border-[#efeae0] rounded-xl p-6 shadow-sm sticky top-28">
            <div className="flex items-center justify-between border-b border-[#faf9f6] pb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#1a120e] flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#1a120e]" />
                Filtros de Búsqueda
              </h2>
              <button
                onClick={handleClearFilters}
                className="text-[10px] text-[#1a120e] hover:text-black uppercase tracking-wider font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                id="clear-filters-btn"
              >
                <RotateCcw className="w-3 h-3" />
                Limpiar
              </button>
            </div>

            {/* Search Input inside Sidebar */}
            <div className="space-y-2.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#1a120e]/60 block">
                Búsqueda
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a120e]/45" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ej. Aviador, Negro..."
                  className="w-full bg-[#faf9f6] border border-[#efeae0] rounded-lg pl-9 pr-3 py-2.5 text-xs text-[#1a120e] placeholder-[#1a120e]/35 focus:outline-none focus:border-[#1a120e] transition-all"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#1a120e]/60 block">
                Categorías
              </label>
              <div className="space-y-2">
                {categoriesList.map((cat) => (
                  <label key={cat} className="flex items-center gap-2.5 text-xs text-[#1a120e]/70 cursor-pointer hover:text-[#1a120e] select-none">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      className="rounded border-[#efeae0] text-[#1a120e] focus:ring-[#1a120e] w-4 h-4"
                    />
                    <span>{cat === 'Sol' ? 'Sol' : cat === 'Ópticos' ? 'Ópticos' : cat === 'Deportivos' ? 'Deportivos' : 'Vintage'}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Slider Filter */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#1a120e]/60">
                  Rango de Precio
                </label>
                <span className="text-xs font-semibold text-[#1a120e]">Hasta ${maxPrice} USD</span>
              </div>
              <input
                type="range"
                min="100"
                max="300"
                step="5"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-1 bg-[#efeae0] rounded-lg appearance-none cursor-pointer accent-[#1a120e]"
              />
              <div className="flex justify-between text-[10px] text-[#1a120e]/40 font-medium">
                <span>$100 USD</span>
                <span>$300 USD</span>
              </div>
            </div>

            {/* Frame Colors Filter */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#1a120e]/60 block">
                Tono de Montura
              </label>
              <div className="flex flex-wrap gap-2">
                {colorsList.map((color) => {
                  const isSelected = selectedColors.includes(color.name);
                  return (
                    <button
                      key={color.name}
                      onClick={() => toggleColor(color.name)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] tracking-wide font-medium transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#1a120e] text-[#f5f0e6] border-[#1a120e]'
                          : 'bg-[#faf9f6] text-[#1a120e]/80 border-[#efeae0] hover:border-[#1a120e]/40'
                      }`}
                      id={`filter-color-${color.name.toLowerCase()}`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-[#f5f0e6]/20"
                        style={{ backgroundColor: color.hex }}
                      />
                      {color.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stock Filter */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#1a120e]/60 block">
                Disponibilidad
              </label>
              <label className="flex items-center gap-2.5 text-xs text-[#1a120e]/70 cursor-pointer hover:text-[#1a120e] select-none">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={() => setOnlyInStock(!onlyInStock)}
                  className="rounded border-[#efeae0] text-[#1a120e] focus:ring-[#1a120e] w-4 h-4"
                />
                <span>En stock / Disponible</span>
              </label>
            </div>
          </aside>

          {/* RIGHT COLUMN: MAIN SHOP AREA */}
          <main className="lg:col-span-3 space-y-6">
            
            {/* Top Toolbar: Mobile Filters Trigger & Sorting */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#efeae0] rounded-xl p-4 shadow-sm">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center justify-center gap-2 border border-[#efeae0] hover:border-[#1a120e]/30 px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-[#1a120e] cursor-pointer w-full sm:w-auto"
                id="mobile-filter-trigger"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#1a120e]" />
                Filtrar Piezas
              </button>

              {/* Sorting options */}
              <div className="flex items-center justify-between sm:justify-end gap-3 w-full">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1a120e]/45 shrink-0">
                  Ordenar Por:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#faf9f6] border border-[#efeae0] rounded-lg text-xs text-[#1a120e] py-2 px-3 focus:outline-none focus:border-[#1a120e] cursor-pointer font-medium"
                >
                  <option value="popular">Recomendados</option>
                  <option value="price-asc">Precio: Menor a Mayor</option>
                  <option value="price-desc">Precio: Mayor a Menor</option>
                  <option value="rating">Calificación de Clientes</option>
                </select>
              </div>
            </div>

            {/* Products Grid / Blank state */}
            {filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-[#efeae0] rounded-xl p-16 text-center space-y-5"
              >
                <div className="bg-[#1a120e]/5 p-4 rounded-full w-14 h-14 flex items-center justify-center mx-auto">
                  <SlidersHorizontal className="w-6 h-6 text-[#1a120e]" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif-elegant text-xl font-bold text-[#1a120e]">
                    Ninguna pieza coincide con los filtros
                  </h3>
                  <p className="text-xs text-[#1a120e]/60 font-light max-w-sm mx-auto leading-relaxed">
                    Intenta ampliar tus criterios de búsqueda, ajustar el control deslizante de precios o limpiar todos los filtros seleccionados.
                  </p>
                </div>
                <div>
                  <button
                    onClick={handleClearFilters}
                    className="bg-[#1a120e] hover:bg-black text-[#f5f0e6] hover:text-white text-xs font-bold tracking-widest uppercase px-6 py-3 transition-colors cursor-pointer"
                    id="no-results-reset-btn"
                  >
                    Restablecer Filtros
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((p, idx) => {
                    const hasAltImage = p.images && p.images.length > 1;
                    const currentImage = (hoveredProduct === p.id && hasAltImage) ? p.images[1] : p.image;
                    const fav = isFavorite(p.id);

                    return (
                      <motion.div
                        key={p.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                        className="group flex flex-col h-full bg-white border border-[#efeae0] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                        id={`shop-product-${p.id}`}
                        onMouseEnter={() => setHoveredProduct(p.id)}
                        onMouseLeave={() => setHoveredProduct(null)}
                      >
                        {/* Image Wrap */}
                        <div className="relative aspect-square w-full bg-[#faf9f6] flex items-center justify-center p-4 border-b border-[#efeae0] overflow-hidden">
                          {/* Stock out badge */}
                          {!p.inStock && (
                            <div className="absolute top-4 left-4 z-10 bg-[#e05050] text-[#f5f0e6] text-[8px] tracking-[0.15em] uppercase font-bold px-2.5 py-1">
                              Agotado
                            </div>
                          )}

                          {/* Favorite Button */}
                          <button
                            onClick={() => onToggleFavorite(p)}
                            className="absolute top-4 right-4 z-10 bg-white hover:bg-[#faf9f6] text-[#1a120e] hover:text-black p-2 rounded-full border border-[#efeae0] transition-all duration-300 shadow-sm focus:outline-none cursor-pointer"
                            aria-label="Agregar a favoritos"
                            id={`shop-fav-btn-${p.id}`}
                          >
                            <Heart 
                              className={`w-4 h-4 transition-transform group-hover:scale-110 duration-200 ${
                                fav ? 'fill-[#1a120e] text-[#1a120e]' : ''
                              }`} 
                            />
                          </button>

                          {/* Image box */}
                          <div
                            onClick={() => onProductClick(p.id)}
                            className="w-full h-full flex items-center justify-center cursor-pointer transition-all duration-500 transform group-hover:scale-104"
                          >
                            <img
                              src={currentImage}
                              alt={p.name}
                              referrerPolicy="no-referrer"
                              className="max-h-[210px] w-auto object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.05)]"
                            />
                          </div>

                          {/* Quick Add Overlay */}
                          {p.inStock && (
                            <div className="absolute bottom-3 inset-x-3 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
                              <button
                                onClick={() => onAddToCart(p, p.colors[0])}
                                className="w-full bg-[#150d0a] hover:bg-black text-[#f5f0e6] hover:text-white text-[9px] tracking-widest font-bold uppercase py-2.5 transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                                id={`shop-quick-add-${p.id}`}
                              >
                                <ShoppingCart className="w-3 h-3" />
                                Añadir Rápido
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Text details */}
                        <div className="p-4 flex flex-col flex-1 bg-white">
                          <span className="text-[8px] tracking-widest text-[#1a120e] uppercase font-bold mb-1">
                            {p.category}
                          </span>

                          <button
                            onClick={() => onProductClick(p.id)}
                            className="text-left font-serif-elegant text-sm font-light text-[#1a120e] hover:text-[#f59e0b] transition-colors focus:outline-none cursor-pointer mb-1"
                            id={`shop-title-${p.id}`}
                          >
                            {p.name}
                          </button>

                          <div className="flex items-center gap-1 mb-3">
                            <div className="flex text-[#1a120e]">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${i < Math.floor(p.rating) ? 'fill-[#1a120e]' : ''}`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-[#1a120e]/50 font-semibold">({p.reviewsCount})</span>
                          </div>

                          <div className="mt-auto flex items-center justify-between pt-2 border-t border-[#efeae0]/40">
                            <span 
                              className="text-lg sm:text-xl font-serif-elegant text-black"
                              style={{ fontWeight: 950 }}
                            >
                              ${p.price.toFixed(2)} USD
                            </span>
                            <span className="text-[9px] font-medium text-[#1a120e]/40 group-hover:text-black transition-colors uppercase tracking-wider flex items-center gap-0.5">
                              Explorar
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </main>

        </div>
      </div>

      {/* MOBILE DRAWER FILTERS PANEL (Full screen overlay) */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-[#efeae0] flex items-center justify-between bg-[#faf9f6]">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#1a120e] flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#1a120e]" />
                  Filtros
                </h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleClearFilters}
                    className="text-[10px] text-[#1a120e] font-bold uppercase tracking-wider"
                    id="mobile-clear-btn"
                  >
                    Limpiar
                  </button>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="p-1.5 rounded-full hover:bg-[#efeae0] text-[#1a120e]"
                    aria-label="Cerrar filtros"
                    id="mobile-close-filters"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Search */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#1a120e]/60">
                    Búsqueda
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a120e]/45" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Ej. Aviador..."
                      className="w-full bg-[#faf9f6] border border-[#efeae0] rounded-lg pl-9 pr-3 py-2.5 text-xs text-[#1a120e]"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#1a120e]/60 block">
                    Categorías
                  </label>
                  <div className="space-y-2.5">
                    {categoriesList.map((cat) => (
                      <label key={cat} className="flex items-center gap-2.5 text-xs text-[#1a120e]/70 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat)}
                          onChange={() => toggleCategory(cat)}
                          className="rounded border-[#efeae0] text-[#1a120e] focus:ring-[#1a120e] w-4.5 h-4.5"
                        />
                        <span className="font-medium">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#1a120e]/60">
                      Rango de Precio
                    </label>
                    <span className="text-xs font-semibold text-[#1a120e]">Hasta ${maxPrice} USD</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="300"
                    step="5"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full h-1.5 bg-[#efeae0] rounded-lg appearance-none cursor-pointer accent-[#1a120e]"
                  />
                  <div className="flex justify-between text-[9px] text-[#1a120e]/40 font-medium">
                    <span>$100 USD</span>
                    <span>$300 USD</span>
                  </div>
                </div>

                {/* Colors */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#1a120e]/60 block">
                    Tono de Montura
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {colorsList.map((color) => {
                      const isSelected = selectedColors.includes(color.name);
                      return (
                        <button
                          key={color.name}
                          onClick={() => toggleColor(color.name)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] tracking-wide font-medium transition-all ${
                            isSelected
                              ? 'bg-[#1a120e] text-[#f5f0e6] border-[#1a120e]'
                              : 'bg-[#faf9f6] text-[#1a120e]/80 border-[#efeae0]'
                          }`}
                          id={`filter-mobile-color-${color.name.toLowerCase()}`}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-[#f5f0e6]/10"
                            style={{ backgroundColor: color.hex }}
                          />
                          {color.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Availability */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#1a120e]/60 block">
                    Disponibilidad
                  </label>
                  <label className="flex items-center gap-2.5 text-xs text-[#1a120e]/70 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onlyInStock}
                      onChange={() => setOnlyInStock(!onlyInStock)}
                      className="rounded border-[#efeae0] text-[#1a120e] focus:ring-[#1a120e] w-4.5 h-4.5"
                    />
                    <span className="font-medium">En stock / Disponible</span>
                  </label>
                </div>

              </div>

              {/* Bottom Apply CTA */}
              <div className="p-6 border-t border-[#efeae0] bg-[#faf9f6]">
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full bg-[#150d0a] hover:bg-black text-[#f5f0e6] hover:text-white text-xs font-bold tracking-widest uppercase py-4 transition-colors shadow-lg cursor-pointer"
                  id="mobile-apply-filters-btn"
                >
                  Aplicar Filtros ({filteredProducts.length})
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
