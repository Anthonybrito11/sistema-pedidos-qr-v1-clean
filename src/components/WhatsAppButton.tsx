import { MessageCircle } from 'lucide-react'

interface WhatsAppButtonProps {
  disabled: boolean
  loading?: boolean
  onClick: () => void
}

export function WhatsAppButton({ disabled, loading, onClick }: WhatsAppButtonProps) {
  function handleClick() {
    if (disabled || loading) {
      return
    }

    onClick()
  }

  return (
    <button
      type="button"
      className="primary-button w-full"
      onClick={handleClick}
      disabled={disabled || loading}
      data-testid="send-whatsapp"
    >
      <MessageCircle size={18} aria-hidden="true" />
      {loading ? 'Registrando pedido...' : 'Finalizar pedido'}
    </button>
  )
}
