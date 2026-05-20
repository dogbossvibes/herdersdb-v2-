import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database.types'

type Dog = Database['public']['Tables']['dogs']['Row']
type DogInsert = Database['public']['Tables']['dogs']['Insert']
type DogUpdate = Database['public']['Tables']['dogs']['Update']

export type { Dog, DogInsert, DogUpdate }

export async function getAllDogs(): Promise<Dog[]> {
  const { data, error } = await supabase.from('dogs').select('*').order('name')
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getDogById(id: string): Promise<Dog | null> {
  const { data, error } = await supabase.from('dogs').select('*').eq('id', id).single()
  if (error) throw new Error(error.message)
  return data
}

export async function createDog(formData: DogInsert): Promise<Dog> {
  const { data, error } = await supabase.from('dogs').insert(formData).select().single()
  if (error) throw new Error(error.message)
  return data
}

export async function updateDog(id: string, formData: DogUpdate): Promise<Dog> {
  const { data, error } = await supabase.from('dogs').update({ ...formData, updated_at: new Date().toISOString() }).eq('id', id).select().single()
  if (error) throw new Error(error.message)
  return data
}

export async function deleteDog(id: string): Promise<void> {
  const { error } = await supabase.from('dogs').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function searchDogs(query: string): Promise<Dog[]> {
  const { data, error } = await supabase.from('dogs').select('*').or(`name.ilike.%${query}%,reg_name.ilike.%${query}%`).order('name')
  if (error) throw new Error(error.message)
  return data ?? []
}
