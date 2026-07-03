import { supabase } from '../lib/supabaseClient'
import { products as localProducts } from '../data/menuData'
import type { Product } from '../types'
import {
  mapDbProductToProduct,
  type DbProduct,
  type ProductFormValues,
} from '../types/supabase'
import { getActiveBusinessSettings } from './businessService'
import { uploadImage } from './storageService'

export async function getPublicProductsWithFallback(): Promise<Product[]> {
  try {
    if (!supabase) {
      return localProducts
    }

    const { data, error } = await supabase
      .from('products')
      .select('*, categories(id, name, slug)')
      .eq('is_active', true)
      .eq('is_available', true)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true })

    if (error) {
      throw error
    }

    if (!data.length) {
      return localProducts
    }

    return data.map(mapDbProductToProduct)
  } catch {
    return localProducts
  }
}

export async function getAdminProducts(): Promise<DbProduct[]> {
  if (!supabase) {
    throw new Error('Supabase no esta configurado.')
  }

  const { data, error } = await supabase
    .from('products')
    .select('*, categories(id, name, slug)')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    throw error
  }

  return data
}

export async function createProduct(values: ProductFormValues) {
  if (!supabase) {
    throw new Error('Supabase no esta configurado.')
  }

  const business = await getActiveBusinessSettings()
  const { data, error } = await supabase
    .from('products')
    .insert({
      business_id: business?.id || null,
      category_id: values.category_id,
      name: values.name,
      slug: slugify(values.name),
      description: values.description || null,
      price: values.price,
      image_url: values.image_url || null,
      is_available: values.is_available,
      is_active: values.is_active,
      sort_order: values.sort_order,
    })
    .select('*')
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function updateProduct(id: string, values: ProductFormValues) {
  if (!supabase) {
    throw new Error('Supabase no esta configurado.')
  }

  const { data, error } = await supabase
    .from('products')
    .update({
      category_id: values.category_id,
      name: values.name,
      slug: slugify(values.name),
      description: values.description || null,
      price: values.price,
      image_url: values.image_url || null,
      is_available: values.is_available,
      is_active: values.is_active,
      sort_order: values.sort_order,
    })
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function setProductActive(id: string, isActive: boolean) {
  return updateProductFlag(id, { is_active: isActive })
}

export async function setProductAvailability(id: string, isAvailable: boolean) {
  return updateProductFlag(id, { is_available: isAvailable })
}

export async function uploadProductImage(file: File) {
  return uploadImage(file, 'products')
}

async function updateProductFlag(
  id: string,
  values: { is_active?: boolean; is_available?: boolean },
) {
  if (!supabase) {
    throw new Error('Supabase no esta configurado.')
  }

  const { error } = await supabase.from('products').update(values).eq('id', id)

  if (error) {
    throw error
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
