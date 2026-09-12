import { useEffect, useState } from "react"

import Login from "./components/Login"
import Summary from "./components/Summary"
import FinanceChart from "./components/FinanceChart"
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
  const [activePage, setActivePage] = useState("dashboard")

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user")

    if (!savedUser) {
      return {
        name: "Usuária",
        email: "usuario@email.com",
      }
    }

    try {
      return JSON.parse(savedUser)
    } catch {
      return {
        name: "Usuária",
        email: "usuario@email.com",
      }
    }
  })

  const [profileOpen, setProfileOpen] = useState(false)
  const [editingProfile, setEditingProfile] = useState(false)
  const [profileName, setProfileName] = useState("")
  const [savingProfile, setSavingProfile] = useState(false)

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
      throw new Error("Erro ao criar categoria")
    }

    await getCategories()
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
      throw new Error("Erro ao atualizar categoria")
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

    if (!response.ok) {
      let data = null

      try {
        data = await response.json()
      } catch {}

      console.error("Erro ao excluir categoria:", data)

      throw new Error("Erro ao excluir categoria")
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
      throw new Error("Erro ao criar transação")
    }

    await getTransactions()
  }

  async function handleDeleteTransaction(transactionId) {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir esta transação?"
    )

    if (!confirmed) return

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
      throw new Error("Erro ao atualizar transação")
    }

    setEditingTransaction(null)

    await getTransactions()
  }

  function handleLogin() {
    const savedUser = localStorage.getItem("user")

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        setUser({
          name: "Usuária",
          email: "usuario@email.com",
        })
      }
    }

    setIsLoggedIn(true)
  }

  function handleLogout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    setIsLoggedIn(false)
    setTransactions([])
    setCategories([])
    setEditingTransaction(null)
    setActivePage("dashboard")
    setProfileOpen(false)
  }

  function openProfileEditor() {
    setProfileName(user.name)
    setEditingProfile(true)
    setProfileOpen(false)
  }

  async function handleUpdateProfile(event) {
    event.preventDefault()

    const name = profileName.trim()

    if (!name) {
      return
    }

    setSavingProfile(true)

    try {
      const token = localStorage.getItem("token")

      const response = await fetch(`${API_URL}/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error("Erro ao atualizar perfil:", data)
        return
      }

      localStorage.setItem("user", JSON.stringify(data))
      setUser(data)
      setEditingProfile(false)
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error)
    } finally {
      setSavingProfile(false)
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      getCategories()
      getTransactions()
    }
  }, [isLoggedIn])

  function formatToday() {
    return new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">
            <span>♥</span>
          </div>

          <div className="brand-text">
            <strong>Finance</strong>
            <span>Manager</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={
              activePage === "dashboard"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => setActivePage("dashboard")}
          >
            <span className="nav-icon">⌂</span>
            Dashboard
          </button>

          <button
            className={
              activePage === "transactions"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => setActivePage("transactions")}
          >
            <span className="nav-icon">▤</span>
            Transações
          </button>

          <button
            className={
              activePage === "categories"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => setActivePage("categories")}
          >
            <span className="nav-icon">▱</span>
            Categorias
          </button>

          <button
            className="nav-item"
            onClick={() => setActivePage("dashboard")}
          >
            <span className="nav-icon">▥</span>
            Relatórios
          </button>
        </nav>

        <div className="sidebar-decoration">
          <span>✦</span>

          <div className="piggy-bank">
            <div className="coin">R$</div>
            <div className="pig">🐷</div>
          </div>

          <span>♥</span>
        </div>

        <div className="sidebar-user-section">
          <div className="sidebar-user">
            <div className="user-avatar">
              👩🏻
            </div>

            <div className="user-info">
              <strong>{user.name}</strong>
              <span>{user.email}</span>
            </div>

            <button
              className="user-arrow"
              onClick={() =>
                setProfileOpen(!profileOpen)
              }
              aria-label="Abrir menu do perfil"
            >
              {profileOpen ? "⌃" : "⌄"}
            </button>
          </div>

          {profileOpen && (
            <div className="profile-menu">
              <button onClick={openProfileEditor}>
                <span>✎</span>
                Editar perfil
              </button>

              <button
                className="profile-logout"
                onClick={handleLogout}
              >
                <span>↪</span>
                Sair
              </button>
            </div>
          )}
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div>
            <p className="topbar-greeting">
              Olá, {user.name}! <span>♥</span>
            </p>

            <p className="topbar-subtitle">
              Aqui está o resumo das suas finanças hoje.
            </p>
          </div>

          <div className="topbar-date">
            <span className="calendar-icon">▣</span>
            {formatToday()}
          </div>
        </header>

        {activePage === "dashboard" && (
          <div className="dashboard-page">
            <section className="dashboard-summary">
              <Summary transactions={transactions} />
            </section>

            <div className="main-dashboard-grid">
              <FinanceChart
                transactions={transactions}
              />

              <section className="dashboard-card new-transaction-card">
                <div className="card-title-row">
                  <div>
                    <h3>Nova transação</h3>
                  </div>

                  <span className="small-card-icon">
                    ▣
                  </span>
                </div>

                <TransactionForm
                  categories={categories}
                  onCreateTransaction={
                    handleCreateTransaction
                  }
                  onUpdateTransaction={
                    handleUpdateTransaction
                  }
                  editingTransaction={
                    editingTransaction
                  }
                  onCancelEdit={() =>
                    setEditingTransaction(null)
                  }
                />
              </section>
            </div>

            <div className="bottom-dashboard-grid">
              <section className="dashboard-card transactions-preview">
                <div className="card-title-row">
                  <div className="title-with-icon">
                    <span className="small-card-icon">
                      ▣
                    </span>

                    <h3>
                      Transações recentes
                    </h3>
                  </div>

                  <button
                    className="link-button"
                    onClick={() =>
                      setActivePage("transactions")
                    }
                  >
                    Ver todas
                  </button>
                </div>

                <TransactionList
                  transactions={transactions.slice(0, 5)}
                  categories={categories}
                  onDeleteTransaction={
                    handleDeleteTransaction
                  }
                  onEditTransaction={
                    setEditingTransaction
                  }
                  compact
                />
              </section>

              <section className="dashboard-card categories-preview">
                <div className="card-title-row">
                  <h3>Despesas do mês</h3>

                  <button
                    className="manage-button"
                    onClick={() =>
                      setActivePage("categories")
                    }
                  >
                    Gerenciar
                  </button>
                </div>

                <CategoryManager
                  categories={categories}
                  transactions={transactions}
                  onCreateCategory={
                    handleCreateCategory
                  }
                  onUpdateCategory={
                    handleUpdateCategory
                  }
                  onDeleteCategory={
                    handleDeleteCategory
                  }
                  compact
                />
              </section>
            </div>
          </div>
        )}

        {activePage === "transactions" && (
          <div className="dashboard-page">
            <section className="dashboard-card full-page-card">
              <div className="card-title-row">
                <div>
                  <span className="section-label">
                    FINANÇAS
                  </span>

                  <h3>Todas as transações</h3>
                </div>
              </div>

              <TransactionList
                transactions={transactions}
                categories={categories}
                onDeleteTransaction={
                  handleDeleteTransaction
                }
                onEditTransaction={
                  setEditingTransaction
                }
              />
            </section>

            <section className="dashboard-card full-page-card">
              <div className="card-title-row">
                <div>
                  <span className="section-label">
                    NOVO LANÇAMENTO
                  </span>

                  <h3>Adicionar transação</h3>
                </div>
              </div>

              <TransactionForm
                categories={categories}
                onCreateTransaction={
                  handleCreateTransaction
                }
                onUpdateTransaction={
                  handleUpdateTransaction
                }
                editingTransaction={
                  editingTransaction
                }
                onCancelEdit={() =>
                  setEditingTransaction(null)
                }
              />
            </section>
          </div>
        )}

        {activePage === "categories" && (
          <div className="dashboard-page">
            <section className="dashboard-card full-page-card">
              <div className="card-title-row">
                <div>
                  <span className="section-label">
                    ORGANIZAÇÃO
                  </span>

                  <h3>Gerenciar categorias</h3>
                </div>
              </div>

              <CategoryManager
                categories={categories}
                transactions={transactions}
                onCreateCategory={
                  handleCreateCategory
                }
                onUpdateCategory={
                  handleUpdateCategory
                }
                onDeleteCategory={
                  handleDeleteCategory
                }
              />
            </section>
          </div>
        )}

        {editingProfile && (
          <div className="profile-modal-overlay">
            <div className="profile-modal">
              <div className="profile-modal-header">
                <div>
                  <span className="section-label">
                    MEU PERFIL
                  </span>

                  <h3>Editar nome</h3>
                </div>

                <button
                  className="modal-close"
                  onClick={() =>
                    setEditingProfile(false)
                  }
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleUpdateProfile}>
                <label htmlFor="profile-name">
                  Nome
                </label>

                <input
                  id="profile-name"
                  type="text"
                  value={profileName}
                  onChange={(event) =>
                    setProfileName(event.target.value)
                  }
                  maxLength={100}
                  autoFocus
                  required
                />

                <div className="profile-modal-actions">
                  <button
                    type="button"
                    onClick={() =>
                      setEditingProfile(false)
                    }
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={savingProfile}
                  >
                    {savingProfile
                      ? "Salvando..."
                      : "Salvar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App