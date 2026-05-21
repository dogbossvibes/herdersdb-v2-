export type COIRating = 'ausgezeichnet' | 'gut' | 'akzeptabel' | 'hoch' | 'kritisch'

export function coiRating(coi: number | null): COIRating {
  if (!coi)       return 'akzeptabel'
  if (coi < 3.0)  return 'ausgezeichnet'
  if (coi < 5.0)  return 'gut'
  if (coi < 6.25) return 'akzeptabel'
  if (coi < 10.0) return 'hoch'
  return 'kritisch'
}

export const COI_COLORS: Record<COIRating, { dot: string; text: string; bg: string; border: string }> = {
  ausgezeichnet: { dot: 'bg-green-500',  text: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200' },
  gut:           { dot: 'bg-yellow-500', text: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  akzeptabel:    { dot: 'bg-orange-400', text: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
  hoch:          { dot: 'bg-red-400',    text: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200' },
  kritisch:      { dot: 'bg-red-600',    text: 'text-red-700',    bg: 'bg-red-50',    border: 'border-red-300' },
}

export const FLAGS: Record<string, string> = {
  NL: '🇳🇱', DE: '🇩🇪', CH: '🇨🇭', BE: '🇧🇪',
  FR: '🇫🇷', PL: '🇵🇱', CZ: '🇨🇿', US: '🇺🇸', UK: '🇬🇧',
}

export function coatLabel(coat: string | null): string {
  if (coat === 'short') return 'Kurzhaar'
  if (coat === 'long')  return 'Langhaar'
  if (coat === 'rough') return 'Rauhhaar'
  return coat ?? ''
}

export function genderLabel(gender: string | null): string {
  if (gender === 'male')   return 'Ruede'
  if (gender === 'female') return 'Hundin'
  return gender ?? ''
}

export function birthYear(dateStr: string | null): string {
  if (!dateStr) return ''
  return new Date(dateStr).getFullYear().toString()
}