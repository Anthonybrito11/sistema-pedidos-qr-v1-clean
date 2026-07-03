import { Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ImageUpload } from '../../components/admin/ImageUpload'
import { getAdminBusinessSettings, upsertBusinessSettings } from '../../services/businessService'
import type { PaymentMethod } from '../../types'
import type { BusinessSettingsFormValues } from '../../types/supabase'

const defaultForm: BusinessSettingsFormValues = {
  business_name: '',
  slug: '',
  logo_url: '',
  banner_url: '',
  whatsapp_number: '',
  address: '',
  description: '',
  opening_hours: '',
  payment_methods: [
    { id: 'cash', label: 'Efectivo' },
    { id: 'card', label: 'Tarjeta al recibir' },
    { id: 'transfer', label: 'Transferencia' },
  ],
  base_whatsapp_message: '',
  delivery_enabled: true,
  delivery_cost: 0,
  currency: 'DOP',
  is_active: true,
}

export function AdminSettings() {
  const [form, setForm] = useState<BusinessSettingsFormValues>(defaultForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    getAdminBusinessSettings()
      .then((settings) => {
        if (!settings) {
          return
        }

        setForm({
          business_name: settings.business_name,
          slug: settings.slug || '',
          logo_url: settings.logo_url || '',
          banner_url: settings.banner_url || '',
          whatsapp_number: settings.whatsapp_number,
          address: settings.address || '',
          description: settings.description || '',
          opening_hours: settings.opening_hours ? JSON.stringify(settings.opening_hours, null, 2) : '',
          payment_methods: settings.payment_methods || defaultForm.payment_methods,
          base_whatsapp_message: settings.base_whatsapp_message || '',
          delivery_enabled: settings.delivery_enabled,
          delivery_cost: Number(settings.delivery_cost),
          currency: settings.currency,
          is_active: settings.is_active,
        })
      })
      .catch((currentError: unknown) => {
        setError(currentError instanceof Error ? currentError.message : 'No se pudo cargar configuracion.')
      })
      .finally(() => setLoading(false))
  }, [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')
    try {
      await upsertBusinessSettings(form)
      setMessage('Configuracion guardada.')
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : 'No se pudo guardar.')
    } finally {
      setSaving(false)
    }
  }

  function togglePaymentMethod(id: PaymentMethod) {
    const exists = form.payment_methods.some((method) => method.id === id)
    const labelMap: Record<PaymentMethod, string> = {
      cash: 'Efectivo',
      card: 'Tarjeta al recibir',
      transfer: 'Transferencia',
    }
    setForm({
      ...form,
      payment_methods: exists
        ? form.payment_methods.filter((method) => method.id !== id)
        : [...form.payment_methods, { id, label: labelMap[id] }],
    })
  }

  if (loading) {
    return <p className="text-sm text-slate-500">Cargando configuracion...</p>
  }

  return (
    <form className="max-w-4xl space-y-6" onSubmit={(event) => void handleSubmit(event)}>
      <div>
        <p className="text-sm font-bold text-brand-700">Negocio</p>
        <h1 className="text-3xl font-black">Configuracion</h1>
      </div>
      {message ? <p className="rounded-lg bg-brand-50 p-3 text-sm font-semibold text-brand-700">{message}</p> : null}
      {error ? <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
      <section className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4">
        <Field label="Nombre del negocio" value={form.business_name} onChange={(value) => setForm({ ...form, business_name: value })} required />
        <Field label="Slug" value={form.slug} onChange={(value) => setForm({ ...form, slug: value })} />
        <Field label="WhatsApp receptor" value={form.whatsapp_number} onChange={(value) => setForm({ ...form, whatsapp_number: value })} required />
        <Field label="Direccion" value={form.address} onChange={(value) => setForm({ ...form, address: value })} />
        <Field label="Descripcion/tagline" value={form.description} onChange={(value) => setForm({ ...form, description: value })} />
        <ImageUpload label="Logo" folder="business" value={form.logo_url} onChange={(value) => setForm({ ...form, logo_url: value })} />
        <ImageUpload label="Banner" folder="business" value={form.banner_url} onChange={(value) => setForm({ ...form, banner_url: value })} />
        <div>
          <label className="field-label">Mensaje base de WhatsApp</label>
          <textarea className="field-input mt-2 min-h-28" value={form.base_whatsapp_message} onChange={(event) => setForm({ ...form, base_whatsapp_message: event.target.value })} />
        </div>
        <div>
          <label className="field-label">Horarios JSON o texto</label>
          <textarea className="field-input mt-2 min-h-28 font-mono" value={form.opening_hours} onChange={(event) => setForm({ ...form, opening_hours: event.target.value })} />
        </div>
      </section>
      <section className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-2">
        <Field label="Moneda" value={form.currency} onChange={(value) => setForm({ ...form, currency: value })} />
        <Field label="Costo delivery" type="number" value={String(form.delivery_cost)} onChange={(value) => setForm({ ...form, delivery_cost: Number(value) })} />
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
          <input type="checkbox" checked={form.delivery_enabled} onChange={(event) => setForm({ ...form, delivery_enabled: event.target.checked })} />
          Delivery activo
        </label>
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
          <input type="checkbox" checked={form.is_active} onChange={(event) => setForm({ ...form, is_active: event.target.checked })} />
          Negocio activo
        </label>
        <div className="sm:col-span-2">
          <p className="field-label">Metodos de pago</p>
          <div className="mt-2 flex flex-wrap gap-3">
            {(['cash', 'card', 'transfer'] as PaymentMethod[]).map((method) => (
              <label key={method} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold">
                <input type="checkbox" checked={form.payment_methods.some((item) => item.id === method)} onChange={() => togglePaymentMethod(method)} />
                {method}
              </label>
            ))}
          </div>
        </div>
      </section>
      <button type="submit" className="primary-button" disabled={saving}>
        <Save size={17} aria-hidden="true" />
        {saving ? 'Guardando...' : 'Guardar configuracion'}
      </button>
    </form>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  required?: boolean
}) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <input className="field-input mt-2" value={value} type={type} onChange={(event) => onChange(event.target.value)} required={required} />
    </div>
  )
}
