import { Category } from '../types';

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'sol',
    name: 'Sol',
    subcategories: [
      { id: 'sol-aviador', name: 'Aviador' },
      { id: 'sol-cuadrado', name: 'Cuadrado' },
      { id: 'sol-elegante', name: 'Elegante' }
    ]
  },
  {
    id: 'opticos',
    name: 'Ópticos',
    subcategories: [
      { id: 'opticos-redondo', name: 'Redondo' },
      { id: 'opticos-pantallas', name: 'Filtro Luz Azul' }
    ]
  },
  {
    id: 'deportivos',
    name: 'Deportivos',
    subcategories: [
      { id: 'deportivos-polarizado', name: 'Polarizado' },
      { id: 'deportivos-alto-rendimiento', name: 'Alto Rendimiento' }
    ]
  },
  {
    id: 'vintage',
    name: 'Vintage',
    subcategories: [
      { id: 'vintage-retro', name: 'Retro 70s' },
      { id: 'vintage-clasico', name: 'Clásico Acetato' }
    ]
  }
];
