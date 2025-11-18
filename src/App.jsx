import { useCallback } from 'react';
import { SearchBar } from './components/SearchBar';
import { PokemonList } from './components/PokemonList';
import { RecentSearches } from './components/RecentSearches';
import { usePokemon } from './hooks/usePokemon';
import { useLocalStorage } from './hooks/useLocalStorage';
import './App.css';

function App() {
  const { filteredPokemon, searchQuery, setSearchQuery } = usePokemon();
  const [recentPokemon, setRecentPokemon] = useLocalStorage('recentPokemon', []);

  const handlePokemonClick = useCallback((pokemon) => {
    setRecentPokemon((prev) => {
      const filtered = prev.filter((p) => p.id !== pokemon.id);
      return [pokemon, ...filtered].slice(0, 10);
    });
  }, [setRecentPokemon]);

  const handleClearRecent = useCallback(() => {
    setRecentPokemon([]);
  }, [setRecentPokemon]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>PokéSort</h1>
      </header>

      <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="app-main">
        <PokemonList pokemon={filteredPokemon} onPokemonClick={handlePokemonClick} />
      </main>

      <RecentSearches
        recentPokemon={recentPokemon}
        onPokemonClick={handlePokemonClick}
        onClear={handleClearRecent}
      />
    </div>
  );
}

export default App;
