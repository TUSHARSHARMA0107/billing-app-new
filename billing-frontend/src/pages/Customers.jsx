import { useEffect, useState } from "react";
import { request } from "../services/apiHelper";
import { toast } from "react-hot-toast";

export default function Customers() {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [customers, setCustomers] = useState([]);

  const fetchCustomers = async () => {
    const res = await request("get", "/customers");
    setCustomers(res);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await request("post", "/customers", form);
    toast.success("Customer Added");
    setForm({ name: "", email: "", phone: "" });
    fetchCustomers();
  };

  return (
    <div className="p-6 space-y-8">

      {/* HEADER */}
      <h1 className="text-3xl font-semibold text-gray-100 dark:text-white">
        Customers
      </h1>

      <div className="grid md:grid-cols-2 gap-8">

        {/* LEFT FORM */}
        <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-700/40">
          <h2 className="text-xl mb-4 font-semibold text-gray-200 dark:text-white">Add Customer</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            
            <input 
              type="text"
              placeholder="Customer Name"
              className="w-full p-3 rounded-lg bg-gray-900/40 dark:bg-gray-700/50 text-white border border-gray-600 focus:border-blue-400"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input 
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-lg bg-gray-900/40 dark:bg-gray-700/50 text-white border border-gray-600 focus:border-blue-400"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input 
              type="text"
              placeholder="Phone Number"
              className="w-full p-3 rounded-lg bg-gray-900/40 dark:bg-gray-700/50 text-white border border-gray-600 focus:border-blue-400"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <button 
              className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all"
            >
              Add Customer
            </button>
          </form>
        </div>

        {/* RIGHT TABLE */}
        <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-700/40">
          <h2 className="text-xl mb-4 font-semibold text-gray-200 dark:text-white">Customer List</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead>
                <tr className="border-b border-gray-600 text-gray-300 text-sm">
                  <th className="py-2 text-left">Name</th>
                  <th className="py-2 text-left">Email</th>
                  <th className="py-2 text-left">Phone</th>
                  <th className="py-2 text-right">Added</th>
                </tr>
              </thead>

              <tbody>
                {customers.map((c) => (
                  <tr 
                    key={c.id}
                    className="border-b border-gray-700/40 hover:bg-gray-700/40 transition"
                  >
                    <td className="py-3">{c.name}</td>
                    <td>{c.email || "--"}</td>
                    <td>{c.phone || "--"}</td>
                    <td className="text-right">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {customers.length === 0 && (
              <p className="text-gray-400 text-center pt-6">No customers added yet.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}