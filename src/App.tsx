/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Glasses, ShieldCheck, Heart, ShoppingBag, X } from 'lucide-react';

import { Product, CartItem, ProductColor, User, Category } from './types';
import { PRODUCTS } from './data/products';
import { DEFAULT_CATEGORIES } from './data/categories';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedCategories from './components/FeaturedCategories';
import NewArrivals from './components/NewArrivals';
import BrandHistory from './components/BrandHistory';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import ShopView from './components/ShopView';
import ProductDetailView from './components/ProductDetailView';
import CartDrawer from './components/CartDrawer';
import FavoritesDrawer from './components/FavoritesDrawer';
import SearchOverlay from './components/SearchOverlay';
import AccountModal from './components/AccountModal';
import CheckoutModal from './components/CheckoutModal';

interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'fav';
}

export default function App() {
  // Load products state
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('sunns_products');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return PRODUCTS;
  });

  // Save products when changed
  useEffect(() => {
    localStorage.setItem('sunns_products', JSON.stringify(products));
  }, [products]);

  // Load categories state
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('sunns_categories');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEFAULT_CATEGORIES;
  });

  // Save categories when changed
  useEffect(() => {
    localStorage.setItem('sunns_categories', JSON.stringify(categories));
  }, [categories]);

  // Load current user
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sunns_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return null;
  });

  // Save current user
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('sunns_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('sunns_current_user');
    }
  }, [currentUser]);

  // Navigation / Router State
  const [currentView, setView] = useState<string>('home'); // home | shop | product-detail
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [initialCategory, setInitialCategory] = useState<string>('');

  // Cart & Favorites States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);

  // Overlays / Drawer States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Custom Toast State
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Scroll restoration on view switch
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  }, [currentView]);

  // Toast helper
  const showToast = (message: string, type: 'success' | 'info' | 'fav' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart actions
  const handleAddToCart = (product: Product, color: ProductColor, quantity = 1) => {
    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedColor.name === color.name
      );

      if (existingIdx > -1) {
        // Increment quantity
        const updated = [...prevCart];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        // Add new item
        return [...prevCart, { product, selectedColor: color, quantity }];
      }
    });

    showToast(`"${product.name}" (${color.name}) añadido a tu bolsa.`, 'success');
    
    // Automatically open the cart drawer for seamless feedback
    setTimeout(() => {
      setIsCartOpen(true);
    }, 300);
  };

  const handleUpdateCartQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) return;
    setCart((prev) => {
      const updated = [...prev];
      updated[index].quantity = quantity;
      return updated;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    const item = cart[index];
    setCart((prev) => prev.filter((_, idx) => idx !== index));
    showToast(`"${item.product.name}" eliminado de tu bolsa.`, 'info');
  };

  // Favorites actions
  const handleToggleFavorite = (product: Product) => {
    const exists = favorites.some((f) => f.id === product.id);
    if (exists) {
      setFavorites((prev) => prev.filter((f) => f.id !== product.id));
      showToast(`"${product.name}" eliminado de favoritos.`, 'info');
    } else {
      setFavorites((prev) => [...prev, product]);
      showToast(`"${product.name}" guardado en favoritos.`, 'fav');
    }
  };

  // Buy Now action
  const handleBuyNow = (product: Product, color: ProductColor, quantity = 1) => {
    // Ensure item is in cart
    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedColor.name === color.name
      );
      if (existingIdx > -1) {
        const updated = [...prevCart];
        updated[existingIdx].quantity = quantity;
        return updated;
      } else {
        return [...prevCart, { product, selectedColor: color, quantity }];
      }
    });

    // Close any drawers and open checkout immediately
    setIsCartOpen(false);
    setIsFavoritesOpen(false);
    setIsCheckoutOpen(true);
  };

  // Checkout complete callback
  const handleCheckoutSuccess = () => {
    setCart([]); // Clear cart
    setView('home'); // Go back home
    showToast('¡Pago procesado con éxito! Tu orden Sunns está en camino.', 'success');
  };

  // Navigate & open product detail
  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId);
    setView('product-detail');
  };

  // Scrolling helpers
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 90; // header height buffer
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  // Total items inside the cart
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="relative min-h-screen bg-[#faf9f6] text-[#1a120e] flex flex-col justify-between overflow-x-hidden selection:bg-[#1a120e]/10 selection:text-[#1a120e]">
      
      {/* 1. STICKY HEADER */}
      <Header
        currentView={currentView}
        setView={setView}
        cartCount={cartCount}
        favoritesCount={favorites.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        scrollToSection={scrollToSection}
      />

      {/* 2. DYNAMIC MAIN PORT / VIEWS */}
      <div className="flex-grow">
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <motion.div
              key="home-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Home Screen Sections */}
              <Hero setView={setView} />
              <NewArrivals
                onProductClick={handleProductClick}
                onAddToCart={handleAddToCart}
                onToggleFavorite={handleToggleFavorite}
                favorites={favorites}
                products={products}
              />
              <BrandHistory />
              <FeaturedCategories setView={setView} setSelectedCategory={setInitialCategory} />
              <Testimonials />
            </motion.div>
          )}

          {currentView === 'shop' && (
            <motion.div
              key="shop-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ShopView
                initialCategory={initialCategory}
                onProductClick={handleProductClick}
                onAddToCart={handleAddToCart}
                onToggleFavorite={handleToggleFavorite}
                favorites={favorites}
                onClearInitialCategory={() => setInitialCategory('')}
                products={products}
                categories={categories}
              />
            </motion.div>
          )}

          {currentView === 'product-detail' && selectedProductId && (
            <motion.div
              key="detail-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ProductDetailView
                productId={selectedProductId}
                onBack={() => setView('shop')}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                onToggleFavorite={handleToggleFavorite}
                favorites={favorites}
                onProductClick={handleProductClick}
                products={products}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. PREMIUM FOOTER */}
      <Footer
        setView={setView}
        setSelectedCategory={setInitialCategory}
        scrollToSection={scrollToSection}
      />

      {/* 4. CART DRAWER COMPONENT */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* 5. FAVORITES DRAWER COMPONENT */}
      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
        onAddToCart={handleAddToCart}
        onProductClick={handleProductClick}
      />

      {/* 6. SEARCH MODAL COMPONENT */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onProductClick={handleProductClick}
        products={products}
      />

      {/* 7. CLUB VIP ACCOUNT MODAL */}
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        products={products}
        setProducts={setProducts}
        categories={categories}
        setCategories={setCategories}
      />

      {/* 8. SECURE CHECKOUT FLOW & RECEIPT GENERATOR */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        onSuccess={handleCheckoutSuccess}
      />

      {/* 9. CUSTOM TOAST NOTIFICATION STACK */}
      <div className="fixed top-24 right-4 z-50 space-y-3 pointer-events-none max-w-sm w-full px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              className="bg-[#150d0a]/95 backdrop-blur-md border border-[#2a1c16] text-[#f5f0e6] p-4 shadow-xl pointer-events-auto rounded-lg flex items-start gap-3"
              id={`toast-${toast.id}`}
            >
              {toast.type === 'success' && <ShoppingBag className="w-5 h-5 text-[#f5f0e6] shrink-0" />}
              {toast.type === 'fav' && <Heart className="w-5 h-5 text-red-500 fill-red-500 shrink-0" />}
              {toast.type === 'info' && <Glasses className="w-5 h-5 text-[#f5f0e6]/50 shrink-0" />}
              
              <div className="flex-1 text-[11px] leading-relaxed font-light">
                {toast.message}
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="p-0.5 text-[#f5f0e6]/40 hover:text-[#f5f0e6] transition-colors focus:outline-none cursor-pointer"
                aria-label="Cerrar notificación"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}
