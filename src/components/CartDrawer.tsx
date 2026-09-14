/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartDrawerProps) {
  // Calculate pricing sums
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shipping = 0; // Free express shipping
  const estimatedTax = subtotal * 0.10; // 10% VAT/IVA included or extra (let's display included to match premium boutiques)
  const total = subtotal;

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
                cart.map((item, index) => {
                  return (
                    <motion.div
                      key={`${item.product.id}-${item.selectedColor.name}`}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-4 p-4 bg-[#faf9f6] border border-[#efeae0] rounded-xl hover:border-[#1a120e]/15 transition-all duration-300 relative"
                      id={`cart-item-${index}`}
                    >
                      {/* Product Visual */}
                      <div className="w-20 h-20 bg-white rounded-lg border border-[#efeae0]/50 flex items-center justify-center p-3 shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          className="max-h-full max-w-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.04)]"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between">
                            <h4 className="text-xs font-bold text-[#1a120e] uppercase tracking-wide max-w-[180px]">
                              {item.product.name}
                            </h4>
                            <span className="text-xs font-bold text-[#1a120e]">
                              ${(item.product.price * item.quantity).toFixed(2)} USD
                            </span>
                          </div>
                          
                          {/* Variant & Unit Price */}
                          <div className="flex items-center gap-1.5 text-[10px] text-[#1a120e]/50 mt-1 font-medium">
                            <span
                              className="w-2 h-2 rounded-full border border-black/5"
                              style={{ backgroundColor: item.selectedColor.value }}
                            />
                            <span>{item.selectedColor.name}</span>
                            <span>•</span>
                            <span>${item.product.price} USD c/u</span>
                          </div>
                        </div>

                        {/* Interactive actions (quantity and delete) */}
                        <div className="flex items-center justify-between pt-2">
                          
                          {/* Quantity control micro-component */}
                          <div className="flex items-center border border-[#efeae0] rounded-md overflow-hidden bg-white">
                            <button
                              onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="p-1.5 hover:bg-[#efeae0] text-[#1a120e] disabled:opacity-30 transition-all focus:outline-none cursor-pointer"
                              id={`cart-item-dec-${index}`}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center text-xs font-bold text-[#1a120e]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                              className="p-1.5 hover:bg-[#efeae0] text-[#1a120e] transition-all focus:outline-none cursor-pointer"
                              id={`cart-item-inc-${index}`}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Remove button */}
                          <button
                            onClick={() => onRemoveItem(index)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            aria-label="Eliminar del carrito"
                            id={`cart-item-remove-${index}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Drawer Footer: Pricing details and checkout triggers */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-[#efeae0] bg-[#faf9f6] space-y-4">
                
                {/* Pricing Summary */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-[#1a120e]/60">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)} USD</span>
                  </div>
                  <div className="flex justify-between text-[#1a120e]/65">
                    <span className="flex items-center gap-1">
                      Envío Express
                      <span className="text-green-700 font-semibold">(Gratis)</span>
                    </span>
                    <span>$0.00 USD</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-[#1a120e]/45 italic">
                    <span>IVA (10%) Incluido en el precio</span>
                    <span>-${estimatedTax.toFixed(2)} USD</span>
                  </div>
                  <div className="border-t border-[#efeae0]/60 my-2 pt-2 flex justify-between text-base font-bold text-[#1a120e]">
                    <span>Total Estimado</span>
                    <span>${total.toFixed(2)} USD</span>
                  </div>
                </div>

                {/* Free shipping reassurance */}
                <div className="bg-green-50 border border-green-100 p-3 rounded-lg flex items-center gap-2.5 text-[10px] text-green-800">
                  <Truck className="w-4.5 h-4.5 text-green-700 shrink-0" />
                  <span><strong>¡Califica para Envío Exprés Gratis!</strong> Recíbelo en 2-4 días hábiles con seguimiento completo.</span>
                </div>

                {/* Pay Trigger Button */}
                <div className="space-y-2.5 pt-2">
                  <button
                    onClick={onCheckout}
                    className="w-full bg-black hover:bg-zinc-800 text-[#f5f0e6] hover:text-white text-xs font-bold tracking-widest uppercase py-4 transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-black/10"
                    id="cart-checkout-btn"
                  >
                    Proceder al Pago
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
                  <ShieldCheck className="w-3.5 h-3.5 text-black/60" /> Pago 100% seguro y encriptado bajo certificados SSL.
                </p>

              </div>
            )}

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
