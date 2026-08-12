import { useState } from "react"

const API_URL = "http://localhost:8000"

function Login({ onLogin }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function handleLogin(event) {
    event.preventDefault()

    setError("")

    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      setError("Email ou senha inválidos")
      return
    }

    localStorage.setItem("token", data.access_token)

    onLogin()
  }

  return (
    <div className="login-page">

      <div className="login-card">

        <h1>Finance Manager</h1>

        <p>Entre na sua conta</p>

        <form onSubmit={handleLogin}>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Senha</label>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {error && (
            <p className="error">
              {error}
            </p>
          )}

          <button type="submit">
            Entrar
          </button>

        </form>

      </div>

    </div>
  )
}

export default Login