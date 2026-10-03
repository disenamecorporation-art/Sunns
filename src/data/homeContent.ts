/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface HomeContent {
  // Hero Section
  heroEditorialTag: string;
  heroFloatingTitle1: string;
  heroFloatingTitle2: string;
  heroFloatingSubtitle: string;
  heroBottomSeason: string;
  heroBottomTitle: string;
  heroBottomDescription: string;
  heroCtaText: string;
  heroPillar1Title: string;
  heroPillar1Desc: string;
  heroPillar2Title: string;
  heroPillar2Desc: string;
  heroPillar3Title: string;
  heroPillar3Desc: string;
  heroPillar4Title: string;
  heroPillar4Desc: string;

  // New Arrivals Section
  arrivalsTag: string;
  arrivalsTitle: string;
  arrivalsDescription: string;

  // Featured Categories Section
  categoriesTag: string;
  categoriesTitle: string;
  categoriesSubtitle: string;

  // Concierge / Brand Contact Section
  conciergeTag: string;
  conciergeTitle: string;
  conciergeSubtitle: string;
  conciergeDescription: string;

  // Testimonials Section
  testimonialsTag: string;
  testimonialsTitle: string;

  // Footer Section
  footerBrandDescription: string;
  footerNewsletterTag: string;
  footerNewsletterDescription: string;
  footerPhone: string;
  footerEmail: string;
  footerAddress: string;
  footerCopyright: string;
}

export const DEFAULT_HOME_CONTENT: HomeContent = {
  // Hero Section
  heroEditorialTag: 'NUEVA COLECCIÓN',
  heroFloatingTitle1: 'MIRA EL MUNDO',
  heroFloatingTitle2: 'A TRAVÉS DEL ESTILO',
  heroFloatingSubtitle: 'ALTA ÓPTICA DE AUTOR',
  heroBottomSeason: 'ALTA ÓPTICA 2026',
  heroBottomTitle: 'Diseño puro.\nMirada eterna.',
  heroBottomDescription: 'Lentes esculpidos artesanalmente en finos acetatos y metales puros para quienes habitan el estilo.',
  heroCtaText: 'Descubrir Colección',
  heroPillar1Title: 'Protección UV400',
  heroPillar1Desc: 'Bloqueo 100% rayos solares',
  heroPillar2Title: 'Calidad Premium',
  heroPillar2Desc: 'Materiales de alta gama',
  heroPillar3Title: 'Diseño Atemporal',
  heroPillar3Desc: 'Siluetas que perduran',
  heroPillar4Title: 'Devolución Fácil',
  heroPillar4Desc: '30 días de garantía',

  // New Arrivals Section
  arrivalsTag: 'LANZAMIENTOS RECIENTES',
  arrivalsTitle: 'New Arrivals',
  arrivalsDescription: 'La última expresión de la artesanía Sunns. Perfiles tallados con precisión extrema y acabados con pulido de espejo.',

  // Featured Categories Section
  categoriesTag: 'COLECCIONES EXCLUSIVAS',
  categoriesTitle: 'Diseño adaptado a cada perspectiva',
  categoriesSubtitle: 'Explora nuestras monturas icónicas de acetato y aleaciones ligeras.',

  // Concierge / Brand Contact Section
  conciergeTag: 'ATENCIÓN CONCIERGE',
  conciergeTitle: 'Habita el estilo.',
  conciergeSubtitle: 'Conecta con Sunns.',
  conciergeDescription: '¿Tienes dudas sobre nuestra colección de lentes, necesitas asesoría de estilo personalizada o deseas realizar un pedido especial? Nuestro equipo de conserjería premium responderá tu solicitud de inmediato.',

  // Testimonials Section
  testimonialsTag: 'OPINIONES EDITORIALES',
  testimonialsTitle: 'La voz de quienes visten Sunns',

  // Footer Section
  footerBrandDescription: 'Artesanía atemporal y perfiles contemporáneos. Diseñamos lentes premium pulidos individualmente a mano con finos acetatos biodegradables para vestir cada mirada con distinción.',
  footerNewsletterTag: 'SUSCRÍBETE A NUESTRA NEWSLETTER',
  footerNewsletterDescription: 'Únete a nuestro club exclusivo. Recibe invitaciones a ventas privadas de stock limitado, lanzamientos editoriales y un 10% de descuento de cortesía en tu primera compra.',
  footerPhone: '+1 (786) 825-9355',
  footerEmail: 'Sunnsshop@icloud.com',
  footerAddress: 'Brickell Avenue, Miami, FL, USA',
  footerCopyright: 'Sunns Shop © 2026. Todos los derechos reservados. Diseñado bajo estándares de lujo sostenible en Miami.',
};
