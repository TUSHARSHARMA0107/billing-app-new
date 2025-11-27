import { useEffect, useState } from "react";
import { request } from "../services/apiHelper";
import Skeleton from "../components/Skeleton";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Invoices() {
  const [invoices, setInvoices] = useState(null);

  const loadData = async () => {
    let data = await request("get", "/invoices");
    setInvoices(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const deleteInvoice = async (id) => {
    if (!confirm("Delete invoice?")) return;
    await request("delete",` /invoices/${id}`);
    toast.success("Invoice deleted");
    loadData();
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Invoices</h2>

        <Link to="/invoices/new">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            + Create Invoice
          </button>
        </Link>
      </div>

      {!invoices ? (
        <Skeleton rows={6} />
      ) : (
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">

          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="p-2 text-left">Title</th>
                <th className="p-2 text-left">Customer</th>
                <th className="p-2 text-right">Amount</th>
                <th className="p-2 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <td className="p-2">{inv.title}</td>
                  <td className="p-2">{inv.customer?.name}</td>
                  <td className="p-2 text-right">₹{inv.totalAmount}</td>

                  <td className="p-2 text-right space-x-3">
                    <Link to={`/invoice/${inv.id}`}>
                      <button className="bg-green-600 text-white px-3 py-1 rounded">
                        View
                      </button>
                    </Link>

                    <button
                      onClick={() => deleteInvoice(inv.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>
      )}
    </div>
  );
}