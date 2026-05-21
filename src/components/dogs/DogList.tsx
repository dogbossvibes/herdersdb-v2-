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
  const [selected, setSelected] = useState<Dog | null>(initialDogs[0] ?? null)
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

  return (
    <div className="flex h-[calc(100vh-45px)]">

      {/* Sidebar */}
      <div className="w-52 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-3 border-b border-slate-100">

          {/* Search */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 mb-3">
            <svg className="text-slate-400 flex-shrink-0" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Suchen..."
              className="bg-transparent flex-1 text-xs text-slate-700 placeholder-slate-400 outline-none"
            />
          </div>

          {/* Gender filter */}
          <div className="flex gap-1">
            {(['all', 'male', 'female'] as const).map(v => (
              <button
                key={v}
                onClick={() => setGender(v)}
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

        {/* Dog list */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="text-xs text-slate-300 uppercase tracking-widest px-2 py-2">
            {filtered.length} Hunde
          </div>
          {filtered.map(d => (
            <DogCard
              key={d.id}
              dog={d}
              selected={selected?.id === d.id}
              onSelect={id => setSelected(initialDogs.find(dog => dog.id === id) ?? null)}
            />
          ))}
          {filtered.length === 0 && (
            <div className="text-xs text-slate-300 text-center py-8">Keine Hunde gefunden</div>
          )}
        </div>
      </div>

      {/* Detail */}
      <div className="flex-1 overflow-y-auto bg-slate-50">
        {selected
          ? <DogDetail dog={selected} />
          : <div className="flex items-center justify-center h-full text-slate-400 text-sm">Hund auswaehlen</div>
        }
      </div>
    </div>
  )
}