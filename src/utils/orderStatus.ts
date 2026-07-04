import type { OrderStatus } from '../types/supabase'

const statusMeta: Record<
  OrderStatus,
  {
    label: string
    badgeClass: string
    selectClass: string
  }
> = {
  pending_whatsapp: {
    label: 'Pendiente WhatsApp',
    badgeClass:
      'inline-flex min-h-9 items-center rounded-lg bg-red-100 px-3 py-2 text-xs font-black text-red-800 ring-1 ring-red-200',
    selectClass:
      'min-h-12 w-full rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm font-black text-red-800 outline-none transition focus:ring-4 focus:ring-red-100',
  },
  confirmed: {
    label: 'Confirmado',
    badgeClass:
      'inline-flex min-h-9 items-center rounded-lg bg-sky-100 px-3 py-2 text-xs font-black text-sky-800 ring-1 ring-sky-200',
    selectClass:
      'min-h-12 w-full rounded-lg border border-sky-300 bg-sky-50 px-4 py-3 text-sm font-black text-sky-800 outline-none transition focus:ring-4 focus:ring-sky-100',
  },
  preparing: {
    label: 'Preparando',
    badgeClass:
      'inline-flex min-h-9 items-center rounded-lg bg-amber-100 px-3 py-2 text-xs font-black text-amber-900 ring-1 ring-amber-200',
    selectClass:
      'min-h-12 w-full rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-black text-amber-900 outline-none transition focus:ring-4 focus:ring-amber-100',
  },
  completed: {
    label: 'Completado',
    badgeClass:
      'inline-flex min-h-9 items-center rounded-lg bg-emerald-100 px-3 py-2 text-xs font-black text-emerald-800 ring-1 ring-emerald-200',
    selectClass:
      'min-h-12 w-full rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-800 outline-none transition focus:ring-4 focus:ring-emerald-100',
  },
  cancelled: {
    label: 'Cancelado',
    badgeClass:
      'inline-flex min-h-9 items-center rounded-lg bg-slate-200 px-3 py-2 text-xs font-black text-slate-700 ring-1 ring-slate-300',
    selectClass:
      'min-h-12 w-full rounded-lg border border-slate-300 bg-slate-100 px-4 py-3 text-sm font-black text-slate-700 outline-none transition focus:ring-4 focus:ring-slate-200',
  },
}

export function getOrderStatusLabel(status: OrderStatus) {
  return statusMeta[status].label
}

export function getOrderStatusBadgeClass(status: OrderStatus) {
  return statusMeta[status].badgeClass
}

export function getOrderStatusSelectClass(status: OrderStatus) {
  return statusMeta[status].selectClass
}
