import { useEffect, useState } from "react"

function CategoryManager({
  categories,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
}) {
  const [name, setName] = useState("")
  const [type, setType] = useState("expense")
  const [editingCategory, setEditingCategory] = useState(null)
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

    if (!name.trim()) {
      return
    }

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
      console.error("Erro ao salvar categoria:", error)
      setError("Não foi possível salvar a categoria.")
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
    if (loading) {
      return
    }

    setEditingCategory(null)
    resetForm()
  }

  async function handleDelete(categoryId) {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir esta categoria?"
    )

    if (!confirmed) {
      return
    }

    setError("")
    setLoading(true)

    try {
      await onDeleteCategory(categoryId)
    } catch (error) {
      console.error("Erro ao excluir categoria:", error)
      setError("Não foi possível excluir a categoria.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="category-manager">
      <h2>
        {editingCategory
          ? "Editar categoria"
          : "Categorias"}
      </h2>

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

        <div>
          <button type="submit" disabled={loading}>
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
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="category-list">
        {categories.length === 0 ? (
          <p>Nenhuma categoria cadastrada.</p>
        ) : (
          <ul>
            {categories.map((category) => (
              <li key={category.id}>
                <span>
                  {category.name}
                </span>

                <span>
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
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

export default CategoryManager