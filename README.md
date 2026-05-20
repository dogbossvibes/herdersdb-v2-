# HerdersDB

Zuchtdatenbank für Holländische Schäferhunde (Wereldwijd).

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Sprache**: TypeScript
- **Datenbank**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Lokale Entwicklung

### Voraussetzungen
- Node.js 18+
- npm oder yarn

### Setup

```bash
# 1. Repository klonen
git clone https://github.com/dogbossvibes/herdersdb.git
cd herdersdb

# 2. Abhängigkeiten installieren
npm install

# 3. Umgebungsvariablen einrichten
cp .env.example .env.local
# Dann .env.local mit den Supabase Keys befüllen

# 4. Entwicklungsserver starten
npm run dev
```

App läuft auf http://localhost:3000

## Umgebungsvariablen

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
```

## Projektstruktur

```
src/
  app/                  # Next.js App Router (Seiten)
    page.tsx            # Startseite / Hundeliste
    hunde/
      page.tsx          # Hundeliste
    erfassen/
      page.tsx          # Hund erfassen
    layout.tsx          # Hauptlayout mit Navigation
  components/
    ui/                 # Wiederverwendbare UI-Elemente
      Button.tsx
      Input.tsx
      Select.tsx
      Card.tsx
    dogs/               # Hund-spezifische Komponenten
      DogCard.tsx       # Hund in der Liste
      DogDetail.tsx     # Hund Detailansicht
      DogForm.tsx       # Formular (Erfassen + Bearbeiten)
      PedigreeSection.tsx  # Stammbaum-Abschnitt
  services/
    dogs.ts             # Alle Supabase-Aufrufe für Hunde
  types/
    dog.ts              # TypeScript Typen
  lib/
    supabase.ts         # Supabase Client
```

## Mitarbeiten

1. Neuen Branch erstellen: `git checkout -b feature/mein-feature`
2. Änderungen machen
3. Commit: `git commit -m "Beschreibung der Änderung"`
4. Push: `git push origin feature/mein-feature`
5. Pull Request auf GitHub erstellen

## Datenbank Schema

Siehe `supabase/schema.sql` für das vollständige Schema.
