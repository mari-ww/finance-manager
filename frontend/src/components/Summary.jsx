function Summary({ transactions }) {
  const now = new Date()

  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const previousDate = new Date(
    currentYear,
    currentMonth - 1,
    1
  )

  const previousMonth = previousDate.getMonth()
  const previousYear = previousDate.getFullYear()

  function getTotals(month, year) {
    const monthTransactions = transactions.filter((transaction) => {
      if (!transaction.date) return false

      const [transactionYear, transactionMonth] =
        transaction.date.split("-").map(Number)

      return (
        transactionYear === year &&
        transactionMonth - 1 === month
      )
    })

    const income = monthTransactions
      .filter((transaction) => transaction.type === "income")
      .reduce(
        (total, transaction) => total + Number(transaction.amount),
        0
      )

    const expenses = monthTransactions
      .filter((transaction) => transaction.type === "expense")
      .reduce(
        (total, transaction) => total + Number(transaction.amount),
        0
      )

    return {
      income,
      expenses,
      balance: income - expenses,
    }
  }

  function getGeneralTotals() {
    const income = transactions
      .filter((transaction) => transaction.type === "income")
      .reduce(
        (total, transaction) => total + Number(transaction.amount),
        0
      )

    const expenses = transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce(
        (total, transaction) => total + Number(transaction.amount),
        0
      )

    return {
      income,
      expenses,
      balance: income - expenses,
    }
  }

  const general = getGeneralTotals()
  const current = getTotals(currentMonth, currentYear)
  const previous = getTotals(previousMonth, previousYear)

  function formatCurrency(value) {
    return Number(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  function calculatePercentage(currentValue, previousValue) {
    if (previousValue === 0) {
      return null
    }

    return Math.round(
      ((currentValue - previousValue) /
        Math.abs(previousValue)) *
        100
    )
  }

  function renderChange(currentValue, previousValue) {
    const percentage = calculatePercentage(
      currentValue,
      previousValue
    )

    if (percentage === null) {
      return "—"
    }

    return `${percentage >= 0 ? "↗" : "↘"} ${Math.abs(
      percentage
    )}%`
  }

  return (
    <section>
      <h2 className="summary-heading">
        Resumo financeiro
      </h2>

      <div className="summary">
        <div className="summary-card income-card">
          <div className="summary-icon">
            ↑
          </div>

          <div className="summary-content">
            <span className="summary-label">
              RECEITAS
            </span>

            <strong>
              {formatCurrency(general.income)}
            </strong>

            <small>
              <span>
                {renderChange(current.income, previous.income)}
              </span>{" "}
              em relação ao mês passado
            </small>
          </div>
        </div>

        <div className="summary-card expense-card">
          <div className="summary-icon">
            ↓
          </div>

          <div className="summary-content">
            <span className="summary-label">
              DESPESAS
            </span>

            <strong>
              {formatCurrency(general.expenses)}
            </strong>

            <small>
              <span>
                {renderChange(current.expenses, previous.expenses)}
              </span>{" "}
              em relação ao mês passado
            </small>
          </div>
        </div>

        <div className="summary-card balance-card">
          <div className="summary-icon">
            ▱
          </div>

          <div className="summary-content">
            <span className="summary-label">
              SALDO
            </span>

            <strong>
              {formatCurrency(general.balance)}
            </strong>

            <small>
              <span>
                {renderChange(current.balance, previous.balance)}
              </span>{" "}
              em relação ao mês passado
            </small>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Summary