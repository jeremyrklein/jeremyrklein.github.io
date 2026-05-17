function toNumber(value) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export function buildPlayerStats(players, games) {
  const initial = {}

  players.forEach((player) => {
    initial[player.id] = {
      playerId: player.id,
      wins: 0,
      gamesPlayed: 0,
      totalScore: 0,
      byGameType: {},
      winRate: 0,
      averageScore: 0,
    }
  })

  games.forEach((game) => {
    game.players.forEach((playerId) => {
      const playerStats = initial[playerId]

      if (!playerStats) {
        return
      }

      playerStats.gamesPlayed += 1
      playerStats.byGameType[game.gameType] =
        (playerStats.byGameType[game.gameType] || 0) + 1

      const score = game.scores?.[playerId]
      playerStats.totalScore += toNumber(score)
    })

    if (initial[game.winner]) {
      initial[game.winner].wins += 1
    }
  })

  Object.values(initial).forEach((playerStats) => {
    if (playerStats.gamesPlayed > 0) {
      playerStats.winRate = (playerStats.wins / playerStats.gamesPlayed) * 100
      playerStats.averageScore = playerStats.totalScore / playerStats.gamesPlayed
    }
  })

  return initial
}

export function buildLifetimeLeaderboard(players, games) {
  const statsByPlayer = buildPlayerStats(players, games)

  return players
    .map((player) => ({ player, stats: statsByPlayer[player.id] }))
    .sort((a, b) => {
      if (b.stats.wins !== a.stats.wins) {
        return b.stats.wins - a.stats.wins
      }
      return b.stats.winRate - a.stats.winRate
    })
}

export function buildWinsOverTime(players, games, events) {
  const dateByEvent = Object.fromEntries(events.map((event) => [event.id, event.date]))

  const gamesByDate = [...games]
    .map((game) => ({ ...game, date: dateByEvent[game.eventId] || '9999-12-31' }))
    .sort((a, b) => a.date.localeCompare(b.date))

  const winCounters = Object.fromEntries(players.map((player) => [player.id, 0]))
  const rows = []

  gamesByDate.forEach((game) => {
    if (winCounters[game.winner] !== undefined) {
      winCounters[game.winner] += 1
    }

    const row = { date: game.date, label: `${game.date} • ${game.gameType}` }

    players.forEach((player) => {
      row[player.id] = winCounters[player.id]
    })

    rows.push(row)
  })

  return rows
}

export function buildGameTypeLeaders(players, games, gameTypes) {
  const playerById = Object.fromEntries(players.map((player) => [player.id, player]))

  return gameTypes.map((type) => {
    const filtered = games.filter((game) => game.gameType === type.id)
    const wins = {}

    filtered.forEach((game) => {
      wins[game.winner] = (wins[game.winner] || 0) + 1
    })

    const top = Object.entries(wins)
      .sort((a, b) => b[1] - a[1])[0]

    return {
      gameType: type.name,
      gamesPlayed: filtered.length,
      leaderName: top ? playerById[top[0]]?.name || top[0] : '—',
      wins: top ? top[1] : 0,
    }
  })
}
