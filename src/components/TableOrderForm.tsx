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
    <div className="rounded-lg border border-slate-200 bg-white p-4">
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
      {error ? <p className="mt-2 text-sm font-semibold text-red-600">{error}</p> : null}
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Si el QR ya trae mesa, la dejamos preseleccionada. Puedes cambiarla si
        escaneaste otro QR por error.
      </p>
    </div>
  )
}
