import pokemonData from '../data/pokemon.json';
import Fuse from 'fuse.js';

// Initialize Fuse.js with configuration
const fuseOptions = {
  keys: [
    { name: 'nameEn', weight: 0.4 },
    { name: 'nameDe', weight: 0.4 },
    { name: 'number', weight: 0.2 }
  ],
  threshold: 0.4, // 0 = perfect match, 1 = match anything
  includeScore: true,
  minMatchCharLength: 1,
  ignoreLocation: true, // Search entire string, not just beginning
};

const fuse = new Fuse(pokemonData, fuseOptions);

export function getAllPokemon() {
  return pokemonData;
}

export function getPokemonById(id) {
  return pokemonData.find(pokemon => pokemon.id === id);
}

export function searchPokemon(query) {
  if (!query) return { results: pokemonData, bestMatch: null };

  const trimmedQuery = query.trim();

  // Use Fuse.js for fuzzy search
  const results = fuse.search(trimmedQuery);

  // Extract items and identify best match (first result has lowest score = best match)
  const items = results.map(result => result.item);
  const bestMatch = items.length > 0 ? items[0] : null;

  return { results: items, bestMatch };
}
