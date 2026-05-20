import { supabase } from '@/lib/supabase'
import type { Dog, DogFormData } from '@/types/dog'

// Alle Hunde laden
export async function getAllDogs(): Promise<Dog[]> {
  const { data, error } = await supabase
    .from('dogs')
    .select('*')
    .order('name')

  if (error) throw new Error(error.message)
  return (data ?? []) as Dog[]
}

// Einzelnen Hund laden
export async function getDogById(id: string): Promise<Dog | null> {
  const { data, error } = await supabase
    .from('dogs')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data as Dog
}

// Hund erstellen
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createDog(formData: DogFormData): Promise<Dog> {
  const { data, error } = await supabase
    .from('dogs')
    .insert([formData] as any)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as Dog
}

// Hund aktualisieren
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateDog(id: string, formData: Partial<DogFormData>): Promise<Dog> {
  const { data, error } = await supabase
    .from('dogs')
    .update({ ...formData, updated_at: new Date().toISOString() } as any)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as Dog
}

// Hund loeschen
export async function deleteDog(id: string): Promise<void> {
  const { error } = await supabase
    .from('dogs')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}

// Hunde suchen
export async function searchDogs(query: string): Promise<Dog[]> {
  const { data, error } = await supabase
    .from('dogs')
    .select('*')
    .or(`name.ilike.%${query}%,reg_name.ilike.%${query}%,chip_number.ilike.%${query}%`)
    .order('name')

  if (error) throw new Error(error.message)
  return (data ?? []) as Dog[]
}