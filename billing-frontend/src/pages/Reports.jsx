import { useEffect, useState } from "react";
import { request } from "../services/apiHelper";
import toast from "react-hot-toast";

export default function Reports() {
  const [invoices, setInvoices] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Load invoices for PDF export list
  const loadInvoices = async () => {
    try {
      const data = await request("get", "/invoices");
      setInvoices(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  // Excel Export Handler
  const exportExcel = () => {
    const q = [];
    if (fromDate) q.push(`from=${fromDate}`);
    if (toDate) q.push(`to=${toDate}`);

    const query = q.length ? `?${q.join("&")}` : "";

    window.open(`${import.meta.env.VITE_API}/reports/invoices/excel${query}`, "_blank");
    toast.success("Excel file downloading...");
  };

  // PDF Export Handler
  const downloadPdf = (id) => {
    window.open(`${import.meta.env.VITE_API}/reports/invoice/${id}/pdf`, "_blank");
    toast.success("PDF downloading...");
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-semibold mb-8 tracking-wide">Reports & Exports</h1>

      {/* EXPORT FILTER CARD */}
      <div className="max-w-xl p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 
          backdrop-blur-xl border border-white/10 shadow-xl hover:border-blue-400/40 transition-all">

        <h2 className="text-xl font-semibold mb-4">Export Invoices (Excel)</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-gray-300 text-sm">From Date</label>
            <input
              type="date"
              className="w-full mt-1 px-4 py-2 rounded-lg bg-white/10 text-white 
              focus:ring-2 focus:ring-blue-500 outline-none"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm">To Date</label>
            <input
              type="date"
              className="w-full mt-1 px-4 py-2 rounded-lg bg-white/10 text-white 
              focus:ring-2 focus:ring-blue-500 outline-none"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>

        {/* EXPORT EXCEL BUTTON */}
        <button
          onClick={exportExcel}
          className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium 
          shadow-lg hover:shadow-blue-500/40 transition-all"
        >
          Export Excel
        </button>
      </div>

      {/* PDF SECTION */}
      <h2 className="text-xl font-semibold mt-10 mb-4">Download Invoice PDFs</h2>

      {invoices.length === 0 ? (
        <p className="text-gray-400">No invoices available.</p>
      ) : (
        <div className="space-y-4">
          {invoices.map((inv) => (
            <div
              key={inv.id}
              className="p-4 rounded-xl bg-white/10 border border-white/10 
              backdrop-blur-xl hover:border-purple-400/40 transition-all flex items-center justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold">{inv.title}</h3>
                <p className="text-gray-300 text-sm">
                  Customer: {inv.customer?.name || "N/A"}
                </p>
                <p className="text-gray-300 text-sm">
                  Total: ₹ {inv.totalAmount}
                </p>
              </div>

              <button
                onClick={() => downloadPdf(inv.id)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg shadow-lg 
                hover:shadow-purple-500/40 transition-all"
              >
                Download PDF
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}