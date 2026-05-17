import { useState } from 'react'

export default function PasswordGate({ onUnlock, errorMessage }) {
  const [passwordInput, setPasswordInput] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    onUnlock(passwordInput)
    setPasswordInput('')
  }

  return (
    <section className="card">
      <h2>Unlock Detailed Stats</h2>
      <p>
        Shared-password gating hides detailed numbers from casual visitors.
        This is not real security.
      </p>

      <form className="gate-form" onSubmit={handleSubmit}>
        <input
          type="password"
          value={passwordInput}
          onChange={(event) => setPasswordInput(event.target.value)}
          placeholder="Enter shared password"
          aria-label="Shared password"
        />
        <button type="submit">Unlock</button>
      </form>

      {errorMessage && <p className="error-text">{errorMessage}</p>}
    </section>
  )
}
