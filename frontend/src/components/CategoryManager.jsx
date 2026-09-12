import { useEffect, useState } from "react"

function CategoryManager({
  categories,
  transactions = [],
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
  compact = false,
}) {
  const [name, setName] = useState("")
  const [type, setType] = useState("expense")
  const [editingCategory, setEditingCategory] =
    useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    setError("")

    if (editingCategory) {
      setName(editingCategory.name)
      setType(editingCategory.type)
    }
  }, [editingCategory])

  async function handleSubmit(event) {
    event.preventDefault()

    if (!name.trim()) return

    setError("")
    setLoading(true)

    const category = {
      name: name.trim(),
      type,
    }

    try {
      if (editingCategory) {
        await onUpdateCategory(
          editingCategory.id,
          category
        )

        setEditingCategory(null)
      } else {
        await onCreateCategory(category)
      }

      resetForm()
    } catch (error) {
      console.error(
        "Erro ao salvar categoria:",
        error
      )

      setError(
        "Não foi possível salvar a categoria."
      )
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setName("")
    setType("expense")
    setError("")
  }

  function handleCancel() {
    if (loading) return

    setEditingCategory(null)
    resetForm()
  }

  async function handleDelete(categoryId) {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir esta categoria?"
    )

    if (!confirmed) return

    setError("")
    setLoading(true)

    try {
      await onDeleteCategory(categoryId)
    } catch (error) {
      console.error(
        "Erro ao excluir categoria:",
        error
      )

      setError(
        "Não foi possível excluir a categoria."
      )
    } finally {
      setLoading(false)
    }
  }

function getCategoryTotal(categoryId) {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  return transactions
    .filter((transaction) => {
      if (
        transaction.category_id !== categoryId ||
        transaction.type !== "expense" ||
        !transaction.date
      ) {
        return false
      }

      const [year, month] = transaction.date
        .split("-")
        .map(Number)

      return (
        year === currentYear &&
        month - 1 === currentMonth
      )
    })
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount),
      0
    )
}

  const expenseCategories =
    categories.filter(
      (category) => category.type === "expense"
    )

  const totalExpenses =
    expenseCategories.reduce(
      (total, category) =>
        total + getCategoryTotal(category.id),
      0
    )

  function formatCurrency(value) {
    return Number(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  function getPercentage(value) {
    if (totalExpenses === 0) return 0

    return Math.round(
      (value / totalExpenses) * 100
    )
  }

  const categoryColors = [
    "category-orange",
    "category-blue",
    "category-purple",
    "category-pink",
    "category-gray",
  ]

  if (compact) {
    return (
      <div className="category-preview-list">

        {expenseCategories.length === 0 ? (
          <div className="empty-category">
            Nenhuma categoria cadastrada.
          </div>
        ) : (
          expenseCategories
            .map((category, index) => {

              const total =
                getCategoryTotal(category.id)

              const percentage =
                getPercentage(total)

              return (
                <div
                  className="category-preview-row"
                  key={category.id}
                >

                  <div className="category-name-area">

                    <span
                      className={`category-circle ${
                        categoryColors[
                          index %
                            categoryColors.length
                        ]
                      }`}
                    >
                      {index === 0
                        ? "♨"
                        : index === 1
                          ? "⌁"
                          : index === 2
                            ? "◈"
                            : index === 3
                              ? "♥"
                              : "•••"}
                    </span>

                    <span>
                      {category.name}
                    </span>

                  </div>

                  <span className="category-total">
                    {formatCurrency(total)}
                  </span>

                  <div className="category-progress">
                    <div>
                      <span
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>

                    <small>
                      {percentage}%
                    </small>
                  </div>

                </div>
              )
            })
        )}

      </div>
    )
  }

  return (
    <section className="category-manager-full">

      <form
        onSubmit={handleSubmit}
        className="category-form"
      >

        <div className="form-group">
          <label>Nome</label>

          <input
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="Ex: Alimentação"
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label>Tipo</label>

          <select
            value={type}
            onChange={(event) =>
              setType(event.target.value)
            }
            disabled={loading}
          >
            <option value="expense">
              Despesa
            </option>

            <option value="income">
              Receita
            </option>
          </select>
        </div>

        {error && (
          <p className="error">
            {error}
          </p>
        )}

        <div className="form-actions">

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Salvando..."
              : editingCategory
                ? "Salvar alterações"
                : "Adicionar categoria"}
          </button>

          {editingCategory && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="cancel-button"
            >
              Cancelar
            </button>
          )}

        </div>

      </form>

      <div className="category-list-full">

        {categories.length === 0 ? (
          <div className="empty-state">
            Nenhuma categoria cadastrada.
          </div>
        ) : (
          categories.map((category) => (

            <div
              className="category-full-row"
              key={category.id}
            >

              <span>
                {category.name}
              </span>

              <span className="category-type">
                {category.type === "income"
                  ? "Receita"
                  : "Despesa"}
              </span>

              <div>

                <button
                  type="button"
                  onClick={() =>
                    setEditingCategory(category)
                  }
                  disabled={loading}
                >
                  Editar
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(category.id)
                  }
                  disabled={loading}
                >
                  Excluir
                </button>

              </div>

            </div>

          ))
        )}

      </div>

    </section>
  )
}

export default CategoryManager