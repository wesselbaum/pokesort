export function RecentSearches({ recentPokemon, onPokemonClick, onClear }) {
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
        {recentPokemon.map((pokemon) => (
          <div
            key={pokemon.id}
            className="recent-item"
            onClick={() => onPokemonClick(pokemon)}
          >
            #{pokemon.number} | {pokemon.nameDe} | {pokemon.nameEn}
          </div>
        ))}
      </div>
    </div>
  );
}
