import pokemonData from '../data/pokemon.json';

export function getAllPokemon() {
  return pokemonData;
}

export function getPokemonById(id) {
  return pokemonData.find(pokemon => pokemon.id === id);
}

export function searchPokemon(query) {
  if (!query) return pokemonData;

  const lowerQuery = query.toLowerCase().trim();

  return pokemonData.filter(pokemon =>
    pokemon.nameEn.toLowerCase().includes(lowerQuery) ||
    pokemon.nameDe.toLowerCase().includes(lowerQuery) ||
    pokemon.number.includes(lowerQuery)
  );
}
