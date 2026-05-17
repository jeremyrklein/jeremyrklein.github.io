import { useMemo, useState } from 'react'

export default function AchievementsBoard({ achievements, playersById }) {
  const [tierFilter, setTierFilter] = useState('all')

  const shown = useMemo(
    () =>
      [...achievements]
        .filter((item) => (tierFilter === 'all' ? true : item.tier === tierFilter))
        .sort((a, b) => b.dateAwarded.localeCompare(a.dateAwarded)),
    [achievements, tierFilter],
  )

  return (
    <div className="stack">
      <section className="card filter-row">
        <label>
          Tier
          <select
            value={tierFilter}
            onChange={(event) => setTierFilter(event.target.value)}
          >
            <option value="all">All</option>
            <option value="gold">Gold</option>
            <option value="silver">Silver</option>
            <option value="bronze">Bronze</option>
          </select>
        </label>
      </section>

      <section className="grid two">
        {shown.map((item) => (
          <article key={item.id} className="card">
            <h2>{item.name}</h2>
            <p className="muted">
              {item.tier.toUpperCase()} · {item.dateAwarded}
            </p>
            <p>
              <strong>Holder:</strong> {playersById[item.holder]?.name || item.holder}
            </p>
            <p>{item.reason}</p>
          </article>
        ))}
      </section>
    </div>
  )
}
