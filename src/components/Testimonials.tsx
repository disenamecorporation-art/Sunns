/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Star, Quote } from 'lucide-react';
import { motion } from 'motion/react';
import { TESTIMONIALS } from '../data/products';

export default function Testimonials() {
  return (
    <section className="py-24 bg-[#ffffff]" id="testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-[10px] tracking-[0.45em] text-black font-semibold uppercase block mb-3">
            OPINIONES EDITORIALES
          </span>
          <h2 className="font-serif-elegant text-3xl sm:text-4xl font-bold text-black leading-tight">
            La voz de quienes visten Sunns
          </h2>
          <div className="w-12 h-[1.5px] bg-black mx-auto mt-4" />
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              className="bg-[#faf9f6] border border-[#f0ebe1] rounded-xl p-8 relative flex flex-col justify-between hover:border-[#e5dfd5] hover:shadow-lg hover:shadow-black/5 transition-all duration-300"
              id={`testimonial-${t.id}`}
            >
              <div className="space-y-4">
                {/* Stars and Quote mark */}
                <div className="flex items-center justify-between text-black">
                  <div className="flex">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-black" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 opacity-[0.06] transform scale-x-[-1]" />
                </div>

                {/* Review Text */}
                <p className="text-xs text-black/80 leading-relaxed font-light">
                  "{t.comment}"
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-6 mt-6 border-t border-[#f0ebe1] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-black uppercase tracking-wider">
                    {t.user}
                  </h4>
                  <span className="text-[10px] text-black/50 block mt-0.5 font-medium">
                    {t.role}
                  </span>
                </div>
                <span className="text-[9px] text-black/40">
                  {t.date}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
