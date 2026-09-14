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

  // Determine header background & text styles based on view and scroll state
  const headerBgClass = isHome
    ? isScrolled
      ? 'bg-[#150d0a]/95 backdrop-blur-md border-b border-[#2a1c16] text-[#f5f0e6] py-4'
      : 'bg-transparent text-[#f5f0e6] py-6'
    : 'bg-[#150d0a]/98 backdrop-blur-md border-b border-[#2a1c16] text-[#f5f0e6] py-4';

  const navItems = [
    { label: 'Home', view: 'home', action: () => setView('home') },
    { label: 'Shop', view: 'shop', action: () => setView('shop') },
    { label: 'New Arrivals', view: 'home', action: () => { setView('home'); setTimeout(() => scrollToSection('new-arrivals'), 100); } },
    { label: 'Collections', view: 'home', action: () => { setView('home'); setTimeout(() => scrollToSection('collections'), 100); } },
    { label: 'About', view: 'home', action: () => { setView('home'); setTimeout(() => scrollToSection('about'), 100); } },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${headerBgClass}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
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
              className={`w-auto brightness-0 invert transition-all duration-300 group-hover:scale-102 ${
                isScrolled ? 'h-16 md:h-18' : 'h-22 md:h-26'
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
                  className={`text-xs uppercase tracking-[0.2em] font-medium transition-all duration-200 hover:text-white cursor-pointer relative py-1 ${
                    isActive ? 'text-white' : 'text-[#f5f0e6]/80'
                  }`}
                  id={`nav-item-${item.label.toLowerCase().replace(' ', '-')}`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 w-full h-[1px] bg-white"
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
              className="p-1.5 text-[#f5f0e6]/80 hover:text-white hover:scale-105 transition-all focus:outline-none"
              aria-label="Buscar productos"
              id="header-search-btn"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Account */}
            <button
              onClick={onOpenAccount}
              className="p-1.5 text-[#f5f0e6]/80 hover:text-white hover:scale-105 transition-all focus:outline-none"
              aria-label="Mi cuenta"
              id="header-account-btn"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Favorites */}
            <button
              onClick={onOpenFavorites}
              className="p-1.5 text-[#f5f0e6]/80 hover:text-white hover:scale-105 transition-all focus:outline-none relative"
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
                    className="absolute -top-0.5 -right-0.5 bg-white text-[#150d0a] text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-[#150d0a]"
                  >
                    {favoritesCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Cart Bag */}
            <button
              onClick={onOpenCart}
              className="p-1.5 text-[#f5f0e6]/80 hover:text-white hover:scale-105 transition-all focus:outline-none relative"
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
                    className="absolute -top-0.5 -right-0.5 bg-white text-[#150d0a] text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-[#150d0a]"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-[#f5f0e6]/80 hover:text-white transition-all focus:outline-none"
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
            className="fixed inset-x-0 top-18 bg-[#150d0a] border-b border-[#2a1c16] z-30 md:hidden overflow-hidden shadow-2xl"
          >
            <div className="px-6 py-8 flex flex-col space-y-5">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    item.action();
                  }}
                  className="text-left text-sm uppercase tracking-[0.2em] font-medium text-[#f5f0e6] hover:text-white py-2 transition-all"
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
