import { memo } from 'react';
import { PokemonListItem } from './PokemonListItem';

export const PokemonList = memo(function PokemonList({ pokemon, onPokemonClick, language }) {
  if (pokemon.length === 0) {
    return (
      <div className="empty-state">
        <p>No Pokemon found</p>
      </div>
    );
  }

  return (
    <div className="pokemon-list">
      {pokemon.map((poke) => (
        <PokemonListItem
          key={poke.id}
          pokemon={poke}
          onClick={onPokemonClick}
          language={language}
        />
      ))}
    </div>
  );
});
