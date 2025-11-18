import { useState, useMemo } from 'react';
import { getAllPokemon, searchPokemon } from '../services/pokemonData';

export function usePokemon() {
  const [searchQuery, setSearchQuery] = useState('');
  const allPokemon = useMemo(() => getAllPokemon(), []);

  const filteredPokemon = useMemo(() => {
    return searchPokemon(searchQuery);
  }, [searchQuery]);

  return {
    allPokemon,
    filteredPokemon,
    searchQuery,
    setSearchQuery
  };
}
