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

  const [activePage, setActivePage] = useState("dashboard")

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
      } catch {
        // resposta sem JSON
      }

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
      throw new Error("Erro ao atualizar transação")
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
    setActivePage("dashboard")
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

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="sidebar-brand">
          <div className="brand-icon">🍓</div>

          <div className="brand-text">
            Finance Manager
          </div>
        </div>

        <nav className="sidebar-nav">

          <p className="nav-title">
            MENU
          </p>

          <button
            className={
              activePage === "dashboard"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => setActivePage("dashboard")}
          >
            <span>🏠</span>
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
            <span>💳</span>
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
            <span>🏷️</span>
            Categorias
          </button>

        </nav>

        <div className="sidebar-bottom">

          <div className="sidebar-tip">
            <span>✨</span>

            <div>
              <strong>Controle seu dinheiro</strong>

              <p>
                Organize suas finanças de forma simples.
              </p>
            </div>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            <span>↪</span>
            Sair
          </button>

        </div>

      </aside>

      {/* ÁREA PRINCIPAL */}

      <main className="main-area">

        {/* TOPBAR */}

        <header className="topbar">

          <div>
            <p className="topbar-small">
              Olá! 👋
            </p>

            <h2>
              {activePage === "dashboard" &&
                "Visão geral"}

              {activePage === "transactions" &&
                "Suas transações"}

              {activePage === "categories" &&
                "Suas categorias"}
            </h2>
          </div>

          <div className="topbar-date">
            <span>🍓</span>
            Finance Manager
          </div>

        </header>

        {/* DASHBOARD */}

        {activePage === "dashboard" && (

          <div className="page-content">

            <div className="welcome-banner">

              <div>
                <span className="banner-label">
                  SEU RESUMO FINANCEIRO
                </span>

                <h3>
                  Cuide do seu dinheiro com carinho 💗
                </h3>

                <p>
                  Acompanhe suas receitas, despesas e saldo
                  em um só lugar.
                </p>
              </div>

              <span className="banner-decoration">
                🍓
              </span>

            </div>

            <section className="dashboard-summary">
              <Summary
                transactions={transactions}
              />
            </section>

            <div className="dashboard-grid">

              <section className="dashboard-card transaction-card">

                <div className="card-header">

                  <div>
                    <span className="section-label">
                      LANÇAMENTO
                    </span>

                    <h3>
                      {editingTransaction
                        ? "Editar transação"
                        : "Nova transação"}
                    </h3>
                  </div>

                  <span className="card-icon">
                    💳
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

              <section className="dashboard-card category-card">

                <div className="card-header">

                  <div>
                    <span className="section-label">
                      ORGANIZAÇÃO
                    </span>

                    <h3>
                      Categorias
                    </h3>
                  </div>

                  <span className="card-icon">
                    🏷️
                  </span>

                </div>

                <CategoryManager
                  categories={categories}
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

            <section className="dashboard-card transactions-preview">

              <div className="card-header">

                <div>
                  <span className="section-label">
                    MOVIMENTAÇÕES
                  </span>

                  <h3>
                    Transações recentes
                  </h3>
                </div>

                <button
                  className="see-all-button"
                  onClick={() =>
                    setActivePage("transactions")
                  }
                >
                  Ver todas →
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
              />

            </section>

          </div>

        )}

        {/* TRANSAÇÕES */}

        {activePage === "transactions" && (

          <div className="page-content">

            <section className="page-card">

              <div className="card-header">

                <div>
                  <span className="section-label">
                    FINANÇAS
                  </span>

                  <h3>
                    Todas as transações
                  </h3>
                </div>

                <span className="card-icon">
                  💳
                </span>

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

            <section className="page-card">

              <div className="card-header">

                <div>
                  <span className="section-label">
                    NOVO LANÇAMENTO
                  </span>

                  <h3>
                    Adicionar transação
                  </h3>
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

        {/* CATEGORIAS */}

        {activePage === "categories" && (

          <div className="page-content">

            <section className="page-card category-page-card">

              <div className="card-header">

                <div>
                  <span className="section-label">
                    ORGANIZAÇÃO
                  </span>

                  <h3>
                    Gerenciar categorias
                  </h3>
                </div>

                <span className="card-icon">
                  🏷️
                </span>

              </div>

              <CategoryManager
                categories={categories}
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

      </main>

    </div>
  )
}

export default App