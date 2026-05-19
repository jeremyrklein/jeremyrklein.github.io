import { useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'

export default function EventArchive({ data, playersById, gameTypesById }) {
  const { events, games } = data
  const [search, setSearch] = useState('')
  const [sortMode, setSortMode] = useState('desc')
  const [hostFilter, setHostFilter] = useState('all')

  const hosts = useMemo(() => {
    const uniqueHosts = [...new Set(events.map((event) => event.host))]
    return uniqueHosts
      .map((id) => ({ id, name: playersById[id]?.name || id }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [events, playersById])

  const filteredEvents = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return [...events]
      .filter((event) =>
        hostFilter === 'all' ? true : event.host === hostFilter,
      )
      .filter((event) => {
        if (!normalizedSearch) {
          return true
        }

        const haystack = [event.title, event.location, event.recap, ...event.highlights]
          .join(' ')
          .toLowerCase()

        return haystack.includes(normalizedSearch)
      })
      .sort((a, b) =>
        sortMode === 'desc'
          ? b.date.localeCompare(a.date)
          : a.date.localeCompare(b.date),
      )
  }, [events, hostFilter, search, sortMode])

  return (
    <div className="stack">
      <section className="card filter-row">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search recaps, highlights, locations"
          aria-label="Search events"
        />

        <select value={hostFilter} onChange={(event) => setHostFilter(event.target.value)}>
          <option value="all">All hosts</option>
          {hosts.map((host) => (
            <option key={host.id} value={host.id}>
              {host.name}
            </option>
          ))}
        </select>

        <select value={sortMode} onChange={(event) => setSortMode(event.target.value)}>
          <option value="desc">Newest first</option>
          <option value="asc">Oldest first</option>
        </select>
      </section>

      <section className="stack">
        {filteredEvents.map((event) => {
          const eventGames = games.filter((game) => game.eventId === event.id)

          return (
            <article key={event.id} className="card event-card">
              <div className="event-head">
                <h2>{event.title}</h2>
                <p>{event.date}</p>
              </div>
              <p>
                <strong>Host:</strong> {playersById[event.host]?.name || event.host} ·{' '}
                <strong>Location:</strong> {event.location}
              </p>

              <ReactMarkdown>{event.recap}</ReactMarkdown>

              <h3>Highlights</h3>
              <ul>
                {event.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>

              <div className="stack">
                {eventGames.map((game) => {
                  const gameName = gameTypesById[game.gameType]?.name || game.gameType
                  const results = (game.results || []).map((result) => ({
                    ...result,
                    playerName: playersById[result.playerId]?.name || result.playerName || result.playerId,
                  }))

                  const hasPosition = results.some((result) => Number.isFinite(Number(result.position)))
                  const hasGamesWon = results.some((result) => Number.isFinite(Number(result.gamesWon)))
                  const hasSeriesWon = results.some((result) => Number.isFinite(Number(result.seriesWon)))
                  const hasPoints = results.some((result) => Number.isFinite(Number(result.points)))
                  const hasWinnings = results.some((result) => Number.isFinite(Number(result.winnings)))
                  const rounds = Array.isArray(game.rounds) ? game.rounds : []

                  const winner = [...results].sort((a, b) => {
                    if (hasPosition) {
                      const positionDiff = Number(a.position) - Number(b.position)
                      if (positionDiff !== 0) {
                        return positionDiff
                      }
                    }

                    if (hasSeriesWon) {
                      const seriesDiff = Number(b.seriesWon || 0) - Number(a.seriesWon || 0)
                      if (seriesDiff !== 0) {
                        return seriesDiff
                      }
                    }

                    if (hasGamesWon) {
                      const gamesDiff = Number(b.gamesWon || 0) - Number(a.gamesWon || 0)
                      if (gamesDiff !== 0) {
                        return gamesDiff
                      }
                    }

                    if (hasPoints) {
                      const lowerIsBetter = game.gameType === 'hearts' || game.gameType === 'canadian-salad'
                      const pointsDiff = lowerIsBetter
                        ? Number(a.points || 0) - Number(b.points || 0)
                        : Number(b.points || 0) - Number(a.points || 0)
                      if (pointsDiff !== 0) {
                        return pointsDiff
                      }
                    }

                    if (hasWinnings) {
                      const winningsDiff = Number(b.winnings || 0) - Number(a.winnings || 0)
                      if (winningsDiff !== 0) {
                        return winningsDiff
                      }
                    }

                    return String(a.playerName || '').localeCompare(String(b.playerName || ''))
                  })[0]

                  const notes = String(game.notes || '').trim()

                  return (
                    <section key={game.id} className="highlight-box">
                      <p className="small-title">{gameName}</p>
                      {notes ? <p className="muted small">{notes}</p> : null}
                      <p className="small">
                        <strong>Winner:</strong> {winner?.playerName || winner?.playerId || '—'}
                      </p>
                      <details className="game-results-details">
                        <summary>See full results</summary>
                        <div className="results-tables" style={{ marginTop: '0.75rem' }}>
                          <div className="game-results-table">
                            <table>
                              <thead>
                                <tr>
                                  <th>Player</th>
                                  {hasPosition && <th>Place</th>}
                                  {hasGamesWon && <th>Games</th>}
                                  {hasSeriesWon && <th>Series</th>}
                                  {hasPoints && <th>Points</th>}
                                  {hasWinnings && <th>Winnings</th>}
                                </tr>
                              </thead>
                              <tbody>
                                {results.map((result, idx) => (
                                  <tr key={`${game.id}-${idx}`}>
                                    <td>{result.playerName}</td>
                                    {hasPosition && (
                                      <td>
                                        {Number.isFinite(Number(result.position)) ? `#${result.position}` : '—'}
                                      </td>
                                    )}
                                    {hasGamesWon && (
                                      <td>
                                        {Number.isFinite(Number(result.gamesWon)) ? result.gamesWon : '—'}
                                      </td>
                                    )}
                                    {hasSeriesWon && (
                                      <td>
                                        {Number.isFinite(Number(result.seriesWon)) ? result.seriesWon : '—'}
                                      </td>
                                    )}
                                    {hasPoints && (
                                      <td>
                                        {Number.isFinite(Number(result.points)) ? result.points : '—'}
                                      </td>
                                    )}
                                    {hasWinnings && (
                                      <td>
                                        {Number.isFinite(Number(result.winnings)) ? `$${result.winnings}` : '—'}
                                      </td>
                                    )}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {rounds.length > 0 ? (
                            <div className="game-results-table">
                              <p className="small-title" style={{ marginBottom: '0.5rem' }}>
                                Round Breakdown
                              </p>
                              <table>
                                <thead>
                                  <tr>
                                    <th>Round</th>
                                    {results.map((result) => (
                                      <th key={`${game.id}-${result.playerId}-round-head`}>
                                        {result.playerName}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {rounds.map((round, roundIndex) => {
                                    const valuesByPlayerId = Object.fromEntries(
                                      (round.values || []).map((value) => [value.playerId, value.value]),
                                    )
                                    const roundLabel = [round.step, round.label].filter(Boolean).join(' - ')

                                    return (
                                      <tr key={`${game.id}-round-${roundIndex}`}>
                                        <td>{roundLabel || `Round ${roundIndex + 1}`}</td>
                                        {results.map((result) => (
                                          <td key={`${game.id}-round-${roundIndex}-${result.playerId}`}>
                                            {valuesByPlayerId[result.playerId] !== '' &&
                                            valuesByPlayerId[result.playerId] !== undefined
                                              ? String(valuesByPlayerId[result.playerId])
                                              : '—'}
                                          </td>
                                        ))}
                                      </tr>
                                    )
                                  })}
                                </tbody>
                              </table>
                            </div>
                          ) : null}
                        </div>
                      </details>
                    </section>
                  )
                })}
              </div>
            </article>
          )
        })}
      </section>
    </div>
  )
}
