import { createClient } from '@supabase/supabase-js'
import type { Dog } from '@/types/dog'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<{ public: { Tables: { dogs: { Row: Dog } } } }>(
  supabaseUrl,
  supabaseKey
)