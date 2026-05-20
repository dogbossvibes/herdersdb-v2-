'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createDog, getDogById, updateDog } from '@/services/dogs'
import type { DogFormData } from '@/types/dog'

const SECTIONS = ['Grunddaten', 'Stammbaum', 'Gesundheit', 'DNA', 'Titel', 'Besitzer']

const inp = { width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#f1f5f9', borderRadius: 10, padding: '10px 14px', fontSize: 13, boxSizing: 'border-box' as const, fontFamily: 'inherit' }
const sel = { ...inp, background: '#1e293b' }
const lbl = { fontSize: 12, color: '#94a3b8', display: 'block' as const, marginBottom: 6, fontWeight: 600 }

function Field({ label, value, onChange, type = 'text', placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={lbl}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={inp} />
    </div>
  )
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={lbl}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} style={sel}>
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  )
}

function ErfassenInner() {
  const router = useRouter()
  const params = useSearchParams()
  const editId = params.get('edit')
  const isEdit = !!editId

  const [section, setSection] = useState(0)
  const [form, setForm] = useState<DogFormData>({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(isEdit)

  useEffect(() => {
    if (!editId) return
    getDogById(editId)
      .then(dog => { if (dog) setForm(dog as DogFormData) })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [editId])

  const set = (key: keyof DogFormData, val: string | number | boolean | null) =>
    setForm(p => ({ ...p, [key]: val }))

  const handleSave = async () => {
    if (!form.name) { setError('Name ist erforderlich'); return }
    setSaving(true)
    setError(null)
    try {
      if (isEdit && editId) {
        await updateDog(editId, form)
      } else {
        await createDog(form)
      }
      setDone(true)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unbekannter Fehler')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', color: '#64748b' }}>Hund wird geladen...</div>

  if (done) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <div style={{ fontSize: 48, marginBottom: 20 }}>OK</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#f8fafc', marginBottom: 8 }}>{isEdit ? 'Hund aktualisiert!' : 'Hund gespeichert!'}</div>
        <div style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>{form.name} wurde erfolgreich {isEdit ? 'aktualisiert' : 'eingetragen'}.</div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button onClick={() => router.push('/hunde')} style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)', color: '#a5b4fc', borderRadius: 10, padding: '10px 20px', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>Zur Hundeliste</button>
          {!isEdit && <button onClick={() => { setForm({}); setDone(false); setSection(0) }} style={{ background: '#6366f1', border: 'none', color: '#fff', borderRadius: 10, padding: '10px 20px', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>Weiteren Hund</button>}
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '90vh', padding: '28px 32px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#f8fafc', marginBottom: 4 }}>{isEdit ? `${form.name} bearbeiten` : 'Hund erfassen'}</div>
          <div style={{ fontSize: 13, color: '#64748b' }}>{Object.values(form).filter(v => v != null && v !== '').length} Felder ausgefuellt</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 24 }}>
          <div>
            {SECTIONS.map((sec, i) => (
              <button key={i} onClick={() => setSection(i)} style={{ width: '100%', background: section === i ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.02)', border: section === i ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(255,255,255,0.07)', color: section === i ? '#a5b4fc' : '#64748b', borderRadius: 10, padding: '10px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600, textAlign: 'left', marginBottom: 6, fontFamily: 'inherit' }}>{sec}</button>
            ))}
            <button onClick={handleSave} disabled={saving} style={{ width: '100%', background: '#6366f1', border: 'none', color: '#fff', borderRadius: 10, padding: 12, cursor: saving ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 700, fontFamily: 'inherit', marginTop: 16, opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Speichern...' : 'Speichern'}
            </button>
            {error && <div style={{ color: '#f87171', fontSize: 12, marginTop: 8 }}>{error}</div>}
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px 28px' }}>
            {section === 0 && (
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', marginBottom: 20 }}>Grunddaten</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
                  <div style={{ gridColumn: '1 / -1', marginBottom: 16 }}>
                    <label style={lbl}>Name des Hundes *</label>
                    <input value={form.name ?? ''} onChange={e => set('name', e.target.value)} placeholder="z.B. Arko van de Herdershof" style={inp} />
                  </div>
                  <Field label="Zuchtbuchname" value={form.reg_name ?? ''} onChange={v => set('reg_name', v)} placeholder="Offizieller Name im Zuchtbuch" />
                  <SelectField label="Geschlecht" value={form.gender ?? ''} onChange={v => set('gender', v)} options={[['', '--'], ['male', 'Ruede'], ['female', 'Hundin']]} />
                  <Field label="Geburtsdatum" value={form.date_of_birth ?? ''} onChange={v => set('date_of_birth', v)} type="date" />
                  <SelectField label="Haartyp" value={form.coat_type ?? ''} onChange={v => set('coat_type', v)} options={[['', '--'], ['short', 'Kurzhaar'], ['long', 'Langhaar'], ['rough', 'Rauhhaar']]} />
                  <SelectField label="Geburtsland" value={form.country_of_birth ?? ''} onChange={v => set('country_of_birth', v)} options={[['','--'],['NL','NL'],['DE','DE'],['CH','CH'],['BE','BE'],['FR','FR'],['PL','PL'],['CZ','CZ'],['US','US'],['UK','UK'],['andere','andere']]} />
                  <Field label="Chip-Nummer" value={form.chip_number ?? ''} onChange={v => set('chip_number', v)} placeholder="756098100012345" />
                  <Field label="Zuchtbuchnummer" value={form.registry_number ?? ''} onChange={v => set('registry_number', v)} placeholder="z.B. NHSB 2901234" />
                  <SelectField label="Zuchtbuch-Org." value={form.registry_org ?? ''} onChange={v => set('registry_org', v)} options={[['','--'],['NHSB','NHSB'],['SKG','SKG'],['VDH','VDH'],['SCC','SCC'],['AKC','AKC'],['KC','KC'],['andere','andere']]} />
                  <Field label="Widerristhoehe (cm)" value={form.height_cm?.toString() ?? ''} onChange={v => set('height_cm', v ? Number(v) : null)} type="number" placeholder="62" />
                  <Field label="Gewicht (kg)" value={form.weight_kg?.toString() ?? ''} onChange={v => set('weight_kg', v ? Number(v) : null)} type="number" placeholder="32" />
                </div>
              </div>
            )}

            {section === 1 && (
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', marginBottom: 20 }}>Stammbaum - Eltern</div>
                <Field label="Vater (Name)" value={form.sire_name ?? ''} onChange={v => set('sire_name', v)} placeholder="Name des Vaters" />
                <Field label="Mutter (Name)" value={form.dam_name ?? ''} onChange={v => set('dam_name', v)} placeholder="Name der Mutter" />
                <div style={{ marginTop: 16, padding: 16, background: 'rgba(99,102,241,0.06)', borderRadius: 12, fontSize: 13, color: '#64748b' }}>
                  Grosseltern und weitere Generationen werden automatisch berechnet sobald die Elterntiere in der Datenbank eingetragen sind.
                </div>
              </div>
            )}

            {section === 2 && (
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', marginBottom: 20 }}>Gesundheit</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
                  <SelectField label="HD" value={form.hd ?? ''} onChange={v => set('hd', v)} options={[['','--'],['A1','A1'],['A2','A2'],['B1','B1'],['B2','B2'],['C','C'],['D','D'],['E','E'],['nicht untersucht','nicht untersucht']]} />
                  <SelectField label="ED" value={form.ed ?? ''} onChange={v => set('ed', v)} options={[['','--'],['0/0','0/0'],['1/0','1/0'],['1/1','1/1'],['2/0','2/0'],['nicht untersucht','nicht untersucht']]} />
                  <SelectField label="Augen (CAER)" value={form.augen ?? ''} onChange={v => set('augen', v)} options={[['','--'],['frei','frei'],['betroffen','betroffen'],['nicht untersucht','nicht untersucht']]} />
                  <SelectField label="Herz" value={form.herz ?? ''} onChange={v => set('herz', v)} options={[['','--'],['frei','frei'],['betroffen','betroffen'],['nicht untersucht','nicht untersucht']]} />
                  <Field label="Untersuchungsdatum" value={form.health_date ?? ''} onChange={v => set('health_date', v)} type="date" />
                  <Field label="Tierarzt / Klinik" value={form.health_vet ?? ''} onChange={v => set('health_vet', v)} placeholder="z.B. Tierklinik Zuerich" />
                </div>
              </div>
            )}

            {section === 3 && (
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', marginBottom: 20 }}>DNA-Analyse</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
                  <SelectField label="MDR1" value={form.mdr1 ?? ''} onChange={v => set('mdr1', v)} options={[['','--'],['N/N klar','N/N klar'],['M/N Traeger','M/N Traeger'],['M/M betroffen','M/M betroffen'],['nicht getestet','nicht getestet']]} />
                  <SelectField label="Deg. Myelopathie" value={form.dew ?? ''} onChange={v => set('dew', v)} options={[['','--'],['N/N klar','N/N klar'],['A/N Traeger','A/N Traeger'],['A/A betroffen','A/A betroffen'],['nicht getestet','nicht getestet']]} />
                  <SelectField label="Labor" value={form.dna_labor ?? ''} onChange={v => set('dna_labor', v)} options={[['','--'],['Laboklin','Laboklin'],['Embark','Embark'],['Orivet','Orivet'],['Generatio','Generatio'],['andere','andere']]} />
                  <Field label="Testdatum" value={form.dna_date ?? ''} onChange={v => set('dna_date', v)} type="date" />
                  <Field label="Genomischer COI (%)" value={form.coi_genomic?.toString() ?? ''} onChange={v => set('coi_genomic', v ? Number(v) : null)} type="number" placeholder="z.B. 4.2" />
                </div>
              </div>
            )}

            {section === 4 && (
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', marginBottom: 20 }}>Titel und Pruefungen</div>
                <Field label="Schutzdienst" value={form.schutzdienst ?? ''} onChange={v => set('schutzdienst', v)} placeholder="z.B. KNPV PH1, IPO3, IGP3" />
                <Field label="Fahrte" value={form.faehrte ?? ''} onChange={v => set('faehrte', v)} placeholder="z.B. FH1, FH2" />
                <Field label="Obedience" value={form.obedience ?? ''} onChange={v => set('obedience', v)} placeholder="z.B. OB1, OB2" />
                <Field label="Weitere" value={form.sport ?? ''} onChange={v => set('sport', v)} placeholder="z.B. NZH, NVBK" />
                <SelectField label="Zuchteignungspruefung" value={form.zuchteigung ?? ''} onChange={v => set('zuchteigung', v)} options={[['','--'],['Bestanden','Bestanden'],['Nicht bestanden','Nicht bestanden'],['Ausstehend','Ausstehend']]} />
              </div>
            )}

            {section === 5 && (
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', marginBottom: 20 }}>Besitzer und Zuchter</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
                  <Field label="Aktueller Besitzer" value={form.owner ?? ''} onChange={v => set('owner', v)} />
                  <SelectField label="Wohnland" value={form.country_of_residence ?? ''} onChange={v => set('country_of_residence', v)} options={[['','--'],['NL','NL'],['DE','DE'],['CH','CH'],['BE','BE'],['FR','FR'],['andere','andere']]} />
                  <Field label="Zuchter" value={form.breeder ?? ''} onChange={v => set('breeder', v)} />
                  <Field label="Zwingername" value={form.kennel ?? ''} onChange={v => set('kennel', v)} placeholder="z.B. van de Herdershof" />
                  <SelectField label="Zuchtzulassung" value={form.breeding_approved ?? ''} onChange={v => set('breeding_approved', v)} options={[['','--'],['Ja','Ja'],['Nein','Nein'],['In Pruefung','In Pruefung']]} />
                  <Field label="Working-dog URL" value={form.workingdog_url ?? ''} onChange={v => set('workingdog_url', v)} placeholder="https://www.working-dog.com/dog/..." />
                </div>
                <div style={{ marginTop: 8 }}>
                  <label style={lbl}>Notizen</label>
                  <textarea value={form.notes ?? ''} onChange={e => set('notes', e.target.value)} rows={3} style={{ ...inp, resize: 'vertical' }} />
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <button onClick={() => setSection(Math.max(0, section - 1))} disabled={section === 0} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: section === 0 ? '#334155' : '#94a3b8', borderRadius: 10, padding: '9px 20px', cursor: section === 0 ? 'not-allowed' : 'pointer', fontSize: 13, fontFamily: 'inherit' }}>Zurueck</button>
              {section < SECTIONS.length - 1
                ? <button onClick={() => setSection(section + 1)} style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)', color: '#a5b4fc', borderRadius: 10, padding: '9px 20px', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>Weiter</button>
                : <button onClick={handleSave} disabled={saving} style={{ background: '#6366f1', border: 'none', color: '#fff', borderRadius: 10, padding: '9px 24px', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit' }}>{saving ? 'Speichern...' : 'Speichern'}</button>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ErfassenPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', color: '#64748b' }}>Wird geladen...</div>}>
      <ErfassenInner />
    </Suspense>
  )
}