/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Glasses, Instagram, Facebook, Twitter, ShieldCheck, Mail, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { HomeContent } from '../types';
import { DEFAULT_HOME_CONTENT } from '../data/homeContent';

interface FooterProps {
  setView: (view: string) => void;
  setSelectedCategory: (category: string) => void;
  scrollToSection: (id: string) => void;
  homeContent?: HomeContent;
}

export default function Footer({ 
  setView, 
  setSelectedCategory, 
  scrollToSection,
  homeContent = DEFAULT_HOME_CONTENT 
}: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (sectionId: string) => {
    setView('home');
    setTimeout(() => scrollToSection(sectionId), 100);
  };

  return (
    <footer className="bg-black text-[#f5f0e6] border-t border-white/10 pt-20 pb-8" id="footer-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section with Branding & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          
          {/* Brand Presentation */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2.5">
              <img
                src="https://i.postimg.cc/c4c5KwvC/logoweb-sunns.png"
                alt="SUNNS"
                referrerPolicy="no-referrer"
                className="h-14 w-auto brightness-0 invert"
              />
            </div>
            
            <p className="text-xs text-[#f5f0e6]/65 leading-relaxed font-light max-w-sm">
              {homeContent.footerBrandDescription || 'Artesanía atemporal y perfiles contemporáneos. Diseñamos lentes premium pulidos individualmente a mano con finos acetatos biodegradables para vestir cada mirada con distinción.'}
            </p>

            {/* Social Icons */}
            <div className="flex items-center space-x-4">
              <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white text-white hover:text-black transition-all duration-300 border border-white/10" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white text-white hover:text-black transition-all duration-300 border border-white/10" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white text-white hover:text-black transition-all duration-300 border border-white/10" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Newsletter Signup Form */}
          <div className="lg:col-span-7 space-y-4">
            <span className="text-[10px] tracking-[0.3em] text-[#f5f0e6] uppercase font-bold block">
              {homeContent.footerNewsletterTag || 'SUSCRÍBETE A NUESTRA NEWSLETTER'}
            </span>
            <p className="text-xs text-[#f5f0e6]/70 font-light max-w-xl leading-relaxed">
              {homeContent.footerNewsletterDescription || 'Únete a nuestro club exclusivo. Recibe invitaciones a ventas privadas de stock limitado, lanzamientos editoriales y un 10% de descuento de cortesía en tu primera compra.'}
            </p>
            
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 pt-2 max-w-lg">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#f5f0e6]/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Introduce tu correo electrónico"
                  className="w-full bg-white/5 border border-white/15 rounded-none pl-11 pr-4 py-3.5 text-xs text-[#f5f0e6] placeholder-[#f5f0e6]/35 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-white hover:bg-zinc-200 text-black text-[10px] tracking-widest font-bold uppercase px-8 py-3.5 rounded-none transition-colors duration-300 shrink-0 cursor-pointer flex items-center justify-center gap-2"
                id="footer-subscribe-btn"
              >
                Suscribirse
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {subscribed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-xs text-[#f5f0e6] font-medium"
              >
                <ShieldCheck className="w-4 h-4" />
                ¡Te has suscrito con éxito! Revisa tu bandeja de entrada para reclamar tu 10% de descuento.
              </motion.div>
            )}
          </div>

        </div>

        {/* Middle Section: Columns of links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16 text-xs border-b border-white/10">
          
          {/* Column 1: Colecciones */}
          <div className="space-y-4">
            <h4 className="text-[10px] tracking-widest text-[#f5f0e6] font-bold uppercase">
              Colecciones
            </h4>
            <ul className="space-y-2.5 font-light text-[#f5f0e6]/70">
              <li>
                <button onClick={() => handleCategoryClick('Sol')} className="hover:text-white transition-colors cursor-pointer text-left focus:outline-none">
                  Lentes de Sol
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('Ópticos')} className="hover:text-white transition-colors cursor-pointer text-left focus:outline-none">
                  Marcos Ópticos
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('Deportivos')} className="hover:text-white transition-colors cursor-pointer text-left focus:outline-none">
                  Línea Deportiva
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('Vintage')} className="hover:text-white transition-colors cursor-pointer text-left focus:outline-none">
                  Línea Vintage / Retro
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Sunns Shop */}
          <div className="space-y-4">
            <h4 className="text-[10px] tracking-widest text-[#f5f0e6] font-bold uppercase">
              La Marca
            </h4>
            <ul className="space-y-2.5 font-light text-[#f5f0e6]/70">
              <li>
                <button onClick={() => handleNavClick('about')} className="hover:text-white transition-colors cursor-pointer text-left focus:outline-none">
                  Sobre Nosotros
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('collections')} className="hover:text-white transition-colors cursor-pointer text-left focus:outline-none">
                  Catálogo Premium
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('testimonials')} className="hover:text-white transition-colors cursor-pointer text-left focus:outline-none">
                  Opiniones de Clientes
                </button>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Sostenibilidad Ambiental
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Ayuda & Soporte */}
          <div className="space-y-4">
            <h4 className="text-[10px] tracking-widest text-[#f5f0e6] font-bold uppercase">
              Ayuda
            </h4>
            <ul className="space-y-2.5 font-light text-[#f5f0e6]/70">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Estado de Envío
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Política de Devoluciones
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Guía de Ajustes y Tallas
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Garantía de Bisagras
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contacto */}
          <div className="space-y-4">
            <h4 className="text-[10px] tracking-widest text-[#f5f0e6] font-bold uppercase">
              Contacto
            </h4>
            <ul className="space-y-2.5 font-light text-[#f5f0e6]/70">
              <li>
                <span className="block text-[#f5f0e6]/50">Atención telefónica:</span>
                <span className="text-[#f5f0e6] font-medium">{homeContent.footerPhone || '+1 (786) 825-9355'}</span>
              </li>
              <li>
                <span className="block text-[#f5f0e6]/50">Soporte por email:</span>
                <span className="text-[#f5f0e6] font-medium">{homeContent.footerEmail || 'Sunnsshop@icloud.com'}</span>
              </li>
              <li>
                <span className="block text-[#f5f0e6]/50">Showroom Central:</span>
                <span className="text-[#f5f0e6] font-medium">{homeContent.footerAddress || 'Brickell Avenue, Miami, FL, USA'}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright and legal notes */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-[#f5f0e6]/45 font-light">
          <div>
            {homeContent.footerCopyright || 'Sunns Shop © 2026. Todos los derechos reservados. Diseñado bajo estándares de lujo sostenible en Miami.'}
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors">
              Términos de Servicio
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Política de Privacidad
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Configuración de Cookies
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
