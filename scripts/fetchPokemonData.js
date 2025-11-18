import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOTAL_POKEMON = 1025;
const DELAY_MS = 100;
const BATCH_SIZE = 20;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchPokemonData() {
  console.log(`Starting to fetch data for ${TOTAL_POKEMON} Pokemon...`);
  console.log('This may take 10-20 minutes. Please be patient.\n');

  const allPokemon = [];

  for (let i = 1; i <= TOTAL_POKEMON; i++) {
    try {
      process.stdout.write(`\rFetching Pokemon ${i}/${TOTAL_POKEMON} (${Math.round((i / TOTAL_POKEMON) * 100)}%)`);

      const [pokemonResponse, speciesResponse] = await Promise.all([
        axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`),
        axios.get(`https://pokeapi.co/api/v2/pokemon-species/${i}`)
      ]);

      const pokemonData = pokemonResponse.data;
      const speciesData = speciesResponse.data;

      // Find German name
      const germanName = speciesData.names.find(name => name.language.name === 'de');
      const englishName = speciesData.names.find(name => name.language.name === 'en');

      // Get sprite
      const sprite = pokemonData.sprites.other?.['official-artwork']?.front_default ||
                     pokemonData.sprites.front_default;

      const pokemon = {
        id: pokemonData.id,
        number: String(pokemonData.id).padStart(3, '0'),
        nameEn: englishName?.name || pokemonData.name,
        nameDe: germanName?.name || pokemonData.name,
        sprite: sprite
      };

      allPokemon.push(pokemon);

      // Respect rate limiting
      if (i % BATCH_SIZE === 0) {
        await delay(DELAY_MS * 5); // Longer delay after batch
      } else {
        await delay(DELAY_MS);
      }

    } catch (error) {
      console.error(`\nError fetching Pokemon #${i}:`, error.message);
      // Continue with next Pokemon
    }
  }

  console.log('\n\nFetch complete! Saving data...');

  // Save to JSON file
  const dataDir = path.join(__dirname, '..', 'src', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const outputPath = path.join(dataDir, 'pokemon.json');
  fs.writeFileSync(outputPath, JSON.stringify(allPokemon, null, 2));

  console.log(`\nSuccessfully saved ${allPokemon.length} Pokemon to ${outputPath}`);
  console.log('You can now run "npm run dev" to start the application.');
}

fetchPokemonData().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
