import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    api
      .get("/dashboard", {
        headers: { Authorization: token }
      })
      .then((res) => setStats(res.data))
      .catch((err) => console.log(err));
  }, []);

  if (!stats) return <div>Loading...</div>;

  const revenueChart = {
    labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    datasets: [
      {
        label: "Monthly Revenue",
        data: stats.monthlyRevenue,
        borderColor: "rgb(34,197,94)",
        backgroundColor: "rgba(34,197,94,0.2)",
        tension: 0.3
      }
    ]
  };

  const expenseChart = {
    labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    datasets: [
      {
        label: "Monthly Expenses",
        data: stats.monthlyExpenses,
        borderColor: "rgb(239,68,68)",
        backgroundColor: "rgba(239,68,68,0.2)",
        tension: 0.3
      }
    ]
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-4 gap-4 mb-8">

        <div className="bg-white p-5 shadow rounded">
          <p className="text-gray-500">Total Revenue</p>
          <p className="text-3xl font-bold text-green-600">₹{stats.totalRevenue}</p>
        </div>

        <div className="bg-white p-5 shadow rounded">
          <p className="text-gray-500">Total Invoices</p>
          <p className="text-3xl font-bold">{stats.totalInvoices}</p>
        </div>

        <div className="bg-white p-5 shadow rounded">
          <p className="text-gray-500">Customers</p>
          <p className="text-3xl font-bold">{stats.totalCustomers}</p>
        </div>

        <div className="bg-white p-5 shadow rounded">
          <p className="text-gray-500">Expenses</p>
          <p className="text-3xl font-bold text-red-600">₹{stats.totalExpenses}</p>
        </div>

      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-2 gap-6">

        <div className="bg-white p-6 shadow rounded">
          <h2 className="text-lg font-semibold mb-3">Revenue Overview</h2>
          <Line data={revenueChart} />
        </div>

        <div className="bg-white p-6 shadow rounded">
          <h2 className="text-lg font-semibold mb-3">Expenses Overview</h2>
          <Line data={expenseChart} />
        </div>

      </div>
    </div>
  );
}