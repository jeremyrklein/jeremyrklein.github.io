import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Bar,
  BarChart,
} from 'recharts'

export default function StatsView({
  isUnlocked,
  leaderboard,
  gameTypeLeaders,
  winsTimeline,
  players,
}) {
  const topPlayerIds = leaderboard.slice(0, 4).map((entry) => entry.player.id)
  const timeline = winsTimeline.map((row) => {
    const trimmed = { label: row.label }
    topPlayerIds.forEach((id) => {
      trimmed[id] = row[id]
    })
    return trimmed
  })

  const colors = ['#1f6feb', '#d29922', '#bf3989', '#238636']

  return (
    <div className="stack">
      <section className="card">
        <h2>Lifetime Leaderboard</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Player</th>
                <th>Wins</th>
                <th>Games</th>
                <th>Win Rate</th>
                {isUnlocked && <th>Avg Score</th>}
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry) => (
                <tr key={entry.player.id}>
                  <td>{entry.player.name}</td>
                  <td>{entry.stats.wins}</td>
                  <td>{entry.stats.gamesPlayed}</td>
                  <td>{entry.stats.winRate.toFixed(1)}%</td>
                  {isUnlocked && <td>{entry.stats.averageScore.toFixed(1)}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {isUnlocked ? (
        <>
          <section className="card">
            <h2>Wins Over Time (Top 4)</h2>
            <div className="chart-box">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={timeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" hide />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  {topPlayerIds.map((playerId, index) => (
                    <Line
                      key={playerId}
                      type="monotone"
                      dataKey={playerId}
                      stroke={colors[index % colors.length]}
                      strokeWidth={2}
                      name={players.find((player) => player.id === playerId)?.name || playerId}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="card">
            <h2>Game Type Leaders</h2>
            <div className="chart-box">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={gameTypeLeaders}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="gameType" tick={{ fontSize: 12 }} interval={0} angle={-15} height={60} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="wins" fill="#1f6feb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </>
      ) : (
        <section className="card">
          <p>Detailed charts are hidden until unlocked.</p>
        </section>
      )}
    </div>
  )
}
