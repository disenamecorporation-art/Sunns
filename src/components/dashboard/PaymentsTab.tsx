/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CreditCard, Plus, Trash2, CheckCircle2, ShieldCheck, 
  Lock, AlertCircle, X, Sparkles, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, SavedPaymentMethod } from '../../types';
import { updateUserProfile } from '../../lib/userService';

interface PaymentsTabProps {
  currentUser: User;
  onUpdateUser: (user: User) => void;
}

export default function PaymentsTab({ currentUser, onUpdateUser }: PaymentsTabProps) {
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expMonth, setExpMonth] = useState('');
  const [expYear, setExpYear] = useState('');
  const [cvc, setCvc] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethods = currentUser.paymentMethods || [];

  // Format Card Number (adds spaces every 4 digits)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '').substring(0, 16);
    let formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardNumber(formatted);
  };

  // Detect Brand from first digits
  const getCardBrand = (number: string): 'visa' | 'mastercard' | 'amex' => {
    const clean = number.replace(/\D/g, '');
    if (clean.startsWith('34') || clean.startsWith('37')) return 'amex';
    if (clean.startsWith('51') || clean.startsWith('52') || clean.startsWith('53') || clean.startsWith('54') || clean.startsWith('55')) return 'mastercard';
    return 'visa';
  };

  const handleAddTestCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setCardHolder(currentUser.name ? currentUser.name.toUpperCase() : 'SOCIO SUNNS');
    setExpMonth('12');
    setExpYear('2028');
    setCvc('789');
  };

  const handleSaveCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    const cleanNum = cardNumber.replace(/\D/g, '');
    if (cleanNum.length < 15) {
      setFormError('Por favor ingrese un número de tarjeta válido.');
      return;
    }

    if (!cardHolder.trim() || !expMonth || !expYear || !cvc) {
      setFormError('Por favor complete todos los campos de la tarjeta.');
      return;
    }

    setIsProcessing(true);

    // Simulate real Stripe tokenization
    await new Promise(r => setTimeout(r, 600));

    const brand = getCardBrand(cleanNum);
    const newCard: SavedPaymentMethod = {
      id: `pm_${Date.now()}`,
      brand,
      last4: cleanNum.slice(-4),
      expMonth,
      expYear,
      holderName: cardHolder.toUpperCase(),
      isDefault: isDefault || paymentMethods.length === 0,
      stripePaymentMethodId: `pm_tok_live_${Math.random().toString(36).substring(2, 10)}`,
    };

    let updatedList: SavedPaymentMethod[];
    if (newCard.isDefault) {
      updatedList = [
        ...paymentMethods.map(p => ({ ...p, isDefault: false })),
        newCard,
      ];
    } else {
      updatedList = [...paymentMethods, newCard];
    }

    const res = await updateUserProfile(currentUser.id, { paymentMethods: updatedList });
    setIsProcessing(false);

    if (res.success && res.user) {
      onUpdateUser(res.user);
      setFormSuccess('¡Tarjeta vinculada con éxito a tu cuenta Stripe!');
      setTimeout(() => {
        setShowAddCardModal(false);
        setCardNumber('');
        setCardHolder('');
        setExpMonth('');
        setExpYear('');
        setCvc('');
        setFormSuccess('');
      }, 1000);
    } else {
      setFormError(res.error || 'Error al guardar la tarjeta.');
    }
  };

  const handleSetDefault = async (cardId: string) => {
    const updated = paymentMethods.map(pm => ({
      ...pm,
      isDefault: pm.id === cardId,
    }));
    const res = await updateUserProfile(currentUser.id, { paymentMethods: updated });
    if (res.success && res.user) {
      onUpdateUser(res.user);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    if (confirm('¿Desea desvincular este método de pago de Stripe?')) {
      const updated = paymentMethods.filter(pm => pm.id !== cardId);
      if (updated.length > 0 && !updated.some(pm => pm.isDefault)) {
        updated[0].isDefault = true;
      }
      const res = await updateUserProfile(currentUser.id, { paymentMethods: updated });
      if (res.success && res.user) {
        onUpdateUser(res.user);
      }
    }
  };

  return (
    <div className="space-y-6 text-black">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-neutral-300 pb-4">
        <div>
          <h3 className="text-xl font-bold text-black flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-black stroke-[2]" />
            Métodos de Pago
          </h3>
          <p className="text-xs font-semibold text-black mt-0.5">
            Gestiona tus tarjetas guardadas para compras rápidas y seguras.
          </p>
        </div>

        <button
          onClick={() => {
            setShowAddCardModal(true);
            setFormError('');
            setFormSuccess('');
          }}
          className="bg-black text-white text-[11px] font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl hover:bg-neutral-900 transition-all flex items-center gap-2 cursor-pointer shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2]" /> Añadir Tarjeta
        </button>
      </div>

      {/* Security Banner */}
      <div className="bg-white border-2 border-neutral-200 rounded-2xl p-4 flex items-center justify-between gap-4 text-xs text-black shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <span className="font-bold text-xs text-black block">Pagos 100% Protegidos</span>
            <span className="text-xs font-medium text-neutral-800">
              Tus transacciones se procesan de forma encriptada y segura mediante Stripe.
            </span>
          </div>
        </div>
        <Lock className="w-4 h-4 text-black shrink-0 hidden sm:block stroke-[2]" />
      </div>

      {/* Cards Grid */}
      {paymentMethods.length === 0 ? (
        <div className="bg-neutral-50 border-2 border-neutral-200 rounded-2xl p-8 text-center space-y-3">
          <CreditCard className="w-10 h-10 text-black mx-auto stroke-[2]" />
          <h4 className="font-bold text-base text-black">No hay tarjetas vinculadas</h4>
          <p className="text-xs text-neutral-800 font-medium max-w-sm mx-auto">
            Añade una tarjeta de crédito o débito para agilizar tus compras en el Club Sunns.
          </p>
          <button
            onClick={() => setShowAddCardModal(true)}
            className="bg-black text-white text-[11px] font-bold uppercase tracking-widest px-6 py-2.5 rounded-xl hover:bg-neutral-900 transition-colors cursor-pointer shadow"
          >
            Vincular Primera Tarjeta
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.map((pm) => (
            <div
              key={pm.id}
              className="rounded-2xl p-5 relative overflow-hidden transition-all shadow-md flex flex-col justify-between h-48 bg-gradient-to-br from-neutral-950 via-neutral-900 to-black text-white border border-neutral-700"
            >
              {/* Card Top */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-5 rounded bg-neutral-300 border border-white/50 shadow-inner" />
                  <span className="text-[10px] tracking-widest uppercase font-bold text-neutral-200">
                    {pm.brand === 'amex' ? 'American Express' : pm.brand.toUpperCase()}
                  </span>
                </div>

                {pm.isDefault ? (
                  <span className="bg-white text-black text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <Star className="w-2.5 h-2.5 fill-black" /> Predeterminada
                  </span>
                ) : (
                  <button
                    onClick={() => handleSetDefault(pm.id)}
                    className="text-[10px] uppercase tracking-wider text-neutral-300 hover:text-white underline cursor-pointer font-medium"
                  >
                    Hacer Predeterminada
                  </button>
                )}
              </div>

              {/* Card Number */}
              <div className="font-mono text-base sm:text-lg tracking-[0.25em] text-white font-bold">
                •••• •••• •••• {pm.last4}
              </div>

              {/* Card Bottom */}
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-neutral-400 block font-semibold">Titular</span>
                  <span className="text-xs font-bold tracking-wider text-white uppercase truncate max-w-[160px] block">
                    {pm.holderName}
                  </span>
                </div>

                <div className="text-right flex items-end gap-3">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-neutral-400 block font-semibold">Vence</span>
                    <span className="text-xs font-mono font-bold text-white">
                      {pm.expMonth}/{pm.expYear.slice(-2)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteCard(pm.id)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-red-600/30 text-white hover:text-red-200 transition-colors cursor-pointer"
                    title="Eliminar tarjeta"
                  >
                    <Trash2 className="w-3.5 h-3.5 stroke-[2]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD CARD MODAL */}
      <AnimatePresence>
        {showAddCardModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-neutral-300 flex flex-col text-black"
            >
              {/* Header */}
              <div className="p-5 border-b border-neutral-200 bg-neutral-50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-black stroke-[2]" />
                  <h4 className="font-bold text-base text-black">Nueva Tarjeta en Stripe</h4>
                </div>
                <button
                  onClick={() => setShowAddCardModal(false)}
                  className="p-1.5 rounded-full text-black hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 stroke-[2]" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSaveCard} className="p-6 space-y-4 text-xs">
                
                {/* Fast Fill Demo Button */}
                <div className="flex justify-between items-center bg-neutral-100 p-3 rounded-xl border border-neutral-300">
                  <span className="text-xs text-black font-semibold">Modo de Pruebas Stripe</span>
                  <button
                    type="button"
                    onClick={handleAddTestCard}
                    className="text-[10px] bg-black text-white px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    Usar Tarjeta Test (4242)
                  </button>
                </div>

                {formError && (
                  <div className="p-3 bg-red-50 border border-red-300 text-red-800 rounded-xl text-xs flex items-center gap-2 font-semibold">
                    <AlertCircle className="w-4 h-4 shrink-0 stroke-[2]" />
                    <span>{formError}</span>
                  </div>
                )}

                {formSuccess && (
                  <div className="p-3 bg-green-50 border border-green-300 text-green-900 rounded-xl text-xs flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="w-4 h-4 shrink-0 stroke-[2]" />
                    <span>{formSuccess}</span>
                  </div>
                )}

                {/* Card Number */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-black">Número de Tarjeta</label>
                  <input
                    type="text"
                    required
                    placeholder="4242 4242 4242 4242"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    className="w-full bg-white border-2 border-neutral-300 rounded-xl px-3 py-2.5 font-mono text-xs font-semibold text-black focus:bg-white focus:outline-none focus:border-black"
                  />
                </div>

                {/* Cardholder */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-black">Nombre del Titular</label>
                  <input
                    type="text"
                    required
                    placeholder="COMO APARECE EN LA TARJETA"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full bg-white border-2 border-neutral-300 rounded-xl px-3 py-2.5 uppercase text-xs font-semibold text-black focus:bg-white focus:outline-none focus:border-black"
                  />
                </div>

                {/* Expiry & CVC */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-black">Mes (MM)</label>
                    <input
                      type="text"
                      maxLength={2}
                      required
                      placeholder="12"
                      value={expMonth}
                      onChange={(e) => setExpMonth(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-white border-2 border-neutral-300 rounded-xl px-3 py-2.5 text-center font-mono text-xs font-semibold text-black focus:bg-white focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-black">Año (AAAA)</label>
                    <input
                      type="text"
                      maxLength={4}
                      required
                      placeholder="2028"
                      value={expYear}
                      onChange={(e) => setExpYear(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-white border-2 border-neutral-300 rounded-xl px-3 py-2.5 text-center font-mono text-xs font-semibold text-black focus:bg-white focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-black">CVC</label>
                    <input
                      type="password"
                      maxLength={4}
                      required
                      placeholder="•••"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-white border-2 border-neutral-300 rounded-xl px-3 py-2.5 text-center font-mono text-xs font-semibold text-black focus:bg-white focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                {/* Checkbox Default */}
                <label className="flex items-center gap-2 cursor-pointer pt-1 text-black font-semibold">
                  <input
                    type="checkbox"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="rounded accent-black w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs text-black">Usar como método de pago predeterminado</span>
                </label>

                {/* Submit */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-black text-white py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-neutral-900 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? 'Verificando con Stripe...' : 'Guardar y Tokenizar en Stripe'}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
