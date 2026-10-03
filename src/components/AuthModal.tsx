/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { User } from '../types';
import AuthForms from './dashboard/AuthForms';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  initialMode?: 'login' | 'register' | 'forgot';
  initialEmail?: string;
  activeCoupon?: { code: string; discountPercent: number; description: string } | null;
}

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'login',
  initialEmail = '',
  activeCoupon,
}: AuthModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        
        {/* Deep Translucent Frosted Glass Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-2xl transition-opacity"
        />

        {/* Ambient Subtle Monochromatic Glows (No harsh yellow) */}
        <div className="fixed top-1/4 left-1/3 -translate-x-1/2 w-96 h-96 bg-white/[0.04] rounded-full blur-3xl pointer-events-none z-[101]" />
        <div className="fixed bottom-1/4 right-1/3 translate-x-1/2 w-96 h-96 bg-white/[0.03] rounded-full blur-3xl pointer-events-none z-[101]" />

        {/* Pop-up Super Glass Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: 'spring', damping: 28, stiffness: 340 }}
          className="relative w-full max-w-lg z-[102] my-auto"
        >
          
          {/* Close Button Floating on Glass - Clean & Minimalist */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white/80 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4 stroke-[1.5]" />
          </button>

          {/* Form inside Super Glass Pop-up */}
          <AuthForms
            onLoginSuccess={(user) => {
              onLoginSuccess(user);
              onClose();
            }}
            initialMode={initialMode}
            initialEmail={initialEmail}
            activeCoupon={activeCoupon}
          />

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
