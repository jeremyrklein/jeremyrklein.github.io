const DATASET_NAMES = ['players', 'events', 'games', 'achievements', 'gameTypes']

let cache = null

async function loadDataset(name) {
  const baseUrl = import.meta.env.BASE_URL || '/'
  const response = await fetch(`${baseUrl}data/${name}.json`)

  if (!response.ok) {
    throw new Error(`Failed loading ${name}.json (${response.status})`)
  }

  return response.json()
}

export async function loadHallOfFameData(force = false) {
  if (cache && !force) {
    return cache
  }

  const loaded = await Promise.all(DATASET_NAMES.map((name) => loadDataset(name)))

  cache = {
    players: loaded[0],
    events: loaded[1],
    games: loaded[2],
    achievements: loaded[3],
    gameTypes: loaded[4],
  }

  return cache
}
