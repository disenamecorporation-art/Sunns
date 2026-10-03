/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Check, Sparkles, MessageSquare, Compass, ShieldAlert } from 'lucide-react';
import { HomeContent } from '../types';
import { DEFAULT_HOME_CONTENT } from '../data/homeContent';

interface BrandHistoryProps {
  homeContent?: HomeContent;
}

export default function BrandHistory({ homeContent = DEFAULT_HOME_CONTENT }: BrandHistoryProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsLoading(true);
    
    // Simulate premium submission with nice timing
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      // Reset form fields
      setName('');
      setEmail('');
      setMessage('');
    }, 1200);
  };

  return (
    <section 
      className="relative py-28 bg-black overflow-hidden flex items-center justify-center min-h-[720px]" 
      id="about"
    >
      {/* Background Image of sunglasses with dark luxury overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=1600"
          alt="Lentes de lujo de fondo"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-30 scale-105 filter brightness-75 contrast-125"
        />
        {/* Soft radial black gradients for premium dark vibe */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        <div className="absolute inset-0 bg-black/75" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column: Decorative/Branding details */}
          <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-3"
            >
              <span className="text-[10px] tracking-[0.5em] text-[#efeae0]/80 font-bold uppercase block">
                {homeContent.conciergeTag || 'ATENCIÓN CONCIERGE'}
              </span>
              <h2 className="font-serif-elegant text-3xl sm:text-4xl text-[#efeae0] leading-tight" style={{ fontWeight: 200 }}>
                {homeContent.conciergeTitle || 'Habita el estilo.'} <br />
                <span className="font-sans font-extrabold tracking-tight text-white block mt-1">
                  {homeContent.conciergeSubtitle || 'Conecta con Sunns.'}
                </span>
              </h2>
              <div className="w-16 h-[1.5px] bg-[#efeae0]/40 mx-auto lg:mx-0 mt-4" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-xs text-[#efeae0]/70 font-light leading-relaxed max-w-md mx-auto lg:mx-0"
            >
              {homeContent.conciergeDescription || '¿Tienes dudas sobre nuestra colección de lentes, necesitas asesoría de estilo personalizada o deseas realizar un pedido especial? Nuestro equipo de conserjería premium responderá tu solicitud de inmediato.'}
            </motion.p>

            {/* Quick Micro-Features */}
            <div className="pt-4 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
              <div className="flex flex-col items-center lg:items-start gap-1">
                <Compass className="w-4 h-4 text-[#efeae0]/80" />
                <span className="text-[9px] font-bold text-white/90 uppercase tracking-wider">Atención 24/7</span>
              </div>
              <div className="flex flex-col items-center lg:items-start gap-1">
                <Sparkles className="w-4 h-4 text-[#efeae0]/80" />
                <span className="text-[9px] font-bold text-white/90 uppercase tracking-wider">Línea Óptica</span>
              </div>
              <div className="flex flex-col items-center lg:items-start gap-1">
                <MessageSquare className="w-4 h-4 text-[#efeae0]/80" />
                <span className="text-[9px] font-bold text-white/90 uppercase tracking-wider">Soporte Directo</span>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Interactive Glassmorphism Form Container */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="relative rounded-2xl p-6 sm:p-8 backdrop-blur-xl bg-white/5 border border-white/10 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.6)] overflow-hidden"
              id="glass-contact-form-container"
            >
              {/* Internal subtle glow decorations */}
              <div className="absolute -top-16 -left-16 w-36 h-36 bg-white/5 rounded-full filter blur-xl pointer-events-none" />
              <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-[#efeae0]/5 rounded-full filter blur-xl pointer-events-none" />

              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.form
                    key="contact-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-5 relative z-10"
                  >
                    <div>
                      <h3 className="font-serif-elegant text-lg text-white mb-1">
                        Formulario Concierge
                      </h3>
                      <p className="text-[10px] text-white/60 font-light">
                        Completa los detalles y nos pondremos en contacto contigo de inmediato.
                      </p>
                    </div>

                    {/* Name input */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] tracking-wider font-bold text-white/80 uppercase block">
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-white/5 focus:bg-white/10 border border-white/10 focus:border-[#efeae0]/40 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300"
                        id="contact-glass-name"
                      />
                    </div>

                    {/* Email input */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] tracking-wider font-bold text-white/80 uppercase block">
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full bg-white/5 focus:bg-white/10 border border-white/10 focus:border-[#efeae0]/40 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300"
                        id="contact-glass-email"
                      />
                    </div>

                    {/* Message input */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] tracking-wider font-bold text-white/80 uppercase block">
                        Mensaje o Consulta Especial
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Escribe tu mensaje o la referencia del modelo de lentes aquí..."
                        className="w-full bg-white/5 focus:bg-white/10 border border-white/10 focus:border-[#efeae0]/40 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300 resize-none"
                        id="contact-glass-msg"
                      />
                    </div>

                    {/* Submit CTA button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="relative w-full bg-white hover:bg-zinc-200 text-black text-xs font-bold tracking-widest uppercase py-3.5 rounded-lg transition-all duration-300 shadow-xl cursor-pointer hover:shadow-white/10 flex items-center justify-center gap-2"
                        id="contact-glass-submit"
                      >
                        {isLoading ? (
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            Enviar Solicitud
                            <Send className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success-card"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="text-center py-8 space-y-4 relative z-10"
                  >
                    <div className="w-14 h-14 bg-white/10 rounded-full border border-white/20 flex items-center justify-center mx-auto shadow-inner">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-serif-elegant text-xl text-white">
                        Solicitud Recibida
                      </h4>
                      <p className="text-xs text-white/70 max-w-sm mx-auto leading-relaxed font-light">
                        Gracias por ponerte en contacto con la experiencia Sunns. Tu asesor de estilo asignado se comunicará contigo vía email en menos de 2 horas.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="text-[10px] tracking-widest uppercase font-bold text-white/50 hover:text-white transition-colors duration-300 border-b border-white/20 hover:border-white pb-0.5"
                    >
                      Enviar otra consulta
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
