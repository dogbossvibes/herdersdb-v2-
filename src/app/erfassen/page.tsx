'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createDog, getDogById, updateDog } from '@/services/dogs'
import { Field } from '@/components/ui/Field'
import { SelectField } from '@/components/ui/SelectField'
import type { Database } from '@/types/database.types'

type DogRow    = Database['public']['Tables']['dogs']['Row']
type DogInsert = Database['public']['Tables']['dogs']['Insert']
type DogUpdate = Database['public']['Tables']['dogs']['Update']

// Vereinfachter Formular-Typ: alle Felder optional
type FormState = Partial<Omit<DogRow, 'id' | 'created_at' | 'updated_at'>>

const SECTIONS = ['Grunddaten', 'Stammbaum', 'Gesundheit', 'DNA', 'Titel', 'Besitzer'] as const

function ErfassenForm() {
  const router = useRouter()
  const params = useSearchParams()
  const editId = params.get('edit')
  const isEdit = Boolean(editId)

  const [section, setSection] = useState(0)
  const [form, setForm] = useState<FormState>({})
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState<string | null>(null)
  const [done, setDone]     = useState(false)
  const [loading, setLoading] = useState(isEdit)

  useEffect(() => {
    if (!editId) return
    getDogById(editId)
      .then(dog => { if (dog) setForm(dog as FormState) })
      .catch(e   => setError(e.message))
      .finally(  () => setLoading(false))
  }, [editId])

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSave() {
    if (!form.name) { setError('Name ist erforderlich'); return }
    setSaving(true)
    setError(null)
    try {
      if (isEdit && editId) {
        await updateDog(editId, form as DogUpdate)
      } else {
        await createDog(form as DogInsert)
      }
      setDone(true)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unbekannter Fehler')
    } finally {
      setSaving(false)
    }
  }

  const filledCount = Object.values(form).filter(v => v != null && v !== '').length

  if (loading) return (
    <div className="flex items-center justify-center h-96 text-slate-400 text-sm">Wird geladen...</div>
  )

  if (done) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="text-center max-w-sm px-6">
        <div className="w-16 h-16 rounded-full bg-green-100 border border-green-200 flex items-center justify-center mx-auto mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h2 className="text-xl font-medium text-slate-900 mb-2">
          {isEdit ? 'Hund aktualisiert!' : 'Hund gespeichert!'}
        </h2>
        <p className="text-slate-500 text-sm mb-8">
          {form.name} wurde erfolgreich {isEdit ? 'aktualisiert' : 'eingetragen'}.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => router.push('/hunde')}
            className="bg-white border border-slate-200 text-slate-600 rounded-xl px-5 py-2.5 text-sm hover:bg-slate-50 transition-colors"
          >
            Zur Hundeliste
          </button>
          {!isEdit && (
            <button
              onClick={() => { setForm({}); setDone(false); setSection(0) }}
              className="bg-indigo-500 text-white rounded-xl px-5 py-2.5 text-sm hover:bg-indigo-600 transition-colors"
            >
              Weiteren Hund
            </button>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-6">

        <div className="mb-6">
          <h1 className="text-xl font-medium text-slate-900 mb-1">
            {isEdit ? `${form.name ?? ''} bearbeiten` : 'Hund erfassen'}
          </h1>
          <p className="text-sm text-slate-400">{filledCount} Felder ausgefuellt</p>
        </div>

        <div className="grid grid-cols-[180px_1fr] gap-6">

          {/* Section nav */}
          <div>
            <nav className="space-y-1" aria-label="Formular-Abschnitte">
              {SECTIONS.map((sec, i) => (
                <button
                  key={sec}
                  onClick={() => setSection(i)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all border
                    ${section === i
                      ? 'bg-white border-slate-200 text-slate-800 shadow-sm'
                      : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-white/50'}`}
                >
                  {sec}
                </button>
              ))}
            </nav>
            <div className="mt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60
                           text-white rounded-xl py-2.5 text-sm font-medium transition-colors"
              >
                {saving ? 'Speichern...' : 'Speichern'}
              </button>
              {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}
            </div>
          </div>

          {/* Form panel */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="text-base font-medium text-slate-900 mb-5">{SECTIONS[section]}</h2>

            {section === 0 && (
              <div className="grid grid-cols-2 gap-x-4">
                <Field label="Name des Hundes *" value={form.name ?? ''} onChange={v => set('name', v)} placeholder="z.B. Arko van de Herdershof" fullWidth />
                <Field label="Zuchtbuchname"     value={form.reg_name ?? ''} onChange={v => set('reg_name', v)} placeholder="Offizieller Name" />
                <SelectField label="Geschlecht" value={form.gender ?? ''} onChange={v => set('gender', v as 'male' | 'female')} options={[['',''],['male','Ruede'],['female','Hundin']]} />
                <Field label="Geburtsdatum"     value={form.date_of_birth ?? ''} onChange={v => set('date_of_birth', v)} type="date" />
                <SelectField label="Haartyp"    value={form.coat_type ?? ''} onChange={v => set('coat_type', v as 'short' | 'long' | 'rough')} options={[['',''],['short','Kurzhaar'],['long','Langhaar'],['rough','Rauhhaar']]} />
                <SelectField label="Geburtsland" value={form.country_of_birth ?? ''} onChange={v => set('country_of_birth', v)} options={[['',''],['NL','NL'],['DE','DE'],['CH','CH'],['BE','BE'],['FR','FR'],['PL','PL'],['CZ','CZ'],['US','US'],['UK','UK'],['andere','andere']]} />
                <Field label="Chip-Nummer"      value={form.chip_number ?? ''} onChange={v => set('chip_number', v)} placeholder="756098100012345" />
                <Field label="Zuchtbuchnummer"  value={form.registry_number ?? ''} onChange={v => set('registry_number', v)} placeholder="z.B. NHSB 2901234" />
                <SelectField label="Zuchtbuch-Org." value={form.registry_org ?? ''} onChange={v => set('registry_org', v)} options={[['',''],['NHSB','NHSB'],['SKG','SKG'],['VDH','VDH'],['SCC','SCC'],['AKC','AKC'],['KC','KC'],['andere','andere']]} />
                <Field label="Widerristhoehe (cm)" value={form.height_cm?.toString() ?? ''} onChange={v => set('height_cm', v ? Number(v) : null)} type="number" placeholder="62" />
                <Field label="Gewicht (kg)"     value={form.weight_kg?.toString() ?? ''} onChange={v => set('weight_kg', v ? Number(v) : null)} type="number" placeholder="32" />
              </div>
            )}

            {section === 1 && (
              <div>
                <Field label="Vater (Name)" value={form.sire_name ?? ''} onChange={v => set('sire_name', v)} placeholder="Name des Vaters" />
                <Field label="Mutter (Name)" value={form.dam_name ?? ''} onChange={v => set('dam_name', v)} placeholder="Name der Mutter" />
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-xs text-indigo-600 mt-2">
                  Grosseltern und weitere Generationen werden automatisch berechnet sobald die Elterntiere in der Datenbank sind.
                </div>
              </div>
            )}

            {section === 2 && (
              <div className="grid grid-cols-2 gap-x-4">
                <SelectField label="HD"    value={form.hd ?? ''} onChange={v => set('hd', v)} options={[['',''],['A1','A1'],['A2','A2'],['B1','B1'],['B2','B2'],['C','C'],['D','D'],['E','E'],['nicht untersucht','nicht untersucht']]} />
                <SelectField label="ED"    value={form.ed ?? ''} onChange={v => set('ed', v)} options={[['',''],['0/0','0/0'],['1/0','1/0'],['1/1','1/1'],['2/0','2/0'],['nicht untersucht','nicht untersucht']]} />
                <SelectField label="Augen (CAER)" value={form.augen ?? ''} onChange={v => set('augen', v)} options={[['',''],['frei','frei'],['betroffen','betroffen'],['nicht untersucht','nicht untersucht']]} />
                <SelectField label="Herz"  value={form.herz ?? ''} onChange={v => set('herz', v)} options={[['',''],['frei','frei'],['betroffen','betroffen'],['nicht untersucht','nicht untersucht']]} />
                <Field label="Untersuchungsdatum" value={form.health_date ?? ''} onChange={v => set('health_date', v)} type="date" />
                <Field label="Tierarzt / Klinik"  value={form.health_vet ?? ''} onChange={v => set('health_vet', v)} placeholder="z.B. Tierklinik Zuerich" />
              </div>
            )}

            {section === 3 && (
              <div className="grid grid-cols-2 gap-x-4">
                <SelectField label="MDR1" value={form.mdr1 ?? ''} onChange={v => set('mdr1', v)} options={[['',''],['N/N klar','N/N klar'],['M/N Traeger','M/N Traeger'],['M/M betroffen','M/M betroffen'],['nicht getestet','nicht getestet']]} />
                <SelectField label="Deg. Myelopathie" value={form.dew ?? ''} onChange={v => set('dew', v)} options={[['',''],['N/N klar','N/N klar'],['A/N Traeger','A/N Traeger'],['A/A betroffen','A/A betroffen'],['nicht getestet','nicht getestet']]} />
                <SelectField label="Labor" value={form.dna_labor ?? ''} onChange={v => set('dna_labor', v)} options={[['',''],['Laboklin','Laboklin'],['Embark','Embark'],['Orivet','Orivet'],['Generatio','Generatio'],['andere','andere']]} />
                <Field label="Testdatum" value={form.dna_date ?? ''} onChange={v => set('dna_date', v)} type="date" />
                <Field label="Genomischer COI (%)" value={form.coi_genomic?.toString() ?? ''} onChange={v => set('coi_genomic', v ? Number(v) : null)} type="number" placeholder="z.B. 4.2" />
              </div>
            )}

            {section === 4 && (
              <div>
                <Field label="Schutzdienst" value={form.schutzdienst ?? ''} onChange={v => set('schutzdienst', v)} placeholder="z.B. KNPV PH1, IPO3" />
                <Field label="Fahrte"       value={form.faehrte ?? ''} onChange={v => set('faehrte', v)} placeholder="z.B. FH1, FH2" />
                <Field label="Obedience"    value={form.obedience ?? ''} onChange={v => set('obedience', v)} placeholder="z.B. OB1, OB2" />
                <Field label="Weitere"      value={form.sport ?? ''} onChange={v => set('sport', v)} placeholder="z.B. NZH, NVBK" />
                <SelectField label="Zuchteignungspruefung" value={form.zuchteigung ?? ''} onChange={v => set('zuchteigung', v)} options={[['',''],['Bestanden','Bestanden'],['Nicht bestanden','Nicht bestanden'],['Ausstehend','Ausstehend']]} />
              </div>
            )}

            {section === 5 && (
              <div className="grid grid-cols-2 gap-x-4">
                <Field label="Aktueller Besitzer" value={form.owner ?? ''} onChange={v => set('owner', v)} />
                <SelectField label="Wohnland" value={form.country_of_residence ?? ''} onChange={v => set('country_of_residence', v)} options={[['',''],['NL','NL'],['DE','DE'],['CH','CH'],['BE','BE'],['FR','FR'],['andere','andere']]} />
                <Field label="Zuchter"    value={form.breeder ?? ''} onChange={v => set('breeder', v)} />
                <Field label="Zwingername" value={form.kennel ?? ''} onChange={v => set('kennel', v)} placeholder="z.B. van de Herdershof" />
                <SelectField label="Zuchtzulassung" value={form.breeding_approved ?? ''} onChange={v => set('breeding_approved', v)} options={[['',''],['Ja','Ja'],['Nein','Nein'],['In Pruefung','In Pruefung']]} />
                <Field label="Working-dog URL" value={form.workingdog_url ?? ''} onChange={v => set('workingdog_url', v)} placeholder="https://www.working-dog.com/dog/..." />
                <div className="col-span-2 mb-4">
                  <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1.5 font-medium">Notizen</label>
                  <textarea
                    value={form.notes ?? ''}
                    onChange={e => set('notes', e.target.value)}
                    rows={3}
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-sm
                               focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
                  />
                </div>
              </div>
            )}

            {/* Nav buttons */}
            <div className="flex justify-between mt-2 pt-4 border-t border-slate-100">
              <button
                onClick={() => setSection(s => Math.max(0, s - 1))}
                disabled={section === 0}
                className="px-4 py-2 text-sm text-slate-400 disabled:opacity-30 hover:text-slate-600 transition-colors"
              >
                Zurueck
              </button>
              {section < SECTIONS.length - 1 ? (
                <button
                  onClick={() => setSection(s => s + 1)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl px-5 py-2 text-sm transition-colors"
                >
                  Weiter
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 text-white rounded-xl px-5 py-2 text-sm transition-colors"
                >
                  {saving ? 'Speichern...' : 'Speichern'}
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default function ErfassenPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-96 text-slate-400 text-sm">
          Wird geladen...
        </div>
      }
    >
      <ErfassenForm />
    </Suspense>
  )
}