import { useCallback, useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { PokemonList } from './components/PokemonList';
import { RecentSearches } from './components/RecentSearches';
import { usePokemon } from './hooks/usePokemon';
import { useLocalStorage } from './hooks/useLocalStorage';
import './App.css';

function App() {
  const { allPokemon, filteredPokemon, bestMatch, searchQuery, setSearchQuery } = usePokemon();
  const [recentPokemon, setRecentPokemon] = useLocalStorage('recentPokemon', []);
  const [language, setLanguage] = useState('de');

  const handlePokemonClick = useCallback((pokemon) => {
    setRecentPokemon((prev) => {
      const filtered = prev.filter((p) => p.id !== pokemon.id);
      return [pokemon, ...filtered].slice(0, 10);
    });
  }, [setRecentPokemon]);

  const handleClearRecent = useCallback(() => {
    setRecentPokemon([]);
  }, [setRecentPokemon]);

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'de' ? 'en' : 'de');
  }, []);

  return (
    <div className="app">
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        bestMatch={bestMatch}
        onPokemonSelect={handlePokemonClick}
        language={language}
        onToggleLanguage={toggleLanguage}
      />

      <main className="app-main">
        <PokemonList
          allPokemon={allPokemon}
          filteredPokemon={filteredPokemon}
          bestMatch={bestMatch}
          onPokemonClick={handlePokemonClick}
          language={language}
        />
      </main>

      <RecentSearches
        recentPokemon={recentPokemon}
        onPokemonClick={handlePokemonClick}
        onClear={handleClearRecent}
        language={language}
      />
    </div>
  );
}

export default App;
