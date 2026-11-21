# ABC Adventure

A mobile-first alphabet adventure. The child finds printed letter cards around the house, scans their QR codes, and every three letters moves the story forward.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000, sign in with Google, then use the gear button → **Print alphabet QR cards**.

## Setup

**Supabase env** — `.env.local` (see `.env.example`):

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

**Google sign-in** (one time):

1. Google Cloud Console → APIs & Services → Credentials → create an **OAuth client ID** (Web application).
   Authorized redirect URI: `https://<project-ref>.supabase.co/auth/v1/callback`
2. Supabase dashboard → Authentication → Sign In / Providers → **Google**: enable it, paste the client ID and secret.
3. Supabase dashboard → Authentication → URL Configuration: add `http://localhost:3000/auth/callback` (and your production URL's `/auth/callback`) to **Redirect URLs**.

**Camera on a phone** — browsers only allow the camera on `https` pages (or `localhost`). To play on a phone, deploy (e.g. Vercel) or expose the dev server through an https tunnel. The scanner also has a "type a code" fallback for testing on desktop.

## How it's built

```
app/                    routes: / (themes), /game/[themeId], /print, /login, /auth/callback
proxy.ts                refreshes the Supabase session; signed-out visitors go to /login
lib/
  alphabet.ts           letters, words, and the 9 letter Sets
  qr.ts                 QR payload format  ABCADVENTURE:LETTER:A
  game-engine.ts        pure, theme-agnostic rules (scan, set complete, finale, sessions)
  progress.ts           the save shape (one object, ready to move to a Supabase row)
  storage.ts            LocalStorage persistence (swap this file for Supabase later)
  sound.ts              synthesized sound effects, melodies and speech (no audio files)
hooks/                  useGameProgress, useSound
themes/                 content packages: story, characters, scene art, finale
components/art/         shared SVG animal characters
components/game/        screens: Home, Intro, Challenge, Scanner, Success, Story, Finale
components/ui/          buttons, icons, confetti, grown-up confirm dialog
```

### Adding a Theme

1. Create `themes/<id>/` with an `index.ts` exporting a `GameTheme` (see `themes/types.ts`) and a `Scene` component that draws the scene for `stage` 0–9 and `mode` `"finale"`.
2. Register it in `themes/index.ts` and add the id to `themes/ids.ts`.

No changes to the engine or screens are needed.
