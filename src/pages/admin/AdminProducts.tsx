import { Edit3, Plus, ToggleLeft, ToggleRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ImageUpload } from '../../components/admin/ImageUpload'
import { getAdminCategories } from '../../services/categoriesService'
import {
  createProduct,
  getAdminProducts,
  setProductActive,
  setProductAvailability,
  updateProduct,
} from '../../services/productsService'
import type { DbCategory, DbProduct, ProductFormValues } from '../../types/supabase'
import { formatCurrency } from '../../utils/currency'
import { fallbackImageSrc, handleImageFallback } from '../../utils/images'

const emptyForm: ProductFormValues = {
  name: '',
  description: '',
  price: 0,
  category_id: null,
  image_url: '',
  is_available: true,
  is_active: true,
  sort_order: 0,
}

export function AdminProducts() {
  const [products, setProducts] = useState<DbProduct[]>([])
  const [categories, setCategories] = useState<DbCategory[]>([])
  const [editing, setEditing] = useState<DbProduct | null>(null)
  const [form, setForm] = useState<ProductFormValues>(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function loadData() {
    setLoading(true)
    setError('')
    try {
      const [nextProducts, nextCategories] = await Promise.all([
        getAdminProducts(),
        getAdminCategories(),
      ])
      setProducts(nextProducts)
      setCategories(nextCategories)
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : 'No se pudieron cargar productos.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [])

  function editProduct(product: DbProduct) {
    setEditing(product)
    setForm({
      name: product.name,
      description: product.description || '',
      price: Number(product.price),
      category_id: product.category_id,
      image_url: product.image_url || '',
      is_available: product.is_available,
      is_active: product.is_active,
      sort_order: product.sort_order,
    })
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!form.name.trim()) {
      setError('El nombre es requerido.')
      return
    }
    if (Number.isNaN(form.price) || form.price < 0) {
      setError('El precio debe ser mayor o igual a 0.')
      return
    }

    setSaving(true)
    setError('')
    try {
      if (editing) {
        await updateProduct(editing.id, form)
      } else {
        await createProduct(form)
      }
      setForm(emptyForm)
      setEditing(null)
      await loadData()
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : 'No se pudo guardar.')
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(product: DbProduct) {
    if (!window.confirm(`${product.is_active ? 'Desactivar' : 'Activar'} ${product.name}?`)) {
      return
    }
    await setProductActive(product.id, !product.is_active)
    await loadData()
  }

  async function toggleAvailable(product: DbProduct) {
    await setProductAvailability(product.id, !product.is_available)
    await loadData()
  }

  return (
    <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_420px]">
      <section>
        <div className="mb-4">
          <p className="text-sm font-bold text-brand-700">Menu</p>
          <h1 className="text-3xl font-black">Productos</h1>
        </div>
        {error ? <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          {loading ? <p className="p-4 text-sm text-slate-500">Cargando...</p> : null}
          {products.map((product) => (
            <div key={product.id} className="grid gap-3 border-b border-slate-100 p-4 last:border-b-0 lg:grid-cols-[72px_1fr_120px_210px]">
              <img
                src={product.image_url || fallbackImageSrc}
                alt=""
                className="h-16 w-16 rounded-lg object-cover"
                onError={handleImageFallback}
              />
              <div>
                <p className="font-black">{product.name}</p>
                <p className="line-clamp-2 text-sm text-slate-500">{product.description || 'Sin descripcion'}</p>
                <p className="mt-1 text-xs font-bold text-slate-500">{product.categories?.name || 'Sin categoria'}</p>
              </div>
              <p className="font-black">{formatCurrency(Number(product.price))}</p>
              <div className="flex flex-wrap gap-2 lg:justify-end">
                <button type="button" className="secondary-button min-h-10 px-3 py-2 text-xs" onClick={() => void toggleAvailable(product)}>
                  {product.is_available ? 'Disponible' : 'Agotado'}
                </button>
                <button type="button" className="icon-button" onClick={() => editProduct(product)} title="Editar">
                  <Edit3 size={17} aria-hidden="true" />
                </button>
                <button type="button" className="icon-button" onClick={() => void toggleActive(product)} title="Cambiar estado">
                  {product.is_active ? <ToggleRight size={20} aria-hidden="true" /> : <ToggleLeft size={20} aria-hidden="true" />}
                </button>
              </div>
            </div>
          ))}
          {!loading && products.length === 0 ? <p className="p-4 text-sm text-slate-500">No hay productos.</p> : null}
        </div>
      </section>

      <form className="rounded-lg border border-slate-200 bg-white p-4" onSubmit={(event) => void handleSubmit(event)}>
        <h2 className="text-xl font-black">{editing ? 'Editar producto' : 'Nuevo producto'}</h2>
        <div className="mt-4 grid gap-4">
          <Field label="Nombre" value={form.name} onChange={(value) => setForm({ ...form, name: value })} required />
          <Field label="Descripcion" value={form.description} onChange={(value) => setForm({ ...form, description: value })} />
          <Field label="Precio" type="number" value={String(form.price)} onChange={(value) => setForm({ ...form, price: Number(value) })} required />
          <div>
            <label className="field-label">Categoria</label>
            <select
              className="field-input mt-2"
              value={form.category_id || ''}
              onChange={(event) => setForm({ ...form, category_id: event.target.value || null })}
            >
              <option value="">Sin categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <ImageUpload label="Imagen" value={form.image_url} onChange={(value) => setForm({ ...form, image_url: value })} />
          <Field label="Orden" type="number" value={String(form.sort_order)} onChange={(value) => setForm({ ...form, sort_order: Number(value) })} />
          <div className="grid gap-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
              <input type="checkbox" checked={form.is_available} onChange={(event) => setForm({ ...form, is_available: event.target.checked })} />
              Disponible
            </label>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
              <input type="checkbox" checked={form.is_active} onChange={(event) => setForm({ ...form, is_active: event.target.checked })} />
              Activo
            </label>
          </div>
        </div>
        <button type="submit" className="primary-button mt-5 w-full" disabled={saving}>
          <Plus size={17} aria-hidden="true" />
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </form>
    </div>
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
