interface TableOrderFormProps {
  tableNumber: string
  error?: string
  onChange: (tableNumber: string) => void
}

export function TableOrderForm({
  tableNumber,
  error,
  onChange,
}: TableOrderFormProps) {
  return (
    <div className="surface-card p-4 sm:p-5">
      <label className="field-label" htmlFor="table-number">
        Numero de mesa
      </label>
      <input
        id="table-number"
        className="field-input mt-2"
        value={tableNumber}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Ej. 3"
        inputMode="numeric"
      />
      {error ? <p className="mt-2 text-sm font-bold text-tomato">{error}</p> : null}
      <p className="mt-3 text-sm font-medium leading-6 text-brand-700/75">
        Si el QR ya trae mesa, la dejamos preseleccionada. Puedes cambiarla si
        escaneaste otro QR por error.
      </p>
    </div>
  )
}
