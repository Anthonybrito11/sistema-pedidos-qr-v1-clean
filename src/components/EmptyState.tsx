import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  message: string
  action?: ReactNode
}

export function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <div className="surface-card border-dashed px-5 py-9 text-center">
      <div className="mx-auto mb-4 h-2 w-20 rounded-full bg-[linear-gradient(90deg,#EA5749,#FBC017,#2EB89D)]" />
      <h2 className="text-lg font-black text-brand-900">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-brand-700/75">{message}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}
