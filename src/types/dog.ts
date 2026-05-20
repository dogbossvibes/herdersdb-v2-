export type Gender = 'male' | 'female'
export type CoatType = 'short' | 'long' | 'rough'

export interface Dog {
  id: string
  created_at: string
  updated_at: string
  name: string
  reg_name: string | null
  gender: Gender | null
  date_of_birth: string | null
  coat_type: CoatType | null
  country_of_birth: string | null
  country_of_residence: string | null
  chip_number: string | null
  registry_number: string | null
  registry_org: string | null
  workingdog_id: string | null
  height_cm: number | null
  weight_kg: number | null
  sire_id: string | null
  dam_id: string | null
  sire_name: string | null
  dam_name: string | null
  hd: string | null
  ed: string | null
  augen: string | null
  herz: string | null
  health_date: string | null
  health_vet: string | null
  mdr1: string | null
  dew: string | null
  dna_labor: string | null
  dna_date: string | null
  coi_genomic: number | null
  schutzdienst: string | null
  faehrte: string | null
  obedience: string | null
  sport: string | null
  zuchteigung: string | null
  titles_notes: string | null
  owner: string | null
  breeder: string | null
  kennel: string | null
  breeding_approved: string | null
  workingdog_url: string | null
  is_approved_for_breeding: boolean
  photo_url: string | null
  notes: string | null
}

export type DogFormData = Partial<Omit<Dog, 'id' | 'created_at' | 'updated_at'>>

export type DogListItem = Pick<Dog,
  'id' | 'name' | 'reg_name' | 'gender' | 'date_of_birth' |
  'coat_type' | 'country_of_birth' | 'hd' | 'coi_genomic' |
  'photo_url' | 'is_approved_for_breeding'
>