import type { Database } from '@/types/database.types'
import { coiRating, COI_COLORS, FLAGS } from '@/lib/utils'

type Dog = Database['public']['Tables']['dogs']['Row']

interface DogCardProps {
  dog: Dog
  selected: boolean
  onSelect: (id: string) => void
}

export function DogCard({ dog, selected, onSelect }: DogCardProps) {
  const rating = coiRating(dog.coi_genomic)
  const colors = COI_COLORS[rating]

  return (
    <button
      onClick={() => onSelect(dog.id)}
      className={`w-full text-left rounded-xl px-3 py-2.5 mb-1 border transition-all
        ${selected ? 'bg-violet-50 border-violet-200' : 'border-transparent hover:bg-slate-50'}`}
    >
      <div className="text-xs font-medium text-slate-800 truncate">{dog.name}</div>
      <div className="flex items-center gap-1.5 mt-1">
        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${colors.dot}`} />
        <span className="text-xs text-slate-400 truncate">
          {FLAGS[dog.country_of_birth ?? ''] ?? ''} {dog.country_of_birth}
          {dog.coi_genomic ? ` · ${dog.coi_genomic}% COI` : ''}
        </span>
      </div>
    </button>
  )
}