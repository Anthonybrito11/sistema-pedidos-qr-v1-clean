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
const MAX_QUANTITY = 99

function normalizeQuantity(value: unknown) {
  const quantity = Number(value)

  if (!Number.isFinite(quantity) || quantity <= 0) {
    return 0
  }

  return Math.min(Math.floor(quantity), MAX_QUANTITY)
}

function readStoredCart() {
  try {
    const rawCart = window.localStorage.getItem(STORAGE_KEY)
    const parsedCart = rawCart ? (JSON.parse(rawCart) as unknown) : []

    if (!Array.isArray(parsedCart)) {
      return []
    }

    return parsedCart.reduce<CartItem[]>((validItems, item) => {
      if (!item || typeof item !== 'object') {
        return validItems
      }

      const currentItem = item as Partial<CartItem>
      const quantity = normalizeQuantity(currentItem.quantity)

      if (
        !currentItem.productId ||
        !currentItem.name ||
        typeof currentItem.price !== 'number' ||
        !Number.isFinite(currentItem.price) ||
        currentItem.price < 0 ||
        quantity === 0
      ) {
        return validItems
      }

      validItems.push({
        productId: currentItem.productId,
        name: currentItem.name,
        price: currentItem.price,
        image: currentItem.image || '',
        quantity,
      })

      return validItems
    }, [])
  } catch {
    return []
  }
}

function areCartItemsEqual(left: CartItem[], right: CartItem[]) {
  return JSON.stringify(left) === JSON.stringify(right)
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
      const nextQuantity = normalizeQuantity(quantity)

      if (nextQuantity === 0) {
        return currentItems.filter((item) => item.productId !== productId)
      }

      return currentItems.map((item) =>
        item.productId === productId ? { ...item, quantity: nextQuantity } : item,
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

  const syncCartWithProducts = useCallback((products: Product[]) => {
    const productById = new Map(
      products
        .filter((product) => product.available)
        .map((product) => [product.id, product]),
    )

    setItems((currentItems) => {
      const nextItems = currentItems.reduce<CartItem[]>((validItems, item) => {
        const product = productById.get(item.productId)
        const quantity = normalizeQuantity(item.quantity)

        if (!product || quantity === 0) {
          return validItems
        }

        validItems.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
        })

        return validItems
      }, [])

      return areCartItemsEqual(currentItems, nextItems) ? currentItems : nextItems
    })
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
      syncCartWithProducts,
      getItemQuantity,
    }),
    [
      addItem,
      clearCart,
      getItemQuantity,
      items,
      removeItem,
      syncCartWithProducts,
      updateQuantity,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
