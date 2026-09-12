const app = document.getElementById("app")

const categories = [
  {
    id: 1,
    name: "Aluguel",
    type: "expense",
    icon: "⌂",
    color: "category-purple",
  },
  {
    id: 2,
    name: "Comida",
    type: "expense",
    icon: "♡",
    color: "category-orange",
  },
  {
    id: 3,
    name: "Astrologia",
    type: "expense",
    icon: "✦",
    color: "category-blue",
  },
  {
    id: 4,
    name: "Lazer",
    type: "expense",
    icon: "♢",
    color: "category-pink",
  },
  {
    id: 5,
    name: "Aventuras",
    type: "income",
    icon: "★",
    color: "category-gray",
  },
]

const transactions = [
  {
    id: 1,
    description: "Aluguel de Mondstadt",
    category: "Aluguel",
    type: "expense",
    amount: 1200,
    date: "2026-09-12",
  },
  {
    id: 2,
    description: "Recompensa de aventura",
    category: "Aventuras",
    type: "income",
    amount: 650,
    date: "2026-09-10",
  },
  {
    id: 3,
    description: "Jantar que eu não deveria ter comprado",
    category: "Comida",
    type: "expense",
    amount: 185,
    date: "2026-09-09",
  },
  {
    id: 4,
    description: "Consultoria astrológica",
    category: "Astrologia",
    type: "income",
    amount: 300,
    date: "2026-09-08",
  },
  {
    id: 5,
    description: "Novo chapéu",
    category: "Lazer",
    type: "expense",
    amount: 240,
    date: "2026-09-06",
  },
  {
    id: 6,
    description: "Comida",
    category: "Comida",
    type: "expense",
    amount: 96,
    date: "2026-09-05",
  },
  {
    id: 7,
    description: "Taxa da guilda",
    category: "Aventuras",
    type: "expense",
    amount: 80,
    date: "2026-09-03",
  },
  {
    id: 8,
    description: "Pagamento atrasado",
    category: "Aventuras",
    type: "income",
    amount: 500,
    date: "2026-08-29",
  },
]

let activePage = "dashboard"

function formatCurrency(value) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

function formatDate(date) {
  const [year, month, day] = date.split("-").map(Number)

  return new Date(year, month - 1, day).toLocaleDateString("pt-BR")
}

function showDemoNotice(message = "Esta ação está disponível apenas no projeto real.") {
  const notice = document.getElementById("demo-notice")

  notice.innerHTML = `
    <strong>Modo demonstração</strong>
    <span>${message}</span>

    <div class="demo-progress">
      <span></span>
    </div>
  `

  notice.style.display = "block"

  const progress = notice.querySelector(".demo-progress span")

  progress.style.animation = "none"

  requestAnimationFrame(() => {
    progress.style.animation = "demoProgress 3s linear forwards"
  })

  clearTimeout(window.demoNoticeTimer)

  window.demoNoticeTimer = setTimeout(() => {
    notice.style.display = "none"
  }, 3000)
}

function getCategory(name) {
  return categories.find(category => category.name === name)
}

function renderSidebar() {
  return `
    <aside class="sidebar">

      <div class="sidebar-brand">
        <div class="brand-logo">
          <span>♥</span>
        </div>

        <div class="brand-text">
          <strong>Finance</strong>
          <span>Manager</span>
        </div>
      </div>

      <nav class="sidebar-nav">

        <button
          class="nav-item ${activePage === "dashboard" ? "active" : ""}"
          onclick="navigate('dashboard')"
        >
          <span class="nav-icon">⌂</span>
          Dashboard
        </button>

        <button
          class="nav-item ${activePage === "transactions" ? "active" : ""}"
          onclick="navigate('transactions')"
        >
          <span class="nav-icon">▤</span>
          Transações
        </button>

        <button
          class="nav-item ${activePage === "categories" ? "active" : ""}"
          onclick="navigate('categories')"
        >
          <span class="nav-icon">▱</span>
          Categorias
        </button>

        <button
          class="nav-item"
          onclick="navigate('dashboard')"
        >
          <span class="nav-icon">▥</span>
          Relatórios
        </button>

      </nav>

      <div class="sidebar-decoration">

        <span>✦</span>

        <div class="piggy-bank">
          <div class="coin">R$</div>
          <div class="pig">🐷</div>
        </div>

        <span>♥</span>

      </div>

      <div class="sidebar-user-section">

        <div class="sidebar-user">

          <div class="user-avatar demo-mona-avatar">
            🔮
          </div>

          <div class="user-info">
            <strong>Mona</strong>
            <span>mona.astrologia@teyvat.com</span>
          </div>

          <button
            class="user-arrow"
            onclick="showDemoNotice('O menu de perfil é apenas visual nesta demo.')"
          >
            ⌄
          </button>

        </div>

      </div>

    </aside>
  `
}

