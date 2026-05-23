import { useMemo, useState } from 'react'

export default function AchievementsBoard({ achievements, playersById }) {
  const [query, setQuery] = useState('')

  const shown = useMemo(
    () =>
      [...achievements]
        .filter((item) => {
          const holders = (Array.isArray(item.holders) && item.holders.length > 0 ? item.holders : [item.holder])
            .map((holderId) => playersById[holderId]?.name || holderId)
            .join(' ')
            .toLowerCase()
          const haystack = [item.name, item.reason, holders].join(' ').toLowerCase()
          return haystack.includes(query.trim().toLowerCase())
        })
        .sort((a, b) => b.dateAwarded.localeCompare(a.dateAwarded)),
    [achievements, playersById, query],
  )

  if (shown.length === 0) {
    return (
      <div className="stack">
        <section className="card">
          <h2>No achievements recorded yet</h2>
          <p className="muted">No placeholder trophies are being shown.</p>
        </section>
      </div>
    )
  }

  return (
    <div className="stack">
      <section className="card filter-row">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search achievements or holders"
          aria-label="Search achievements"
        />
      </section>

      <section className="grid two">
        {shown.map((item) => (
          <article key={item.id} className="card">
            <h2>{item.name}</h2>
            <p className="muted">{item.dateAwarded}</p>
            <p>
              <strong>{Array.isArray(item.holders) && item.holders.length > 1 ? 'Holders' : 'Holder'}:</strong>{' '}
              {(Array.isArray(item.holders) && item.holders.length > 0 ? item.holders : [item.holder])
                .map((holderId) => playersById[holderId]?.name || holderId)
                .join(', ')}
            </p>
            <p>{item.reason}</p>
          </article>
        ))}
      </section>
    </div>
  )
}
