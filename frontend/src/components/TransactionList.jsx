import { useState } from "react"

function TransactionList({
  transactions,
  categories,
  onDeleteTransaction,
  onEditTransaction,
  compact = false,
}) {
  const [openMenu, setOpenMenu] = useState(null)

  function getCategory(categoryId) {
    return categories.find(
      (category) => category.id === categoryId
    )
  }

  function formatCurrency(value, type) {
    const formatted = Number(value).toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    )

    return type === "expense"
      ? `- ${formatted}`
      : formatted
  }

  function formatDate(dateString) {
    if (!dateString) return "-"

    const [year, month, day] =
      dateString.split("-")

    return `${day}/${month}/${year}`
  }

  function getCategoryColor(categoryId) {
    const colors = [
      "category-orange",
      "category-blue",
      "category-purple",
      "category-pink",
      "category-gray",
    ]

    return colors[
      Number(categoryId || 0) % colors.length
    ]
  }

  function toggleMenu(id) {
    setOpenMenu(
      openMenu === id ? null : id
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="empty-state">
        <span>♡</span>
        <p>
          Nenhuma transação cadastrada.
        </p>
      </div>
    )
  }

  return (
    <div
      className={
        compact
          ? "transaction-table compact"
          : "transaction-table"
      }
    >

      <div className="transaction-table-header">
        <span>Descrição</span>
        <span>Categoria</span>
        <span>Tipo</span>
        <span>Valor</span>
        <span>Data</span>
        <span />
      </div>

      {transactions.map((transaction) => {

        const category = getCategory(
          transaction.category_id
        )

        const categoryColor =
          getCategoryColor(
            transaction.category_id
          )

        return (
          <div
            className="transaction-row"
            key={transaction.id}
          >

            <div className="transaction-description">
              {transaction.description || "-"}
            </div>

            <div className="transaction-category">

              <span
                className={`category-dot ${categoryColor}`}
              />

              <span>
                {category
                  ? category.name
                  : "Sem categoria"}
              </span>

            </div>

            <div>

              <span
                className={
                  transaction.type === "income"
                    ? "transaction-badge income-badge"
                    : "transaction-badge expense-badge"
                }
              >
                {transaction.type === "income"
                  ? "Receita"
                  : "Despesa"}
              </span>

            </div>

            <div
              className={
                transaction.type === "income"
                  ? "transaction-value income-value"
                  : "transaction-value expense-value"
              }
            >
              {formatCurrency(
                transaction.amount,
                transaction.type
              )}
            </div>

            <div className="transaction-date">
              {formatDate(transaction.date)}
            </div>

            <div className="transaction-actions">

              <button
                className="dots-button"
                onClick={() =>
                  toggleMenu(transaction.id)
                }
              >
                ⋮
              </button>

              {openMenu === transaction.id && (
                <div className="action-menu">

                  <button
                    onClick={() => {
                      onEditTransaction(
                        transaction
                      )
                      setOpenMenu(null)
                    }}
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => {
                      setOpenMenu(null)
                      onDeleteTransaction(
                        transaction.id
                      )
                    }}
                  >
                    Excluir
                  </button>

                </div>
              )}

            </div>

          </div>
        )
      })}

    </div>
  )
}

export default TransactionList