import { useEffect, useState } from "react"
import Login from "./components/Login"
import Summary from "./components/Summary"
import TransactionForm from "./components/TransactionForm"
import TransactionList from "./components/TransactionList"
import CategoryManager from "./components/CategoryManager"
import "./App.css"

const API_URL = "http://localhost:8000"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  )

  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [editingTransaction, setEditingTransaction] = useState(null)

  async function getCategories() {
    const token = localStorage.getItem("token")

    const response = await fetch(`${API_URL}/categories/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      console.error("Erro ao buscar categorias")
      return
    }

    const data = await response.json()
    setCategories(data)
  }

  async function getTransactions() {
    const token = localStorage.getItem("token")

    const response = await fetch(`${API_URL}/transactions/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      console.error("Erro ao buscar transações")
      return
    }

    const data = await response.json()
    setTransactions(data)
  }

  async function handleUpdateCategory(categoryId, category) {
  const token = localStorage.getItem("token")

  const response = await fetch(
    `${API_URL}/categories/${categoryId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(category),
    }
  )

  const data = await response.json()

  if (!response.ok) {
    console.error("Erro ao atualizar categoria:", data)
    return
  }

  await getCategories()
}

async function handleDeleteCategory(categoryId) {
  const token = localStorage.getItem("token")

  const response = await fetch(
    `${API_URL}/categories/${categoryId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  const data = await response.json()

  if (!response.ok) {
    console.error("Erro ao excluir categoria:", data)
    return
  }

  await getCategories()
}

  async function handleCreateCategory(category) {
    const token = localStorage.getItem("token")

    const response = await fetch(`${API_URL}/categories/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(category),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("Erro ao criar categoria:", data)
      return
    }

    await getCategories()
  }

  async function handleCreateTransaction(transaction) {
    const token = localStorage.getItem("token")

    const response = await fetch(`${API_URL}/transactions/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(transaction),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("Erro ao criar transação:", data)
      return
    }

    await getTransactions()
  }

  async function handleDeleteTransaction(transactionId) {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir esta transação?"
    )

    if (!confirmed) {
      return
    }

    const token = localStorage.getItem("token")

    const response = await fetch(
      `${API_URL}/transactions/${transactionId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      console.error("Erro ao excluir transação")
      return
    }

    await getTransactions()
  }

  async function handleUpdateTransaction(
    transactionId,
    transaction
  ) {
    const token = localStorage.getItem("token")

    const response = await fetch(
      `${API_URL}/transactions/${transactionId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transaction),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      console.error("Erro ao atualizar transação:", data)
      return
    }

    setEditingTransaction(null)

    await getTransactions()
  }

  function handleLogin() {
    setIsLoggedIn(true)
  }

  function handleLogout() {
    localStorage.removeItem("token")

    setIsLoggedIn(false)
    setTransactions([])
    setCategories([])
    setEditingTransaction(null)
  }

  useEffect(() => {
    if (isLoggedIn) {
      getCategories()
      getTransactions()
    }
  }, [isLoggedIn])

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />
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

        <Summary transactions={transactions} />

        <CategoryManager
          categories={categories}
          onCreateCategory={handleCreateCategory}
          onUpdateCategory={handleUpdateCategory}
          onDeleteCategory={handleDeleteCategory}
        />

        <TransactionForm
          categories={categories}
          onCreateTransaction={handleCreateTransaction}
          onUpdateTransaction={handleUpdateTransaction}
          editingTransaction={editingTransaction}
          onCancelEdit={() => setEditingTransaction(null)}
        />

        <TransactionList
          transactions={transactions}
          categories={categories}
          onDeleteTransaction={handleDeleteTransaction}
          onEditTransaction={setEditingTransaction}
        />

      </main>

    </div>
  )
}

export default App