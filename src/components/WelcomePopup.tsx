/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  X, Sparkles, ArrowRight, CheckCircle2, Mail, Tag, Crown 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getAllRegisteredUsers, setActiveSession } from '../lib/userService';
import { User, Coupon } from '../types';

interface WelcomePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCoupon: (coupon: Coupon) => void;
  onRedirectRegister: (email: string) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
}

export default function WelcomePopup({
  isOpen,
  onClose,
  onApplyCoupon,
  onRedirectRegister,
  currentUser,
  setCurrentUser,
}: WelcomePopupProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successState, setSuccessState] = useState<{
    type: 'registered' | 'unregistered';
    userName?: string;
    couponCode: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto populate if user is already logged in
  useEffect(() => {
    if (currentUser?.email) {
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  const couponData: Coupon = {
    code: 'BIENVENIDO10',
    discountPercent: 10,
    description: '10% OFF Cupón Exclusivo de Bienvenida Sunns',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMsg('Por favor introduce un correo electrónico válido.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      // Check if email belongs to a registered user
      const users = getAllRegisteredUsers();
      const matchedUser = users.find((u) => u.email.toLowerCase() === cleanEmail);

      // Apply coupon globally
      onApplyCoupon(couponData);

      if (matchedUser) {
        // Identified registered user!
        if (!currentUser) {
          setActiveSession(matchedUser);
          setCurrentUser(matchedUser);
        }

        setSuccessState({
          type: 'registered',
          userName: matchedUser.name || cleanEmail.split('@')[0],
          couponCode: couponData.code,
        });
      } else {
        // User not registered: notify and allow redirect or staying
        setSuccessState({
          type: 'unregistered',
          couponCode: couponData.code,
        });
      }
    }, 600);
  };

  const handleClaimAndShop = () => {
    onClose();
  };

  const handleGoToRegister = () => {
    onClose();
    onRedirectRegister(email.trim().toLowerCase());
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
          
          {/* Main Hero-Styled Popup Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 25 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative w-full max-w-2xl bg-black border border-white/20 rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95)] text-white flex flex-col my-auto"
            id="welcome-coupon-popup"
          >
            {/* 1. SLEEK BLACK STUDIO LIGHTING BACKGROUND */}
            <div 
              className="absolute inset-0 pointer-events-none z-0"
              style={{
                background: `
                  radial-gradient(ellipse 70% 60% at 75% 25%, rgba(255, 255, 255, 0.08) 0%, rgba(20, 20, 20, 0.8) 55%, #000000 100%),
                  radial-gradient(circle at 20% 80%, rgba(40, 40, 40, 0.3) 0%, transparent 60%),
                  linear-gradient(180deg, rgba(15, 15, 15, 0.6) 0%, #000000 100%)
                `
              }}
            />

            {/* Subtle Monochrome Studio Glow */}
            <div 
              className="absolute inset-0 pointer-events-none z-[1] opacity-25 mix-blend-screen"
              style={{
                background: 'radial-gradient(circle at 70% 25%, rgba(255, 255, 255, 0.35) 0%, rgba(60, 60, 60, 0.15) 50%, transparent 75%)'
              }}
            />

            {/* 2. GIANT WATERMARK EDITORIAL LETTERS "SUNNS" BEHIND CONTENT */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[2] select-none overflow-hidden opacity-20">
              <div 
                className="w-full flex items-center justify-between text-center font-hero-editorial leading-none tracking-[-0.03em] px-4 text-white"
                style={{ fontSize: 'clamp(4rem, 15vw, 11rem)' }}
              >
                <span className="text-hero-solid">S</span>
                <span className="text-hero-outline">U</span>
                <span className="text-hero-solid">N</span>
                <span className="text-hero-outline">N</span>
                <span className="text-hero-solid">S</span>
              </div>
            </div>

            {/* Top Close Button (X) */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white/80 hover:text-white transition-all cursor-pointer backdrop-blur-md border border-white/20"
              aria-label="Cerrar ventana"
              id="close-welcome-popup-btn"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content Container */}
            <div className="relative z-20 p-6 sm:p-10 flex flex-col justify-center">
              
              {/* Heading & Subtitle */}
              <div className="space-y-3 text-center sm:text-left">
                <h2 className="text-xl sm:text-3xl text-white leading-tight">
                  <span className="text-zinc-200 font-light block">Obtén tu Cupón de</span>
                  <span className="font-montserrat-heavy text-4xl sm:text-6xl tracking-tight block bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent drop-shadow-[0_4px_24px_rgba(245,158,11,0.45)] my-1">
                    10% OFF
                  </span>
                </h2>

                <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed max-w-md">
                  Ingresa tu correo para desbloquear y activar tu cupón inmediato del <strong className="font-montserrat-heavy text-amber-300 font-bold">10% OFF</strong> aplicable a cualquier montura de nuestra colección.
                </p>
              </div>

              {/* Central Dynamic State */}
              <div className="my-6">
                {!successState ? (
                  /* Form State */
                  <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
                    
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Introduce tu correo electrónico..."
                        className="w-full pl-10 pr-4 py-3.5 bg-white/[0.07] hover:bg-white/[0.1] focus:bg-white/[0.14] border border-amber-400/30 focus:border-amber-300 rounded-2xl text-xs sm:text-sm text-white placeholder-zinc-400 backdrop-blur-xl focus:outline-none transition-all shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
                        id="welcome-popup-email-input"
                      />
                    </div>

                    {errorMsg && (
                      <p className="text-xs text-rose-300 font-medium bg-rose-950/40 border border-rose-800/50 px-3 py-1.5 rounded-lg">
                        {errorMsg}
                      </p>
                    )}

                    {/* VIBRANT GOLDEN CTA BUTTON */}
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      className="group relative overflow-hidden w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 hover:from-amber-200 hover:to-amber-300 text-black text-xs font-montserrat-heavy tracking-[0.2em] uppercase py-4 px-6 rounded-2xl transition-all duration-300 cursor-pointer shadow-[0_10px_35px_rgba(245,158,11,0.35)] hover:shadow-[0_10px_40px_rgba(245,158,11,0.55)] disabled:opacity-50"
                      id="welcome-popup-claim-btn"
                    >
                      <Tag className="relative z-10 w-4 h-4 text-black" />
                      <span className="relative z-10 font-montserrat-heavy text-xs">
                        {isSubmitting ? 'Verificando socio...' : 'Activar mi 10% OFF Inmediato'}
                      </span>
                      <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300 text-black" />
                    </motion.button>
                  </form>
                ) : successState.type === 'registered' ? (
                  /* Success Screen for Registered Users */
                  <div className="bg-gradient-to-br from-zinc-900 to-black border border-amber-400/40 rounded-2xl p-5 backdrop-blur-xl space-y-3 animate-in fade-in zoom-in-95 shadow-[0_10px_30px_rgba(245,158,11,0.15)]">
                    <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span className="font-montserrat-heavy">¡Socio Identificado! Bienvenido, {successState.userName}</span>
                    </div>

                    <p className="text-xs text-zinc-200 font-light leading-relaxed">
                      Hemos vinculado tu cupón <strong className="font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-400/40 font-bold">{successState.couponCode}</strong> a tu cuenta. Disfruta de un <span className="font-montserrat-heavy bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent text-sm">10% OFF</span> en tu orden.
                    </p>

                    <button
                      onClick={handleClaimAndShop}
                      className="w-full mt-2 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 hover:from-amber-200 hover:to-amber-300 text-black font-montserrat-heavy text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-black" /> Ir a la Tienda a Canjear
                    </button>
                  </div>
                ) : (
                  /* Notification for Non-Registered Users */
                  <div className="bg-gradient-to-br from-zinc-900 to-black border border-amber-400/40 rounded-2xl p-5 backdrop-blur-xl space-y-3 animate-in fade-in zoom-in-95 shadow-[0_10px_30px_rgba(245,158,11,0.15)]">
                    <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                      <Crown className="w-5 h-5 text-amber-300" />
                      <span className="font-montserrat-heavy">¡Cupón {successState.couponCode} Activado!</span>
                    </div>

                    <p className="text-xs text-zinc-200 font-light leading-relaxed">
                      Tu correo <strong className="text-white font-medium">{email}</strong> tiene listo el cupón <strong className="font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-400/40 font-bold">{successState.couponCode}</strong> con <span className="font-montserrat-heavy bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent text-sm">10% OFF</span>.
                    </p>

                    <div className="pt-2 flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={handleGoToRegister}
                        className="flex-1 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 hover:from-amber-200 hover:to-amber-300 text-black font-montserrat-heavy text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
                      >
                        <Crown className="w-4 h-4" /> Guardar Cuenta Club Privé
                      </button>
                      <button
                        onClick={handleClaimAndShop}
                        className="px-4 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded-xl border border-white/10 transition-all cursor-pointer"
                      >
                        Ir a la Tienda
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
