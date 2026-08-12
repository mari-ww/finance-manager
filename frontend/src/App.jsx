import { useState, useEffect } from "react"

function App() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [transactions, setTransactions] = useState([])

  const [categoryId, setCategoryId] = useState("")
  const [type, setType] = useState("expense")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")

  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  )

  function handleLogout() {
    localStorage.removeItem("token")
    window.location.reload()
  }

  async function handleLogin(event) {
    event.preventDefault()

    const response = await fetch("http://localhost:8000/auth/login", {
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

    localStorage.setItem("token", data.access_token)
    setIsLoggedIn(true)

    console.log("Login realizado!")
  }

  async function getCategories() {
    const token = localStorage.getItem("token")

    const response = await fetch("http://localhost:8000/categories/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    console.log("Categorias:", data)
  }

  async function getTransactions() {
    const token = localStorage.getItem("token")

    const response = await fetch("http://localhost:8000/transactions/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    setTransactions(data)
  }

  async function handleCreateTransaction(event) {
    event.preventDefault()

    const token = localStorage.getItem("token")

    const response = await fetch("http://localhost:8000/transactions/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        category_id: Number(categoryId),
        type,
        amount: Number(amount),
        description,
        date,
      }),
    })

    const data = await response.json()

    console.log("Transação criada:", data)

    if (response.ok) {
      setCategoryId("")
      setType("expense")
      setAmount("")
      setDescription("")
      setDate("")

      getTransactions()
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (token) {
      getTransactions()
    }
  }, [])

  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce(
      (total, transaction) => total + Number(transaction.amount),
      0
    )

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce(
      (total, transaction) => total + Number(transaction.amount),
      0
    )

  const balance = totalIncome - totalExpenses

  if (!isLoggedIn) {
    return (
      <div>
        <h1>Finance Manager</h1>

        <form onSubmit={handleLogin}>
          <div>
            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div>
            <label>Senha</label>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <button type="submit">
            Entrar
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="app">

      <header className="header">
        <h1>Finance Manager</h1>

        <button onClick={handleLogout}>
          Sair
        </button>
      </header>

      <main className="container">

        <h2>Resumo financeiro</h2>

        <div className="summary">

          <div className="card">
            <h3>Receitas</h3>
            <p>R$ {totalIncome.toFixed(2)}</p>
          </div>

          <div className="card">
            <h3>Despesas</h3>
            <p>R$ {totalExpenses.toFixed(2)}</p>
          </div>

          <div className="card">
            <h3>Saldo</h3>
            <p>R$ {balance.toFixed(2)}</p>
          </div>

        </div>

        <h2>Nova transação</h2>

        <form onSubmit={handleCreateTransaction}>

          <div>
            <label>Categoria</label>

            <input
              type="number"
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              placeholder="ID da categoria"
              required
            />
          </div>

          <div>
            <label>Tipo</label>

            <select
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              <option value="expense">
                Despesa
              </option>

              <option value="income">
                Receita
              </option>
            </select>
          </div>

          <div>
            <label>Valor</label>

            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              required
            />
          </div>

          <div>
            <label>Descrição</label>

            <input
              type="text"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          <div>
            <label>Data</label>

            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
            />
          </div>

          <button type="submit">
            Adicionar transação
          </button>

        </form>

        <h2>Transações</h2>

        <table>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Valor</th>
              <th>Descrição</th>
              <th>Data</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.type}</td>
                <td>R$ {transaction.amount}</td>
                <td>{transaction.description}</td>
                <td>{transaction.date}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </main>

    </div>
  )
}

export default App