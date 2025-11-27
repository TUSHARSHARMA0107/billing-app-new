import { useEffect, useState } from "react";
import { request } from "../services/apiHelper";
import Skeleton from "../components/Skeleton";
import ExcelJS from "exceljs";
import toast from "react-hot-toast";

export default function Reports() {
  const [report, setReport] = useState(null);

  const loadData = async () => {
    let data = await request("get", "/reports");
    setReport(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const exportExcel = async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Report");

    ws.addRow(["Month", "Revenue", "Expenses"]);
    report.months.forEach((m, idx) => {
      ws.addRow([
        m,
        report.revenue[idx],
        report.expenses[idx],
      ]);
    });

    const buffer = await wb.xlsx.writeBuffer();
    const blob = new Blob([buffer]);

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "report.xlsx";
    a.click();

    toast.success("Excel exported");
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Reports</h2>

      {!report ? (
        <Skeleton rows={6} />
      ) : (
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">

          <button
            onClick={exportExcel}
            className="bg-green-600 text-white px-4 py-2 rounded mb-4"
          >
            Export Excel
          </button>

          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="p-2">Month</th>
                <th className="p-2">Revenue</th>
                <th className="p-2">Expenses</th>
              </tr>
            </thead>

            <tbody>
              {report.months.map((m, idx) => (
                <tr key={idx} className="border-b dark:border-gray-700">
                  <td className="p-2">{m}</td>
                  <td className="p-2">₹{report.revenue[idx]}</td>
                  <td className="p-2">₹{report.expenses[idx]}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      )}
    </div>
  );
}