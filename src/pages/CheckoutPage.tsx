import { ArrowLeft, ArrowRight } from 'lucide-react'
import { DeliveryForm } from '../components/DeliveryForm'
import { OrderSummary } from '../components/OrderSummary'
import { OrderTypeSelector } from '../components/OrderTypeSelector'
import { TableOrderForm } from '../components/TableOrderForm'
import type {
  BusinessConfig,
  CartItem,
  CustomerInfo,
  CustomerLocation,
  OrderType,
} from '../types'
import { formatCurrency } from '../utils/currency'

export type CheckoutErrors = Partial<Record<keyof CustomerInfo | 'tableNumber', string>>

interface CheckoutPageProps {
  business: BusinessConfig
  items: CartItem[]
  orderType: OrderType
  tableNumber: string
  customerInfo: CustomerInfo
  location: CustomerLocation | null
  locationMessage: string
  isLocating: boolean
  subtotal: number
  deliveryFee: number
  total: number
  errors: CheckoutErrors
  onBack: () => void
  onOrderTypeChange: (orderType: OrderType) => void
  onTableChange: (tableNumber: string) => void
  onCustomerChange: (field: keyof CustomerInfo, value: string) => void
  onLocate: () => void
  onReview: () => void
}

export function CheckoutPage({
  business,
  items,
  orderType,
  tableNumber,
  customerInfo,
  location,
  locationMessage,
  isLocating,
  subtotal,
  deliveryFee,
  total,
  errors,
  onBack,
  onOrderTypeChange,
  onTableChange,
  onCustomerChange,
  onLocate,
  onReview,
}: CheckoutPageProps) {
  return (
    <main className="content-wrap grid gap-5 pb-12 pt-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-5">
        <button type="button" className="secondary-button" onClick={onBack}>
          <ArrowLeft size={17} aria-hidden="true" />
          Volver al menu
        </button>

        <OrderTypeSelector
          orderType={orderType}
          tableNumber={tableNumber}
          onChange={onOrderTypeChange}
        />

        {orderType === 'table' ? (
          <TableOrderForm
            tableNumber={tableNumber}
            error={errors.tableNumber}
            onChange={onTableChange}
          />
        ) : (
          <DeliveryForm
            mode={orderType}
            customerInfo={customerInfo}
            errors={errors}
            business={business}
            isLocating={isLocating}
            location={location}
            locationMessage={locationMessage}
            onChange={onCustomerChange}
            onLocate={onLocate}
          />
        )}

        
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <OrderSummary
          items={items}
          orderType={orderType}
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          total={total}
        />
        <button
          type="button"
          className="primary-button w-full sm:w-auto mt-3"
          onClick={onReview}
          disabled={items.length === 0}
          data-testid="review-order"
        >
          Confirmar orden
          <ArrowRight size={17} aria-hidden="true" />
        </button>
        <p className="mt-3 rounded-lg bg-paper px-4 py-3 text-sm font-medium leading-6 text-brand-700/75 shadow-sm">
          Total estimado: <strong>{formatCurrency(total)}</strong>. El negocio
          confirmara disponibilidad por WhatsApp.
        </p>
      </aside>
    </main>
  )
}
