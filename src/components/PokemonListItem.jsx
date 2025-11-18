export function PokemonListItem({ pokemon, onClick }) {
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
        <div className="pokemon-name-de">{pokemon.nameDe}</div>
        <div className="pokemon-name-en">{pokemon.nameEn}</div>
      </div>
    </div>
  );
}
