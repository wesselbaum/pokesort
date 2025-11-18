# Pokemon Web Application - Project Plan

## Project Overview
A React-based web application to browse and search Pokemon using data from PokeAPI. The application will display all Pokemon in a list format with search functionality and maintain a history of recently searched Pokemon.

## Technology Stack
- **Framework**: React 18
- **Build Tool**: Vite
- **Data Source**: PokeAPI (https://pokeapi.co/)
- **Styling**: CSS Modules or Styled Components (TBD)
- **State Management**: React useState/useContext (or Zustand for more complex state)
- **HTTP Client**: Fetch API or Axios

## Application Requirements

### Main Pokemon List
- Display all current Pokemon (Generation 1-9)
- Each list item contains:
  - Pokemon sprite image (left side)
  - National Pokedex number (large, prominent)
  - German name (smaller text)
  - English name (smaller text)

### Search Functionality
- Search field at the top of the page
- Filter Pokemon by name (German or English) or Pokedex number
- Real-time search filtering

### Recent Searches Bar
- Located at the bottom of the page
- Display last searched/clicked Pokemon
- Show: Pokedex number + German name + English name
- Displayed horizontally next to each other
- Clickable to quickly access previously viewed Pokemon

## Implementation Plan

### Phase 1: Project Setup (30 minutes)
1. Initialize Vite + React project
   ```bash
   npm create vite@latest pokesort -- --template react
   cd pokesort
   npm install
   ```
2. Install additional dependencies:
   ```bash
   npm install axios
   ```
3. Set up project structure:
   ```
   src/
   ├── components/
   │   ├── PokemonList.jsx
   │   ├── PokemonListItem.jsx
   │   ├── SearchBar.jsx
   │   └── RecentSearches.jsx
   ├── hooks/
   │   └── usePokemon.js
   ├── services/
   │   └── pokeapi.js
   ├── utils/
   │   └── storage.js
   ├── App.jsx
   └── main.jsx
   ```

### Phase 2: One-Time Data Initialization (1-2 hours)
**Goal**: Fetch all Pokemon data from PokeAPI once during setup and store it locally as a static JSON file.

1. **Create Data Fetching Script** (`scripts/fetchPokemonData.js`):
   - Node.js script to run once during setup
   - Fetches all Pokemon data and saves to static JSON file
   - Should be run with: `node scripts/fetchPokemonData.js`

2. **Key PokeAPI Endpoints to Use**:
   - List all Pokemon: `https://pokeapi.co/api/v2/pokemon?limit=1025`
   - Pokemon details: `https://pokeapi.co/api/v2/pokemon/{id}`
   - Pokemon species: `https://pokeapi.co/api/v2/pokemon-species/{id}`
     (Contains German names in `names` array with `language.name === "de"`)

3. **Script Implementation Steps**:
   - Fetch the complete list of Pokemon (IDs 1-1025)
   - For each Pokemon, fetch both:
     - `/pokemon/{id}` - for sprite URLs
     - `/pokemon-species/{id}` - for German names
   - Implement rate limiting/delays to respect PokeAPI limits (e.g., 100ms delay between requests)
   - Show progress indicator in console
   - Combine data into single JSON structure:
     ```json
     [
       {
         "id": 1,
         "number": "001",
         "nameEn": "Bulbasaur",
         "nameDe": "Bisasam",
         "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
       },
       ...
     ]
     ```
   - Save to `src/data/pokemon.json`

4. **Create Data Service** (`services/pokemonData.js`):
   - Simple import of the static JSON file
   - Export helper functions to query the data:
     - `getAllPokemon()` - returns complete list
     - `getPokemonById(id)` - returns single Pokemon
     - `searchPokemon(query)` - filters by name or number

5. **Update Project Structure**:
   ```
   pokesort/
   ├── scripts/
   │   └── fetchPokemonData.js
   ├── src/
   │   ├── data/
   │   │   └── pokemon.json (generated)
   │   ├── services/
   │   │   └── pokemonData.js
   ```

6. **Update package.json Scripts**:
   ```json
   "scripts": {
     "fetch-data": "node scripts/fetchPokemonData.js",
     "dev": "vite",
     "build": "vite build"
   }
   ```

7. **Setup Instructions**:
   - Run `npm run fetch-data` once before first development
   - This generates `src/data/pokemon.json`
   - Application will use this static file (no runtime API calls)
   - Re-run only when new Pokemon are released

**Benefits of This Approach**:
- No runtime API calls (faster app performance)
- No rate limiting issues
- Works offline after initial setup
- Predictable data structure
- All data available immediately on app load

### Phase 3: Custom Hooks (45 minutes)
1. **usePokemon Hook** (`hooks/usePokemon.js`):
   - Load Pokemon data from static JSON file
   - Provide filtered Pokemon list based on search query
   - Handle search/filter logic
   - No need for loading states (data is already available)

2. **useLocalStorage Hook**:
   - Persist recent searches to localStorage
   - Restore recent searches on app load

### Phase 4: Component Development (2-3 hours)

#### 4.1 SearchBar Component
- Input field with search icon
- Real-time onChange handler
- Clear button to reset search
- Placeholder text: "Search by name or number..."

#### 4.2 PokemonListItem Component
- Display Pokemon sprite (official-artwork or front_default)
- Large Pokedex number (#001, #025, etc.)
- German name (smaller, secondary text)
- English name (smaller, secondary text)
- onClick handler to add to recent searches
- Responsive layout (image | content)

#### 4.3 PokemonList Component
- Container for all Pokemon list items
- Virtual scrolling or pagination for performance (optional but recommended)
- Loading state skeleton/spinner
- Empty state for no search results

#### 4.4 RecentSearches Component
- Fixed position at bottom of screen
- Horizontal scrollable list
- Display last 5-10 Pokemon
- Each item shows: #number | German name | English name
- onClick to scroll to Pokemon in main list or filter
- Clear recent searches button

### Phase 5: Main App Component (1 hour)
1. Integrate all components
2. Manage global state:
   - All Pokemon data
   - Search query
   - Recent searches array
3. Implement search logic
4. Handle Pokemon click events

### Phase 6: Styling (2-3 hours)
1. Create responsive layout:
   - Search bar: sticky at top
   - Pokemon list: main scrollable area
   - Recent searches: fixed at bottom

2. Design considerations:
   - Clean, modern UI
   - Pokemon-themed colors (optional)
   - Proper spacing and typography hierarchy
   - Mobile-responsive design
   - Loading states and transitions

3. CSS Structure:
   - Use CSS Modules or styled-components
   - Create reusable style utilities
   - Ensure accessibility (focus states, contrast)

### Phase 7: Performance Optimization (1 hour)
1. Implement virtual scrolling (react-window or react-virtual)
2. Lazy load Pokemon images
3. Debounce search input
4. Memoize expensive computations (filtering, searching)
5. Consider code splitting if bundle size is large

### Phase 8: Testing & Polish (1-2 hours)
1. Test search functionality
2. Test recent searches persistence
3. Test on different screen sizes
4. Handle edge cases:
   - Missing pokemon.json file (show error message)
   - No search results
   - Invalid search queries
5. Add smooth transitions and animations
6. Add error boundaries
7. Verify all 1025 Pokemon are displayed correctly

## Data Strategy

### One-Time Setup
1. Run `npm run fetch-data` to generate `src/data/pokemon.json`
2. Script fetches all Pokemon data from PokeAPI and saves locally
3. This needs to be run only once (or when new Pokemon are released)

### Runtime Data Usage
1. Import static JSON file in the application
2. All Pokemon data is immediately available (no loading state needed)
3. Search and filter operations work purely on local data
4. No API calls during runtime

### Benefits
- Instant data availability (no API delays)
- Works completely offline
- No rate limiting concerns
- Predictable, consistent data structure
- Better performance and user experience

## Key Challenges & Solutions

### Challenge 1: Getting German Names
**Problem**: PokeAPI's `/pokemon` endpoint only provides English names.
**Solution**: Fetch from `/pokemon-species/{id}` endpoint which contains `names` array with multiple languages including German (`language.name === "de"`).

### Challenge 2: Performance with 1000+ Pokemon
**Problem**: Rendering 1000+ items can cause performance issues.
**Solutions**:
- Virtual scrolling (only render visible items)
- Pagination
- Lazy loading of images and data

### Challenge 3: Initial Data Fetching Time
**Problem**: Fetching data for 1025+ Pokemon during setup takes time.
**Solutions**:
- Implement rate limiting in fetch script (e.g., 100ms delay between requests)
- Show progress indicator in console during data fetch
- Batch requests where possible (10-20 concurrent requests)
- One-time operation - only needs to be run during initial setup
- Generated JSON file is committed to repository so end users don't need to fetch

## Future Enhancements (Post-MVP)
- Filter by Pokemon type, generation, or region
- Detailed Pokemon view (stats, abilities, evolution chain)
- Comparison feature
- Favorites/bookmarks
- Dark mode
- Multiple language support (not just German/English)
- PWA capabilities for offline use
- Sort options (by name, number, type)

## Timeline Estimate
- **Total Development Time**: 9-13 hours
- **Phase 1**: 30 minutes (project setup)
- **Phase 2**: 1-2 hours (one-time data fetch script - run once)
- **Phase 3**: 45 minutes (custom hooks)
- **Phase 4**: 2-3 hours (components)
- **Phase 5**: 1 hour (main app)
- **Phase 6**: 2-3 hours (styling)
- **Phase 7**: 1 hour (optimization)
- **Phase 8**: 1-2 hours (testing & polish)

## Getting Started Command Sequence
```bash
# Create project
npm create vite@latest pokesort -- --template react

# Navigate and install
cd pokesort
npm install

# Install additional dependencies
npm install axios

# Fetch Pokemon data (ONE-TIME SETUP)
npm run fetch-data

# Start development server
npm run dev
```

**Note**: The `npm run fetch-data` command is a one-time operation that fetches all Pokemon data from PokeAPI and saves it to `src/data/pokemon.json`. This may take 10-20 minutes to complete due to rate limiting, but only needs to be run once.

## File Structure (Final)
```
pokesort/
├── scripts/
│   └── fetchPokemonData.js (one-time setup script)
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── PokemonList.jsx
│   │   ├── PokemonListItem.jsx
│   │   ├── SearchBar.jsx
│   │   └── RecentSearches.jsx
│   ├── data/
│   │   └── pokemon.json (generated by fetch script)
│   ├── hooks/
│   │   ├── usePokemon.js
│   │   └── useLocalStorage.js
│   ├── services/
│   │   └── pokemonData.js (imports pokemon.json)
│   ├── utils/
│   │   ├── storage.js
│   │   └── helpers.js
│   ├── styles/
│   │   ├── App.css
│   │   └── components/
│   ├── App.jsx
│   └── main.jsx
├── .gitignore (optional: exclude node_modules, dist)
├── package.json
├── vite.config.js
├── index.html
└── README.md
```

## Notes
- Start with a simple implementation and iterate
- **IMPORTANT**: Run `npm run fetch-data` once during initial setup before development
- The generated `pokemon.json` file should be committed to the repository
- Focus on core functionality first (list + search)
- Add recent searches feature once basic functionality works
- Consider using TypeScript for better type safety (optional)
- Use React DevTools for debugging
- No runtime API calls means faster, more reliable application
