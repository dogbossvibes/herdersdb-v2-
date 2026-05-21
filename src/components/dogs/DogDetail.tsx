'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Database } from '@/types/database.types'
import { Pill } from '@/components/ui/Pill'
import { coiRating, COI_COLORS, FLAGS, coatLabel, genderLabel, birthYear } from '@/lib/utils'

type Dog = Database['public']['Tables']['dogs']['Row']

const TABS = [
  { id: 'uebersicht', label: 'Uebersicht' },
  { id: 'stammbaum',  label: 'Stammbaum' },
  { id: 'gesundheit', label: 'Gesundheit' },
  { id: 'dna',        label: 'DNA' },
  { id: 'titel',      label: 'Titel' },
]

interface SectionProps {
  title: string
  children: React.ReactNode
}

function Section({ title, children }: SectionProps) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs text-slate-300 uppercase tracking-widest whitespace-nowrap">{title}</span>
        <div className="flex-1 h-px bg-slate-100" />
      </div>
      {children}
    </div>
  )
}

interface BentoCardProps {
  label: string
  children: React.ReactNode
  wide?: boolean
}

function BentoCard({ label, children, wide }: BentoCardProps) {
  return (
    <div className={`bg-white border border-slate-200 rounded-xl p-4 ${wide ? 'col-span-2' : ''}`}>
      <div className="text-xs text-slate-400 uppercase tracking-widest mb-2">{label}</div>
      {children}
    </div>
  )
}

