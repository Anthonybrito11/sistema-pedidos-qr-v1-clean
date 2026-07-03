import type { CartItem, OrderPayload, OrderType, PaymentMethod } from '../types'

export function getCartCount(items: CartItem[]) {
  return items.reduce((total, item) => total + item.quantity, 0)
}

export function getSubtotal(items: CartItem[]) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0)
}

export function getOrderTypeLabel(orderType: OrderType) {
  const labels: Record<OrderType, string> = {
    table: 'Mesa',
    delivery: 'Delivery',
    pickup: 'Pickup',
  }

  return labels[orderType]
}

export function getPaymentMethodLabel(paymentMethod: PaymentMethod) {
  const labels: Record<PaymentMethod, string> = {
    cash: 'Efectivo',
    card: 'Tarjeta al recibir',
    transfer: 'Transferencia',
  }

  return labels[paymentMethod]
}

export function createOrderPayload(
  payload: Omit<OrderPayload, 'deliveryFee' | 'total'>,
  configuredDeliveryFee: number,
): OrderPayload {
  const deliveryFee = payload.orderType === 'delivery' ? configuredDeliveryFee : 0

  return {
    ...payload,
    deliveryFee,
    total: payload.subtotal + deliveryFee,
  }
}
