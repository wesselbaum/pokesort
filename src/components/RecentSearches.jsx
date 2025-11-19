import { useState, useMemo } from 'react';

export function RecentSearches({ recentPokemon, onPokemonClick, onClear, language }) {
  const [sortByNumber, setSortByNumber] = useState(false);

  const sortedPokemon = useMemo(() => {
    if (!sortByNumber) {
      return recentPokemon;
    }
    return [...recentPokemon].sort((a, b) => a.number - b.number);
  }, [recentPokemon, sortByNumber]);

  if (recentPokemon.length === 0) {
    return null;
  }

  const lastAddedId = recentPokemon[0]?.id;

  return (
    <div className="recent-searches">
      <div className="recent-header">
        <span>Recent</span>
        <div className="recent-header-actions">
          <button
            onClick={() => setSortByNumber(!sortByNumber)}
            className="sort-toggle-button"
            aria-label={sortByNumber ? "Sort by recent" : "Sort by number"}
          >
            {sortByNumber ? '🔢' : '🕒'}
          </button>
          <button onClick={onClear} className="clear-recent-button">
            Clear
          </button>
        </div>
      </div>
      <div className="recent-list">
        {sortedPokemon.map((pokemon) => {
          const displayName = language === 'de' ? pokemon.nameDe : pokemon.nameEn;
          const isLastAdded = pokemon.id === lastAddedId;
          return (
            <div
              key={pokemon.id}
              className={`recent-item ${isLastAdded ? 'recent-item-highlight' : ''}`}
              onClick={() => onPokemonClick(pokemon)}
            >
              #{pokemon.number} | {displayName}
            </div>
          );
        })}
      </div>
    </div>
  );
}
