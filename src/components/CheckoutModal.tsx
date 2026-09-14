/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, ShieldCheck, ShoppingBag, Truck, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onSuccess: () => void;
}

export default function CheckoutModal({ isOpen, onClose, cart, onSuccess }: CheckoutModalProps) {
  // Form State
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('Estados Unidos');

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const total = subtotal;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !fullName || !phone || !address || !city || !zip) {
      alert('Por favor, rellene todos los datos obligatorios.');
      return;
    }

    // Build WhatsApp message block with high fidelity formatting
    const orderItemsText = cart.map((item, idx) => 
      `${idx + 1}. ${item.quantity}x ${item.product.name} (${item.selectedColor.name}) - $${(item.product.price * item.quantity).toFixed(2)} USD`
    ).join('\n');

    const message = `🌟 *NUEVO PEDIDO - SUNNS SHOP* 🌟

👤 *Datos de Contacto:*
• *Nombre Completo:* ${fullName}
• *Teléfono:* ${phone}
• *Email:* ${email}

📍 *Dirección de Envío Exprés:*
• *Calle y Número:* ${address}
• *Ciudad:* ${city}
• *Código Postal:* ${zip}
• *País:* ${country}

🛍️ *Resumen del Pedido:*
${orderItemsText}

🚚 *Método de Envío:* Envío Exprés Gratuito

💰 *Total a Confirmar:* $${total.toFixed(2)} USD

¡Hola! He completado el checkout en la web y quiero confirmar mi pedido para coordinar la entrega.`;

    const encodedMessage = encodeURIComponent(message);
    
    // Using a professional premium destination line (+1 786 825 9355)
    const whatsappNumber = "17868259355";
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`;

    // Open WhatsApp in a new tab safely
    window.open(whatsappUrl, '_blank');

    // Callback to clear cart and return home
    onSuccess();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          
          {/* Modal Card container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-xl overflow-hidden shadow-2xl w-full max-w-2xl border border-[#efeae0] flex flex-col max-h-[90vh]"
            id="checkout-modal-card"
          >
            {/* Header */}
            <div className="px-6 py-4.5 border-b border-[#efeae0] flex items-center justify-between bg-[#faf9f6]">
              <h2 className="font-serif-elegant text-base font-bold text-[#1a120e] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#1a120e]" />
                Checkout de Compra Concierge
              </h2>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-[#efeae0] text-[#1a120e] transition-colors focus:outline-none cursor-pointer"
                id="close-checkout-x"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8">
              
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Cart quick summary badge */}
                <div className="bg-[#faf9f6] border border-[#efeae0] p-4 rounded-lg flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[#1a120e]/50 font-light block">Estás comprando:</span>
                    <strong className="text-[#1a120e] font-semibold">
                      {cart.length} {cart.length === 1 ? 'artículo' : 'artículos'} en tu bolsa
                    </strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[#1a120e]/50 font-light block">Total a pagar:</span>
                    <strong className="text-sm font-bold text-[#1a120e]">${total.toFixed(2)} USD</strong>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-3">
                  <h3 className="text-[10px] tracking-widest text-[#1a120e] font-bold uppercase border-b border-[#faf9f6] pb-1.5">
                    1. Información de Contacto
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-[#1a120e]/60 uppercase block mb-1">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-[#faf9f6] border border-[#efeae0] rounded-lg px-3 py-2 text-xs text-[#1a120e] focus:outline-none focus:border-[#1a120e]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#1a120e]/60 uppercase block mb-1">
                        Número de Teléfono *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+34 600 123 456"
                        className="w-full bg-[#faf9f6] border border-[#efeae0] rounded-lg px-3 py-2 text-xs text-[#1a120e] focus:outline-none focus:border-[#1a120e]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#1a120e]/60 uppercase block mb-1">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tuemail@dominio.com"
                      className="w-full bg-[#faf9f6] border border-[#efeae0] rounded-lg px-3 py-2 text-xs text-[#1a120e] focus:outline-none focus:border-[#1a120e]"
                    />
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="space-y-3">
                  <h3 className="text-[10px] tracking-widest text-[#1a120e] font-bold uppercase border-b border-[#faf9f6] pb-1.5">
                    2. Dirección de Envío Exprés
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold text-[#1a120e]/60 uppercase block mb-1">
                        Dirección Completa *
                      </label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Calle, Número, Piso, Puerta"
                        className="w-full bg-[#faf9f6] border border-[#efeae0] rounded-lg px-3 py-2 text-xs text-[#1a120e] focus:outline-none focus:border-[#1a120e]"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-1">
                        <label className="text-[10px] font-bold text-[#1a120e]/60 uppercase block mb-1">
                          Ciudad *
                        </label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Miami"
                          className="w-full bg-[#faf9f6] border border-[#efeae0] rounded-lg px-3 py-2 text-xs text-[#1a120e] focus:outline-none focus:border-[#1a120e]"
                        />
                      </div>
                      <div className="col-span-1">
                        <label className="text-[10px] font-bold text-[#1a120e]/60 uppercase block mb-1">
                          Cód. Postal *
                        </label>
                        <input
                          type="text"
                          required
                          value={zip}
                          onChange={(e) => setZip(e.target.value)}
                          placeholder="33131"
                          className="w-full bg-[#faf9f6] border border-[#efeae0] rounded-lg px-3 py-2 text-xs text-[#1a120e] focus:outline-none focus:border-[#1a120e]"
                        />
                      </div>
                      <div className="col-span-1">
                        <label className="text-[10px] font-bold text-[#1a120e]/60 uppercase block mb-1">
                          País *
                        </label>
                        <select
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="w-full bg-[#faf9f6] border border-[#efeae0] rounded-lg px-2.5 py-2 text-xs text-[#1a120e] focus:outline-none focus:border-[#1a120e] cursor-pointer font-medium"
                        >
                          <option value="España">España</option>
                          <option value="México">México</option>
                          <option value="Colombia">Colombia</option>
                          <option value="Chile">Chile</option>
                          <option value="Argentina">Argentina</option>
                          <option value="Estados Unidos">EE.UU.</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Point 3: Cart Order Summary and total */}
                <div className="space-y-3">
                  <h3 className="text-[10px] tracking-widest text-[#1a120e] font-bold uppercase border-b border-[#faf9f6] pb-1.5 flex items-center justify-between">
                    <span>3. Resumen de tu Pedido</span>
                    <ShoppingBag className="w-4 h-4 text-[#1a120e]/40" />
                  </h3>
                  
                  <div className="bg-[#faf9f6] border border-[#efeae0] rounded-xl p-5 space-y-4">
                    <div className="divide-y divide-[#efeae0]/60 max-h-48 overflow-y-auto pr-1">
                      {cart.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2.5 text-xs first:pt-0 last:pb-0">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#efeae0]/30 rounded overflow-hidden flex-shrink-0 flex items-center justify-center border border-[#efeae0]/40">
                              <img 
                                src={item.product.images[0]} 
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div>
                              <span className="font-semibold text-[#1a120e] block">{item.product.name}</span>
                              <span className="text-[9px] text-[#1a120e]/50 block">Color: {item.selectedColor.name} | Cantidad: {item.quantity}</span>
                            </div>
                          </div>
                          <span className="font-mono font-bold text-[#1a120e] text-right">
                            ${(item.product.price * item.quantity).toFixed(2)} USD
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-[#efeae0] space-y-1.5 text-xs">
                      <div className="flex justify-between text-[#1a120e]/60">
                        <span>Subtotal de artículos</span>
                        <span>${subtotal.toFixed(2)} USD</span>
                      </div>
                      <div className="flex justify-between text-[#1a120e]/60 items-center">
                        <span className="flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5 text-green-700" />
                          Envío Exprés Concierge
                        </span>
                        <span className="text-green-700 font-semibold uppercase text-[10px]">Gratuito</span>
                      </div>
                      <div className="pt-2 border-t border-[#efeae0]/50 flex justify-between items-center text-sm font-bold text-[#1a120e]">
                        <span>Total del Pedido</span>
                        <span className="font-serif-elegant text-base" style={{ fontWeight: 950 }}>
                          ${total.toFixed(2)} USD
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submission CTA */}
                <div className="pt-4 border-t border-[#efeae0]/40 flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <span className="text-[10px] text-[#1a120e]/50 font-light leading-snug max-w-xs text-center sm:text-left">
                    Al confirmar, se abrirá WhatsApp para coordinar el pago personalizado y el envío inmediato con un asesor.
                  </span>
                  <button
                    type="submit"
                    className="bg-[#1a120e] hover:bg-black text-[#f5f0e6] hover:text-white text-xs font-bold tracking-widest uppercase px-10 py-4 transition-colors duration-300 shadow-xl cursor-pointer w-full sm:w-auto text-center flex items-center justify-center gap-2"
                    id="checkout-pay-btn"
                  >
                    Confirmar Pedido vía WhatsApp
                    <ChevronRight className="w-4.5 h-4.5" />
                  </button>
                </div>

              </form>

            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
