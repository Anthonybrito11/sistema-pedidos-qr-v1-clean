import { createContext } from 'react'
import type { CartItem, Product } from '../types'

export interface CartContextValue {
  items: CartItem[]
  cartCount: number
  subtotal: number
  addItem: (product: Product) => void
  updateQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clearCart: () => void
  getItemQuantity: (productId: string) => number
}

export const CartContext = createContext<CartContextValue | null>(null)
