/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CreditCard, Sparkles, Building2, ShieldCheck, Clock, ExternalLink } from 'lucide-react';
import { User } from '../../types';

interface CasheaTabProps {
  currentUser: User;
  onUpdateUser: (user: User) => void;
}

export default function CasheaTab({ currentUser }: CasheaTabProps) {
  return (
    <div className="space-y-6 text-black">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-neutral-300 pb-4">
        <div>
          <h3 className="text-xl font-bold text-black flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-black stroke-[2]" />
            Financiamiento Cashea (Próximamente en Venezuela)
          </h3>
          <p className="text-xs font-semibold text-neutral-700 mt-0.5">
            Compra ahora y paga en cuotas sin interés con Cashea.
          </p>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5 flex items-start gap-4 text-xs text-neutral-900 shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5">
          <Building2 className="w-5 h-5 stroke-[2]" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-bold uppercase tracking-wider text-amber-900 text-xs">
              Expansión a Venezuela en Proceso
            </span>
            <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-mono font-bold">
              PRÓXIMAMENTE
            </span>
          </div>
          <p className="text-xs text-neutral-800 leading-relaxed font-medium">
            Actualmente la empresa <strong>SUNNS</strong> no está formalmente registrada como comercio aliado en el sistema operativo de <strong>Cashea</strong> en Venezuela. Estamos finalizando los trámites legales y de integración comercial para habilitar pagos fraccionados muy pronto.
          </p>
          <div className="pt-1 flex items-center gap-3 text-[11px] font-semibold text-neutral-900">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Sin intereses ocultos
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" /> Aprobación instantánea
            </span>
          </div>
        </div>
      </div>

      {/* Preview Card */}
      <div className="bg-white border-2 border-neutral-200 rounded-3xl p-6 shadow-sm space-y-4 opacity-80">
        <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center font-bold text-base">
              C+
            </div>
            <div>
              <span className="font-bold text-sm text-neutral-900 block">Cashea Club Sunns</span>
              <span className="text-[11px] text-neutral-500">Nivel de Usuario: N/D (Pendiente Registro)</span>
            </div>
          </div>
          <span className="text-xs font-bold text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">
            Inactivo en Comercio
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
          <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-1">
            <span className="text-neutral-500 block uppercase font-bold text-[10px]">Límite Disponible</span>
            <strong className="text-base text-neutral-900 font-mono">$0.00 USD</strong>
          </div>
          <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-1">
            <span className="text-neutral-500 block uppercase font-bold text-[10px]">Cuota Inicial</span>
            <strong className="text-base text-neutral-900 font-mono">40% al confirmar</strong>
          </div>
          <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-1">
            <span className="text-neutral-500 block uppercase font-bold text-[10px]">Plazo de Pago</span>
            <strong className="text-base text-neutral-900 font-mono">3 Cuotas sin interés</strong>
          </div>
        </div>

        <div className="pt-2">
          <button
            disabled
            className="w-full py-3 bg-neutral-200 text-neutral-500 rounded-2xl text-xs font-bold uppercase tracking-widest cursor-not-allowed"
          >
            Cashea estará disponible próximamente en SUNNS Venezuela
          </button>
        </div>
      </div>

    </div>
  );
}
