import { useState } from "react"

const API_URL = "http://localhost:8000"

function Login({ onLogin }) {
  const [mode, setMode] = useState("login")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  function changeMode(newMode) {
    setMode(newMode)
    setError("")
    setSuccess("")
    setEmail("")
    setPassword("")
    setConfirmPassword("")
  }

  async function handleLogin(event) {
    event.preventDefault()

    setError("")
    setSuccess("")
    setLoading(true)

    try {
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
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      setError("Não foi possível conectar ao servidor")
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(event) {
    event.preventDefault()

    setError("")
    setSuccess("")

    if (password !== confirmPassword) {
      setError("As senhas não são iguais")
      return
    }

    if (password.length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres")
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/users/`, {
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
        if (response.status === 400) {
          setError("Esse email já está cadastrado")
        } else {
          setError("Não foi possível criar a conta")
        }

        return
      }

      console.log("Usuário criado:", data)

      setSuccess("Conta criada com sucesso! Agora faça login.")

      setMode("login")
      setPassword("")
      setConfirmPassword("")
    } catch (error) {
      console.error("Erro ao criar conta:", error)
      setError("Não foi possível conectar ao servidor")
    } finally {
      setLoading(false)
    }
  }

  const isLogin = mode === "login"

  return (
    <div className="login-page">

      <div className="login-card">

        <h1>Finance Manager</h1>

        <p>
          {isLogin
            ? "Entre na sua conta"
            : "Crie sua conta"}
        </p>

        <form
          onSubmit={
            isLogin
              ? handleLogin
              : handleRegister
          }
        >

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label>Senha</label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              disabled={loading}
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Confirmar senha</label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                disabled={loading}
                required
              />
            </div>
          )}

          {error && (
            <p className="error">
              {error}
            </p>
          )}

          {success && (
            <p className="success">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? isLogin
                ? "Entrando..."
                : "Criando conta..."
              : isLogin
                ? "Entrar"
                : "Criar conta"}
          </button>

        </form>

        <div className="login-switch">

          {isLogin ? (
            <>
              <span>
                Ainda não tem uma conta?
              </span>

              <button
                type="button"
                onClick={() => changeMode("register")}
                disabled={loading}
              >
                Criar conta
              </button>
            </>
          ) : (
            <>
              <span>
                Já tem uma conta?
              </span>

              <button
                type="button"
                onClick={() => changeMode("login")}
                disabled={loading}
              >
                Voltar para login
              </button>
            </>
          )}

        </div>

      </div>

    </div>
  )
}

export default Login