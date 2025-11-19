export function SearchBar({ searchQuery, onSearchChange, filteredPokemon, onPokemonSelect }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && filteredPokemon.length === 1) {
      onPokemonSelect(filteredPokemon[0]);
      onSearchChange('');
    } else if (e.key === 'Escape') {
      onSearchChange('');
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search by name or number..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="search-input"
      />
      {searchQuery && (
        <button
          onClick={() => onSearchChange('')}
          className="clear-button"
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
}
