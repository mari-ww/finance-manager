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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    setError("")

    if (editingTransaction) {
      setCategoryId(
        String(editingTransaction.category_id)
      )

      setType(editingTransaction.type)
      setAmount(editingTransaction.amount)
      setDescription(
        editingTransaction.description || ""
      )
      setDate(editingTransaction.date)
    }
  }, [editingTransaction])

  async function handleSubmit(event) {
    event.preventDefault()

    setError("")
    setLoading(true)

    const transaction = {
      category_id: Number(categoryId),
      type,
      amount: Number(amount),
      description: description || null,
      date,
    }

    try {
      if (editingTransaction) {
        await onUpdateTransaction(
          editingTransaction.id,
          transaction
        )
      } else {
        await onCreateTransaction(transaction)
      }

      resetForm()
    } catch (error) {
      console.error(
        "Erro ao salvar transação:",
        error
      )

      setError(
        "Não foi possível salvar a transação."
      )
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setCategoryId("")
    setType("expense")
    setAmount("")
    setDescription("")
    setDate("")
    setError("")
  }

  function handleCancel() {
    if (loading) return

    resetForm()
    onCancelEdit()
  }

  return (
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
          disabled={loading}
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

        <div className="type-selector">

          <button
            type="button"
            className={
              type === "expense"
                ? "type-button selected"
                : "type-button"
            }
            onClick={() => setType("expense")}
            disabled={loading}
          >
            Despesa
          </button>

          <button
            type="button"
            className={
              type === "income"
                ? "type-button selected"
                : "type-button"
            }
            onClick={() => setType("income")}
            disabled={loading}
          >
            Receita
          </button>

        </div>
      </div>

      <div className="form-row">

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
            placeholder="R$ 0,00"
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label>
            Descrição{" "}
            <span>(opcional)</span>
          </label>

          <input
            type="text"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="Digite uma descrição"
            disabled={loading}
          />
        </div>

      </div>

      <div className="form-group date-group">

        <label>Data</label>

        <input
          type="date"
          value={date}
          onChange={(event) =>
            setDate(event.target.value)
          }
          disabled={loading}
          required
        />

      </div>

      {error && (
        <p className="error">
          {error}
        </p>
      )}

      <div className="form-actions">

        <button
          className="submit-transaction-button"
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Salvando..."
            : editingTransaction
              ? "Salvar alterações"
              : "Adicionar transação"}

          {!loading && !editingTransaction && (
            <span>+</span>
          )}
        </button>

        {editingTransaction && (
          <button
            className="cancel-button"
            type="button"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancelar
          </button>
        )}

      </div>

    </form>
  )
}

export default TransactionForm