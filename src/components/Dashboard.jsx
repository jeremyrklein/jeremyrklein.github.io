export default function Dashboard({ data, leaderboard }) {
  const { events, games, players, achievements } = data

  const recentEvents = [...events]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3)

  return (
    <div className="stack">
      <section className="grid four">
        <article className="card metric">
          <h3>Total Events</h3>
          <p>{events.length}</p>
        </article>
        <article className="card metric">
          <h3>Games Logged</h3>
          <p>{games.length}</p>
        </article>
        <article className="card metric">
          <h3>Active Players</h3>
          <p>{players.filter((player) => player.active).length}</p>
        </article>
        <article className="card metric">
          <h3>Trophies Awarded</h3>
          <p>{achievements.length}</p>
        </article>
      </section>

      <section className="grid two">
        <article className="card">
          <h2>Recent Events</h2>
          <ul className="list">
            {recentEvents.map((event) => (
              <li key={event.id}>
                <strong>{event.title}</strong>
                <span>{event.date}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="card">
          <h2>Lifetime Top 5</h2>
          <ol className="list ordered">
            {leaderboard.slice(0, 5).map((entry) => (
              <li key={entry.player.id}>
                <strong>{entry.player.name}</strong>
                <span>{entry.stats.wins} wins</span>
              </li>
            ))}
          </ol>
        </article>
      </section>
    </div>
  )
}
