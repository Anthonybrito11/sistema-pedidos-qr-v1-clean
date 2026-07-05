import { Edit3, Plus, ToggleLeft, ToggleRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  createCategory,
  getAdminCategories,
  setCategoryActive,
  updateCategory,
} from '../../services/categoriesService'
import type { CategoryFormValues, DbCategory } from '../../types/supabase'

const emptyForm: CategoryFormValues = {
  name: '',
  description: '',
  sort_order: 0,
  is_active: true,
}

export function AdminCategories() {
  const [categories, setCategories] = useState<DbCategory[]>([])
  const [editing, setEditing] = useState<DbCategory | null>(null)
  const [form, setForm] = useState<CategoryFormValues>(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function loadCategories() {
    setLoading(true)
    setError('')
    try {
      setCategories(await getAdminCategories())
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : 'No se pudieron cargar categorias.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadCategories()
  }, [])

  function editCategory(category: DbCategory) {
    setEditing(category)
    setForm({
      name: category.name,
      description: category.description || '',
      sort_order: category.sort_order,
      is_active: category.is_active,
    })
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!form.name.trim()) {
      setError('El nombre es requerido.')
      return
    }

    setSaving(true)
    setError('')
    try {
      if (editing) {
        await updateCategory(editing.id, form)
      } else {
        await createCategory(form)
      }
      setForm(emptyForm)
      setEditing(null)
      await loadCategories()
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : 'No se pudo guardar.')
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(category: DbCategory) {
    if (!window.confirm(`${category.is_active ? 'Desactivar' : 'Activar'} ${category.name}?`)) {
      return
    }

    await setCategoryActive(category.id, !category.is_active)
    await loadCategories()
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <section>
        <div className="mb-4">
          <p className="text-sm font-bold text-brand-700">Menu</p>
          <h1 className="text-3xl font-black">Categorias</h1>
        </div>
        {error ? <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          {loading ? <p className="p-4 text-sm text-slate-500">Cargando...</p> : null}
          {categories.map((category) => (
            <div key={category.id} className="grid gap-3 border-b border-slate-100 p-4 last:border-b-0 md:grid-cols-[1fr_100px_160px]">
              <div>
                <p className="font-black">{category.name}</p>
                <p className="text-sm text-slate-500">{category.description || 'Sin descripcion'}</p>
              </div>
              <p className="text-sm font-bold text-slate-600">Orden {category.sort_order}</p>
              <div className="flex gap-2 md:justify-end">
                <button type="button" className="icon-button" onClick={() => editCategory(category)} aria-label={`Editar ${category.name}`} title="Editar">
                  <Edit3 size={17} aria-hidden="true" />
                </button>
                <button type="button" className="icon-button" onClick={() => void toggleActive(category)} aria-label={`${category.is_active ? 'Desactivar' : 'Activar'} ${category.name}`} title="Cambiar estado">
                  {category.is_active ? <ToggleRight size={20} aria-hidden="true" /> : <ToggleLeft size={20} aria-hidden="true" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <form className="rounded-lg border border-slate-200 bg-white p-4" onSubmit={(event) => void handleSubmit(event)}>
        <h2 className="text-xl font-black">{editing ? 'Editar categoria' : 'Nueva categoria'}</h2>
        <div className="mt-4 grid gap-4">
          <Field label="Nombre" value={form.name} onChange={(value) => setForm({ ...form, name: value })} required />
          <Field label="Descripcion" value={form.description} onChange={(value) => setForm({ ...form, description: value })} />
          <Field label="Orden" type="number" value={String(form.sort_order)} onChange={(value) => setForm({ ...form, sort_order: Number(value) })} />
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <input type="checkbox" checked={form.is_active} onChange={(event) => setForm({ ...form, is_active: event.target.checked })} />
            Activa
          </label>
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
