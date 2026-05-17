import { useMemo, useState } from 'react'

export default function PlayerDossiers({ players, statsByPlayer }) {
  const [search, setSearch] = useState('')
  const [activeOnly, setActiveOnly] = useState(false)
  const [sortBy, setSortBy] = useState('wins')

  const displayedPlayers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return [...players]
      .filter((player) => (activeOnly ? player.active : true))
      .filter((player) => {
        if (!normalizedSearch) {
          return true
        }

        return [player.name, player.nickname, player.specialty]
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearch)
      })
      .sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name)
        }

        if (sortBy === 'joined') {
          return a.joinedYear - b.joinedYear
        }

        return (statsByPlayer[b.id]?.wins || 0) - (statsByPlayer[a.id]?.wins || 0)
      })
  }, [activeOnly, players, search, sortBy, statsByPlayer])

  return (
    <div className="stack">
      <section className="card filter-row">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name, nickname, specialty"
          aria-label="Search players"
        />

        <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
          <option value="wins">Sort by wins</option>
          <option value="name">Sort by name</option>
          <option value="joined">Sort by join year</option>
        </select>

        <label className="inline-check">
          <input
            type="checkbox"
            checked={activeOnly}
            onChange={(event) => setActiveOnly(event.target.checked)}
          />
          Active only
        </label>
      </section>

      <section className="grid two">
        {displayedPlayers.map((player) => {
          const stats = statsByPlayer[player.id]

          return (
            <article key={player.id} className="card player-card">
              <h2>{player.name}</h2>
              <p className="muted">{player.nickname} · Joined {player.joinedYear}</p>
              <p>{player.bio}</p>
              <p>
                <strong>Specialty:</strong> {player.specialty}
              </p>
              <div className="stats-line">
                <span>{stats.wins} wins</span>
                <span>{stats.gamesPlayed} games</span>
                <span>{stats.winRate.toFixed(1)}% WR</span>
              </div>
            </article>
          )
        })}
      </section>
    </div>
  )
}
