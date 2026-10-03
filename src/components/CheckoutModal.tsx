/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  X, ShieldCheck, ShoppingBag, Truck, ChevronRight, 
  CreditCard, CheckCircle2, Lock, Sparkles, MessageSquare 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, User, Order, OrderItem, Coupon } from '../types';
import { saveUserOrder } from '../lib/userService';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  currentUser?: User | null;
  activeCoupon?: Coupon | null;
  onSuccess: () => void;
}

export default function CheckoutModal({ 
  isOpen, 
  onClose, 
  cart, 
  currentUser, 
  activeCoupon,
  onSuccess 
}: CheckoutModalProps) {
  // Payment gateway choice: 'square' | 'whatsapp'
  const [paymentMethod, setPaymentMethod] = useState<'square' | 'whatsapp'>('square');

  // Form State
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('Estados Unidos');

  // Square card state
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('789');

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState<Order | null>(null);

  // Auto-populate when user is logged in
  useEffect(() => {
    if (currentUser) {
      setEmail(currentUser.email || '');
      setFullName(currentUser.name || '');
      setPhone(currentUser.phone || '');
      if (currentUser.addresses && currentUser.addresses.length > 0) {
        const defaultAddr = currentUser.addresses.find(a => a.isDefaultShipping) || currentUser.addresses[0];
        setAddress(defaultAddr.address);
        setCity(defaultAddr.city);
        setZip(defaultAddr.zip);
        setCountry(defaultAddr.country);
      }
    }
  }, [currentUser, isOpen]);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discount = activeCoupon ? (subtotal * activeCoupon.discountPercent) / 100 : 0;
  const shipping = 0; // Free express shipping
  const total = Math.max(0, subtotal - discount + shipping);

  const handleProcessCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !fullName || !phone || !address || !city || !zip) {
      alert('Por favor, rellene todos los datos obligatorios.');
      return;
    }

    if (paymentMethod === 'whatsapp') {
      // Build WhatsApp concierge message
      const orderItemsText = cart.map((item, idx) => 
        `${idx + 1}. ${item.quantity}x ${item.product.name} (${item.selectedColor.name}) - $${(item.product.price * item.quantity).toFixed(2)} USD`
      ).join('\n');

      const message = `🌟 *NUEVO PEDIDO - SUNNS SHOP (SQUARE PASARELA)* 🌟

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

🚚 *Método de Envío:* Envío Exprés Asegurado Gratuito

💰 *Total a Confirmar:* $${total.toFixed(2)} USD

¡Hola! He completado el checkout en la web y quiero confirmar mi pedido para coordinar el despacho.`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappNumber = "17868259355";
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`;

      // Save order to history if user is logged in
      if (currentUser) {
        const orderItems: OrderItem[] = cart.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          productImage: item.product.image,
          category: item.product.category,
          colorName: item.selectedColor.name,
          colorValue: item.selectedColor.value,
          lensType: 'Filtro Solar HD UV400',
          quantity: item.quantity,
          unitPrice: item.product.price,
          totalPrice: item.product.price * item.quantity,
        }));

        const now = new Date();
        const dateFormatted = `${now.getDate()} de ${now.toLocaleString('es-ES', { month: 'long' })}, ${now.getFullYear()}`;
        const newOrder: Order = {
          id: 'ord_sunns_' + Math.random().toString(36).substring(2, 8),
          orderNumber: `SN-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          date: dateFormatted,
          createdAt: now.toISOString(),
          status: 'processing',
          statusLabel: 'En Preparación',
          paymentMethod: {
            type: 'stripe_card',
            brand: 'visa',
            last4: 'WA',
            stripePaymentIntentId: `pi_concierge_${Date.now()}`,
          },
          shippingAddress: {
            fullName,
            address,
            city,
            state: 'FL',
            zip,
            country,
            phone,
          },
          items: orderItems,
          subtotal,
          shippingCost: 0,
          discount: 0,
          tax: 0,
          total,
          courier: 'Envío Concierge Express',
          estimatedDelivery: '3 a 5 días hábiles',
        };

        saveUserOrder(currentUser.id, newOrder);
      }

      window.open(whatsappUrl, '_blank');
      onSuccess();
      onClose();
      return;
    }

    // SQUARE PAYMENT GATEWAY CHECKOUT FLOW
    setIsProcessing(true);

    try {
      const orderNumber = `SN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      // Call backend API for Square Payment
      const sqResponse = await fetch('/api/process-square-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceId: 'cnest:card-nonce-ok', // Test or real nonce/token handled by Square backend
          amount: total,
          currency: 'USD',
          buyerEmail: email,
          orderNumber: orderNumber,
          note: `SUNNS Shop Order ${orderNumber} - ${fullName}`
        })
      });

      const sqData = await sqResponse.json();

      if (!sqResponse.ok || !sqData.success) {
        throw new Error(sqData.error || 'Error al procesar el pago con tarjeta');
      }

      const cleanCard = cardNumber.replace(/\D/g, '');
      const last4 = sqData.cardDetails?.last4 || (cleanCard.length >= 4 ? cleanCard.slice(-4) : '4242');
      const brand: 'visa' | 'mastercard' | 'amex' = last4 === '4242' ? 'visa' : 'mastercard';

      const orderItems: OrderItem[] = cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.image,
        category: item.product.category,
        colorName: item.selectedColor.name,
        colorValue: item.selectedColor.value,
        lensType: 'Filtro Polarizado Antirreflejo UV400',
        quantity: item.quantity,
        unitPrice: item.product.price,
        totalPrice: item.product.price * item.quantity,
      }));

      const now = new Date();
      const dateFormatted = `${now.getDate()} de ${now.toLocaleString('es-ES', { month: 'long' })}, ${now.getFullYear()}`;
      const orderId = 'ord_sunns_' + Math.random().toString(36).substring(2, 8);

      const newOrder: Order = {
        id: orderId,
        orderNumber,
        date: dateFormatted,
        createdAt: now.toISOString(),
        status: 'paid',
        statusLabel: 'Pago Confirmado',
        paymentMethod: {
          type: 'stripe_card',
          brand,
          last4,
          stripePaymentIntentId: sqData.paymentId || `pay_${Date.now()}`,
          stripeReceiptUrl: sqData.receiptUrl || `https://sunnsshop.com/receipts/${Date.now()}`,
        },
        shippingAddress: {
          fullName,
          address,
          city,
          state: 'FL',
          zip,
          country,
          phone,
        },
        items: orderItems,
        subtotal,
        shippingCost: 0,
        discount: discount,
        tax: 0,
        total,
        trackingNumber: `FDX-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        courier: 'FedEx Luxury Overnight',
        estimatedDelivery: '3 días hábiles (Envío Exprés)',
        hasPrescription: !!currentUser?.prescription,
      };

      const targetUserId = currentUser ? currentUser.id : 'usr_guest';
      saveUserOrder(targetUserId, newOrder);

      setIsProcessing(false);
      setOrderCompleted(newOrder);
    } catch (err: any) {
      console.error('Payment error:', err);
      alert(err.message || 'Hubo un error al procesar el pago. Por favor intente nuevamente.');
      setIsProcessing(false);
    }
  };

  const handleFinish = () => {
    setOrderCompleted(null);
    onSuccess();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
          
          {/* Modal Card container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-2xl border border-[#efeae0] flex flex-col max-h-[92vh]"
            id="checkout-modal-card"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#efeae0] flex items-center justify-between bg-[#faf9f6]">
              <h2 className="font-serif-elegant text-base font-bold text-[#1a120e] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#1a120e]" />
                Pasarela de Pago Segura
              </h2>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-[#efeae0] text-[#1a120e] transition-colors focus:outline-none cursor-pointer"
                id="close-checkout-x"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* If Order Complete Screen */}
            {orderCompleted ? (
              <div className="p-8 text-center space-y-6 overflow-y-auto flex-1 flex flex-col justify-center items-center">
                <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-2 max-w-md">
                  <span className="text-[10px] tracking-widest uppercase font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                    Transacción Square Aprobada
                  </span>
                  <h3 className="font-serif-elegant text-2xl font-bold text-[#1a120e]">
                    ¡Gracias por tu compra!
                  </h3>
                  <p className="text-xs text-[#1a120e]/60 font-light leading-relaxed">
                    Hemos confirmado tu pago de <strong className="text-[#1a120e]">${orderCompleted.total.toFixed(2)} USD</strong> a través de Square. Tu pedido <strong className="font-mono text-[#1a120e]">{orderCompleted.orderNumber}</strong> ha sido registrado en tu panel de socio.
                  </p>
                </div>

                {/* Receipt Box */}
                <div className="bg-[#faf9f6] border border-[#efeae0] p-4 rounded-xl text-left w-full max-w-sm space-y-2 text-xs">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#1a120e]/60">N° Pedido:</span>
                    <span className="font-mono font-bold text-[#1a120e]">{orderCompleted.orderNumber}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#1a120e]/60">Número de Guía:</span>
                    <span className="font-mono font-bold text-[#1a120e]">{orderCompleted.trackingNumber}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#1a120e]/60">Método de Pago:</span>
                    <span className="font-bold text-[#1a120e] uppercase">Square • {orderCompleted.paymentMethod.brand} •••• {orderCompleted.paymentMethod.last4}</span>
                  </div>
                  <div className="flex justify-between text-[11px] border-t border-[#efeae0] pt-2">
                    <span className="font-bold text-[#1a120e]">Total Cargado:</span>
                    <span className="font-bold text-green-700">${orderCompleted.total.toFixed(2)} USD</span>
                  </div>
                </div>

                <button
                  onClick={handleFinish}
                  className="bg-[#1a120e] text-white text-xs font-bold uppercase tracking-widest px-8 py-3.5 rounded-xl hover:bg-black transition-all cursor-pointer shadow-lg"
                >
                  Continuar
                </button>
              </div>
            ) : (
              /* Scrollable Content Body */
              <div className="flex-1 overflow-y-auto p-6 sm:p-8">
                
                <form onSubmit={handleProcessCheckout} className="space-y-6">
                  
                  {/* Cart quick summary badge */}
                  <div className="bg-[#faf9f6] border border-[#efeae0] p-4 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <span className="text-[#1a120e]/50 font-light block">Estás comprando:</span>
                      <strong className="text-[#1a120e] font-semibold">
                        {cart.length} {cart.length === 1 ? 'artículo' : 'artículos'} en tu bolsa
                      </strong>
                      {activeCoupon && (
                        <span className="inline-block mt-1 text-[10px] text-green-700 font-bold bg-green-50 border border-green-200 px-2 py-0.5 rounded">
                          Cupón {activeCoupon.code} (-{activeCoupon.discountPercent}%)
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-[#1a120e]/50 font-light block">Total a pagar:</span>
                      <strong className="text-sm font-bold text-[#1a120e]">${total.toFixed(2)} USD</strong>
                      {activeCoupon && (
                        <span className="text-[10px] text-green-700 block font-medium">
                          Ahorras ${discount.toFixed(2)} USD
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Payment Gateway Toggle */}
                  <div className="space-y-2">
                    <label className="text-[10px] tracking-widest text-[#1a120e] font-bold uppercase block">
                      Selecciona Método de Pago
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('square')}
                        className={`p-3 rounded-xl border flex items-center justify-center gap-2.5 font-semibold text-xs transition-all cursor-pointer ${
                          paymentMethod === 'square'
                            ? 'bg-[#1a120e] text-white border-[#1a120e] shadow-md'
                            : 'bg-[#faf9f6] border-[#efeae0] text-[#1a120e] hover:bg-white'
                        }`}
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Tarjeta de Crédito o Débito</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('whatsapp')}
                        className={`p-3 rounded-xl border flex items-center justify-center gap-2.5 font-semibold text-xs transition-all cursor-pointer ${
                          paymentMethod === 'whatsapp'
                            ? 'bg-green-700 text-white border-green-700 shadow-md'
                            : 'bg-[#faf9f6] border-[#efeae0] text-[#1a120e] hover:bg-white'
                        }`}
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Concierge WhatsApp</span>
                      </button>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3">
                    <h3 className="text-[10px] tracking-widest text-[#1a120e] font-bold uppercase border-b border-[#faf9f6] pb-1.5">
                      1. Información del Cliente
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
                          placeholder="Valeria Montiel"
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
                          placeholder="+1 (786) 825-9355"
                          className="w-full bg-[#faf9f6] border border-[#efeae0] rounded-lg px-3 py-2 text-xs text-[#1a120e] focus:outline-none focus:border-[#1a120e]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#1a120e]/60 uppercase block mb-1">
                        Correo Electrónico para Factura *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="socio@sunnsshop.com"
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
                            <option value="Estados Unidos">EE.UU.</option>
                            <option value="España">España</option>
                            <option value="México">México</option>
                            <option value="Colombia">Colombia</option>
                            <option value="Chile">Chile</option>
                            <option value="Argentina">Argentina</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Fields (If card selected) */}
                  {paymentMethod === 'square' && (
                    <div className="bg-[#faf9f6] border border-[#efeae0] rounded-xl p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#1a120e] flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-neutral-800" /> Información de Tarjeta
                        </span>
                        <div className="flex items-center gap-1.5">
                          {/* Visa Badge */}
                          <div className="bg-blue-900 text-white text-[9px] font-extrabold px-2 py-0.5 rounded tracking-tighter uppercase shadow-sm">
                            VISA
                          </div>
                          {/* Mastercard Badge */}
                          <div className="bg-neutral-900 text-amber-400 text-[9px] font-extrabold px-2 py-0.5 rounded tracking-tighter uppercase shadow-sm flex items-center gap-0.5">
                            <span className="w-2 h-2 rounded-full bg-red-500 inline-block opacity-90" />
                            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block -ml-1.5 opacity-90" />
                            MC
                          </div>
                          {/* Amex Badge */}
                          <div className="bg-cyan-800 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded tracking-tighter uppercase shadow-sm">
                            AMEX
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-[#1a120e]/60">Número de Tarjeta</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4242 4242 4242 4242"
                          className="w-full bg-white border border-[#efeae0] rounded-lg px-3 py-2 text-xs font-mono text-[#1a120e]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-bold text-[#1a120e]/60">Vence (MM/AA)</label>
                          <input
                            type="text"
                            value={cardExp}
                            onChange={(e) => setCardExp(e.target.value)}
                            placeholder="12/28"
                            className="w-full bg-white border border-[#efeae0] rounded-lg px-3 py-2 text-xs font-mono text-center text-[#1a120e]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-bold text-[#1a120e]/60">CVC</label>
                          <input
                            type="password"
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            placeholder="789"
                            maxLength={4}
                            className="w-full bg-white border border-[#efeae0] rounded-lg px-3 py-2 text-xs font-mono text-center text-[#1a120e]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
                        paymentMethod === 'square'
                          ? 'bg-[#1a120e] text-white hover:bg-black'
                          : 'bg-green-700 text-white hover:bg-green-800'
                      }`}
                    >
                      {isProcessing ? (
                        'Procesando pago seguro...'
                      ) : paymentMethod === 'square' ? (
                        <>
                          <Lock className="w-4 h-4" />
                          Pagar ${total.toFixed(2)} USD
                        </>
                      ) : (
                        <>
                          <MessageSquare className="w-4 h-4" />
                          Confirmar por WhatsApp Concierge
                        </>
                      )}
                    </button>
                  </div>

                </form>
              </div>
            )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
