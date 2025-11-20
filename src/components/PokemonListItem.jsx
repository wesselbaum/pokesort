import { memo } from 'react';

export const PokemonListItem = memo(function PokemonListItem({ pokemon, onClick, language, isVisible, isBestMatch }) {
  const displayName = language === 'de' ? pokemon.nameDe : pokemon.nameEn;

  return (
    <div
      className={`pokemon-item ${isBestMatch ? 'pokemon-item-best-match' : ''}`}
      onClick={() => onClick(pokemon)}
      style={{ display: isVisible ? 'flex' : 'none' }}
    >
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
