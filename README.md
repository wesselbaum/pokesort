# PokéSort

A React-based web application to browse and search Pokemon with German and English names.

## Features

- Browse all 1025 Pokemon (Generations 1-9)
- Search by Pokemon name (German or English) or Pokedex number
- View Pokemon sprites and information
- Recent searches history (stored in localStorage)
- Responsive design for mobile and desktop

## Tech Stack

- React 19
- Vite
- PokeAPI data (pre-fetched and stored locally)

## Getting Started

### Installation

```bash
npm install
```

### Initial Setup (One-time)

The Pokemon data has already been fetched and stored in `src/data/pokemon.json`. If you need to refresh the data, run:

```bash
npm run fetch-data
```

This will fetch all Pokemon data from PokeAPI and update the local JSON file.

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
pokesort/
├── scripts/
│   └── fetchPokemonData.js    # One-time data fetch script
├── src/
│   ├── components/            # React components
│   │   ├── PokemonList.jsx
│   │   ├── PokemonListItem.jsx
│   │   ├── SearchBar.jsx
│   │   └── RecentSearches.jsx
│   ├── data/
│   │   └── pokemon.json       # Pre-fetched Pokemon data
│   ├── hooks/
│   │   ├── usePokemon.js
│   │   └── useLocalStorage.js
│   ├── services/
│   │   └── pokemonData.js
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
└── package.json
```

## How It Works

1. Pokemon data is fetched once during setup and stored in a local JSON file
2. The application loads all data from this static file (no runtime API calls)
3. Search and filtering happens entirely on the client side
4. Recently clicked Pokemon are stored in localStorage for persistence

## Data Source

All Pokemon data is sourced from [PokeAPI](https://pokeapi.co/).
