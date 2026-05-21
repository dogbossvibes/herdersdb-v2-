import { getAllDogs } from '@/services/dogs'
import { DogList } from '@/components/dogs/DogList'

export const dynamic = 'force-dynamic'

export default async function HundePage() {
  const dogs = await getAllDogs()
  return <DogList initialDogs={dogs} />
}