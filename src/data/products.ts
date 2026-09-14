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
    category: 'Sol',
    description: 'Lentes de sol minimalistas de acetato italiano de alta densidad en tono negro absoluto. Un diseño contemporáneo esculpido a mano para quienes aprecian la sofisticación sin esfuerzo.',
    details: [
      'Protección 100% UVA/UVB (Filtro UV400)',
      'Acetato pulido a mano de origen orgánico mazzucchelli',
      'Bisagras alemanas de 5 barriles de alta durabilidad',
      'Lentes polarizados de nailon de máxima nitidez óptica',
      'Estuche de cuero marrón Sunns y paño de microfibra de alta calidad'
    ],
    image: '/src/assets/images/glasses_sun_minimal_1787327499742.jpg',
    images: [
      '/src/assets/images/glasses_sun_minimal_1787327499742.jpg',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600'
    ],
    colors: [
      { name: 'Negro Carbón', value: '#1A1A1A' },
      { name: 'Humo Translúcido', value: '#4E5154' },
      { name: 'Miel Calma', value: '#C68E5A' }
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
    category: 'Vintage',
    description: 'Lentes de sol retro de inspiración setentera con montura metálica dorada y lentes oscuros de alta definición. El equilibrio perfecto entre nostalgia sofisticada y elegancia moderna.',
    details: [
      'Protección 100% UVA/UVB (UV400)',
      'Estructura metálica de acero inoxidable con baño de oro de 18k sutil',
      'Plaquetas nasales de silicona hipoalergénicas y ajustables',
      'Lentes CR-39 con recubrimiento antirreflejante interno',
      'Estuche rígido de piel Sunns premium incluido'
    ],
    image: '/src/assets/images/glasses_sun_vintage_1787327472556.jpg',
    images: [
      '/src/assets/images/glasses_sun_vintage_1787327472556.jpg',
      'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&q=80&w=600'
    ],
    colors: [
      { name: 'Oro Pulido / Negro', value: '#D4AF37' },
      { name: 'Plata Noble / Azul', value: '#C0C0C0' },
      { name: 'Bronce Antiguo', value: '#CD7F32' }
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
    category: 'Ópticos',
    description: 'Gafas ópticas circulares elegantes con montura de acetato translúcido en tono champaña cálido. Comodidad excepcional de peso pluma y estilo intelectual contemporáneo.',
    details: [
      'Diseñado para cristales recetados de alta precisión',
      'Montura de acetato ultraligero y flexible de primera calidad',
      'Varillas reforzadas con alma de metal grabado para ajuste óptimo',
      'Filtro de luz azul sutil preinstalado para pantallas',
      'Incluye certificado de autenticidad, estuche protector y paño'
    ],
    image: '/src/assets/images/glasses_optical_classic_1787327485566.jpg',
    images: [
      '/src/assets/images/glasses_optical_classic_1787327485566.jpg',
      'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&q=80&w=600'
    ],
    colors: [
      { name: 'Champaña Translúcido', value: '#EEDC82' },
      { name: 'Cristal Claro', value: '#F0F8FF' },
      { name: 'Carey Ámbar', value: '#704214' }
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
    category: 'Deportivos',
    description: 'Lentes deportivos de alta resistencia con protección aerodinámica envolvente y lentes polarizados premium. Diseñados para un rendimiento óptimo al aire libre sin comprometer tu estilo de alta costura.',
    details: [
      'Protección 100% UVA/UVB contra rayos dañinos de alta intensidad',
      'Estructura de polímero TR90 ultraligero y resistente al sudor',
      'Zonas de contacto antideslizantes de caucho hidrófilo en nariz y varillas',
      'Lentes hidrofóbicos y oleofóbicos que repelen agua, polvo y grasa',
      'Carcasa deportiva rígida acolchada de protección extrema'
    ],
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&q=80&w=600'
    ],
    colors: [
      { name: 'Negro Mate / Verde', value: '#2C3E50' },
      { name: 'Gris Grafito / Rojo', value: '#7F8C8D' }
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
    category: 'Sol',
    description: 'Gafas de sol de gran tamaño con elegantes bordes biselados y patillas metálicas ultradelgadas. Un tributo atemporal al glamour clásico italiano de la Riviera de los años 60.',
    details: [
      'Protección total UV400 categoría de filtro 3',
      'Acetato esculpido con un grosor premium de 6mm en bordes',
      'Detalles metálicos grabados con láser y patillas de metal templado',
      'Estuche blando plegable de viaje en ecocuero de grano fino'
    ],
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&q=80&w=600'
    ],
    colors: [
      { name: 'Carey Havanna', value: '#4A3B32' },
      { name: 'Negro Profundo / Degradado', value: '#1C1C1C' }
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
    category: 'Ópticos',
    description: 'Montura óptica ultraligera fabricada con hilos de titanio quirúrgico de alta flexibilidad. Un perfil minimalista absoluto, ideal para mentes creativas y dinámicas.',
    details: [
      'Fabricado con titanio aeroespacial japonés de alta memoria de forma',
      'Peso inferior a 9 gramos (sin cristales)',
      'Diseño sin tornillos para una longevidad excepcional',
      'Plaquetas de silicona médica ultra-suaves',
      'Estuche Sunns ultra-delgado magnético de aluminio satinado'
    ],
    image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&q=80&w=600'
    ],
    colors: [
      { name: 'Plata Cepillada', value: '#A5A9B4' },
      { name: 'Negro Satinado', value: '#282C35' },
      { name: 'Oro Rosa Minimal', value: '#B76E79' }
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
    category: 'Vintage',
    description: 'Gafas vintage estilo aviador con lentes degradados en tono ámbar y montura de doble puente chapada en oro de baja saturación. Un clásico que redefine la actitud ejecutiva.',
    details: [
      'Protección UV400 y polarizado reductor de destellos',
      'Montura de doble puente clásico en aleación de níquel y cobre de alta gama',
      'Terminales de patilla de acetato pulido para comodidad en orejas',
      'Estuche icónico de cuero grabado premium con broche'
    ],
    image: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600'
    ],
    colors: [
      { name: 'Oro Mate / Ámbar', value: '#CFB53B' },
      { name: 'Negro Gunmetal', value: '#555555' }
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
    category: 'Deportivos',
    description: 'Lentes deportivos ergonómicos con montura envolvente de compuesto de fibra de carbono. Lentes dinámicos fotocromáticos que se adaptan instantáneamente a la luz del sol.',
    details: [
      'Lentes fotocromáticos y polarizados de última generación',
      'Estructura inyectada reforzada con nano-partículas de carbono',
      'Almohadillas de silicona hidrofílica adaptables a tres posiciones',
      'Ranuras de ventilación anti-vaho integradas',
      'Kit de estuche deportivo, cordón de seguridad y líquido de limpieza'
    ],
    image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600'
    ],
    colors: [
      { name: 'Carbono Mate / Amarillo', value: '#1C1C1C' },
      { name: 'Azul Eléctrico Active', value: '#1A5F7A' }
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