export function DogDetail({ dog }: { dog: Dog }) {
  const [tab, setTab] = useState<string>('uebersicht')
  const rating = coiRating(dog.coi_genomic)
  const colors = COI_COLORS[rating]

  const titles = [dog.schutzdienst, dog.faehrte, dog.obedience, dog.sport]
    .filter(Boolean)
    .flatMap(t => t!.split(',').map(s => s.trim()))
    .filter(Boolean)

  return (
    <div className="p-6">

      {/* Tab bar */}
      <div className="flex gap-1 bg-slate-100 rounded-lg p-1 mb-6 w-fit">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-1.5 rounded-md text-xs transition-all
              ${tab === t.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium text-slate-900 mb-2">{dog.name}</h1>
          <div className="flex items-center gap-1.5 flex-wrap">
            {dog.country_of_birth && (
              <Pill>{FLAGS[dog.country_of_birth] ?? ''} {dog.country_of_birth}</Pill>
            )}
            {dog.coat_type   && <Pill>{coatLabel(dog.coat_type)}</Pill>}
            {dog.gender      && <Pill>{genderLabel(dog.gender)}</Pill>}
            {dog.date_of_birth && <Pill>geb. {birthYear(dog.date_of_birth)}</Pill>}
            {dog.is_approved_for_breeding && <Pill variant="success">Zuchtzulassung</Pill>}
          </div>
        </div>
        <Link
          href={`/erfassen?edit=${dog.id}`}
          className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-600
                     rounded-lg px-3 py-1.5 text-xs hover:bg-slate-50 transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Bearbeiten
        </Link>
      </div>

      {/* Uebersicht */}
      {tab === 'uebersicht' && (
        <>
          <div className="grid grid-cols-3 gap-2.5 mb-5">
            <BentoCard label="Inzuchtkoeffizient (COI)" wide>
              <div className="flex items-end gap-3 mb-2">
                <span className={`text-3xl font-medium ${colors.text}`}>
                  {dog.coi_genomic != null ? `${dog.coi_genomic}%` : '—'}
                </span>
                {dog.coi_genomic != null && (
                  <span className={`text-xs mb-1.5 ${colors.text}`}>{rating}</span>
                )}
              </div>
              <div className="bg-slate-100 rounded-full h-1 overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full ${colors.dot}`}
                  style={{ width: `${Math.min(((dog.coi_genomic ?? 0) / 15) * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-green-500">0%</span>
                <span className="text-yellow-500">5%</span>
                <span className="text-orange-500">10%</span>
                <span className="text-red-500">15%+</span>
              </div>
            </BentoCard>

            <BentoCard label="HD">
              <div className={`text-2xl font-medium ${dog.hd?.startsWith('A') ? 'text-green-600' : dog.hd?.startsWith('B') ? 'text-yellow-600' : 'text-slate-800'}`}>
                {dog.hd ?? '—'}
              </div>
            </BentoCard>

            <BentoCard label="Chip-Nr.">
              <div className="text-xs text-slate-500 font-mono mt-1 break-all">
                {dog.chip_number ?? '—'}
              </div>
            </BentoCard>

            <BentoCard label="ED">
              <div className={`text-2xl font-medium ${dog.ed === '0/0' ? 'text-green-600' : 'text-slate-800'}`}>
                {dog.ed ?? '—'}
              </div>
            </BentoCard>

            <BentoCard label="Masse">
              <div className="flex gap-4 mt-1">
                <div>
                  <div className="text-base font-medium text-slate-800">
                    {dog.height_cm ? `${dog.height_cm} cm` : '—'}
                  </div>
                  <div className="text-xs text-slate-400">Widerrist</div>
                </div>
                <div>
                  <div className="text-base font-medium text-slate-800">
                    {dog.weight_kg ? `${dog.weight_kg} kg` : '—'}
                  </div>
                  <div className="text-xs text-slate-400">Gewicht</div>
                </div>
              </div>
            </BentoCard>
          </div>

          {(dog.sire_name || dog.dam_name) && (
            <Section title="Eltern">
              <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
                {dog.sire_name && (
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className="w-6 h-6 rounded-md bg-indigo-50 border border-indigo-200 flex items-center justify-center flex-shrink-0 text-xs text-indigo-500">♂</div>
                    <div>
                      <div className="text-xs text-slate-600">{dog.sire_name}</div>
                      <div className="text-xs text-slate-400">Vater</div>
                    </div>
                  </div>
                )}
                {dog.dam_name && (
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className="w-6 h-6 rounded-md bg-pink-50 border border-pink-200 flex items-center justify-center flex-shrink-0 text-xs text-pink-500">♀</div>
                    <div>
                      <div className="text-xs text-slate-600">{dog.dam_name}</div>
                      <div className="text-xs text-slate-400">Mutter</div>
                    </div>
                  </div>
                )}
              </div>
            </Section>
          )}

          {titles.length > 0 && (
            <Section title="Titel">
              <div className="flex flex-wrap gap-1.5">
                {titles.map((t, i) => <Pill key={i} variant="indigo">{t}</Pill>)}
              </div>
            </Section>
          )}

          {dog.workingdog_url && (
            <a
              href={dog.workingdog_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 bg-white border border-slate-200
                         text-slate-500 rounded-xl p-3 text-xs hover:bg-slate-50 transition-colors mt-4"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              Profil auf working-dog.com
            </a>
          )}
        </>
      )}

      {/* Gesundheit */}
      {tab === 'gesundheit' && (
        <div className="grid grid-cols-2 gap-2.5">
          {([
            ['HD', dog.hd],
            ['ED', dog.ed],
            ['Augen (CAER)', dog.augen],
            ['Herz', dog.herz],
            ['Untersuchungsdatum', dog.health_date],
            ['Tierarzt / Klinik', dog.health_vet],
          ] as [string, string | null][]).map(([label, value]) => (
            <div key={label} className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="text-xs text-slate-400 uppercase tracking-widest mb-2">{label}</div>
              <div className="text-sm text-slate-700 font-medium">{value ?? '—'}</div>
            </div>
          ))}
        </div>
      )}

      {/* DNA */}
      {tab === 'dna' && (
        <div className="grid grid-cols-2 gap-2.5">
          {([
            ['MDR1', dog.mdr1],
            ['Deg. Myelopathie', dog.dew],
            ['Labor', dog.dna_labor],
            ['Testdatum', dog.dna_date],
            ['Genomischer COI', dog.coi_genomic != null ? `${dog.coi_genomic}%` : null],
          ] as [string, string | null][]).map(([label, value]) => {
            const isGood = value?.includes('N/N') || value?.includes('klar')
            const isWarn = value?.includes('Traeger')
            const isBad  = value?.includes('betroffen')
            return (
              <div key={label} className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="text-xs text-slate-400 uppercase tracking-widest mb-2">{label}</div>
                <div className={`text-sm font-medium ${isGood ? 'text-green-600' : isWarn ? 'text-yellow-600' : isBad ? 'text-red-600' : 'text-slate-700'}`}>
                  {value ?? '—'}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Stammbaum */}
      {tab === 'stammbaum' && (
        <div>
          <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 mb-4">
            {([['Vater', dog.sire_name], ['Mutter', dog.dam_name]] as [string, string | null][]).map(([label, value]) => (
              <div key={label} className="px-4 py-3 flex justify-between items-center">
                <span className="text-xs text-slate-400">{label}</span>
                <span className="text-sm text-slate-700">{value ?? '—'}</span>
              </div>
            ))}
          </div>
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-xs text-indigo-600">
            Weitere Generationen werden automatisch berechnet sobald die Elterntiere in der Datenbank sind.
          </div>
        </div>
      )}

      {/* Titel */}
      {tab === 'titel' && (
        <div className="space-y-2.5">
          {([
            ['Schutzdienst', dog.schutzdienst],
            ['Fahrte', dog.faehrte],
            ['Obedience', dog.obedience],
            ['Weitere', dog.sport],
            ['Zuchteignung', dog.zuchteigung],
          ] as [string, string | null][]).map(([label, value]) => (
            <div key={label} className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex justify-between items-center">
              <span className="text-xs text-slate-400">{label}</span>
              <span className="text-sm text-slate-700">{value ?? '—'}</span>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}