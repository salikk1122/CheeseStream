# CheeseStream

A production-quality streaming catalog web app built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**. Browse movies and TV shows powered by [TMDB](https://www.themoviedb.org/) metadata, watch official YouTube trailers, and save titles to your personal watchlist.

![CheeseStream](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwindcss)

## Features

- **Home page** with auto-rotating hero banner and multiple content carousels
- **Movies & TV Shows** browse pages with genre filtering
- **Detail pages** with cast, metadata, and "More Like This" recommendations
- **Search** with debounced live results
- **My List** watchlist persisted in localStorage via Zustand
- **Watch page** with official YouTube trailer embeds (via TMDB)
- Dark cheese-themed UI with amber accent color (`#F5C518`)
- Fully responsive, Netflix-style poster grid with hover effects
- ISR caching (1-hour revalidation) for TMDB API calls

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State | Zustand (watchlist) |
| Carousels | embla-carousel-react |
| Icons | lucide-react |
| Video | react-player (YouTube embeds only) |
| Data | TMDB API v3 |

## Getting Started

### 1. Get a TMDB API Key

1. Create a free account at [themoviedb.org](https://www.themoviedb.org/signup)
2. Go to **Settings → API** and request an API key (Developer / Personal use)
3. Copy your **API Read Access Token** (v4 auth / Bearer token)

### 2. Configure Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with **either** credential (both works best):

```
# v4 read access token (recommended — from TMDB Settings → API → API Read Access Token)
API_READ_ACCESS_TOKEN=eyJ...

# OR v3 API key (32-character hex string)
TMDB_API_KEY=your_v3_api_key_here
```

> **Note:** These are two different values from your TMDB account. The read access token is a long JWT starting with `eyJ`. The v3 API key is a short hex string. Do not use the v3 key as a Bearer token.

### 3. Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Home
│   ├── movies/             # Movies browse
│   ├── shows/              # TV Shows browse
│   ├── search/             # Search results
│   ├── my-list/            # Watchlist
│   ├── title/[type]/[id]/  # Detail page
│   └── watch/[type]/[id]/  # Trailer player
├── components/             # Reusable UI components
├── lib/
│   ├── tmdb.ts             # TMDB API helpers
│   └── utils.ts            # Image URLs, formatting
├── store/
│   └── watchlist.ts        # Zustand watchlist store
└── types/
    └── index.ts            # TypeScript interfaces
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Home with hero + carousels |
| `/movies` | Movie grid with genre filter |
| `/shows` | TV show grid with genre filter |
| `/title/movie/[id]` | Movie detail page |
| `/title/tv/[id]` | TV show detail page |
| `/search?q=...` | Search results |
| `/my-list` | Saved watchlist |
| `/watch/movie/[id]` | Movie trailer player |
| `/watch/tv/[id]` | TV trailer player |

## Important Notes

- **No pirated content.** CheeseStream only embeds official YouTube trailers fetched from TMDB's `/videos` endpoint. There is no full-length streaming.
- **API key security.** Never commit `.env.local` or hardcode your TMDB key.
- **TMDB attribution.** This product uses the TMDB API but is not endorsed or certified by TMDB.

## License

MIT — for demo and educational purposes.