function renderTopbar() {
  return `
    <header class="topbar">

      <div>
        <p class="topbar-greeting">
          Olá, Mona! <span>♥</span>
        </p>

        <p class="topbar-subtitle">
          Aqui está o resumo das suas finanças hoje.
        </p>
      </div>

      <div class="topbar-date">
        <span class="calendar-icon">▣</span>
        12 de setembro de 2026
      </div>

    </header>
  `
}

function renderSummary() {
  const income = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)

  const expenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = income - expenses

  return `
    <section class="dashboard-summary">

      <h2 class="summary-heading">
        Resumo financeiro
      </h2>

      <div class="summary">

        <div class="summary-card income-card">
          <div class="summary-icon">↑</div>

          <div class="summary-content">
            <span class="summary-label">
              RECEITAS
            </span>

            <strong>${formatCurrency(income)}</strong>

            <small>
              <span>↗ 12%</span>
              em relação ao mês passado
            </small>
          </div>
        </div>

        <div class="summary-card expense-card">
          <div class="summary-icon">↓</div>

          <div class="summary-content">
            <span class="summary-label">
              DESPESAS
            </span>

            <strong>${formatCurrency(expenses)}</strong>

            <small>
              <span>↗ 27%</span>
              em relação ao mês passado
            </small>
          </div>
        </div>

        <div class="summary-card balance-card">
          <div class="summary-icon">▱</div>

          <div class="summary-content">
            <span class="summary-label">
              SALDO
            </span>

            <strong>${formatCurrency(balance)}</strong>

            <small>
              <span>↘ 18%</span>
              em relação ao mês passado
            </small>
          </div>
        </div>

      </div>

    </section>
  `
}

function renderFinanceChart() {
  const months = [
    { name: "Abr", income: 35, expense: 65 },
    { name: "Mai", income: 55, expense: 48 },
    { name: "Jun", income: 40, expense: 72 },
    { name: "Jul", income: 70, expense: 52 },
    { name: "Ago", income: 58, expense: 78 },
    { name: "Set", income: 35, expense: 90 },
  ]

  return `
    <section class="dashboard-card finance-chart-card">

      <div class="chart-heading">

        <div>
          <h3>Visão financeira</h3>

          <p>
            Receitas e despesas dos últimos meses
          </p>
        </div>

        <div class="chart-legend">

          <span>
            <i class="legend-income"></i>
            Receitas
          </span>

          <span>
            <i class="legend-expense"></i>
            Despesas
          </span>

        </div>

      </div>

      <div class="demo-finance-chart">

        ${months.map(month => `
          <div class="demo-chart-month">

            <div class="demo-chart-bars">

              <div
                class="demo-bar demo-bar-income"
                style="height:${month.income}%"
              ></div>

              <div
                class="demo-bar demo-bar-expense"
                style="height:${month.expense}%"
              ></div>

            </div>

            <small>${month.name}</small>

          </div>
        `).join("")}

      </div>

    </section>
  `
}

function renderTransactionForm() {
  return `
    <section class="dashboard-card new-transaction-card">

      <div class="card-title-row">

        <div>
          <h3>Nova transação</h3>
        </div>

        <span class="small-card-icon">
          ▣
        </span>

      </div>

      <form
        class="transaction-form"
        onsubmit="submitDemoTransaction(event)"
      >

        <div class="form-group">

          <label>
            Descrição
          </label>

          <input
            type="text"
            placeholder="Ex.: Compra de comida"
          />

        </div>

        <div class="form-group">

          <label>
            Valor
          </label>

          <input
            type="number"
            placeholder="0,00"
          />

        </div>

        <div class="form-group">

          <label>
            Tipo
          </label>

          <div class="type-selector">

            <button
              type="button"
              class="type-button selected"
              onclick="selectDemoType(this)"
            >
              ↑ Receita
            </button>

            <button
              type="button"
              class="type-button"
              onclick="selectDemoType(this)"
            >
              ↓ Despesa
            </button>

          </div>

        </div>

        <div class="form-group">

          <label>
            Categoria
          </label>

          <select>
            <option>Aluguel</option>
            <option>Comida</option>
            <option>Astrologia</option>
            <option>Lazer</option>
            <option>Aventuras</option>
          </select>

        </div>

        <div class="form-group">

          <label>
            Data
          </label>

          <input
            type="date"
            value="2026-09-12"
          />

        </div>

        <div class="form-actions">

          <button
            type="submit"
            class="submit-transaction-button"
          >
            <span>+</span>
            Adicionar transação
          </button>

        </div>

      </form>

      <p class="demo-form-note">
        * Os dados inseridos não são salvos nesta demonstração.
      </p>

    </section>
  `
}

