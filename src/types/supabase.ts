import type { BusinessConfig, Category, PaymentMethod, Product } from '../types'

export type OrderStatus =
  | 'pending_whatsapp'
  | 'confirmed'
  | 'preparing'
  | 'completed'
  | 'cancelled'

export type AdminUser = {
  id: string
  email: string | null
}

export type BusinessSettings = {
  id: string
  business_name: string
  slug: string | null
  logo_url: string | null
  banner_url: string | null
  whatsapp_number: string
  address: string | null
  description: string | null
  opening_hours: Record<string, unknown> | null
  payment_methods: Array<{ id: PaymentMethod; label: string }> | null
  base_whatsapp_message: string | null
  delivery_enabled: boolean
  delivery_cost: number
  currency: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export type DbCategory = {
  id: string
  business_id: string | null
  name: string
  slug: string | null
  description: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type DbProduct = {
  id: string
  business_id: string | null
  category_id: string | null
  name: string
  slug: string | null
  description: string | null
  price: number
  image_url: string | null
  is_available: boolean
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
  categories?: Pick<DbCategory, 'id' | 'name' | 'slug'> | null
}

export type Order = {
  id: string
  business_id: string | null
  order_code: string
  order_type: 'table' | 'delivery' | 'pickup'
  table_number: string | null
  customer_name: string
  customer_phone: string | null
  customer_address: string | null
  customer_notes: string | null
  customer_location_url: string | null
  payment_method: PaymentMethod
  subtotal: number
  delivery_cost: number
  total: number
  status: OrderStatus
  whatsapp_sent: boolean
  created_at: string
  updated_at: string
}

export type OrderItem = {
  id: string
  order_id: string
  product_id: string | null
  product_name: string
  unit_price: number
  quantity: number
  line_total: number
  created_at: string
}

export type OrderWithItems = Order & {
  order_items?: OrderItem[]
}

export type ProductFormValues = {
  name: string
  description: string
  price: number
  category_id: string | null
  image_url: string
  is_available: boolean
  is_active: boolean
  sort_order: number
}

export type CategoryFormValues = {
  name: string
  description: string
  sort_order: number
  is_active: boolean
}

export type BusinessSettingsFormValues = {
  business_name: string
  slug: string
  logo_url: string
  banner_url: string
  whatsapp_number: string
  address: string
  description: string
  opening_hours: string
  payment_methods: Array<{ id: PaymentMethod; label: string }>
  base_whatsapp_message: string
  delivery_enabled: boolean
  delivery_cost: number
  currency: string
  is_active: boolean
}

type RowMap = {
  business_settings: BusinessSettings
  categories: DbCategory
  products: DbProduct
  orders: Order
  order_items: OrderItem
}

type InsertMap = {
  business_settings: Partial<BusinessSettings> & Pick<BusinessSettings, 'business_name' | 'whatsapp_number'>
  categories: Partial<DbCategory> & Pick<DbCategory, 'name'>
  products: Partial<DbProduct> & Pick<DbProduct, 'name' | 'price'>
  orders: Partial<Order> & Pick<Order, 'order_code' | 'customer_name' | 'payment_method'>
  order_items: Partial<OrderItem> & Pick<OrderItem, 'order_id' | 'product_name' | 'unit_price' | 'quantity' | 'line_total'>
}

type UpdateMap = {
  [TableName in keyof RowMap]: Partial<RowMap[TableName]>
}

export interface Database {
  public: {
    Tables: {
      [TableName in keyof RowMap]: {
        Row: RowMap[TableName]
        Insert: InsertMap[TableName]
        Update: UpdateMap[TableName]
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export function mapBusinessSettingsToConfig(settings: BusinessSettings): BusinessConfig {
  return {
    name: settings.business_name,
    tagline: settings.description || 'Menu digital',
    whatsappNumber: settings.whatsapp_number,
    address: settings.address || '',
    currency: settings.currency === 'DOP' ? 'RD$' : settings.currency,
    deliveryFee: Number(settings.delivery_cost || 0),
    paymentMethods: settings.payment_methods?.length
      ? settings.payment_methods
      : [
          { id: 'cash', label: 'Efectivo' },
          { id: 'card', label: 'Tarjeta al recibir' },
          { id: 'transfer', label: 'Transferencia' },
        ],
    logoUrl: settings.logo_url || undefined,
    bannerUrl: settings.banner_url || undefined,
    baseWhatsAppMessage: settings.base_whatsapp_message || undefined,
    deliveryEnabled: settings.delivery_enabled,
  }
}

export function mapDbCategoryToCategory(category: DbCategory): Category {
  return {
    id: category.id,
    name: category.name,
    description: category.description || '',
    sortOrder: category.sort_order,
    active: category.is_active,
  }
}

export function mapDbProductToProduct(product: DbProduct): Product {
  return {
    id: product.id,
    name: product.name,
    description: product.description || '',
    price: Number(product.price),
    image: product.image_url || '',
    category: product.category_id || '',
    available: product.is_available,
    featured: false,
    sortOrder: product.sort_order,
    active: product.is_active,
  }
}
