/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, ShieldCheck, ShoppingBag, Truck, ChevronRight, 
  CreditCard, CheckCircle2, Lock, Sparkles, MessageSquare 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, User, Order, OrderItem, Coupon } from '../types';
import { saveUserOrder } from '../lib/userService';

const SQUARE_APP_ID = import.meta.env.VITE_SQUARE_APPLICATION_ID || '';
const SQUARE_LOCATION_ID = import.meta.env.VITE_SQUARE_LOCATION_ID || '';

const loadSquareSdk = (appId: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && (window as any).Square) {
      resolve((window as any).Square);
      return;
    }

    const isSandbox = appId.startsWith('sandbox-');
    const sdkUrl = isSandbox
      ? 'https://sandbox.web.squarecdn.com/v1/square.js'
      : 'https://web.squarecdn.com/v1/square.js';

    const existingScript = document.querySelector(`script[src="${sdkUrl}"]`) as HTMLScriptElement | null;
    if (existingScript) {
      if (existingScript.dataset.failed === 'true') {
        existingScript.remove();
      } else {
        existingScript.addEventListener('load', () => {
          if ((window as any).Square) resolve((window as any).Square);
          else reject(new Error('No se pudo inicializar Square.'));
        });
        existingScript.addEventListener('error', () =>
          reject(new Error('No se pudo cargar el formulario seguro de Square.'))
        );
        return;
      }
    }

    const script = document.createElement('script');
    script.src = sdkUrl;
    script.async = true;
    script.onload = () => {
      if ((window as any).Square) {
        resolve((window as any).Square);
      } else {
        reject(new Error('Square SDK cargado pero no inicializado.'));
      }
    };
    script.onerror = () => {
      script.dataset.failed = 'true';
      reject(new Error('No se pudo cargar el formulario seguro de Square.'));
    };
    document.head.appendChild(script);
  });
};

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

  // Square Web Payments SDK state
  const cardRef = useRef<any>(null);
  const [isCardReady, setIsCardReady] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

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

  // Discount coupon state
  const [couponInput, setCouponInput] = useState('');
  const [currentCoupon, setCurrentCoupon] = useState<Coupon | null>(activeCoupon || null);
  const [couponFeedback, setCouponFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const VALID_COUPONS: Record<string, number> = {
    'SUNNS10': 10,
    'SUNNS15': 15,
    'SUNNS20': 20,
    'BIENVENIDO': 10,
    'VIP25': 25,
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    if (VALID_COUPONS[code]) {
      const percent = VALID_COUPONS[code];
      setCurrentCoupon({ code, discountPercent: percent });
      setCouponFeedback({ type: 'success', message: `¡Cupón ${code} aplicado con éxito! -${percent}% de descuento.` });
    } else {
      setCouponFeedback({ type: 'error', message: 'Código inválido o expirado. Prueba con SUNNS10, SUNNS20 o BIENVENIDO.' });
    }
  };

  const handleRemoveCoupon = () => {
    setCurrentCoupon(null);
    setCouponInput('');
    setCouponFeedback(null);
  };

  // Subtotal, Discount, 7% Tax, and Total
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discount = currentCoupon ? (subtotal * currentCoupon.discountPercent) / 100 : 0;
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = taxableAmount * 0.07; // Impuestos del 7%
  const shipping = 0; // Free express shipping
  const total = taxableAmount + tax;

  // Initialize Square Web Payments Card form when modal opens with Square selected
  useEffect(() => {
    if (!isOpen || paymentMethod !== 'square' || orderCompleted) {
      return;
    }

    let cancelled = false;
    let mountedCard: any = null;

    const initSquareCard = async () => {
      setIsCardReady(false);
      setCardError(null);

      if (!SQUARE_APP_ID || !SQUARE_LOCATION_ID) {
        setCardError(
          'Faltan configurar VITE_SQUARE_APPLICATION_ID y VITE_SQUARE_LOCATION_ID en las variables de entorno de Netlify.'
        );
        return;
      }

      try {
        const SquareSDK = await loadSquareSdk(SQUARE_APP_ID);
        if (cancelled) return;

        const container = document.getElementById('square-card-container');
        if (!container) return;
        container.innerHTML = '';

        const payments = SquareSDK.payments(SQUARE_APP_ID, SQUARE_LOCATION_ID);
        const card = await payments.card({
          style: {
            '.input-container': {
              borderColor: '#efeae0',
              borderRadius: '8px',
            },
            '.input-container.is-focus': {
              borderColor: '#1a120e',
            },
            '.input-container.is-error': {
              borderColor: '#dc2626',
            },
            input: {
              backgroundColor: '#ffffff',
              color: '#1a120e',
              fontSize: '15px',
            },
            'input.is-error': {
              color: '#dc2626',
            },
          },
        });

        if (cancelled) {
          await card.destroy().catch(() => {});
          return;
        }

        await card.attach('#square-card-container');
        if (cancelled) {
          await card.destroy().catch(() => {});
          return;
        }

        mountedCard = card;
        cardRef.current = card;
        setIsCardReady(true);
      } catch (err: any) {
        console.error('Square SDK init error:', err);
        if (!cancelled) {
          setCardError(
            err?.message ||
              'No se pudo inicializar el formulario seguro de Square. Verifica tu Application ID y Location ID.'
          );
          setIsCardReady(false);
        }
      }
    };

    initSquareCard();

    return () => {
      cancelled = true;
      cardRef.current = null;
      setIsCardReady(false);
      if (mountedCard) {
        mountedCard.destroy().catch(() => {});
      }
    };
  }, [isOpen, paymentMethod, orderCompleted]);

  const handleProcessCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setCardError(null);

    if (!email || !fullName || !phone || !address || !city || !zip) {
      setCardError('Por favor, rellene todos los datos obligatorios de contacto y envío.');
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

    if (!cardRef.current || !isCardReady) {
      setCardError('El formulario seguro de tarjeta aún está cargando. Espere un momento.');
      return;
    }

    // PAYMENT GATEWAY CHECKOUT FLOW WITH SQUARE TOKENIZATION
    setIsProcessing(true);

    try {
      const tokenResult = await cardRef.current.tokenize();
      if (tokenResult.status !== 'OK' || !tokenResult.token) {
        const sdkErrors = tokenResult.errors?.map((err: any) => err.message).join(' • ');
        throw new Error(sdkErrors || 'Por favor verifica los datos de tu tarjeta e intenta nuevamente.');
      }

      const sourceId = tokenResult.token;
      const tokenCardInfo = tokenResult.details?.card;

      const orderNumber = `SN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      let paymentId = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      let receiptUrl = `https://sunnsshop.com/receipts/${Date.now()}`;
      let detectedBrand: 'visa' | 'mastercard' | 'amex' = 'visa';
      let last4 = tokenCardInfo?.last4 || '4242';

      const sdkBrand = (tokenCardInfo?.brand || '').toLowerCase();
      if (sdkBrand.includes('master')) detectedBrand = 'mastercard';
      else if (sdkBrand.includes('amex') || sdkBrand.includes('american')) detectedBrand = 'amex';

      // Call Square / Bank payment processor (Server / Netlify Function)
      const sqResponse = await fetch('/api/process-square-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceId,
          amount: total,
          currency: 'USD',
          buyerEmail: email,
          orderNumber,
          note: `SUNNS Shop Order ${orderNumber} - ${fullName}`
        })
      });

      const contentType = sqResponse.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('Error al conectar con la pasarela bancaria. Intente nuevamente.');
      }

      const sqData = await sqResponse.json();

      if (!sqResponse.ok || !sqData.success) {
        throw new Error(sqData.error || 'Pago Rechazado: Fondos insuficientes o transacción declinada por su banco.');
      }

      if (sqData.paymentId) {
        paymentId = sqData.paymentId;
        receiptUrl = sqData.receiptUrl || receiptUrl;
        if (sqData.cardDetails?.last4) last4 = sqData.cardDetails.last4;
        const apiBrand = (sqData.cardDetails?.brand || '').toLowerCase();
        if (apiBrand.includes('master')) detectedBrand = 'mastercard';
        else if (apiBrand.includes('amex') || apiBrand.includes('american')) detectedBrand = 'amex';
      }

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
          brand: detectedBrand,
          last4,
          stripePaymentIntentId: paymentId,
          stripeReceiptUrl: receiptUrl,
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
        tax: tax,
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
      setCardError(err.message || 'Pago rechazado: Transacción denegada o fondos insuficientes.');
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
                  
                  {/* Cart quick summary badge & 7% Tax Breakdown */}
                  <div className="bg-[#faf9f6] border border-[#efeae0] p-4 sm:p-5 rounded-2xl space-y-3 text-xs">
                    <div className="flex justify-between items-center pb-2 border-b border-[#efeae0]/70">
                      <div>
                        <span className="text-[#1a120e]/60 font-semibold block">Resumen de Compra</span>
                        <strong className="text-[#1a120e] font-bold text-sm">
                          {cart.length} {cart.length === 1 ? 'artículo' : 'artículos'} en tu bolsa
                        </strong>
                      </div>
                      <span className="text-xs text-green-700 font-semibold bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
                        Envío Exprés Gratis
                      </span>
                    </div>

                    {/* Interactive Discount Coupon Code Form */}
                    <div className="pt-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#1a120e]/70 block mb-1.5">
                        ¿Tienes un código de descuento?
                      </label>
                      {currentCoupon ? (
                        <div className="flex items-center justify-between bg-green-50 border border-green-200 p-2.5 rounded-xl">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-green-700" />
                            <span className="font-bold text-xs text-green-900">
                              CÓDIGO {currentCoupon.code} ACTIVO (-{currentCoupon.discountPercent}%)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveCoupon}
                            className="text-[10px] font-semibold text-rose-600 hover:text-rose-800 uppercase tracking-wider cursor-pointer"
                          >
                            Quitar
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={couponInput}
                              onChange={(e) => {
                                setCouponInput(e.target.value);
                                setCouponFeedback(null);
                              }}
                              placeholder="Ej: SUNNS10, SUNNS20, BIENVENIDO"
                              className="flex-1 bg-white border border-[#efeae0] rounded-xl px-3 py-2 text-xs uppercase font-mono tracking-wider text-[#1a120e] placeholder:normal-case placeholder:font-sans focus:outline-none focus:border-black"
                            />
                            <button
                              type="button"
                              onClick={handleApplyCoupon}
                              className="px-4 py-2 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                            >
                              Aplicar
                            </button>
                          </div>
                          {couponFeedback && (
                            <p className={`text-[11px] font-medium ${couponFeedback.type === 'success' ? 'text-green-700' : 'text-rose-600'}`}>
                              {couponFeedback.message}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Breakdown with 7% Tax */}
                    <div className="space-y-1.5 pt-2 border-t border-[#efeae0]/70 text-xs text-[#1a120e]/70">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)} USD</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-green-700 font-semibold">
                          <span>Descuento aplicado ({currentCoupon?.discountPercent}%)</span>
                          <span>-${discount.toFixed(2)} USD</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Envío Express Asegurado</span>
                        <span className="text-green-700 font-semibold">Gratis ($0.00 USD)</span>
                      </div>
                      <div className="flex justify-between font-medium text-black">
                        <span>Impuestos obligatorios (7%)</span>
                        <span>${tax.toFixed(2)} USD</span>
                      </div>
                      <div className="flex justify-between text-base font-black text-black pt-2 border-t border-[#efeae0]">
                        <span>Total Final a Pagar</span>
                        <span className="text-lg font-serif-elegant font-black">
                          ${total.toFixed(2)} USD
                        </span>
                      </div>
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

                  {/* Card Fields (Square Web Payments SDK) */}
                  {paymentMethod === 'square' && (
                    <div className={`bg-[#faf9f6] border rounded-xl p-4 space-y-3 transition-colors ${cardError ? 'border-red-400 bg-red-50/20' : 'border-[#efeae0]'}`}>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#1a120e] flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-neutral-800" /> Información de Tarjeta (Square)
                        </span>
                        <div className="flex items-center gap-1.5">
                          <div className="text-[9px] font-extrabold px-2 py-0.5 rounded tracking-tighter uppercase shadow-sm bg-neutral-800 text-white">
                            VISA
                          </div>
                          <div className="text-[9px] font-extrabold px-2 py-0.5 rounded tracking-tighter uppercase shadow-sm flex items-center gap-0.5 bg-neutral-800 text-amber-400">
                            <span className="w-2 h-2 rounded-full bg-red-500 inline-block opacity-90" />
                            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block -ml-1.5 opacity-90" />
                            MC
                          </div>
                          <div className="text-[9px] font-extrabold px-1.5 py-0.5 rounded tracking-tighter uppercase shadow-sm bg-neutral-800 text-white">
                            AMEX
                          </div>
                        </div>
                      </div>

                      {/* Card Error Alert Banner */}
                      {cardError && (
                        <div className="bg-red-100 border border-red-300 text-red-800 text-xs px-3 py-2 rounded-lg font-medium flex items-center gap-2">
                          <span className="font-bold">⚠️</span>
                          <span>{cardError}</span>
                        </div>
                      )}

                      {!isCardReady && !cardError && (
                        <div className="text-xs text-[#1a120e]/60 py-3 text-center">
                          Cargando formulario seguro de tarjeta Square...
                        </div>
                      )}

                      {/* Official Square Web Payments SDK Container */}
                      <div
                        id="square-card-container"
                        className="min-h-[96px] bg-white rounded-lg p-1 border border-[#efeae0]"
                      />
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isProcessing || (paymentMethod === 'square' && !isCardReady)}
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
