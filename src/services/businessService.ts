import { supabase } from '../lib/supabaseClient'
import { businessConfig as localBusinessConfig } from '../data/businessConfig'
import type { BusinessConfig } from '../types'
import {
  mapBusinessSettingsToConfig,
  type BusinessSettings,
  type BusinessSettingsFormValues,
} from '../types/supabase'

export async function getActiveBusinessSettings(): Promise<BusinessSettings | null> {
  if (!supabase) {
    return null
  }

  const { data, error } = await supabase
    .from('business_settings')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data
}

export async function getBusinessConfigWithFallback(): Promise<BusinessConfig> {
  try {
    const settings = await getActiveBusinessSettings()
    return settings ? mapBusinessSettingsToConfig(settings) : localBusinessConfig
  } catch {
    return localBusinessConfig
  }
}

export async function getAdminBusinessSettings() {
  if (!supabase) {
    throw new Error('Supabase no esta configurado.')
  }

  const { data, error } = await supabase
    .from('business_settings')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data
}

export async function upsertBusinessSettings(values: BusinessSettingsFormValues) {
  if (!supabase) {
    throw new Error('Supabase no esta configurado.')
  }

  const current = await getAdminBusinessSettings()
  const payload = {
    business_name: values.business_name,
    slug: values.slug || null,
    logo_url: values.logo_url || null,
    banner_url: values.banner_url || null,
    whatsapp_number: values.whatsapp_number,
    address: values.address || null,
    description: values.description || null,
    opening_hours: values.opening_hours ? safeJsonParse(values.opening_hours) : null,
    payment_methods: values.payment_methods,
    base_whatsapp_message: values.base_whatsapp_message || null,
    delivery_enabled: values.delivery_enabled,
    delivery_cost: values.delivery_cost,
    currency: values.currency || 'DOP',
    is_active: values.is_active,
  }

  const query = current
    ? supabase.from('business_settings').update(payload).eq('id', current.id).select('*').single()
    : supabase.from('business_settings').insert(payload).select('*').single()

  const { data, error } = await query

  if (error) {
    throw error
  }

  return data
}

function safeJsonParse(value: string) {
  try {
    return JSON.parse(value) as Record<string, unknown>
  } catch {
    return { raw: value }
  }
}
