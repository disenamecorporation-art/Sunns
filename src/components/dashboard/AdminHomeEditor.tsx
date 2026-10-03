/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Sparkles, Save, RotateCcw, CheckCircle2, AlertCircle, Layout, 
  Type, MessageSquare, Phone, Mail, MapPin, Eye, Compass, ShieldCheck 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HomeContent } from '../../types';
import { DEFAULT_HOME_CONTENT } from '../../data/homeContent';
import { dbSaveHomeContent } from '../../lib/dbService';

interface AdminHomeEditorProps {
  content: HomeContent;
  onUpdateContent: (newContent: HomeContent) => void;
  showToast: (msg: string) => void;
}

export default function AdminHomeEditor({
  content,
  onUpdateContent,
  showToast
}: AdminHomeEditorProps) {
  const [form, setForm] = useState<HomeContent>({ ...content });
  const [activeSubTab, setActiveSubTab] = useState<'hero' | 'sections' | 'footer'>('hero');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleChange = (field: keyof HomeContent, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleResetDefaults = () => {
    setForm({ ...DEFAULT_HOME_CONTENT });
    setShowResetConfirm(false);
    showToast('Textos restablecidos a los valores por defecto');
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const success = await dbSaveHomeContent(form);
      if (success) {
        onUpdateContent(form);
        setSaveSuccess(true);
        showToast('¡Textos de la página de inicio guardados en Supabase con éxito!');
        setTimeout(() => setSaveSuccess(false), 3500);
      } else {
        showToast('Error al conectar con Supabase. Cambios guardados en memoria.');
      }
    } catch (err) {
      console.error('Error saving home content:', err);
      showToast('Error inesperado al guardar');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Save Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-black/60 p-4 sm:p-5 rounded-2xl border border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              <Layout className="w-5 h-5 text-amber-400" />
              Editor Editorial de la Portada (Home)
            </h3>
            <span className="font-mono text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full uppercase">
              Supabase Cloud
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-light mt-1">
            Modifica todos los textos, lemas, llamados a la acción, información de contacto y pie de página en tiempo real.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {showResetConfirm ? (
            <div className="flex items-center gap-1.5 bg-neutral-900 border border-red-500/40 p-1 rounded-xl">
              <span className="text-[11px] text-red-400 font-semibold px-2">¿Restablecer todo?</span>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer"
              >
                Sí, reiniciar
              </button>
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-2 py-1 text-zinc-400 hover:text-white rounded-lg text-[10px] cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-white hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
              title="Restablecer textos por defecto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Restablecer</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-white text-black hover:bg-zinc-200 transition-all shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-50"
            id="admin-save-home-content-btn"
          >
            {isSaving ? (
              <>
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-black border-t-transparent rounded-full"
                />
                <span>Guardando...</span>
              </>
            ) : saveSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>¡Guardado!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-black" />
                <span>Guardar Cambios</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sub-tabs selector for sections */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSubTab('hero')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeSubTab === 'hero'
              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
              : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>1. Hero & Portada Principal</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('sections')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeSubTab === 'sections'
              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
              : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>2. Colecciones & Concierge</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('footer')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeSubTab === 'footer'
              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
              : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>3. Footer & Contacto Global</span>
        </button>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* ============================================================ */}
        {/* TAB 1: HERO & PORTADA PRINCIPAL */}
        {/* ============================================================ */}
        {activeSubTab === 'hero' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Upper Floating Texts Group */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-widest">
                <Type className="w-4 h-4" />
                <span>Textos Flotantes Superiores (Esquina Superior Derecha)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Línea Superior 1
                  </label>
                  <input
                    type="text"
                    value={form.heroFloatingTitle1}
                    onChange={(e) => handleChange('heroFloatingTitle1', e.target.value)}
                    placeholder="MIRA EL MUNDO"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Línea Superior 2
                  </label>
                  <input
                    type="text"
                    value={form.heroFloatingTitle2}
                    onChange={(e) => handleChange('heroFloatingTitle2', e.target.value)}
                    placeholder="A TRAVÉS DEL ESTILO"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-mono"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Subtítulo Flotante
                  </label>
                  <input
                    type="text"
                    value={form.heroFloatingSubtitle}
                    onChange={(e) => handleChange('heroFloatingSubtitle', e.target.value)}
                    placeholder="ALTA ÓPTICA DE AUTOR"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Left Editorial Block */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-widest">
                <Sparkles className="w-4 h-4" />
                <span>Tarjeta Editorial Inferior Izquierda</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Etiqueta Superior de Colección
                  </label>
                  <input
                    type="text"
                    value={form.heroEditorialTag}
                    onChange={(e) => handleChange('heroEditorialTag', e.target.value)}
                    placeholder="NUEVA COLECCIÓN"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Temporada / Indicador CTA
                  </label>
                  <input
                    type="text"
                    value={form.heroBottomSeason}
                    onChange={(e) => handleChange('heroBottomSeason', e.target.value)}
                    placeholder="ALTA ÓPTICA 2026"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-mono"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Título Principal del Hero (Soporta saltos de línea)
                  </label>
                  <textarea
                    rows={2}
                    value={form.heroBottomTitle}
                    onChange={(e) => handleChange('heroBottomTitle', e.target.value)}
                    placeholder="Diseño puro.&#10;Mirada eterna."
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-serif resize-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Descripción / Párrafo Explicativo
                  </label>
                  <textarea
                    rows={2}
                    value={form.heroBottomDescription}
                    onChange={(e) => handleChange('heroBottomDescription', e.target.value)}
                    placeholder="Lentes esculpidos artesanalmente en finos acetatos y metales puros..."
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all resize-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Texto del Botón de Acción Principal (CTA)
                  </label>
                  <input
                    type="text"
                    value={form.heroCtaText}
                    onChange={(e) => handleChange('heroCtaText', e.target.value)}
                    placeholder="Descubrir Colección"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 4 Pillars / Features Bar */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" />
                <span>Barra de 4 Pilares de Calidad (Debajo de la foto)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Pillar 1 */}
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <span className="text-[10px] font-mono text-zinc-400 block uppercase">Pilar 1</span>
                  <input
                    type="text"
                    value={form.heroPillar1Title}
                    onChange={(e) => handleChange('heroPillar1Title', e.target.value)}
                    placeholder="Título 1"
                    className="w-full bg-black/60 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white font-semibold"
                  />
                  <input
                    type="text"
                    value={form.heroPillar1Desc}
                    onChange={(e) => handleChange('heroPillar1Desc', e.target.value)}
                    placeholder="Descripción 1"
                    className="w-full bg-black/60 border border-white/15 rounded-lg px-2.5 py-1.5 text-[11px] text-zinc-300 font-light"
                  />
                </div>

                {/* Pillar 2 */}
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <span className="text-[10px] font-mono text-zinc-400 block uppercase">Pilar 2</span>
                  <input
                    type="text"
                    value={form.heroPillar2Title}
                    onChange={(e) => handleChange('heroPillar2Title', e.target.value)}
                    placeholder="Título 2"
                    className="w-full bg-black/60 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white font-semibold"
                  />
                  <input
                    type="text"
                    value={form.heroPillar2Desc}
                    onChange={(e) => handleChange('heroPillar2Desc', e.target.value)}
                    placeholder="Descripción 2"
                    className="w-full bg-black/60 border border-white/15 rounded-lg px-2.5 py-1.5 text-[11px] text-zinc-300 font-light"
                  />
                </div>

                {/* Pillar 3 */}
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <span className="text-[10px] font-mono text-zinc-400 block uppercase">Pilar 3</span>
                  <input
                    type="text"
                    value={form.heroPillar3Title}
                    onChange={(e) => handleChange('heroPillar3Title', e.target.value)}
                    placeholder="Título 3"
                    className="w-full bg-black/60 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white font-semibold"
                  />
                  <input
                    type="text"
                    value={form.heroPillar3Desc}
                    onChange={(e) => handleChange('heroPillar3Desc', e.target.value)}
                    placeholder="Descripción 3"
                    className="w-full bg-black/60 border border-white/15 rounded-lg px-2.5 py-1.5 text-[11px] text-zinc-300 font-light"
                  />
                </div>

                {/* Pillar 4 */}
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <span className="text-[10px] font-mono text-zinc-400 block uppercase">Pilar 4</span>
                  <input
                    type="text"
                    value={form.heroPillar4Title}
                    onChange={(e) => handleChange('heroPillar4Title', e.target.value)}
                    placeholder="Título 4"
                    className="w-full bg-black/60 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white font-semibold"
                  />
                  <input
                    type="text"
                    value={form.heroPillar4Desc}
                    onChange={(e) => handleChange('heroPillar4Desc', e.target.value)}
                    placeholder="Descripción 4"
                    className="w-full bg-black/60 border border-white/15 rounded-lg px-2.5 py-1.5 text-[11px] text-zinc-300 font-light"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: COLECCIONES, LANZAMIENTOS & CONCIERGE */}
        {/* ============================================================ */}
        {activeSubTab === 'sections' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* New Arrivals Section */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-widest">
                <Sparkles className="w-4 h-4" />
                <span>Sección: New Arrivals / Lanzamientos Recientes</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Etiqueta Superior
                  </label>
                  <input
                    type="text"
                    value={form.arrivalsTag}
                    onChange={(e) => handleChange('arrivalsTag', e.target.value)}
                    placeholder="LANZAMIENTOS RECIENTES"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Título de la Sección
                  </label>
                  <input
                    type="text"
                    value={form.arrivalsTitle}
                    onChange={(e) => handleChange('arrivalsTitle', e.target.value)}
                    placeholder="New Arrivals"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-serif"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Descripción Explicativa
                  </label>
                  <textarea
                    rows={2}
                    value={form.arrivalsDescription}
                    onChange={(e) => handleChange('arrivalsDescription', e.target.value)}
                    placeholder="La última expresión de la artesanía Sunns..."
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Featured Categories Section */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-widest">
                <Layout className="w-4 h-4" />
                <span>Sección: Colecciones Exclusivas</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Etiqueta Superior
                  </label>
                  <input
                    type="text"
                    value={form.categoriesTag}
                    onChange={(e) => handleChange('categoriesTag', e.target.value)}
                    placeholder="COLECCIONES EXCLUSIVAS"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Título de Colecciones
                  </label>
                  <input
                    type="text"
                    value={form.categoriesTitle}
                    onChange={(e) => handleChange('categoriesTitle', e.target.value)}
                    placeholder="Diseño adaptado a cada perspectiva"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-serif"
                  />
                </div>
              </div>
            </div>

            {/* Concierge & Contact Section */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-widest">
                <MessageSquare className="w-4 h-4" />
                <span>Sección: Atención Concierge & Formulario</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Etiqueta Concierge
                  </label>
                  <input
                    type="text"
                    value={form.conciergeTag}
                    onChange={(e) => handleChange('conciergeTag', e.target.value)}
                    placeholder="ATENCIÓN CONCIERGE"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Línea 1 Título
                  </label>
                  <input
                    type="text"
                    value={form.conciergeTitle}
                    onChange={(e) => handleChange('conciergeTitle', e.target.value)}
                    placeholder="Habita el estilo."
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-serif"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Línea 2 Subtítulo
                  </label>
                  <input
                    type="text"
                    value={form.conciergeSubtitle}
                    onChange={(e) => handleChange('conciergeSubtitle', e.target.value)}
                    placeholder="Conecta con Sunns."
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-bold"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Texto Descriptivo Concierge
                  </label>
                  <textarea
                    rows={2}
                    value={form.conciergeDescription}
                    onChange={(e) => handleChange('conciergeDescription', e.target.value)}
                    placeholder="¿Tienes dudas sobre nuestra colección de lentes..."
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Testimonials */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-widest">
                <Sparkles className="w-4 h-4" />
                <span>Sección: Opiniones Editoriales</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Etiqueta
                  </label>
                  <input
                    type="text"
                    value={form.testimonialsTag}
                    onChange={(e) => handleChange('testimonialsTag', e.target.value)}
                    placeholder="OPINIONES EDITORIALES"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Título
                  </label>
                  <input
                    type="text"
                    value={form.testimonialsTitle}
                    onChange={(e) => handleChange('testimonialsTitle', e.target.value)}
                    placeholder="La voz de quienes visten Sunns"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-serif"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: FOOTER & CONTACTO GLOBAL */}
        {/* ============================================================ */}
        {activeSubTab === 'footer' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Brand statement & Newsletter */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-widest">
                <Type className="w-4 h-4" />
                <span>Manifiesto de Marca & Newsletter</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Descripción de la Marca en el Footer
                  </label>
                  <textarea
                    rows={3}
                    value={form.footerBrandDescription}
                    onChange={(e) => handleChange('footerBrandDescription', e.target.value)}
                    placeholder="Artesanía atemporal y perfiles contemporáneos..."
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                      Título Newsletter
                    </label>
                    <input
                      type="text"
                      value={form.footerNewsletterTag}
                      onChange={(e) => handleChange('footerNewsletterTag', e.target.value)}
                      placeholder="SUSCRÍBETE A NUESTRA NEWSLETTER"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                      Texto de Beneficio Newsletter
                    </label>
                    <input
                      type="text"
                      value={form.footerNewsletterDescription}
                      onChange={(e) => handleChange('footerNewsletterDescription', e.target.value)}
                      placeholder="Únete a nuestro club exclusivo..."
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Contact Details */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-widest">
                <Phone className="w-4 h-4" />
                <span>Datos de Contacto Directo & Showroom</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-amber-300" />
                    Atención Telefónica
                  </label>
                  <input
                    type="text"
                    value={form.footerPhone}
                    onChange={(e) => handleChange('footerPhone', e.target.value)}
                    placeholder="+1 (786) 825-9355"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-amber-300" />
                    Soporte por Email
                  </label>
                  <input
                    type="text"
                    value={form.footerEmail}
                    onChange={(e) => handleChange('footerEmail', e.target.value)}
                    placeholder="Sunnsshop@icloud.com"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-amber-300" />
                    Showroom Central
                  </label>
                  <input
                    type="text"
                    value={form.footerAddress}
                    onChange={(e) => handleChange('footerAddress', e.target.value)}
                    placeholder="Brickell Avenue, Miami, FL, USA"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Copyright & Legal notes */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" />
                <span>Copyright y Pie Legal</span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Línea de Copyright & Año
                </label>
                <input
                  type="text"
                  value={form.footerCopyright}
                  onChange={(e) => handleChange('footerCopyright', e.target.value)}
                  placeholder="Sunns Shop © 2026. Todos los derechos reservados..."
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Bottom Save Action */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-4 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            Restablecer Valores
          </button>
          
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-7 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-white text-black hover:bg-zinc-200 transition-all shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-black border-t-transparent rounded-full"
                />
                <span>Guardando en Supabase...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-black" />
                <span>Guardar Cambios en Portada</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
