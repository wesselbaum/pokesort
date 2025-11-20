import { useState, useMemo, useDeferredValue } from 'react';
import { getAllPokemon, searchPokemon } from '../services/pokemonData';

export function usePokemon() {
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const allPokemon = useMemo(() => getAllPokemon(), []);

  const searchResults = useMemo(() => {
    return searchPokemon(deferredSearchQuery);
  }, [deferredSearchQuery]);

  return {
    allPokemon,
    filteredPokemon: searchResults.results,
    bestMatch: searchResults.bestMatch,
    searchQuery,
    setSearchQuery
  };
}
