/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'nox-minimal',
    name: 'Nox Minimal',
    price: 185,
    originalPrice: 265,
    category: 'Sol',
    description: 'Lentes de sol minimalistas de acetato italiano de alta densidad en tono negro absoluto. Un diseño contemporáneo esculpido a mano para quienes aprecian la sofisticación sin esfuerzo.',
    details: [
      'Acetato italiano Mazzucchelli pulido a mano de alta densidad',
      'Protección 100% UVA/UVB con lentes de nailon polarizados de máxima nitidez'
    ],
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&q=80&w=600'
    ],
    colors: [
      { 
        name: 'Negro Carbón', 
        value: '#1A1A1A', 
        images: [
          'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600'
        ] 
      },
      { 
        name: 'Humo Translúcido', 
        value: '#4E5154', 
        images: [
          'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&q=80&w=600'
        ] 
      },
      { 
        name: 'Miel Calma', 
        value: '#C68E5A', 
        images: [
          'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=600'
        ] 
      }
    ],
    inStock: true,
    featured: true,
    rating: 4.9,
    reviewsCount: 38
  },
  {
    id: 'aurelia-vintage',
    name: 'Aurelia Vintage',
    price: 210,
    originalPrice: 295,
    category: 'Vintage',
    description: 'Lentes de sol retro de inspiración setentera con montura metálica dorada y lentes oscuros de alta definición. El equilibrio perfecto entre nostalgia sofisticada y elegancia moderna.',
    details: [
      'Estructura de acero inoxidable con baño de oro de 18k y plaquetas de silicona',
      'Lentes CR-39 con recubrimiento antirreflejante y protección total UV400'
    ],
    image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600'
    ],
    colors: [
      { 
        name: 'Oro Pulido / Negro', 
        value: '#D4AF37', 
        images: [
          'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&q=80&w=600'
        ] 
      },
      { 
        name: 'Plata Noble / Azul', 
        value: '#C0C0C0', 
        images: [
          'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&q=80&w=600'
        ] 
      },
      { 
        name: 'Bronce Antiguo', 
        value: '#CD7F32', 
        images: [
          'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600'
        ] 
      }
    ],
    inStock: true,
    featured: true,
    rating: 4.8,
    reviewsCount: 24
  },
  {
    id: 'lumiere-classic',
    name: 'Lumière Classic',
    price: 165,
    originalPrice: 240,
    category: 'Ópticos',
    description: 'Gafas ópticas circulares elegantes con montura de acetato translúcido en tono champaña cálido. Comodidad excepcional de peso pluma y estilo intelectual contemporáneo.',
    details: [
      'Montura de acetato ultraligero y flexible con varillas reforzadas grabadas',
      'Filtro de luz azul preinstalado para pantallas y soporte para cristales graduados'
    ],
    image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&q=80&w=600'
    ],
    colors: [
      { 
        name: 'Champaña Translúcido', 
        value: '#EEDC82', 
        images: [
          'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=600'
        ] 
      },
      { 
        name: 'Cristal Claro', 
        value: '#F0F8FF', 
        images: [
          'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&q=80&w=600'
        ] 
      },
      { 
        name: 'Carey Ámbar', 
        value: '#704214', 
        images: [
          'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600'
        ] 
      }
    ],
    inStock: true,
    featured: true,
    rating: 4.7,
    reviewsCount: 42
  },
  {
    id: 'zephyr-active',
    name: 'Zephyr Active',
    price: 195,
    originalPrice: 280,
    category: 'Deportivos',
    description: 'Lentes deportivos de alta resistencia con protección aerodinámica envolvente y lentes polarizados premium. Diseñados para un rendimiento óptimo al aire libre sin comprometer tu estilo de alta costura.',
    details: [
      'Estructura de polímero TR90 ultraligero y resistente con zonas antideslizantes',
      'Lentes hidrofóbicos polarizados que repelen agua y protegen 100% contra rayos UVA/UVB'
    ],
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&q=80&w=600'
    ],
    colors: [
      { 
        name: 'Negro Mate / Verde', 
        value: '#2C3E50', 
        images: [
          'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600'
        ] 
      },
      { 
        name: 'Gris Grafito / Rojo', 
        value: '#7F8C8D', 
        images: [
          'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&q=80&w=600'
        ] 
      }
    ],
    inStock: true,
    featured: false,
    rating: 4.6,
    reviewsCount: 19
  },
  {
    id: 'solaria-grand',
    name: 'Solaria Grand',
    price: 230,
    originalPrice: 320,
    category: 'Sol',
    description: 'Gafas de sol de gran tamaño con elegantes bordes biselados y patillas metálicas ultradelgadas. Un tributo atemporal al glamour clásico italiano de la Riviera de los años 60.',
    details: [
      'Acetato italiano esculpido de 6mm de grosor con patillas grabadas con láser',
      'Protección total UV400 categoría 3 contra deslumbramientos solares intensos'
    ],
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&q=80&w=600'
    ],
    colors: [
      { 
        name: 'Carey Havanna', 
        value: '#4A3B32', 
        images: [
          'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600'
        ] 
      },
      { 
        name: 'Negro Profundo / Degradado', 
        value: '#1C1C1C', 
        images: [
          'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&q=80&w=600'
        ] 
      }
    ],
    inStock: true,
    featured: true,
    rating: 4.9,
    reviewsCount: 53
  },
  {
    id: 'helvetica-pure',
    name: 'Helvetica Pure',
    price: 175,
    originalPrice: 250,
    category: 'Ópticos',
    description: 'Montura óptica ultraligera fabricada con hilos de titanio quirúrgico de alta flexibilidad. Un perfil minimalista absoluto, ideal para mentes creativas y dinámicas.',
    details: [
      'Titanio aeroespacial japonés con memoria de forma y peso inferior a 9 gramos',
      'Diseño sin tornillos de alta ingeniería con plaquetas de silicona médica ultra-suaves'
    ],
    image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&q=80&w=600'
    ],
    colors: [
      { 
        name: 'Plata Cepillada', 
        value: '#A5A9B4', 
        images: [
          'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=600'
        ] 
      },
      { 
        name: 'Negro Satinado', 
        value: '#282C35', 
        images: [
          'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&q=80&w=600'
        ] 
      },
      { 
        name: 'Oro Rosa Minimal', 
        value: '#B76E79', 
        images: [
          'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&q=80&w=600'
        ] 
      }
    ],
    inStock: true,
    featured: false,
    rating: 4.8,
    reviewsCount: 31
  },
  {
    id: 'atlas-retro',
    name: 'Atlas Aviator',
    price: 205,
    originalPrice: 285,
    category: 'Vintage',
    description: 'Gafas vintage estilo aviador con lentes degradados en tono ámbar y montura de doble puente chapada en oro de baja saturación. Un clásico que redefine la actitud ejecutiva.',
    details: [
      'Montura de doble puente clásico en aleación ligera dorada con terminales de acetato',
      'Lentes polarizados con filtro antirreflejante y protección total UV400'
    ],
    image: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600'
    ],
    colors: [
      { 
        name: 'Oro Mate / Ámbar', 
        value: '#CFB53B', 
        images: [
          'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&q=80&w=600'
        ] 
      },
      { 
        name: 'Negro Gunmetal', 
        value: '#555555', 
        images: [
          'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600'
        ] 
      }
    ],
    inStock: false,
    featured: false,
    rating: 4.5,
    reviewsCount: 15
  },
  {
    id: 'chronos-sport',
    name: 'Chronos Pro Sport',
    price: 215,
    originalPrice: 310,
    category: 'Deportivos',
    description: 'Lentes deportivos ergonómicos con montura envolvente de compuesto de fibra de carbono. Lentes dinámicos fotocromáticos que se adaptan instantáneamente a la luz del sol.',
    details: [
      'Estructura inyectada reforzada con nano-partículas de carbono y ventilación anti-vaho',
      'Lentes fotocromáticos y polarizados de última generación con protección 100% UV'
    ],
    image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600'
    ],
    colors: [
      { 
        name: 'Carbono Mate / Amarillo', 
        value: '#1C1C1C', 
        images: [
          'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&q=80&w=600'
        ] 
      },
      { 
        name: 'Azul Eléctrico Active', 
        value: '#1A5F7A', 
        images: [
          'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600'
        ] 
      }
    ],
    inStock: true,
    featured: false,
    rating: 4.7,
    reviewsCount: 28
  }
];

export const TESTIMONIALS = [
  {
    id: 't1',
    user: 'Valeria Mendoza',
    role: 'Directora de Arte',
    comment: 'La calidad del acetato y la sutileza de los marcos es increíble. Compré los Nox Minimal y superaron mis expectativas de diseño. La presentación de la caja y el estuche es de otro nivel.',
    rating: 5,
    date: '14 de Agosto, 2026'
  },
  {
    id: 't2',
    user: 'Santiago de Alborán',
    role: 'Fotógrafo de Moda',
    comment: 'Los Aurelia Vintage tienen ese look setentero perfecto sin sentirse pesados. El recubrimiento interno antireflejo es fantástico para disparos al aire libre. Repetiré seguro.',
    rating: 5,
    date: '02 de Julio, 2026'
  },
  {
    id: 't3',
    user: 'Clara Domínguez',
    role: 'Diseñadora de Experiencias',
    comment: 'Los Helvetica Pure son ridículamente ligeros. A veces olvido que los llevo puestos. Su servicio al cliente me ayudó de manera súper rápida a entender las medidas de las monturas.',
    rating: 5,
    date: '28 de Mayo, 2026'
  }
];
