import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOTAL_POKEMON = 1025;
const DELAY_MS = 100;
const BATCH_SIZE = 20;
const MAX_RETRIES = 5;
const INITIAL_RETRY_DELAY = 1000; // 1 second
const POKEMON_CSV_URL = 'https://raw.githubusercontent.com/PokeAPI/pokeapi/refs/heads/master/data/v2/csv/pokemon.csv';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Retry function with exponential backoff
async function fetchWithRetry(url, retries = MAX_RETRIES) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await axios.get(url);
      return response;
    } catch (error) {
      const isLastAttempt = attempt === retries - 1;
      const isServerError = error.response?.status >= 500;
      const isRateLimited = error.response?.status === 429;

      if (isLastAttempt || (!isServerError && !isRateLimited)) {
        throw error;
      }

      // Exponential backoff: 1s, 2s, 4s, 8s, 16s
      const retryDelay = INITIAL_RETRY_DELAY * Math.pow(2, attempt);
      console.log(`\n⚠️  ${error.response?.status || 'Network'} error for ${url}. Retrying in ${retryDelay/1000}s... (Attempt ${attempt + 1}/${retries})`);
      await delay(retryDelay);
    }
  }
}

// Fetch and parse the Pokemon CSV to get ID to name mappings
async function fetchPokemonCSV() {
  console.log('Fetching Pokemon CSV from GitHub...');
  try {
    const response = await fetchWithRetry(POKEMON_CSV_URL);
    const csvText = response.data;

    // Parse CSV (simple parser for this specific format)
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');

    // Find the column indexes we need
    const idIndex = headers.indexOf('id');
    const identifierIndex = headers.indexOf('identifier');

    const pokemonMap = new Map();

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const id = parseInt(values[idIndex]);
      const name = values[identifierIndex];

      // Extract base form name (everything before the first hyphen for forms)
      // For Pokemon with forms like "tornadus-incarnate" or "dudunsparce-two-segment"
      // we want just "tornadus" or "dudunsparce"
      const existingName = pokemonMap.get(id);

      if (!existingName) {
        // First entry for this ID - extract base name if it's a form
        const baseName = name.includes('-') ? name.split('-')[0] : name;
        pokemonMap.set(id, baseName);
      } else {
        // Already have an entry for this ID, prefer the shorter/base form
        const baseName = name.includes('-') ? name.split('-')[0] : name;

        // If the new base name is shorter (more likely to be the true base form)
        // or if existing has hyphen but current doesn't, replace it
        if (baseName.length < existingName.length || (!name.includes('-') && existingName.includes('-'))) {
          pokemonMap.set(id, baseName);
        }
      }
    }

    console.log(`✓ Loaded ${pokemonMap.size} Pokemon from CSV\n`);
    return pokemonMap;
  } catch (error) {
    console.error('❌ Failed to fetch Pokemon CSV:', error.message);
    throw new Error('Cannot proceed without Pokemon CSV data');
  }
}

// Parse command line arguments for specific Pokemon numbers
function parseArgs() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    return { mode: 'all' };
  }

  // Support formats: node script.js 25 26 27 or node script.js 25-30
  const numbers = new Set();

  for (const arg of args) {
    if (arg.includes('-')) {
      const [start, end] = arg.split('-').map(Number);
      for (let i = start; i <= end; i++) {
        numbers.add(i);
      }
    } else {
      numbers.add(Number(arg));
    }
  }

  return { mode: 'specific', numbers: Array.from(numbers).sort((a, b) => a - b) };
}

// Load existing Pokemon data if available
function loadExistingData(dataPath) {
  if (fs.existsSync(dataPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      console.log(`✓ Loaded ${data.length} existing Pokemon from ${dataPath}\n`);
      return data;
    } catch (error) {
      console.log(`⚠️  Could not load existing data: ${error.message}\n`);
      return [];
    }
  }
  return [];
}

async function fetchPokemonData() {
  const config = parseArgs();
  const dataDir = path.join(__dirname, '..', 'src', 'data');
  const outputPath = path.join(dataDir, 'pokemon.json');

  // Fetch Pokemon CSV to get ID to name mappings
  const pokemonCSVMap = await fetchPokemonCSV();

  // Load existing data
  const existingPokemon = loadExistingData(outputPath);
  const pokemonMap = new Map(existingPokemon.map(p => [p.id, p]));

  let pokemonToFetch;

  if (config.mode === 'all') {
    console.log(`Starting to fetch data for ${TOTAL_POKEMON} Pokemon...`);
    console.log('This may take 10-20 minutes. Please be patient.\n');
    pokemonToFetch = Array.from({ length: TOTAL_POKEMON }, (_, i) => i + 1);
  } else {
    console.log(`Fetching specific Pokemon: ${config.numbers.join(', ')}\n`);
    pokemonToFetch = config.numbers;
  }

  let successCount = 0;
  let errorCount = 0;
  const errors = [];

  for (let i = 0; i < pokemonToFetch.length; i++) {
    const pokemonId = pokemonToFetch[i];
    const pokemonName = pokemonCSVMap.get(pokemonId);

    if (!pokemonName) {
      console.error(`\n❌ No name found for Pokemon ID #${pokemonId} in CSV`);
      errorCount++;
      errors.push({ id: pokemonId, error: 'Name not found in CSV' });
      continue;
    }

    try {
      const progress = config.mode === 'all'
        ? `${i + 1}/${pokemonToFetch.length} (${Math.round(((i + 1) / pokemonToFetch.length) * 100)}%)`
        : `${i + 1}/${pokemonToFetch.length}`;

      process.stdout.write(`\rFetching Pokemon #${pokemonId} (${pokemonName}) [${progress}]`);

      const [pokemonResponse, speciesResponse] = await Promise.all([
        fetchWithRetry(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`),
        fetchWithRetry(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`)
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

      pokemonMap.set(pokemon.id, pokemon);
      successCount++;

      // Respect rate limiting
      if ((i + 1) % BATCH_SIZE === 0) {
        await delay(DELAY_MS * 5); // Longer delay after batch
      } else {
        await delay(DELAY_MS);
      }

    } catch (error) {
      errorCount++;
      errors.push({ id: pokemonId, error: error.message });
      console.error(`\n❌ Error fetching Pokemon #${pokemonId}:`, error.message);
      // Continue with next Pokemon
    }
  }

  console.log('\n\nFetch complete! Saving data...');

  // Convert map back to sorted array
  const allPokemon = Array.from(pokemonMap.values()).sort((a, b) => a.id - b.id);

  // Save to JSON file
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(allPokemon, null, 2));

  console.log(`\n${'='.repeat(60)}`);
  console.log(`✓ Successfully saved ${allPokemon.length} Pokemon to ${outputPath}`);
  console.log(`  • Fetched: ${successCount}`);
  console.log(`  • Errors: ${errorCount}`);

  if (errors.length > 0) {
    console.log(`\n⚠️  Failed Pokemon IDs:`);
    const failedIds = errors.map(e => e.id).join(', ');
    console.log(`  ${failedIds}`);
    console.log(`\n💡 To retry failed Pokemon, run:`);
    console.log(`  node scripts/fetchPokemonData.js ${failedIds}`);
  }

  console.log(`${'='.repeat(60)}`);
  console.log('You can now run "npm run dev" to start the application.');
}

fetchPokemonData().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
