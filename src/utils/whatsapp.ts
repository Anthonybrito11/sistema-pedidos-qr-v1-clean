import type { BusinessConfig, OrderPayload } from '../types'
import { formatCurrency } from './currency'
import { getOrderTypeLabel, getPaymentMethodLabel } from './order'

export function buildWhatsAppMessage(order: OrderPayload, business: BusinessConfig) {
  const lines = [
    business.baseWhatsAppMessage || `Hola ${business.name}, quiero hacer este pedido:`,
    '',
  ]

  if (order.orderCode) {
    lines.push(`Codigo de orden: ${order.orderCode}`)
  }

  lines.push(`Modalidad: ${getOrderTypeLabel(order.orderType)}`)

  if (order.orderType === 'table') {
    lines.push(`Mesa: ${order.tableNumber}`)
  }

  if (order.orderType === 'delivery' || order.orderType === 'pickup') {
    lines.push(`Nombre: ${order.customerInfo.name}`)
    lines.push(`Telefono: ${order.customerInfo.phone || 'No indicado'}`)
    lines.push(`Pago: ${getPaymentMethodLabel(order.customerInfo.paymentMethod)}`)
  }

  if (order.orderType === 'delivery') {
    lines.push(`Direccion: ${order.customerInfo.address}`)

    if (order.customerInfo.reference) {
      lines.push(`Referencia: ${order.customerInfo.reference}`)
    }

    if (order.location) {
      lines.push(`Ubicacion: ${order.location.mapsUrl}`)
    }
  }

  lines.push('')
  lines.push('Productos:')

  order.items.forEach((item) => {
    lines.push(
      `- ${item.quantity}x ${item.name} - ${formatCurrency(item.price)} c/u (${formatCurrency(item.price * item.quantity)})`,
    )
  })

  lines.push('')
  lines.push(`Subtotal: ${formatCurrency(order.subtotal)}`)

  if (order.deliveryFee > 0) {
    lines.push(`Delivery: ${formatCurrency(order.deliveryFee)}`)
  }

  lines.push(`Total: ${formatCurrency(order.total)}`)
  lines.push('')
  lines.push('Quedo atento/a a la confirmacion por WhatsApp.')

  return lines.join('\n')
}

export function buildWhatsAppUrl(
  order: OrderPayload,
  business: BusinessConfig,
) {
  const message = buildWhatsAppMessage(order, business)
  return `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(message)}`
}