function renderTransactionRows(list = transactions) {
  return list.map(transaction => {

    const category = getCategory(transaction.category)

    return `
      <div class="transaction-row">

        <span class="transaction-description">
          ${transaction.description}
        </span>

        <span class="transaction-category">

          <span class="category-dot ${category?.color || "category-gray"}"></span>

          <span>
            ${transaction.category}
          </span>

        </span>

        <span>
          <span class="transaction-badge ${
            transaction.type === "income"
              ? "income-badge"
              : "expense-badge"
          }">
            ${
              transaction.type === "income"
                ? "Receita"
                : "Despesa"
            }
          </span>
        </span>

        <span
          class="transaction-value ${
            transaction.type === "income"
              ? "income-value"
              : "expense-value"
          }"
        >
          ${
            transaction.type === "income"
              ? "+"
              : "-"
          } ${formatCurrency(transaction.amount)}
        </span>

        <span class="transaction-date">
          ${formatDate(transaction.date)}
        </span>

        <span class="transaction-actions">

          <button
            class="dots-button"
            onclick="showDemoNotice('Editar e excluir estão desativados no modo demonstração.')"
          >
            ⋮
          </button>

        </span>

      </div>
    `
  }).join("")
}

function renderTransactionsTable(list = transactions) {
  return `
    <div class="transaction-table demo-full-table">

      <div class="transaction-table-header">

        <span>DESCRIÇÃO</span>
        <span>CATEGORIA</span>
        <span>TIPO</span>
        <span>VALOR</span>
        <span>DATA</span>
        <span></span>

      </div>

      ${renderTransactionRows(list)}

    </div>
  `
}

function renderRecentTransactions() {
  return `
    <section class="dashboard-card transactions-preview">

      <div class="card-title-row">

        <div class="title-with-icon">

          <span class="small-card-icon">
            ▣
          </span>

          <h3>
            Transações recentes
          </h3>

        </div>

        <button
          class="link-button"
          onclick="navigate('transactions')"
        >
          Ver todas
        </button>

      </div>

      <div class="transaction-table">

        <div class="transaction-table-header">

          <span>DESCRIÇÃO</span>
          <span>CATEGORIA</span>
          <span>TIPO</span>
          <span>VALOR</span>
          <span>DATA</span>
          <span></span>

        </div>

        ${renderTransactionRows(transactions.slice(0, 5))}

      </div>

    </section>
  `
}

function renderMonthlyExpenses() {
  const expenses = transactions.filter(
    transaction => transaction.type === "expense"
  )

  const totals = {}

  expenses.forEach(transaction => {
    totals[transaction.category] =
      (totals[transaction.category] || 0) +
      transaction.amount
  })

  const max = Math.max(...Object.values(totals))

  return `
    <section class="dashboard-card categories-preview">

      <div class="card-title-row">

        <h3>
          Despesas do mês
        </h3>

        <button
          class="manage-button"
          onclick="navigate('categories')"
        >
          Gerenciar
        </button>

      </div>

      <div class="category-preview-list">

        ${Object.entries(totals).map(
          ([name, total]) => {

            const category = getCategory(name)

            const percentage = Math.round(
              (total / max) * 100
            )

            return `
              <div class="category-preview-row">

                <div class="category-name-area">

                  <span
                    class="category-circle ${category?.color || "category-gray"}"
                  >
                    ${category?.icon || "•"}
                  </span>

                  <span>
                    ${name}
                  </span>

                </div>

                <span class="category-total">
                  ${formatCurrency(total)}
                </span>

                <div class="category-progress">

                  <div>
                    <span
                      style="width:${percentage}%"
                    ></span>
                  </div>

                  <small>
                    ${percentage}%
                  </small>

                </div>

              </div>
            `
          }
        ).join("")}

      </div>

    </section>
  `
}

