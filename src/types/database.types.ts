export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      dogs: {
        Row: {
          augen: string | null
          breeder: string | null
          breeding_approved: string | null
          chip_number: string | null
          coat_type: string | null
          coi_genomic: number | null
          country_of_birth: string | null
          country_of_residence: string | null
          created_at: string | null
          dam_id: string | null
          dam_name: string | null
          date_of_birth: string | null
          dew: string | null
          dna_date: string | null
          dna_labor: string | null
          ed: string | null
          faehrte: string | null
          gender: string | null
          hd: string | null
          health_date: string | null
          health_vet: string | null
          height_cm: number | null
          herz: string | null
          id: string
          is_approved_for_breeding: boolean | null
          kennel: string | null
          mdr1: string | null
          name: string
          notes: string | null
          obedience: string | null
          owner: string | null
          photo_url: string | null
          reg_name: string | null
          registry_number: string | null
          registry_org: string | null
          schutzdienst: string | null
          sire_id: string | null
          sire_name: string | null
          sport: string | null
          titles_notes: string | null
          updated_at: string | null
          weight_kg: number | null
          workingdog_id: string | null
          workingdog_url: string | null
          zuchteigung: string | null
        }
        Insert: {
          augen?: string | null
          breeder?: string | null
          breeding_approved?: string | null
          chip_number?: string | null
          coat_type?: string | null
          coi_genomic?: number | null
          country_of_birth?: string | null
          country_of_residence?: string | null
          created_at?: string | null
          dam_id?: string | null
          dam_name?: string | null
          date_of_birth?: string | null
          dew?: string | null
          dna_date?: string | null
          dna_labor?: string | null
          ed?: string | null
          faehrte?: string | null
          gender?: string | null
          hd?: string | null
          health_date?: string | null
          health_vet?: string | null
          height_cm?: number | null
          herz?: string | null
          id?: string
          is_approved_for_breeding?: boolean | null
          kennel?: string | null
          mdr1?: string | null
          name: string
          notes?: string | null
          obedience?: string | null
          owner?: string | null
          photo_url?: string | null
          reg_name?: string | null
          registry_number?: string | null
          registry_org?: string | null
          schutzdienst?: string | null
          sire_id?: string | null
          sire_name?: string | null
          sport?: string | null
          titles_notes?: string | null
          updated_at?: string | null
          weight_kg?: number | null
          workingdog_id?: string | null
          workingdog_url?: string | null
          zuchteigung?: string | null
        }
        Update: {
          augen?: string | null
          breeder?: string | null
          breeding_approved?: string | null
          chip_number?: string | null
          coat_type?: string | null
          coi_genomic?: number | null
          country_of_birth?: string | null
          country_of_residence?: string | null
          created_at?: string | null
          dam_id?: string | null
          dam_name?: string | null
          date_of_birth?: string | null
          dew?: string | null
          dna_date?: string | null
          dna_labor?: string | null
          ed?: string | null
          faehrte?: string | null
          gender?: string | null
          hd?: string | null
          health_date?: string | null
          health_vet?: string | null
          height_cm?: number | null
          herz?: string | null
          id?: string
          is_approved_for_breeding?: boolean | null
          kennel?: string | null
          mdr1?: string | null
          name?: string
          notes?: string | null
          obedience?: string | null
          owner?: string | null
          photo_url?: string | null
          reg_name?: string | null
          registry_number?: string | null
          registry_org?: string | null
          schutzdienst?: string | null
          sire_id?: string | null
          sire_name?: string | null
          sport?: string | null
          titles_notes?: string | null
          updated_at?: string | null
          weight_kg?: number | null
          workingdog_id?: string | null
          workingdog_url?: string | null
          zuchteigung?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dogs_dam_id_fkey"
            columns: ["dam_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dogs_sire_id_fkey"
            columns: ["sire_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
