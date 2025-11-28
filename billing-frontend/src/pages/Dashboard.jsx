import { useEffect, useState } from "react";
import { request } from "../services/apiHelper";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Dashboard() {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    profitLoss: 0,
  });

  const [monthly, setMonthly] = useState({
    invoices: [],
    expenses: [],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const s = await request("get", "/dashboard/profit-loss");
      const m = await request("get", "/dashboard/monthly-summary");

      setSummary(s);
      setMonthly(m);
    } catch {}
  };

  // Preparing Monthly Chart Data
  const months = [...new Set([
    ...monthly.invoices.map(i => i.month),
    ...monthly.expenses.map(e => e.month),
  ])].sort();

  const incomeData = months.map(m =>
    monthly.invoices.find(i => i.month === m)?.income || 0
  );

  const expenseData = months.map(m =>
    monthly.expenses.find(e => e.month === m)?.expenses || 0
  );

  const data = {
    labels: months,
    datasets: [
      {
        label: "Income",
        data: incomeData,
        backgroundColor: "rgba(34,197,94,0.6)", // green
        borderRadius: 8,
      },
      {
        label: "Expenses",
        data: expenseData,
        backgroundColor: "rgba(239,68,68,0.6)", // red
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="p-6 text-white">

      {/* Title */}
      <h1 className="text-3xl font-bold mb-6">
        Dashboard Overview
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        {/* Income Card */}
        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-lg">
          <p className="text-gray-300 text-sm">Total Income</p>
          <h2 className="text-3xl font-bold text-green-400 mt-1">
            ₹{summary.totalIncome.toLocaleString()}
          </h2>
        </div>

        {/* Expense Card */}
        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-lg">
          <p className="text-gray-300 text-sm">Total Expenses</p>
          <h2 className="text-3xl font-bold text-red-400 mt-1">
            ₹{summary.totalExpenses.toLocaleString()}
          </h2>
        </div>

        {/* Profit/Loss Card */}
        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-lg">
          <p className="text-gray-300 text-sm">Profit / Loss</p>
          <h2
            className={`text-3xl font-bold mt-1 ${
              summary.profitLoss >= 0 ? "text-green-300" : "text-red-300"
            }`}
          >
            ₹{summary.profitLoss.toLocaleString()}
          </h2>
        </div>
      </div>

      {/* Bar Chart Section */}
      <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-200">Monthly Summary</h2>
        <Bar data={data} />
      </div>
    </div>
  );
}