function renderDashboard() {
  return `
    <div class="dashboard-page">

      ${renderSummary()}

      <div class="main-dashboard-grid">

        ${renderFinanceChart()}

        ${renderTransactionForm()}

      </div>

      <div class="bottom-dashboard-grid">

        ${renderRecentTransactions()}

        ${renderMonthlyExpenses()}

      </div>

      <div class="demo-mona-message">
        <strong>🔮 Mona:</strong>
        "Eu finalmente organizei minhas finanças.
        Infelizmente, isso só confirmou que eu não tenho dinheiro."
      </div>

    </div>
  `
}

function renderTransactionsPage() {
  return `
    <div class="dashboard-page">

      <section class="dashboard-card full-page-card">

        <div class="card-title-row">

          <div>

            <span class="section-label">
              FINANÇAS
            </span>

            <h3>
              Todas as transações
            </h3>

          </div>

        </div>

        ${renderTransactionsTable()}

      </section>

      <section class="dashboard-card full-page-card">

        <div class="card-title-row">

          <div>

            <span class="section-label">
              NOVO LANÇAMENTO
            </span>

            <h3>
              Adicionar transação
            </h3>

          </div>

        </div>

        ${renderTransactionForm()}

      </section>

    </div>
  `
}

function renderCategoriesPage() {
  return `
    <div class="dashboard-page">

      <section class="dashboard-card full-page-card">

        <div class="card-title-row">

          <div>

            <span class="section-label">
              ORGANIZAÇÃO
            </span>

            <h3>
              Gerenciar categorias
            </h3>

          </div>

        </div>

        <div class="category-manager-full">

          <form
            class="category-form"
            onsubmit="submitDemoCategory(event)"
          >

            <div class="form-group">

              <label>
                Nome
              </label>

              <input
                type="text"
                placeholder="Ex.: Transporte"
              />

            </div>

            <div class="form-group">

              <label>
                Tipo
              </label>

              <select>
                <option>Despesa</option>
                <option>Receita</option>
              </select>

            </div>

            <div class="form-actions">

              <button type="submit">
                Criar categoria
              </button>

            </div>

          </form>

          <div class="category-list-full">

            ${categories.map(category => `
              <div class="category-full-row">

                <span>
                  ${category.name}
                </span>

                <span class="category-type">
                  ${
                    category.type === "income"
                      ? "Receita"
                      : "Despesa"
                  }
                </span>

                <div>

                  <button
                    onclick="showDemoNotice('Editar categorias está desativado nesta demonstração.')"
                  >
                    Editar
                  </button>

                  <button
                    onclick="showDemoNotice('Excluir categorias está desativado nesta demonstração.')"
                  >
                    Excluir
                  </button>

                </div>

              </div>
            `).join("")}

          </div>

        </div>

        <div class="demo-mona-message">
          <strong>🔮 Mona:</strong>
          "Eu criei uma categoria chamada 'Astrologia'
          porque aparentemente prever meu futuro financeiro
          é mais fácil do que melhorar ele."
        </div>

      </section>

    </div>
  `
}

function renderApp() {
  let content = ""

  if (activePage === "dashboard") {
    content = renderDashboard()
  }

  if (activePage === "transactions") {
    content = renderTransactionsPage()
  }

  if (activePage === "categories") {
    content = renderCategoriesPage()
  }

  app.innerHTML = `
    <div class="app">

      ${renderSidebar()}

      <main class="main-area">

        ${renderTopbar()}

        ${content}

      </main>

    </div>
  `
}

function navigate(page) {
  activePage = page
  renderApp()

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

function submitDemoTransaction(event) {
  event.preventDefault()

  showDemoNotice(
    "A transação seria criada aqui, mas os dados não são salvos na demo."
  )
}

function submitDemoCategory(event) {
  event.preventDefault()

  showDemoNotice(
    "A categoria seria criada aqui, mas os dados não são salvos na demo."
  )
}

function selectDemoType(button) {
  const container = button.parentElement

  container
    .querySelectorAll(".type-button")
    .forEach(item => {
      item.classList.remove("selected")
    })

  button.classList.add("selected")
}

renderApp()

setTimeout(() => {
  showDemoNotice(
    "Explore o Dashboard, Transações e Categorias."
  )
}, 500)