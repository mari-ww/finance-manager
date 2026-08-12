function Summary({ transactions }) {
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

  function formatCurrency(value) {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  return (
    <section>

      <h2>Resumo financeiro</h2>

      <div className="summary">

        <div className="card income">
          <h3>Receitas</h3>
          <p>{formatCurrency(totalIncome)}</p>
        </div>

        <div className="card expense">
          <h3>Despesas</h3>
          <p>{formatCurrency(totalExpenses)}</p>
        </div>

        <div className="card balance">
          <h3>Saldo</h3>
          <p>{formatCurrency(balance)}</p>
        </div>

      </div>

    </section>
  )
}

export default Summary