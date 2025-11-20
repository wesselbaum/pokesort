import { useRef } from 'react';

export function SearchBar({ searchQuery, onSearchChange, bestMatch, onPokemonSelect, language, onToggleLanguage }) {
  const inputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && bestMatch) {
      onPokemonSelect(bestMatch);
      onSearchChange('');
    } else if (e.key === 'Escape') {
      onSearchChange('');
    }
  };

  const handleClear = () => {
    onSearchChange('');
    inputRef.current?.focus();
  };

  return (
    <div className="search-bar">
      <input
        ref={inputRef}
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
          onClick={handleClear}
          className="clear-button"
          aria-label="Clear search"
        >
          ×
        </button>
      )}
      <button
        className="language-toggle"
        onClick={onToggleLanguage}
        aria-label="Toggle language"
      >
        {language === 'de' ? 'DE' : 'EN'}
      </button>
    </div>
  );
}
