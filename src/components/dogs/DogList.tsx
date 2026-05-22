'use client'

import { useState } from 'react'
import type { Database } from '@/types/database.types'
import { DogCard } from './DogCard'
import { DogDetail } from './DogDetail'

type Dog = Database['public']['Tables']['dogs']['Row']
type GenderFilter = 'all' | 'male' | 'female'

interface DogListProps {
  initialDogs: Dog[]
}

export function DogList({ initialDogs }: DogListProps) {
  const [selected, setSelected] = useState<Dog | null>(null)
  const [search, setSearch] = useState('')
  const [gender, setGender] = useState<GenderFilter>('all')

  const filtered = initialDogs.filter(d => {
    const matchSearch =
      !search ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      (d.country_of_birth ?? '').toLowerCase().includes(search.toLowerCase())
    const matchGender = gender === 'all' || d.gender === gender
    return matchSearch && matchGender
  })

  function handleSelect(id: string) {
    const dog = initialDogs.find(d => d.id === id) ?? null
    setSelected(dog)
  }

  function handleBack() {
    setSelected(null)
  }

  // Mobile: Detail-Ansicht
  if (selected) {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Mobile Back Button */}
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-slate-500 text-sm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Alle Hunde
          </button>
        </div>

        {/* Desktop: zeige beide Panels */}
        <div className="hidden md:flex h-[calc(100vh-45px)]">
          <Sidebar
            dogs={filtered}
            selected={selected}
            search={search}
            gender={gender}
            onSearch={setSearch}
            onGender={setGender}
            onSelect={handleSelect}
          />
          <div className="flex-1 overflow-y-auto bg-slate-50">
            <DogDetail dog={selected} />
          </div>
        </div>

        {/* Mobile: nur Detail */}
        <div className="md:hidden">
          <DogDetail dog={selected} />
        </div>
      </div>
    )
  }

  // Liste (mobile: immer, desktop: linke Seite)
  return (
    <div className="flex h-[calc(100vh-45px)]">

      <Sidebar
        dogs={filtered}
        selected={selected}
        search={search}
        gender={gender}
        onSearch={setSearch}
        onGender={setGender}
        onSelect={handleSelect}
        fullWidth
      />

      {/* Desktop rechte Seite wenn kein Hund ausgewaehlt */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-slate-50 text-slate-400 text-sm">
        Hund auswaehlen
      </div>
    </div>
  )
}

interface SidebarProps {
  dogs: Dog[]
  selected: Dog | null
  search: string
  gender: GenderFilter
  onSearch: (v: string) => void
  onGender: (v: GenderFilter) => void
  onSelect: (id: string) => void
  fullWidth?: boolean
}

function Sidebar({ dogs, selected, search, gender, onSearch, onGender, onSelect, fullWidth }: SidebarProps) {
  return (
    <div className={`bg-white border-r border-slate-200 flex flex-col ${fullWidth ? 'w-full md:w-52' : 'w-52 flex-shrink-0'}`}>

      {/* Search + Filter */}
      <div className="p-3 border-b border-slate-100">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 mb-3">
          <svg className="text-slate-400 flex-shrink-0" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            value={search}
            onChange={e => onSearch(e.target.value)}
            placeholder="Suchen..."
            className="bg-transparent flex-1 text-xs text-slate-700 placeholder-slate-400 outline-none"
          />
        </div>
        <div className="flex gap-1">
          {(['all', 'male', 'female'] as const).map(v => (
            <button
              key={v}
              onClick={() => onGender(v)}
              className={`flex-1 text-center py-1 rounded-full text-xs border transition-colors
                ${gender === v
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                  : 'border-slate-200 text-slate-400 hover:border-slate-300'}`}
            >
              {v === 'all' ? 'Alle' : v === 'male' ? 'Rueden' : 'Huend.'}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="text-xs text-slate-300 uppercase tracking-widest px-2 py-2">
          {dogs.length} Hunde
        </div>
        {dogs.map(d => (
          <DogCard
            key={d.id}
            dog={d}
            selected={selected?.id === d.id}
            onSelect={onSelect}
          />
        ))}
        {dogs.length === 0 && (
          <div className="text-xs text-slate-300 text-center py-8">Keine Hunde gefunden</div>
        )}
      </div>
    </div>
  )
}