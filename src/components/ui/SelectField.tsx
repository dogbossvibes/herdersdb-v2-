'use client'

interface SelectFieldProps {
  label: string
  value: string
  onChange: (v: string) => void
  options: [string, string][]
}

export function SelectField({ label, value, onChange, options }: SelectFieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1.5 font-medium">
        {label}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-white border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-sm
                   focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>{l || '-- bitte waehlen --'}</option>
        ))}
      </select>
    </div>
  )
}