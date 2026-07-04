import { ImageUp } from 'lucide-react'
import { useState } from 'react'
import { uploadImage } from '../../services/storageService'
import { handleImageFallback } from '../../utils/images'

interface ImageUploadProps {
  label: string
  folder?: string
  value: string
  onChange: (url: string) => void
}

export function ImageUpload({ label, folder, value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(file: File | undefined) {
    if (!file) {
      return
    }

    setUploading(true)
    setError('')

    try {
      const url = await uploadImage(file, folder)
      onChange(url)
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : 'No se pudo subir la imagen.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label className="field-label">{label}</label>
      <div className="mt-2 grid gap-3 sm:grid-cols-[96px_minmax(0,1fr)]">
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" onError={handleImageFallback} />
          ) : (
            <ImageUp className="text-slate-400" size={24} aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0 space-y-2">
          <input
            className="field-input"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="URL de imagen"
          />
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-700 file:px-3 file:py-2 file:text-sm file:font-bold file:text-white"
            onChange={(event) => void handleFile(event.target.files?.[0])}
            disabled={uploading}
          />
          {uploading ? <p className="text-sm font-semibold text-slate-500">Subiendo...</p> : null}
          {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}
        </div>
      </div>
    </div>
  )
}
