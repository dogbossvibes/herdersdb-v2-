interface PillProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'indigo'
}

export function Pill({ children, variant = 'default' }: PillProps) {
  const styles = {
    default: 'bg-slate-100 border-slate-200 text-slate-500',
    success: 'bg-green-50 border-green-200 text-green-600',
    indigo:  'bg-indigo-50 border-indigo-200 text-indigo-600',
  }
  return (
    <span className={`inline-block border rounded-full px-2 py-0.5 text-xs ${styles[variant]}`}>
      {children}
    </span>
  )
}