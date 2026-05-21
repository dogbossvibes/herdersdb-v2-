'use client'

interface FieldProps {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  fullWidth?: boolean
}

export function Field({ label, value, onChange, type = 'text', placeholder, fullWidth }: FieldProps) {
  return (
    <div className={fullWidth ? 'col-span-2 mb-4' : 'mb-4'}>
      <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1.5 font-medium">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-sm
                   focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all
                   placeholder:text-slate-300"
      />
    </div>
  )
}