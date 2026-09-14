/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Heart, User, Search, Menu, X, Glasses } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  currentView: string;
  setView: (view: string) => void;
  cartCount: number;
  favoritesCount: number;
  onOpenCart: () => void;
  onOpenFavorites: () => void;
  onOpenSearch: () => void;
  onOpenAccount: () => void;
  scrollToSection: (id: string) => void;
}

export default function Header({
  currentView,
  setView,
  cartCount,
  favoritesCount,
  onOpenCart,
  onOpenFavorites,
  onOpenSearch,
  onOpenAccount,
  scrollToSection,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = currentView === 'home';
  const isShop = currentView === 'shop';

  // Determine header background & text styles based on view and scroll state
  let headerBgClass = '';
  if (isShop) {
    headerBgClass = 'bg-white/95 backdrop-blur-xl border-b border-[#efeae0] shadow-[0_4px_20px_rgba(0,0,0,0.04)] text-[#1a120e] py-3.5';
  } else if (isHome) {
    headerBgClass = isScrolled
      ? 'bg-black/45 backdrop-blur-3xl border-b border-white/15 shadow-[0_25px_50px_rgba(0,0,0,0.7)] text-[#f5f0e6] py-3.5'
      : 'bg-transparent text-[#f5f0e6] py-6';
  } else {
    headerBgClass = 'bg-black/60 backdrop-blur-3xl border-b border-white/15 shadow-[0_25px_50px_rgba(0,0,0,0.7)] text-[#f5f0e6] py-3.5';
  }

  const navItems = [
    { label: 'Inicio', view: 'home', action: () => setView('home') },
    { label: 'Tienda', view: 'shop', action: () => setView('shop') },
    { label: 'Novedades', view: 'home', action: () => { setView('home'); setTimeout(() => scrollToSection('new-arrivals'), 100); } },
    { label: 'Colecciones', view: 'home', action: () => { setView('home'); setTimeout(() => scrollToSection('collections'), 100); } },
    { label: 'Nosotros', view: 'home', action: () => { setView('home'); setTimeout(() => scrollToSection('about'), 100); } },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ${headerBgClass}`}>
        {/* Subtle glass shimmer gradient at the top when scrolled (only on dark mode) */}
        {!isShop && isScrolled && (
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
        )}
        {/* Subtle light top border on shop mode */}
        {isShop && (
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#efeae0] to-transparent pointer-events-none" />
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between relative">
          
          {/* Logo */}
          <button
            onClick={() => { setView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center focus:outline-none group py-1.5"
            id="header-logo-btn"
          >
            <img
              src="https://i.postimg.cc/c4c5KwvC/logoweb-sunns.png"
              alt="SUNNS"
              referrerPolicy="no-referrer"
              className={`w-auto transition-all duration-300 group-hover:scale-102 ${
                isShop 
                  ? 'brightness-0 h-16 md:h-18' 
                  : `brightness-0 invert ${isScrolled ? 'h-16 md:h-18' : 'h-22 md:h-26'}`
              }`}
            />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.label}
                  onClick={item.action}
                  className={`text-xs uppercase tracking-[0.2em] transition-all duration-200 cursor-pointer relative py-1 ${
                    isShop
                      ? isActive
                        ? 'text-black font-bold'
                        : 'text-[#1a120e]/65 hover:text-black font-medium'
                      : isActive
                        ? 'text-white font-medium'
                        : 'text-[#f5f0e6]/80 hover:text-white font-medium'
                  }`}
                  id={`nav-item-${item.label.toLowerCase().replace(' ', '-')}`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className={`absolute bottom-0 left-0 w-full h-[1.5px] ${isShop ? 'bg-black' : 'bg-white'}`}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Utilities (Search, Account, Favorites, Cart) */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* Search */}
            <button
              onClick={onOpenSearch}
              className={`p-1.5 hover:scale-105 transition-all focus:outline-none ${
                isShop ? 'text-[#1a120e]/75 hover:text-black' : 'text-[#f5f0e6]/80 hover:text-white'
              }`}
              aria-label="Buscar productos"
              id="header-search-btn"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Account */}
            <button
              onClick={onOpenAccount}
              className={`p-1.5 hover:scale-105 transition-all focus:outline-none ${
                isShop ? 'text-[#1a120e]/75 hover:text-black' : 'text-[#f5f0e6]/80 hover:text-white'
              }`}
              aria-label="Mi cuenta"
              id="header-account-btn"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Favorites */}
            <button
              onClick={onOpenFavorites}
              className={`p-1.5 hover:scale-105 transition-all focus:outline-none relative ${
                isShop ? 'text-[#1a120e]/75 hover:text-black' : 'text-[#f5f0e6]/80 hover:text-white'
              }`}
              aria-label="Favoritos"
              id="header-favs-btn"
            >
              <Heart className="w-5 h-5" />
              <AnimatePresence>
                {favoritesCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className={`absolute -top-0.5 -right-0.5 text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-sm ${
                      isShop ? 'bg-black text-white border border-white' : 'bg-white text-black border border-black'
                    }`}
                  >
                    {favoritesCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Cart Bag */}
            <button
              onClick={onOpenCart}
              className={`p-1.5 hover:scale-105 transition-all focus:outline-none relative ${
                isShop ? 'text-[#1a120e]/75 hover:text-black' : 'text-[#f5f0e6]/80 hover:text-white'
              }`}
              aria-label="Carrito de compras"
              id="header-cart-btn"
            >
              <ShoppingBag className="w-5 h-5" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className={`absolute -top-0.5 -right-0.5 text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-sm ${
                      isShop ? 'bg-black text-white border border-white' : 'bg-white text-black border border-black'
                    }`}
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-1.5 transition-all focus:outline-none ${
                isShop ? 'text-[#1a120e] hover:text-black' : 'text-[#f5f0e6]/80 hover:text-white'
              }`}
              aria-label="Menú móvil"
              id="header-mobile-toggle-btn"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed inset-x-0 top-18 z-30 md:hidden overflow-hidden shadow-2xl ${
              isShop
                ? 'bg-white/98 backdrop-blur-2xl border-b border-[#efeae0] text-[#1a120e]'
                : 'bg-black/95 backdrop-blur-3xl border-b border-white/15 text-[#f5f0e6]'
            }`}
          >
            <div className="px-6 py-8 flex flex-col space-y-5">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    item.action();
                  }}
                  className={`text-left text-sm uppercase tracking-[0.2em] font-medium py-2 transition-all ${
                    isShop ? 'text-[#1a120e] hover:text-black' : 'text-[#f5f0e6] hover:text-white'
                  }`}
                  id={`mobile-nav-item-${item.label.toLowerCase().replace(' ', '-')}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
