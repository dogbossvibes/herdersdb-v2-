-- HerdersDB Datenbankschema
-- Ausfuehren in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS dogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  name VARCHAR(120) NOT NULL,
  reg_name VARCHAR(120),
  gender VARCHAR(20),
  date_of_birth DATE,
  coat_type VARCHAR(20),
  country_of_birth VARCHAR(50),
  country_of_residence VARCHAR(50),
  chip_number VARCHAR(20) UNIQUE,
  registry_number VARCHAR(40),
  registry_org VARCHAR(30),
  workingdog_id VARCHAR(20),
  height_cm SMALLINT,
  weight_kg DECIMAL(4,1),
  sire_id UUID REFERENCES dogs(id),
  dam_id UUID REFERENCES dogs(id),
  sire_name VARCHAR(120),
  dam_name VARCHAR(120),
  hd VARCHAR(30),
  ed VARCHAR(30),
  augen VARCHAR(30),
  herz VARCHAR(30),
  health_date DATE,
  health_vet VARCHAR(100),
  mdr1 VARCHAR(30),
  dew VARCHAR(30),
  dna_labor VARCHAR(30),
  dna_date DATE,
  coi_genomic DECIMAL(5,2),
  schutzdienst VARCHAR(100),
  faehrte VARCHAR(100),
  obedience VARCHAR(100),
  sport VARCHAR(100),
  zuchteigung VARCHAR(30),
  titles_notes TEXT,
  owner VARCHAR(100),
  breeder VARCHAR(100),
  kennel VARCHAR(100),
  breeding_approved VARCHAR(20),
  workingdog_url TEXT,
  is_approved_for_breeding BOOLEAN DEFAULT false,
  photo_url TEXT,
  notes TEXT
);

-- Sicherheit (RLS)
ALTER TABLE dogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon lesen" ON dogs FOR SELECT TO anon USING (true);
CREATE POLICY "anon einfuegen" ON dogs FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon aktualisieren" ON dogs FOR UPDATE TO anon USING (true) WITH CHECK (true);