import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function SalesChart({ data = [] }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mt-8">

      <h2 className="text-2xl font-bold mb-6">
        Monthly Sales
      </h2>

      {data.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No Sales Data Available
        </div>
      ) : (
        <ResponsiveContainer
          width="100%"
          height={350}
        >
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="totalSales"
              fill="#2563eb"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}

    </div>
  );
}

export default SalesChart;