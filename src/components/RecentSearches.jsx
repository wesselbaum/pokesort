export function RecentSearches({ recentPokemon, onPokemonClick, onClear, language }) {
  if (recentPokemon.length === 0) {
    return null;
  }

  return (
    <div className="recent-searches">
      <div className="recent-header">
        <span>Recent</span>
        <button onClick={onClear} className="clear-recent-button">
          Clear
        </button>
      </div>
      <div className="recent-list">
        {recentPokemon.map((pokemon) => {
          const displayName = language === 'de' ? pokemon.nameDe : pokemon.nameEn;
          return (
            <div
              key={pokemon.id}
              className="recent-item"
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
