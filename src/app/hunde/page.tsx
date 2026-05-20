'use client'

import { useEffect, useState } from 'react'
import { getAllDogs } from '@/services/dogs'
import type { Dog } from '@/types/dog'

export default function HundePage() {
  const [dogs, setDogs] = useState<Dog[]>([])
  const [selected, setSelected] = useState<Dog | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [gender, setGender] = useState<'all' | 'male' | 'female'>('all')

  useEffect(() => {
    getAllDogs()
      .then(setDogs)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = dogs.filter(d => {
    const matchSearch = !search ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      (d.country_of_birth ?? '').toLowerCase().includes(search.toLowerCase())
    const matchGender = gender === 'all' || d.gender === gender
    return matchSearch && matchGender
  })

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', color: '#64748b' }}>
      Hunde werden geladen...
    </div>
  )

  if (error) return (
    <div style={{ padding: 32, color: '#f87171' }}>Fehler: {error}</div>
  )

  return (
    <div style={{ display: 'flex', gap: 20, padding: '24px 32px', minHeight: '90vh' }}>

      {/* Liste links */}
      <div style={{ width: 320, flexShrink: 0 }}>
        <input
          placeholder="Suche nach Name, Land..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#f1f5f9', borderRadius: 10, padding: '10px 14px', fontSize: 13, marginBottom: 10, boxSizing: 'border-box' }}
        />
        <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
          {(['all', 'male', 'female'] as const).map(v => (
            <button key={v} onClick={() => setGender(v)} style={{
              flex: 1, background: gender === v ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.03)',
              border: gender === v ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(255,255,255,0.08)',
              color: gender === v ? '#a5b4fc' : '#64748b',
              borderRadius: 8, padding: 7, cursor: 'pointer', fontSize: 12, fontWeight: 600,
            }}>
              {v === 'all' ? 'Alle' : v === 'male' ? 'Rueden' : 'Huendinnen'}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 11, color: '#475569', marginBottom: 10 }}>{filtered.length} HUNDE</div>
        {filtered.map(d => (
          <div key={d.id} onClick={() => setSelected(d)} style={{
            background: selected?.id === d.id ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
            border: selected?.id === d.id ? '1.5px solid #6366f1' : '1.5px solid rgba(255,255,255,0.07)',
            borderRadius: 14, padding: '14px 16px', cursor: 'pointer', marginBottom: 10,
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>{d.name}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>
              {d.country_of_birth} &middot; {d.coat_type} &middot; {d.gender}
            </div>
            {d.coi_genomic && (
              <div style={{ fontSize: 11, color: '#facc15', marginTop: 4 }}>COI {d.coi_genomic}%</div>
            )}
          </div>
        ))}
      </div>

      {/* Detail rechts */}
      <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '28px 32px', overflowY: 'auto' }}>
        {!selected ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#475569' }}>
            Hund auswaehlen
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#f8fafc' }}>{selected.name}</div>
                <div style={{ color: '#94a3b8', fontSize: 14, marginTop: 4 }}>
                  {selected.country_of_birth} &middot; {selected.coat_type} &middot; {selected.gender}
                </div>
              </div>
              <a href={`/erfassen?edit=${selected.id}`} style={{
                background: '#6366f1', color: '#fff', borderRadius: 10,
                padding: '8px 18px', fontSize: 13, fontWeight: 600, textDecoration: 'none',
              }}>Bearbeiten</a>
            </div>

            {/* Grunddaten */}
            <Section title="Grunddaten">
              <Grid items={[
                ['Geburtsjahr', selected.date_of_birth ? new Date(selected.date_of_birth).getFullYear().toString() : null],
                ['Geburtsland', selected.country_of_birth],
                ['Groesse', selected.height_cm ? `${selected.height_cm} cm` : null],
                ['Gewicht', selected.weight_kg ? `${selected.weight_kg} kg` : null],
                ['Zuchtbuch-Nr.', selected.registry_number],
                ['Chip-Nr.', selected.chip_number],
              ]} />
            </Section>

            {/* Stammbaum */}
            {(selected.sire_name || selected.dam_name) && (
              <Section title="Stammbaum">
                <Grid items={[
                  ['Vater', selected.sire_name],
                  ['Mutter', selected.dam_name],
                ]} />
              </Section>
            )}

            {/* Gesundheit */}
            {(selected.hd || selected.ed || selected.augen || selected.herz) && (
              <Section title="Gesundheit">
                <Grid items={[
                  ['HD', selected.hd],
                  ['ED', selected.ed],
                  ['Augen', selected.augen],
                  ['Herz', selected.herz],
                  ['Untersuchungsdatum', selected.health_date],
                  ['Tierarzt / Klinik', selected.health_vet],
                ]} />
              </Section>
            )}

            {/* DNA */}
            {(selected.mdr1 || selected.dew || selected.dna_labor) && (
              <Section title="DNA-Analyse">
                <Grid items={[
                  ['MDR1', selected.mdr1],
                  ['Deg. Myelopathie', selected.dew],
                  ['Labor', selected.dna_labor],
                  ['Testdatum', selected.dna_date],
                  ['Genomischer COI', selected.coi_genomic ? `${selected.coi_genomic}%` : null],
                ]} />
              </Section>
            )}

            {/* Titel */}
            {(selected.schutzdienst || selected.faehrte || selected.obedience || selected.sport) && (
              <Section title="Titel und Pruefungen">
                <Grid items={[
                  ['Schutzdienst', selected.schutzdienst],
                  ['Fahrte', selected.faehrte],
                  ['Obedience', selected.obedience],
                  ['Weitere', selected.sport],
                  ['Zuchteignung', selected.zuchteigung],
                ]} />
              </Section>
            )}

            {/* Besitzer */}
            {(selected.owner || selected.breeder || selected.kennel) && (
              <Section title="Besitzer und Zuchter">
                <Grid items={[
                  ['Besitzer', selected.owner],
                  ['Zuchter', selected.breeder],
                  ['Zwinger', selected.kennel],
                  ['Zuchtzulassung', selected.breeding_approved],
                ]} />
              </Section>
            )}

            {selected.workingdog_url && (
              <a href={selected.workingdog_url} target="_blank" rel="noreferrer" style={{
                display: 'block', textAlign: 'center',
                background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)',
                color: '#a5b4fc', borderRadius: 10, padding: 10, fontSize: 13,
                textDecoration: 'none', fontWeight: 600, marginTop: 16,
              }}>
                Profil auf working-dog.com
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: 12 }}>{title}</div>
      {children}
    </div>
  )
}

function Grid({ items }: { items: [string, string | number | null | undefined][] }) {
  const visible = items.filter(([, v]) => v != null && v !== '')
  if (visible.length === 0) return null
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      {visible.map(([label, value]) => (
        <div key={label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '10px 14px' }}>
          <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
          <div style={{ fontSize: 14, color: '#e2e8f0', fontWeight: 600, marginTop: 4 }}>{value}</div>
        </div>
      ))}
    </div>
  )
}