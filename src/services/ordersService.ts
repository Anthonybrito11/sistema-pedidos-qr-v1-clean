import { supabase } from '../lib/supabaseClient'
import type { OrderPayload } from '../types'
import type { OrderStatus, OrderWithItems } from '../types/supabase'
import { getActiveBusinessSettings } from './businessService'

export function getOrdersCutoffDate(days = 31) {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)
  return cutoffDate
}

export function getOrdersDeleteRange(days = 30) {
  const endDate = new Date()
  endDate.setHours(0, 0, 0, 0)

  const startDate = new Date(endDate)
  startDate.setDate(startDate.getDate() - days)

  return { startDate, endDate }
}

export function generateOrderCode() {
  const now = new Date()
  const date = now.toISOString().slice(0, 10).replace(/-/g, '')
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `QR-${date}-${suffix}`
}

function generateOrderId() {
  if (crypto.randomUUID) {
    return crypto.randomUUID()
  }

  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (character) =>
    (
      Number(character) ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(character) / 4)))
    ).toString(16),
  )
}

export async function createOrder(order: OrderPayload) {
  if (!supabase) {
    throw new Error('Supabase no esta configurado.')
  }

  const business = await getActiveBusinessSettings()
  const orderId = generateOrderId()
  const orderCode = generateOrderCode()
  const customerName =
    order.customerInfo.name.trim() ||
    (order.orderType === 'table' ? `Mesa ${order.tableNumber}` : 'Cliente')

  const { error: orderError } = await supabase
    .from('orders')
    .insert({
      id: orderId,
      business_id: business?.id || null,
      order_code: orderCode,
      order_type: order.orderType,
      table_number: order.tableNumber || null,
      customer_name: customerName,
      customer_phone: order.customerInfo.phone || null,
      customer_address: order.customerInfo.address || null,
      customer_notes: order.customerInfo.reference || null,
      customer_location_url: order.location?.mapsUrl || null,
      payment_method: order.customerInfo.paymentMethod,
      subtotal: order.subtotal,
      delivery_cost: order.deliveryFee,
      total: order.total,
      status: 'pending_whatsapp',
      whatsapp_sent: false,
    })

  if (orderError) {
    throw orderError
  }

  const items = order.items.map((item) => ({
    order_id: orderId,
    product_id: isUuid(item.productId) ? item.productId : null,
    product_name: item.name,
    unit_price: item.price,
    quantity: item.quantity,
    line_total: item.price * item.quantity,
  }))

  const { error: itemsError } = await supabase.from('order_items').insert(items)

  if (itemsError) {
    throw itemsError
  }

  return {
    id: orderId,
    orderCode,
  }
}

export async function getAdminOrders(limit = 50): Promise<OrderWithItems[]> {
  if (!supabase) {
    throw new Error('Supabase no esta configurado.')
  }

  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    throw error
  }

  return data
}

export async function getOrdersForCsv(days = 31): Promise<OrderWithItems[]> {
  if (!supabase) {
    throw new Error('Supabase no esta configurado.')
  }

  const cutoffDate = getOrdersCutoffDate(days)
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .gte('created_at', cutoffDate.toISOString())
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data
}

export async function deleteRecentOrderHistory(days = 30) {
  if (!supabase) {
    throw new Error('Supabase no esta configurado.')
  }

  const { startDate, endDate } = getOrdersDeleteRange(days)
  const { data: orders, error: selectError } = await supabase
    .from('orders')
    .select('id')
    .gte('created_at', startDate.toISOString())
    .lt('created_at', endDate.toISOString())

  if (selectError) {
    throw selectError
  }

  const orderIds = orders.map((order) => order.id)

  if (orderIds.length === 0) {
    return {
      matchedCount: 0,
      deletedCount: 0,
    }
  }

  const { data: deletedOrders, error: deleteError } = await supabase
    .from('orders')
    .delete()
    .in('id', orderIds)
    .select('id')

  if (deleteError) {
    throw deleteError
  }

  return {
    matchedCount: orderIds.length,
    deletedCount: deletedOrders.length,
  }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  if (!supabase) {
    throw new Error('Supabase no esta configurado.')
  }

  const { error } = await supabase.from('orders').update({ status }).eq('id', orderId)

  if (error) {
    throw error
  }
}

export async function markOrderWhatsAppSent(orderId: string) {
  if (!supabase) {
    throw new Error('Supabase no esta configurado.')
  }

  const { error } = await supabase
    .from('orders')
    .update({ whatsapp_sent: true })
    .eq('id', orderId)

  if (error) {
    throw error
  }
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  )
}
