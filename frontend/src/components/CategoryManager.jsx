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

  useEffect(() => {
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

    const category = {
      name: name.trim(),
      type,
    }

    if (editingCategory) {
      await onUpdateCategory(editingCategory.id, category)
      setEditingCategory(null)
    } else {
      await onCreateCategory(category)
    }

    resetForm()
  }

  function resetForm() {
    setName("")
    setType("expense")
  }

  function handleCancel() {
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

    await onDeleteCategory(categoryId)
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
          >
            <option value="expense">
              Despesa
            </option>

            <option value="income">
              Receita
            </option>
          </select>
        </div>

        <div>
          <button type="submit">
            {editingCategory
              ? "Salvar alterações"
              : "Adicionar categoria"}
          </button>

          {editingCategory && (
            <button
              type="button"
              onClick={handleCancel}
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
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(category.id)
                    }
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