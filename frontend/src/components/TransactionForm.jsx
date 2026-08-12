import { useEffect, useState } from "react"

function TransactionForm({
  categories,
  onCreateTransaction,
  onUpdateTransaction,
  editingTransaction,
  onCancelEdit,
}) {
  const [categoryId, setCategoryId] = useState("")
  const [type, setType] = useState("expense")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")

  useEffect(() => {
    if (editingTransaction) {
      setCategoryId(String(editingTransaction.category_id))
      setType(editingTransaction.type)
      setAmount(editingTransaction.amount)
      setDescription(editingTransaction.description || "")
      setDate(editingTransaction.date)
    }
  }, [editingTransaction])

  async function handleSubmit(event) {
    event.preventDefault()

    const transaction = {
      category_id: Number(categoryId),
      type,
      amount: Number(amount),
      description: description || null,
      date,
    }

    if (editingTransaction) {
      await onUpdateTransaction(
        editingTransaction.id,
        transaction
      )
    } else {
      await onCreateTransaction(transaction)
    }

    resetForm()
  }

  function resetForm() {
    setCategoryId("")
    setType("expense")
    setAmount("")
    setDescription("")
    setDate("")
  }

  function handleCancel() {
    resetForm()
    onCancelEdit()
  }

  return (
    <section>

      <h2>
        {editingTransaction
          ? "Editar transação"
          : "Nova transação"}
      </h2>

      <form
        className="transaction-form"
        onSubmit={handleSubmit}
      >

        <div className="form-group">
          <label>Categoria</label>

          <select
            value={categoryId}
            onChange={(event) =>
              setCategoryId(event.target.value)
            }
            required
          >
            <option value="">
              Selecione uma categoria
            </option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Tipo</label>

          <select
            value={type}
            onChange={(event) =>
              setType(event.target.value)
            }
          >
            <option value="expense">
              Despesa
            </option>

            <option value="income">
              Receita
            </option>
          </select>
        </div>

        <div className="form-group">
          <label>Valor</label>

          <input
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(event) =>
              setAmount(event.target.value)
            }
            required
          />
        </div>

        <div className="form-group">
          <label>Descrição</label>

          <input
            type="text"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
          />
        </div>

        <div className="form-group">
          <label>Data</label>

          <input
            type="date"
            value={date}
            onChange={(event) =>
              setDate(event.target.value)
            }
            required
          />
        </div>

        <div>
          <button type="submit">
            {editingTransaction
              ? "Salvar alterações"
              : "Adicionar transação"}
          </button>

          {editingTransaction && (
            <button
              type="button"
              onClick={handleCancel}
            >
              Cancelar
            </button>
          )}
        </div>

      </form>

    </section>
  )
}

export default TransactionForm