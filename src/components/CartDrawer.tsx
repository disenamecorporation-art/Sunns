/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Truck, Tag, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, Coupon } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onCheckout: () => void;
  activeCoupon?: Coupon | null;
  onOpenCouponModal?: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  activeCoupon,
  onOpenCouponModal,
}: CartDrawerProps) {
  // Calculate pricing sums
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shipping = 0; // Free express shipping
  const discountAmount = activeCoupon ? (subtotal * activeCoupon.discountPercent) / 100 : 0;
  const total = Math.max(0, subtotal - discountAmount);
  const estimatedTax = total * 0.10; // 10% VAT/IVA included in price

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
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
            id="cart-drawer-panel"
          >
            {/* Drawer Header */}
            <div className="px-6 py-5 border-b border-[#efeae0] flex items-center justify-between bg-[#faf9f6]">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-black" />
                <h2 className="font-serif-elegant text-lg font-bold text-black">
                  Bolsa de Compras
                </h2>
                <span className="bg-black text-[#f5f0e6] text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {cart.length}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-[#efeae0] text-black transition-colors focus:outline-none cursor-pointer"
                aria-label="Cerrar carrito"
                id="close-cart-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Cart items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-5">
                  <div className="bg-[#faf9f6] border border-[#efeae0] p-6 rounded-full w-18 h-18 flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-black/40" />
                  </div>
                  <div>
                    <h3 className="font-serif-elegant text-base font-bold text-black">
                      Tu bolsa está vacía
                    </h3>
                    <p className="text-[11px] text-black/60 font-light max-w-xs leading-relaxed mt-1">
                      Aún no has añadido ninguna de nuestras selectas piezas a tu carrito. Explora nuestra tienda para descubrir diseños atemporales.
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="bg-black hover:bg-zinc-800 text-[#f5f0e6] hover:text-white text-[10px] tracking-widest font-bold uppercase px-6 py-3 transition-colors cursor-pointer"
                    id="cart-continue-shopping"
                  >
                    Seguir Explorando
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Active Coupon notification bar if present */}
                  {activeCoupon ? (
                    <div className="bg-gradient-to-r from-[#1a120e] to-[#2c1d15] text-[#f5f0e6] p-3 rounded-xl border border-amber-500/30 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <div>
                          <span className="text-[10px] uppercase font-bold text-amber-300 block">
                            Cupón {activeCoupon.code} Aplicado
                          </span>
                          <span className="text-[9px] text-[#efeae0]/70">
                            10% de descuento en el total
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-amber-300">
                        -{activeCoupon.discountPercent}%
                      </span>
                    </div>
                  ) : onOpenCouponModal ? (
                    <button
                      onClick={onOpenCouponModal}
                      className="w-full bg-[#faf9f6] hover:bg-[#f2ece1] border border-dashed border-[#1a120e]/30 p-2.5 rounded-xl flex items-center justify-between text-xs text-[#1a120e] transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5 text-[11px] font-medium">
                        <Tag className="w-3.5 h-3.5 text-amber-600" />
                        ¿Tienes un cupón de 10% OFF?
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 underline">
                        Activar aquí
                      </span>
                    </button>
                  ) : null}

                  <div className="divide-y divide-[#efeae0]">
                    {cart.map((item, index) => (
                      <div key={`${item.product.id}-${item.selectedColor.name}-${index}`} className="py-4 flex gap-4">
                        {/* Product Thumbnail */}
                        <div className="w-20 h-20 bg-[#faf9f6] border border-[#efeae0] rounded-lg p-2 flex items-center justify-center shrink-0">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-contain"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start">
                              <h3 className="font-serif-elegant font-bold text-xs text-black">
                                {item.product.name}
                              </h3>
                              <button
                                onClick={() => onRemoveItem(index)}
                                className="text-black/40 hover:text-red-600 p-1 transition-colors cursor-pointer"
                                aria-label="Eliminar producto"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            
                            <div className="flex items-center gap-1.5 mt-1">
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-black/10"
                                style={{ backgroundColor: item.selectedColor.value }}
                              />
                              <span className="text-[10px] text-black/60 font-light">
                                {item.selectedColor.name}
                              </span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center mt-2">
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-[#efeae0] rounded bg-[#faf9f6]">
                              <button
                                onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                                className="p-1 text-black/60 hover:text-black transition-colors cursor-pointer disabled:opacity-30"
                                disabled={item.quantity <= 1}
                                aria-label="Disminuir cantidad"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-semibold px-2 text-black">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                                className="p-1 text-black/60 hover:text-black transition-colors cursor-pointer"
                                aria-label="Aumentar cantidad"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <span className="font-bold text-xs text-black">
                              ${(item.product.price * item.quantity).toFixed(2)} USD
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Cart Footer & Checkout Action */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-[#efeae0] bg-[#faf9f6] space-y-4">
                
                {/* Pricing Summary */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-[#1a120e]/60">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)} USD</span>
                  </div>

                  {activeCoupon && (
                    <div className="flex justify-between text-green-700 font-semibold">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" /> Cupón Bienvenida ({activeCoupon.discountPercent}%)
                      </span>
                      <span>-${discountAmount.toFixed(2)} USD</span>
                    </div>
                  )}

                  <div className="flex justify-between text-[#1a120e]/65">
                    <span className="flex items-center gap-1">
                      Envío Express Asegurado
                      <span className="text-green-700 font-semibold">(Gratis)</span>
                    </span>
                    <span>$0.00 USD</span>
                  </div>

                  <div className="border-t border-[#efeae0]/60 my-2 pt-2 flex justify-between text-base font-bold text-[#1a120e]">
                    <span>Total a Pagar</span>
                    <span className={activeCoupon ? 'text-green-700' : 'text-[#1a120e]'}>
                      ${total.toFixed(2)} USD
                    </span>
                  </div>
                </div>

                {/* Free shipping reassurance */}
                <div className="bg-green-50 border border-green-100 p-3 rounded-lg flex items-center gap-2.5 text-[10px] text-green-800">
                  <Truck className="w-4.5 h-4.5 text-green-700 shrink-0" />
                  <span><strong>¡Califica para Envío Exprés Gratis!</strong> Recíbelo en 2-4 días hábiles con seguimiento completo.</span>
                </div>

                {/* Pay Trigger Button */}
                <div className="space-y-2.5 pt-1">
                  <button
                    onClick={onCheckout}
                    className="w-full bg-black hover:bg-zinc-800 text-[#f5f0e6] hover:text-white text-xs font-bold tracking-widest uppercase py-4 transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-black/10"
                    id="cart-checkout-btn"
                  >
                    Proceder al Pago Segura (${total.toFixed(2)} USD)
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full bg-transparent text-black/60 hover:text-black text-[10px] tracking-widest font-bold uppercase py-2 text-center cursor-pointer block"
                    id="cart-back-to-shop-btn"
                  >
                    Continuar Comprando
                  </button>
                </div>

                {/* Secure checkout notice */}
                <p className="text-[9px] text-black/40 text-center flex items-center justify-center gap-1 font-light">
                  <ShieldCheck className="w-3.5 h-3.5 text-black/60" /> Pasarela Stripe encriptada bajo estándares PCI-DSS.
                </p>

              </div>
            )}

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
