import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface StatsChartQuizProps {
  data: { jour: string; quizCount: number }[];
}

export default function StatsChartQuiz({ data }: StatsChartQuizProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-xl font-heading font-bold mb-5 text-dark drop-shadow-sm">
        Nombre de quiz terminés par jour (7 derniers jours)
      </h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="jour"
            stroke="#0e7011"
            tick={{ fontSize: 13, fontWeight: "600", fill: "#064e03" }}
            axisLine={{ stroke: "#0e7011" }}
            tickLine={false}
          />
          <YAxis
            stroke="#0e7011"
            tick={{ fontSize: 13, fontWeight: "600", fill: "#064e03" }}
            axisLine={{ stroke: "#0e7011" }}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#f0fdf4",
              borderRadius: 8,
              border: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
            itemStyle={{ color: "#0e7011", fontWeight: "600" }}
            cursor={{ fill: "rgba(14,112,17,0.1)" }}
          />
          <Bar
            dataKey="quizCount"
            fill="#0e7011"
            radius={[6, 6, 0, 0]}
            barSize={25}
            animationDuration={800}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}