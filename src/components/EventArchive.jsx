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

              <h3>Games Played</h3>
              <ul className="compact-list">
                {eventGames.map((game) => (
                  <li key={game.id}>
                    <strong>{gameTypesById[game.gameType]?.name || game.gameType}</strong> —
                    Winner: {playersById[game.winner]?.name || game.winner}
                  </li>
                ))}
              </ul>
            </article>
          )
        })}
      </section>
    </div>
  )
}
