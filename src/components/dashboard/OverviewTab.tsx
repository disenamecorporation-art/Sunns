/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Crown, Award, Gift, MapPin, Truck, ChevronRight, 
  Eye, Receipt, ShieldCheck, Sparkles, ArrowUpRight, CreditCard, ShoppingBag 
} from 'lucide-react';
import { motion } from 'motion/react';
import { User, Order, Product } from '../../types';

interface OverviewTabProps {
  currentUser: User;
  orders: Order[];
  onNavigateTab: (tab: 'orders' | 'payments' | 'addresses' | 'security' | 'prescription') => void;
  onViewOrderDetails: (order: Order) => void;
  onOpenShop?: () => void;
}

export default function OverviewTab({
  currentUser,
  orders,
  onNavigateTab,
  onViewOrderDetails,
  onOpenShop,
}: OverviewTabProps) {
  const latestOrder = orders.length > 0 ? orders[0] : null;
  const nextTierPoints = currentUser.tier === 'Black Elite' ? 15000 : 10000;
  const pointsProgress = Math.min(100, Math.round((currentUser.loyaltyPoints / nextTierPoints) * 100));

  return (
    <div className="space-y-7 text-black">
      
      {/* 1. VIP Membership Holographic Card */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-neutral-950 via-neutral-900 to-black p-6 sm:p-7 text-white shadow-xl border border-white/10">
        
        {/* Subtle background glow effect */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              {currentUser.avatar ? (
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-16 h-16 rounded-full object-cover border-2 border-white/40 shadow-lg"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/40 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'S'}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 bg-white text-black p-1 rounded-full shadow-md">
                <Crown className="w-3.5 h-3.5 fill-black" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] tracking-[0.25em] text-white font-bold uppercase">
                  {currentUser.tier}
                </span>
                <span className="text-[9px] bg-white/20 text-white px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                  Socio Activo
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-wide mt-0.5">
                {currentUser.name || currentUser.email.split('@')[0]}
              </h3>
              <p className="text-[11px] text-neutral-300 font-normal flex items-center gap-2 mt-0.5">
                <span>Miembro desde: {currentUser.memberSince}</span>
                <span>•</span>
                <span className="font-mono text-white">ID #{currentUser.id.substring(0, 8)}</span>
              </p>
            </div>
          </div>

          <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 border-white/10 pt-4 sm:pt-0">
            <div className="text-left sm:text-right">
              <span className="text-[10px] uppercase tracking-widest text-neutral-300 block font-semibold">Puntos de Lealtad</span>
              <span className="text-2xl font-bold text-white">
                {currentUser.loyaltyPoints.toLocaleString()} <span className="text-xs font-sans text-neutral-300">PTS</span>
              </span>
            </div>
            <span className="text-[10px] text-white bg-white/10 px-3 py-1 rounded-lg mt-2 border border-white/10 flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3 h-3 text-white" /> $1 = 10 Puntos
            </span>
          </div>
        </div>

        {/* Tier Progress Bar */}
        <div className="relative z-10 mt-6 pt-5 border-t border-white/10 space-y-2">
          <div className="flex justify-between items-center text-[11px] text-neutral-200 font-medium">
            <span>Progreso hacia nivel <strong className="text-white font-semibold">Black Elite Concierge</strong></span>
            <span className="font-semibold text-white">{pointsProgress}% ({currentUser.loyaltyPoints} / {nextTierPoints} PTS)</span>
          </div>
          <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${pointsProgress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="bg-white h-full rounded-full"
            />
          </div>
        </div>

        <div className="absolute -right-6 -bottom-6 text-8xl font-bold text-white/[0.03] select-none pointer-events-none">
          SUNNS
        </div>
      </div>

      {/* 2. Quick Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white border-2 border-neutral-200 p-4 rounded-xl space-y-1 shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-black block">Inversión Total</span>
          <span className="text-xl font-bold text-black">
            ${currentUser.totalSpent.toFixed(2)} <span className="text-[10px] font-medium text-black">USD</span>
          </span>
          <p className="text-[10px] text-emerald-800 font-semibold">Stripe Seguro ✓</p>
        </div>

        <div 
          onClick={() => onNavigateTab('orders')}
          className="bg-white border-2 border-neutral-200 p-4 rounded-xl space-y-1 cursor-pointer hover:border-black transition-colors shadow-sm"
        >
          <span className="text-[10px] uppercase font-bold tracking-wider text-black block">Órdenes Realizadas</span>
          <span className="text-xl font-bold text-black">{orders.length}</span>
          <p className="text-[10px] text-black flex items-center gap-1 font-semibold">
            Ver historial <ArrowUpRight className="w-3 h-3 stroke-[2]" />
          </p>
        </div>

        <div 
          onClick={() => onNavigateTab('payments')}
          className="bg-white border-2 border-neutral-200 p-4 rounded-xl space-y-1 cursor-pointer hover:border-black transition-colors shadow-sm"
        >
          <span className="text-[10px] uppercase font-bold tracking-wider text-black block">Tarjetas Stripe</span>
          <span className="text-xl font-bold text-black">
            {currentUser.paymentMethods?.length || 0}
          </span>
          <p className="text-[10px] text-black flex items-center gap-1 font-semibold">
            Gestionar <ArrowUpRight className="w-3 h-3 stroke-[2]" />
          </p>
        </div>

        <div 
          onClick={() => onNavigateTab('prescription')}
          className="bg-white border-2 border-neutral-200 p-4 rounded-xl space-y-1 cursor-pointer hover:border-black transition-colors shadow-sm"
        >
          <span className="text-[10px] uppercase font-bold tracking-wider text-black block">Ficha Óptica</span>
          <span className="text-xl font-bold text-black">
            {currentUser.prescription ? 'Activa' : 'Pendiente'}
          </span>
          <p className="text-[10px] text-black font-semibold flex items-center gap-1">
            Garantía UV400 <ShieldCheck className="w-3 h-3 stroke-[2]" />
          </p>
        </div>
      </div>

      {/* 3. Live Active Order Tracking Widget (if available) */}
      {latestOrder && (
        <div className="bg-white border-2 border-neutral-200 rounded-2xl p-5 space-y-4 shadow-sm text-black">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-black">Último Pedido en Curso</span>
                <h4 className="text-sm font-bold text-black">{latestOrder.orderNumber}</h4>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                latestOrder.status === 'delivered' 
                  ? 'bg-green-100 text-green-900 border border-green-300' 
                  : latestOrder.status === 'shipped'
                  ? 'bg-blue-100 text-blue-900 border border-blue-300'
                  : 'bg-neutral-100 text-neutral-900 border border-neutral-300'
              }`}>
                {latestOrder.statusLabel}
              </span>
              <button
                onClick={() => onViewOrderDetails(latestOrder)}
                className="text-[11px] font-bold uppercase tracking-wider text-black hover:underline flex items-center gap-1 cursor-pointer"
              >
                Detalles <ChevronRight className="w-3 h-3 stroke-[2]" />
              </button>
            </div>
          </div>

          {/* Tracking Step Progress */}
          <div className="grid grid-cols-4 gap-2 pt-1 text-center">
            <div className="space-y-1">
              <div className="w-full h-1.5 rounded-full bg-black" />
              <span className="text-[10px] font-bold text-black block">1. Pago Stripe</span>
              <span className="text-[9px] text-black font-semibold">Aprobado</span>
            </div>
            <div className="space-y-1">
              <div className={`w-full h-1.5 rounded-full ${latestOrder.status !== 'cancelled' ? 'bg-black' : 'bg-neutral-300'}`} />
              <span className="text-[10px] font-bold text-black block">2. Calibración Óptica</span>
              <span className="text-[9px] text-black font-semibold">Taller Sunns</span>
            </div>
            <div className="space-y-1">
              <div className={`w-full h-1.5 rounded-full ${latestOrder.status === 'shipped' || latestOrder.status === 'delivered' ? 'bg-black' : 'bg-neutral-300'}`} />
              <span className="text-[10px] font-bold text-black block">3. En Tránsito</span>
              <span className="text-[9px] text-black font-semibold">{latestOrder.courier || 'DHL'}</span>
            </div>
            <div className="space-y-1">
              <div className={`w-full h-1.5 rounded-full ${latestOrder.status === 'delivered' ? 'bg-black' : 'bg-neutral-300'}`} />
              <span className="text-[10px] font-bold text-black block">4. Entrega</span>
              <span className="text-[9px] text-black font-semibold">Miami, FL</span>
            </div>
          </div>

          {/* Item Preview */}
          <div className="bg-neutral-50 rounded-xl p-3 flex items-center justify-between gap-3 border border-neutral-200">
            <div className="flex items-center gap-3 overflow-hidden">
              <img 
                src={latestOrder.items[0]?.productImage} 
                alt={latestOrder.items[0]?.productName} 
                className="w-12 h-12 object-contain bg-white rounded-lg p-1 border border-neutral-300 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="overflow-hidden">
                <h5 className="font-bold text-xs text-black truncate">{latestOrder.items[0]?.productName}</h5>
                <p className="text-[11px] text-neutral-700 truncate font-medium">
                  {latestOrder.items[0]?.colorName} • {latestOrder.items[0]?.lensType || 'Filtro UV400'}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="font-bold text-sm text-black">${latestOrder.total.toFixed(2)} USD</span>
              <span className="text-[10px] text-neutral-800 font-medium block">Pagado con {latestOrder.paymentMethod.brand.toUpperCase()} ****{latestOrder.paymentMethod.last4}</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. VIP Member Benefits & Concierge Access */}
      <div className="space-y-3">
        <h4 className="text-[11px] tracking-widest text-black font-bold uppercase border-b border-neutral-300 pb-1.5">
          Privilegios Exclusivos del Club
        </h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="flex items-start gap-3 p-4 bg-white border-2 border-neutral-200 rounded-xl shadow-sm">
            <Gift className="w-5 h-5 text-black shrink-0 mt-0.5 stroke-[1.8]" />
            <div className="space-y-1">
              <h5 className="font-bold text-xs text-black">Estuches de Edición Limitada</h5>
              <p className="text-[11px] text-neutral-800 font-medium leading-relaxed">
                Cada compra incluye de cortesía nuestro estuche rígido en piel vegana italiana con gamuza de microfibra de alta densidad.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white border-2 border-neutral-200 rounded-xl shadow-sm">
            <MapPin className="w-5 h-5 text-black shrink-0 mt-0.5 stroke-[1.8]" />
            <div className="space-y-1">
              <h5 className="font-bold text-xs text-black">Atención Personalizada en Miami</h5>
              <p className="text-[11px] text-neutral-800 font-medium leading-relaxed">
                Acceso prioritario y cita privada con nuestros estilistas ópticos en el Showroom de Miami Beach.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
