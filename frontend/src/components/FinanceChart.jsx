import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

function FinanceChart({ transactions }) {
  const today = new Date()
  const months = []

  for (let i = 5; i >= 0; i--) {
    const date = new Date(
      today.getFullYear(),
      today.getMonth() - i,
      1
    )

    months.push({
      year: date.getFullYear(),
      month: date.getMonth(),
      label: date
        .toLocaleDateString("pt-BR", {
          month: "short",
        })
        .replace(".", ""),
      receitas: 0,
      despesas: 0,
    })
  }

  transactions.forEach((transaction) => {
    if (!transaction.date) return

    const [year, month, day] = transaction.date
      .split("-")
      .map(Number)

    const transactionDate = new Date(
      year,
      month - 1,
      day
    )

    const currentMonth = months.find(
      (item) =>
        item.year === transactionDate.getFullYear() &&
        item.month === transactionDate.getMonth()
    )

    if (!currentMonth) return

    const amount = Number(transaction.amount)

    if (transaction.type === "income") {
      currentMonth.receitas += amount
    }

    if (transaction.type === "expense") {
      currentMonth.despesas += amount
    }
  })

  function formatCurrency(value) {
    return `R$ ${Number(value).toLocaleString(
      "pt-BR",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`
  }

  return (
    <section className="dashboard-card finance-chart-card">

      <div className="chart-heading">

        <div>
          <h3>
            Visão financeira
          </h3>

          <p>
            Receitas e despesas dos últimos 6 meses
          </p>
        </div>

        <div className="chart-legend">

          <span>
            <i className="legend-income" />
            Receitas
          </span>

          <span>
            <i className="legend-expense" />
            Despesas
          </span>

        </div>

      </div>

      <div className="finance-chart">

        <ResponsiveContainer
          width="100%"
          height={250}
        >

          <BarChart
            data={months}
            margin={{
              top: 8,
              right: 8,
              left: 0,
              bottom: 0,
            }}
            barGap={8}
          >

            <CartesianGrid
              strokeDasharray="2 3"
              vertical={false}
              stroke="#eee5e8"
            />

            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 10,
                fill: "#6f6267",
              }}
              dy={8}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 10,
                fill: "#6f6267",
              }}
              tickFormatter={(value) => {
                if (value >= 1000) {
                  return `R$ ${value / 1000}k`
                }

                return `R$ ${value}`
              }}
            />

            <Tooltip
              formatter={(value, name) => [
                formatCurrency(value),
                name === "Receitas"
                  ? "Receitas"
                  : "Despesas",
              ]}
              contentStyle={{
                borderRadius: "10px",
                border: "1px solid #f0e3e7",
                fontSize: "11px",
              }}
            />

            <Legend
              verticalAlign="top"
              height={0}
              content={() => null}
            />

            <Bar
              dataKey="receitas"
              name="Receitas"
              fill="#e95075"
              radius={[4, 4, 0, 0]}
              maxBarSize={22}
            />

            <Bar
              dataKey="despesas"
              name="Despesas"
              fill="#f5a5b7"
              radius={[4, 4, 0, 0]}
              maxBarSize={22}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </section>
  )
}

export default FinanceChart