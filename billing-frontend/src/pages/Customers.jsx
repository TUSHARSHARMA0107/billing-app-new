import { useEffect, useState } from "react";
import { request } from "../services/apiHelper";
import toast from "react-hot-toast";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);

  // Fetch all customers
  const loadCustomers = async () => {
    try {
      const data = await request("get", "/customers");
      setCustomers(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  // Add customer
  const addCustomer = async () => {
    if (!form.name) return toast.error("Name is required");

    try {
      setLoading(true);
      await request("post", "/customers", form);
      toast.success("Customer added");
      setForm({ name: "", email: "", phone: "" });
      loadCustomers();
    } catch {
      toast.error("Failed to add");
    } finally {
      setLoading(false);
    }
  };

  // Delete customer
  const deleteCustomer = async (id) => {
    if (!confirm("Delete this customer?")) return;
    try {
      await request("delete",` /customers/${id}`);
      toast.success("Customer deleted");
      loadCustomers();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-semibold mb-6">Customers</h1>

      {/* Add Customer Card */}
      <div className="bg-white/10 backdrop-blur-xl p-6 rounded-xl shadow-lg w-full max-w-lg">
        <h2 className="text-xl mb-4 font-medium">Add Customer</h2>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Name"
            className="w-full px-4 py-2 bg-white/20 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 bg-white/20 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="text"
            placeholder="Phone"
            className="w-full px-4 py-2 bg-white/20 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <button
            onClick={addCustomer}
            disabled={loading}
            className="w-full bg-purple-600 py-2 rounded-lg hover:bg-purple-700 transition shadow-md"
          >
            {loading ? "Adding..." : "Add Customer"}
          </button>
        </div>
      </div>

      {/* Customer List */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-3">Customer List</h2>

        <div className="space-y-3">
          {customers.length === 0 && (
            <p className="text-gray-300">No customers found.</p>
          )}

          {customers.map((c) => (
            <div
              key={c.id}
              className="bg-white/10 backdrop-blur-xl p-4 rounded-lg flex items-center justify-between border border-white/10"
            >
              <div>
                <h3 className="text-lg font-medium">{c.name}</h3>
                <p className="text-gray-300">{c.email || "No email"}</p>
                <p className="text-gray-300">{c.phone || "No phone"}</p>
              </div>

              {/* DELETE BUTTON */}
              <button
                onClick={() => deleteCustomer(c.id)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}