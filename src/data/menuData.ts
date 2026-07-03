import type { Category, Product } from '../types'

export const categories: Category[] = [
  { id: 'all', name: 'Todos' },
  { id: 'coffee', name: 'Café' },
  { id: 'breakfast', name: 'Desayunos' },
  { id: 'lunch', name: 'Almuerzos' },
   { id: 'picaderas', name: 'Picaderas' },
  { id: 'desserts', name: 'Postres' },
 
]

export const products: Product[] = [
  {
    id: 'latte-vanilla',
    name: 'Latte de vainilla',
    description: 'Espresso suave con leche cremosa y vainilla.',
    price: 185,
    image:
      'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80',
    category: 'coffee',
    available: true,
    featured: true,
  },
  {
    id: 'americano',
    name: 'Cafe americano',
    description: 'Cafe negro caliente, balanceado y aromático.',
    price: 120,
    image:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80',
    category: 'coffee',
    available: true,
  },
  {
    id: 'cold-brew',
    name: 'Cold brew',
    description: 'Cafe frio de extraccion lenta con hielo.',
    price: 210,
    image:
      'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=80',
    category: 'coffee',
    available: true,
  },
  {
    id: 'croissant-ham',
    name: 'Croissant de jamon y queso',
    description: 'Croissant tostado con jamon, queso y mantequilla.',
    price: 240,
    image:
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80',
    category: 'breakfast',
    available: true,
  },
  {
    id: 'toast-avocado',
    name: 'Tostada de aguacate',
    description: 'Pan artesanal, aguacate, huevo y semillas.',
    price: 295,
    image:
      'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=900&q=80',
    category: 'breakfast',
    available: true,
  },
  {
    id: 'chicken-bowl',
    name: 'Bowl de pollo',
    description: 'Pollo a la plancha, arroz, vegetales y salsa de casa.',
    price: 390,
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80',
    category: 'lunch',
    available: true,
    featured: true,
  },
  {
    id: 'panini-caprese',
    name: 'Panini caprese',
    description: 'Mozzarella, tomate, albahaca y pesto.',
    price: 330,
    image:
      'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80',
    category: 'lunch',
    available: true,
  },
  {
    id: 'cheesecake',
    name: 'Cheesecake de frutos rojos',
    description: 'Porcion cremosa con coulis de frutos rojos.',
    price: 220,
    image:
      'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=80',
    category: 'desserts',
    available: true,
  },
]
