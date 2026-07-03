import { LocateFixed } from 'lucide-react'
import type {
  BusinessConfig,
  CustomerInfo,
  CustomerLocation,
  PaymentMethod,
} from '../types'

interface DeliveryFormProps {
  mode: 'delivery' | 'pickup'
  customerInfo: CustomerInfo
  errors: Partial<Record<keyof CustomerInfo, string>>
  business: BusinessConfig
  isLocating: boolean
  location: CustomerLocation | null
  locationMessage: string
  onChange: (field: keyof CustomerInfo, value: string) => void
  onLocate: () => void
}

export function DeliveryForm({
  mode,
  customerInfo,
  errors,
  business,
  isLocating,
  location,
  locationMessage,
  onChange,
  onLocate,
}: DeliveryFormProps) {
  const needsAddress = mode === 'delivery'

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div>
        <p className="text-sm font-semibold text-brand-700">
          {needsAddress ? 'Datos delivery' : 'Datos pickup'}
        </p>
        <h2 className="mt-1 text-xl font-black text-slate-950">
          {needsAddress ? 'Datos para entregar' : 'Datos para recoger'}
        </h2>
      </div>

      <div className="mt-4 grid gap-4">
        <Field
          id="customer-name"
          label="Nombre"
          value={customerInfo.name}
          onChange={(value) => onChange('name', value)}
          error={errors.name}
          placeholder="Tu nombre"
        />

        <Field
          id="customer-phone"
          label={needsAddress ? 'Telefono' : 'Telefono (opcional)'}
          value={customerInfo.phone}
          onChange={(value) => onChange('phone', value)}
          error={errors.phone}
          placeholder="809-000-0000"
          inputMode="tel"
        />

        {needsAddress ? (
          <>
            <Field
              id="customer-address"
              label="Direccion"
              value={customerInfo.address}
              onChange={(value) => onChange('address', value)}
              error={errors.address}
              placeholder="Calle, sector, edificio o casa"
            />

            <Field
              id="customer-reference"
              label="Referencia"
              value={customerInfo.reference}
              onChange={(value) => onChange('reference', value)}
              error={errors.reference}
              placeholder="Ej. porton negro, frente a farmacia"
            />

            <div>
              <button
                type="button"
                className="secondary-button w-full"
                onClick={onLocate}
                disabled={isLocating}
              >
                <LocateFixed size={17} aria-hidden="true" />
                {isLocating ? 'Buscando ubicacion...' : 'Usar ubicacion actual'}
              </button>
              {location ? (
                <a
                  href={location.mapsUrl}
                  className="mt-2 inline-flex text-sm font-semibold text-brand-700"
                  target="_blank"
                  rel="noreferrer"
                >
                  Ver ubicacion capturada
                </a>
              ) : null}
              {locationMessage ? (
                <p className="mt-2 text-sm leading-5 text-slate-600">{locationMessage}</p>
              ) : null}
            </div>
          </>
        ) : null}

        <div>
          <label className="field-label" htmlFor="payment-method">
            Metodo de pago
          </label>
          <select
            id="payment-method"
            className="field-input mt-2"
            value={customerInfo.paymentMethod}
            onChange={(event) =>
              onChange('paymentMethod', event.target.value as PaymentMethod)
            }
          >
            {business.paymentMethods.map((method) => (
              <option key={method.id} value={method.id}>
                {method.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

interface FieldProps {
  id: string
  label: string
  value: string
  error?: string
  placeholder: string
  inputMode?: 'text' | 'tel' | 'numeric'
  onChange: (value: string) => void
}

function Field({
  id,
  label,
  value,
  error,
  placeholder,
  inputMode = 'text',
  onChange,
}: FieldProps) {
  return (
    <div>
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className="field-input mt-2"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
      />
      {error ? <p className="mt-2 text-sm font-semibold text-red-600">{error}</p> : null}
    </div>
  )
}
