function TransactionList({
  transactions,
  categories,
  onDeleteTransaction,
  onEditTransaction,
}) {
  function getCategoryName(categoryId) {
    const category = categories.find(
      (category) => category.id === categoryId
    )

    return category ? category.name : "Sem categoria"
  }

  function formatCurrency(value) {
    return Number(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  return (
    <section>
      <h2>Transações</h2>

      {transactions.length === 0 ? (
        <p>Nenhuma transação cadastrada.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Tipo</th>
                <th>Valor</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.date}</td>

                  <td>
                    {transaction.description || "-"}
                  </td>

                  <td>
                    {getCategoryName(transaction.category_id)}
                  </td>

                  <td>
                    {transaction.type === "income"
                      ? "Receita"
                      : "Despesa"}
                  </td>

                  <td>
                    {formatCurrency(transaction.amount)}
                  </td>

                  <td>
                    <button
                      onClick={() =>
                        onEditTransaction(transaction)
                      }
                    >
                      Editar
                    </button>

                    <button
                      onClick={() =>
                        onDeleteTransaction(transaction.id)
                      }
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default TransactionList