export function SearchBar({ searchQuery, onSearchChange, bestMatch, onPokemonSelect }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && bestMatch) {
      onPokemonSelect(bestMatch);
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
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
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
