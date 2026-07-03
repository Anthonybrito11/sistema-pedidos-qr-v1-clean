import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { CartItem, Product } from '../types'
import { getCartCount, getSubtotal } from '../utils/order'
import { CartContext } from './cartContext'

const STORAGE_KEY = 'qr-orders-cart-v1'

function readStoredCart() {
  try {
    const rawCart = window.localStorage.getItem(STORAGE_KEY)
    return rawCart ? (JSON.parse(rawCart) as CartItem[]) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readStoredCart)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = useCallback((product: Product) => {
    if (!product.available) {
      return
    }

    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.productId === product.id)

      if (existingItem) {
        return currentItems.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }

      return [
        ...currentItems,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
        },
      ]
    })
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((currentItems) => {
      if (quantity <= 0) {
        return currentItems.filter((item) => item.productId !== productId)
      }

      return currentItems.map((item) =>
        item.productId === productId ? { ...item, quantity } : item,
      )
    })
  }, [])

  const removeItem = useCallback((productId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.productId !== productId),
    )
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const getItemQuantity = useCallback(
    (productId: string) => {
      return items.find((item) => item.productId === productId)?.quantity ?? 0
    },
    [items],
  )

  const value = useMemo(
    () => ({
      items,
      cartCount: getCartCount(items),
      subtotal: getSubtotal(items),
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      getItemQuantity,
    }),
    [addItem, clearCart, getItemQuantity, items, removeItem, updateQuantity],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
