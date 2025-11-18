import { memo } from 'react';

export const PokemonListItem = memo(function PokemonListItem({ pokemon, onClick, language }) {
  const displayName = language === 'de' ? pokemon.nameDe : pokemon.nameEn;

  return (
    <div className="pokemon-item" onClick={() => onClick(pokemon)}>
      <img
        src={pokemon.sprite}
        alt={pokemon.nameEn}
        className="pokemon-sprite"
        loading="lazy"
      />
      <div className="pokemon-info">
        <div className="pokemon-number">#{pokemon.number}</div>
        <div className="pokemon-name">{displayName}</div>
      </div>
    </div>
  );
});
