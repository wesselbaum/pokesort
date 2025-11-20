import { memo, useMemo } from 'react';
import { PokemonListItem } from './PokemonListItem';

export const PokemonList = memo(function PokemonList({ allPokemon, filteredPokemon, bestMatch, onPokemonClick, language }) {
  const visibleIds = useMemo(() => {
    return new Set(filteredPokemon.map(p => p.id));
  }, [filteredPokemon]);

  const hasVisiblePokemon = filteredPokemon.length > 0;

  return (
    <>
      {!hasVisiblePokemon && (
        <div className="empty-state">
          <p>No Pokemon found</p>
        </div>
      )}
      <div className="pokemon-list">
        {allPokemon.map((poke) => (
          <PokemonListItem
            key={poke.id}
            pokemon={poke}
            onClick={onPokemonClick}
            language={language}
            isVisible={visibleIds.has(poke.id)}
            isBestMatch={bestMatch && poke.id === bestMatch.id}
          />
        ))}
      </div>
    </>
  );
});
