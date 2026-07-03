import { supabase } from '../lib/supabaseClient'

const IMAGE_BUCKET = 'products'
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

function slugifyFileName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function validateImageFile(file: File) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Solo se permiten imagenes jpg, jpeg, png o webp.')
  }
}

export function buildStoragePath(file: File, folder = 'products') {
  const timestamp = Date.now()
  const cleanName = slugifyFileName(file.name)
  return `${folder}/${timestamp}-${cleanName}`
}

export async function uploadImage(file: File, folder = 'products') {
  if (!supabase) {
    throw new Error('Supabase no esta configurado.')
  }

  validateImageFile(file)
  const path = buildStoragePath(file, folder)
  const { error } = await supabase.storage.from(IMAGE_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) {
    throw error
  }

  return getPublicImageUrl(path)
}

export function getPublicImageUrl(path: string) {
  if (!supabase) {
    throw new Error('Supabase no esta configurado.')
  }

  const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path)
  return data.publicUrl
}

export async function deleteImage(path: string) {
  if (!supabase) {
    throw new Error('Supabase no esta configurado.')
  }

  const { error } = await supabase.storage.from(IMAGE_BUCKET).remove([path])

  if (error) {
    throw error
  }
}
