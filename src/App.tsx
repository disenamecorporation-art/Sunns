/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Glasses, ShieldCheck, Heart, ShoppingBag, X, Tag } from 'lucide-react';

import { Product, CartItem, ProductColor, User, Category, Coupon, HomeContent } from './types';
import { PRODUCTS } from './data/products';
import { DEFAULT_CATEGORIES } from './data/categories';
import { DEFAULT_HOME_CONTENT } from './data/homeContent';
import { dbGetProducts, dbGetCategories, dbGetActiveSession, dbGetHomeContent, dbLogoutUser } from './lib/dbService';
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
import AccountView from './components/AccountView';
import AuthModal from './components/AuthModal';
import CheckoutModal from './components/CheckoutModal';
import WelcomePopup from './components/WelcomePopup';
import AdminView from './components/AdminView';

interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'fav';
}

export default function App() {
  // Load products state from DB
  const [products, setProducts] = useState<Product[]>(PRODUCTS);

  // Load categories state from DB
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);

  // Load current user from DB session
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Load home content from Supabase DB
  const [homeContent, setHomeContent] = useState<HomeContent>(DEFAULT_HOME_CONTENT);

  // Initial load from Database
  useEffect(() => {
    let isMounted = true;
    async function loadInitialDBData() {
      try {
        const [dbProducts, dbCategories, dbHome] = await Promise.all([
          dbGetProducts(),
          dbGetCategories(),
          dbGetHomeContent(),
        ]);
        if (isMounted) {
          if (dbProducts && dbProducts.length > 0) setProducts(dbProducts);
          if (dbCategories && dbCategories.length > 0) setCategories(dbCategories);
          if (dbHome) setHomeContent(dbHome);
          const activeSession = dbGetActiveSession();
          if (activeSession) setCurrentUser(activeSession);
        }
      } catch (err) {
        console.warn('DB initialization error:', err);
      }
    }
    loadInitialDBData();
    return () => { isMounted = false; };
  }, []);

  // Coupon & Welcome Popup States
  const [isWelcomePopupOpen, setIsWelcomePopupOpen] = useState(true);
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [authInitialEmail, setAuthInitialEmail] = useState<string>('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Navigation / Router State
  const [currentView, setView] = useState<string>('home'); // home | shop | product-detail | account
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [initialCategory, setInitialCategory] = useState<string>('');

  // Cart & Favorites States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);

  // Overlays / Drawer States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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
        const updated = [...prevCart];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [...prevCart, { product, selectedColor: color, quantity }];
      }
    });

    showToast(`✓ "${product.name}" (${color.name}) añadido al carrito`);
  };

  const handleBuyNow = (product: Product, color: ProductColor, quantity = 1) => {
    handleAddToCart(product, color, quantity);
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(index);
      return;
    }
    setCart((prev) => {
      const updated = [...prev];
      updated[index].quantity = quantity;
      return updated;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
    showToast('Producto eliminado del carrito', 'info');
  };

  // Favorites actions
  const handleToggleFavorite = (product: Product) => {
    setFavorites((prev) => {
      const isFav = prev.some((p) => p.id === product.id);
      if (isFav) {
        showToast(`Removido de favoritos: ${product.name}`, 'info');
        return prev.filter((p) => p.id !== product.id);
      } else {
        showToast(`❤️ Guardado en favoritos: ${product.name}`, 'fav');
        return [...prev, product];
      }
    });
  };

  // Navigation handlers
  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId);
    setView('product-detail');
  };

  const scrollToSection = (sectionId: string) => {
    if (currentView !== 'home') {
      setView('home');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleCheckoutSuccess = () => {
    setCart([]);
    showToast('🎉 ¡Pedido procesado con éxito!', 'success');
  };

  const handleLogout = () => {
    dbLogoutUser();
    setCurrentUser(null);
    setView('home');
    showToast('Sesión cerrada correctamente', 'info');
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#1a120e] selection:bg-[#1a120e] selection:text-[#f5f0e6] relative">
      
      {/* 1. STICKY GLOBAL HEADER */}
      <Header
        currentView={currentView}
        setView={setView}
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        favoritesCount={favorites.length}
        currentUser={currentUser}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAccount={() => {
          if (currentUser) {
            setView('account');
          } else {
            setAuthInitialMode('login');
            setAuthInitialEmail('');
            setIsAuthModalOpen(true);
          }
        }}
        onOpenAdminPanel={() => setView('admin')}
        scrollToSection={scrollToSection}
      />

      {/* 2. DYNAMIC MAIN BODY ROUTER */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <motion.main
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Hero setView={setView} homeContent={homeContent} />
              
              <FeaturedCategories
                setView={setView}
                setSelectedCategory={setInitialCategory}
                homeContent={homeContent}
              />

              <NewArrivals
                products={products}
                onAddToCart={handleAddToCart}
                onToggleFavorite={handleToggleFavorite}
                favorites={favorites}
                onProductClick={handleProductClick}
                homeContent={homeContent}
              />

              <BrandHistory homeContent={homeContent} />

              <Testimonials homeContent={homeContent} />
            </motion.main>
          )}

          {currentView === 'shop' && (
            <motion.div
              key="shop"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <ShopView
                products={products}
                categories={categories}
                initialCategory={initialCategory}
                onClearInitialCategory={() => setInitialCategory('')}
                onAddToCart={handleAddToCart}
                onToggleFavorite={handleToggleFavorite}
                favorites={favorites}
                onProductClick={handleProductClick}
              />
            </motion.div>
          )}

          {currentView === 'product-detail' && (
            <motion.div
              key="product-detail"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <ProductDetailView
                productId={selectedProductId || products[0]?.id || '1'}
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

          {currentView === 'account' && (
            <motion.div
              key="account"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <AccountView
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                products={products}
                setProducts={setProducts}
                categories={categories}
                setCategories={setCategories}
                onNavigateHome={() => setView('home')}
                onNavigateShop={() => setView('shop')}
                onOpenAdminPanel={() => setView('admin')}
                onOpenAuthModal={() => {
                  setAuthInitialMode('login');
                  setIsAuthModalOpen(true);
                }}
              />
            </motion.div>
          )}

          {/* VIEW 5: SUPER ADMIN HUB (FULL PAGE DASHBOARD) */}
          {currentView === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <AdminView
                currentUser={currentUser}
                products={products}
                setProducts={setProducts}
                categories={categories}
                setCategories={setCategories}
                homeContent={homeContent}
                setHomeContent={setHomeContent}
                onNavigateHome={() => setView('home')}
                onNavigateShop={() => setView('shop')}
                onNavigateAccount={() => setView('account')}
                onLogout={handleLogout}
                onOpenAuthModal={() => {
                  setAuthInitialMode('login');
                  setIsAuthModalOpen(true);
                }}
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
        homeContent={homeContent}
      />

      {/* 4. CART DRAWER COMPONENT */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        activeCoupon={activeCoupon}
        onOpenCouponModal={() => {
          setIsCartOpen(false);
          setIsWelcomePopupOpen(true);
        }}
        onCheckout={() => {
          if (!currentUser) {
            setIsCartOpen(false);
            setAuthInitialMode('login');
            setIsAuthModalOpen(true);
            showToast('Por favor, inicie sesión o regístrese para continuar con el pago.', 'info');
            return;
          }
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

      {/* 7. SUPER GLASS POP-UP MODAL (LOGIN & REGISTRO) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setView('account');
          showToast(`✨ ¡Bienvenido de nuevo, ${user.name}!`, 'success');
        }}
        initialMode={authInitialMode}
        initialEmail={authInitialEmail}
        activeCoupon={activeCoupon}
      />

      {/* 8. SECURE CHECKOUT FLOW & RECEIPT GENERATOR */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        currentUser={currentUser}
        activeCoupon={activeCoupon}
        onSuccess={handleCheckoutSuccess}
      />

      {/* 10. HERO-STYLED WELCOME COUPON POPUP */}
      <WelcomePopup
        isOpen={isWelcomePopupOpen}
        onClose={() => setIsWelcomePopupOpen(false)}
        onApplyCoupon={(coupon) => {
          setActiveCoupon(coupon);
          showToast(`🎉 ¡Cupón "${coupon.code}" (${coupon.discountPercent}% OFF) activado!`, 'success');
        }}
        onRedirectRegister={(email) => {
          setAuthInitialEmail(email);
          setAuthInitialMode('register');
          setIsAuthModalOpen(true);
        }}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
      />

      {/* 11. CUSTOM TOAST NOTIFICATION STACK */}
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
