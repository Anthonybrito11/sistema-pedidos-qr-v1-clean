import { supabase } from '../lib/supabaseClient'
import { categories as localCategories } from '../data/menuData'
import type { Category } from '../types'
import {
  mapDbCategoryToCategory,
  type CategoryFormValues,
  type DbCategory,
} from '../types/supabase'
import { getActiveBusinessSettings } from './businessService'

const allCategory: Category = { id: 'all', name: 'Todos' }

export async function getPublicCategoriesWithFallback(): Promise<Category[]> {
  try {
    if (!supabase) {
      return localCategories
    }

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true })

    if (error) {
      throw error
    }

    if (!data.length) {
      return localCategories
    }

    return [allCategory, ...data.map(mapDbCategoryToCategory)]
  } catch {
    return localCategories
  }
}

export async function getAdminCategories(): Promise<DbCategory[]> {
  if (!supabase) {
    throw new Error('Supabase no esta configurado.')
  }

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    throw error
  }

  return data
}

export async function createCategory(values: CategoryFormValues) {
  if (!supabase) {
    throw new Error('Supabase no esta configurado.')
  }

  const business = await getActiveBusinessSettings()
  const { data, error } = await supabase
    .from('categories')
    .insert({
      business_id: business?.id || null,
      name: values.name,
      slug: slugify(values.name),
      description: values.description || null,
      sort_order: values.sort_order,
      is_active: values.is_active,
    })
    .select('*')
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function updateCategory(id: string, values: CategoryFormValues) {
  if (!supabase) {
    throw new Error('Supabase no esta configurado.')
  }

  const { data, error } = await supabase
    .from('categories')
    .update({
      name: values.name,
      slug: slugify(values.name),
      description: values.description || null,
      sort_order: values.sort_order,
      is_active: values.is_active,
    })
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function setCategoryActive(id: string, isActive: boolean) {
  if (!supabase) {
    throw new Error('Supabase no esta configurado.')
  }

  const { error } = await supabase
    .from('categories')
    .update({ is_active: isActive })
    .eq('id', id)

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
