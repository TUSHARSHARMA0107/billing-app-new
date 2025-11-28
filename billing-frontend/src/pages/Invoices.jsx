import { useEffect, useState } from "react";
import { request } from "../services/apiHelper";
import toast from "react-hot-toast";

export default function Invoices() {
  const [customers, setCustomers] = useState([]);
  const [invoices, setInvoices] = useState([]);

  // Invoice form
  const [title, setTitle] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [status, setStatus] = useState("PAID");
  const [items, setItems] = useState([
    { description: "", quantity: "", price: "" },
  ]);

  const loadCustomers = async () => {
    try {
      const res = await request("get", "/customers");
      setCustomers(res);
    } catch {}
  };

  const loadInvoices = async () => {
    try {
      const res = await request("get", "/invoices");
      setInvoices(res);
    } catch {}
  };

  useEffect(() => {
    loadCustomers();
    loadInvoices();
  }, []);

  const addItem = () => {
    setItems([...items, { description: "", quantity: "", price: "" }]);
  };

  const removeItem = (i) => {
    let arr = [...items];
    arr.splice(i, 1);
    setItems(arr);
  };

  const updateItem = (i, key, value) => {
    let arr = [...items];
    arr[i][key] = value;
    setItems(arr);
  };

  const submit = async () => {
    if (!title) return toast.error("Title required!");
    if (items.length === 0) return toast.error("At least 1 item 🛒");

    try {
      await request("post", "/invoices", {
        title,
        customerId: customerId || null,
        status,
        items: items.map((i) => ({
          description: i.description,
          quantity: Number(i.quantity),
          price: Number(i.price),
        })),
      });

      toast.success("Invoice created!");
      setTitle("");
      setCustomerId("");
      setStatus("PAID");
      setItems([{ description: "", quantity: "", price: "" }]);
      loadInvoices();
    } catch {
      toast.error("Failed to create invoice");
    }
  };

  return (
    <div className="text-white p-6">
      <h1 className="text-3xl font-semibold tracking-wide mb-8">Invoices</h1>

      {/* ADD INVOICE CARD */}
      <div className="max-w-3xl p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 
      backdrop-blur-xl border border-white/10 shadow-xl hover:border-purple-400/40 transition-all">

        <h2 className="text-xl font-semibold mb-5">Create New Invoice</h2>

        {/* Title */}
        <input
          type="text"
          placeholder="Invoice Title"
          className="w-full px-4 py-3 rounded-lg bg-white/10 placeholder-gray-300 
          focus:ring-2 focus:ring-purple-500 outline-none mb-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Customer */}
        <select
          className="w-full px-4 py-3 rounded-lg bg-white/10 text-white mb-4
          focus:ring-2 focus:ring-purple-500 outline-none"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
        >
          <option value="">Select Customer (optional)</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id} className="text-black">
              {c.name}
            </option>
          ))}
        </select>

        {/* Status */}
        <select
          className="w-full px-4 py-3 rounded-lg bg-white/10 text-white mb-4
          focus:ring-2 focus:ring-purple-500 outline-none"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="PAID" className="text-black">PAID</option>
          <option value="PENDING" className="text-black">PENDING</option>
        </select>

        {/* ITEMS */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Items</h3>

          {items.map((it, i) => (
            <div
              key={i}
              className="p-4 bg-white/10 rounded-xl border border-white/10"
            >
              <div className="grid md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Description"
                  className="px-3 py-2 rounded-lg bg-white/10 placeholder-gray-300 
                  focus:ring-2 focus:ring-purple-500 outline-none"
                  value={it.description}
                  onChange={(e) => updateItem(i, "description", e.target.value)}
                />

                <input
                  type="number"
                  placeholder="Qty"
                  className="px-3 py-2 rounded-lg bg-white/10 placeholder-gray-300 
                  focus:ring-2 focus:ring-purple-500 outline-none"
                  value={it.quantity}
                  onChange={(e) => updateItem(i, "quantity", e.target.value)}
                />

                <input
                  type="number"
                  placeholder="Price"
                  className="px-3 py-2 rounded-lg bg-white/10 placeholder-gray-300 
                  focus:ring-2 focus:ring-purple-500 outline-none"
                  value={it.price}
                  onChange={(e) => updateItem(i, "price", e.target.value)}
                />
              </div>

              {items.length > 1 && (
                <button
                  onClick={() => removeItem(i)}
                  className="mt-2 text-red-400 hover:text-red-500"
                >
                  Remove Item
                </button>
              )}
            </div>
          ))}

          <button
            onClick={addItem}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg 
            shadow-md transition-all"
          >
            + Add Item
          </button>
        </div>

        {/* SUBMIT */}
        <button
          onClick={submit}
          className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg 
          font-medium shadow-lg transition hover:shadow-blue-500/40"
        >
          Create Invoice
        </button>
      </div>

      {/* INVOICE LIST */}
      <h2 className="text-xl font-semibold mt-10 mb-4">Your Invoices</h2>

      {invoices.length === 0 ? (
        <p className="text-gray-400">No invoices created yet.</p>
      ) : (
        <div className="space-y-4">
          {invoices.map((inv) => (
            <div
              key={inv.id}
              className="p-5 rounded-xl bg-white/10 border border-white/10 
              backdrop-blur-xl hover:border-purple-400/40 transition-all"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{inv.title}</h3>
                  <p className="text-gray-300 text-sm">
                    {inv.customer?.name || "No customer"}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    inv.status === "PAID"
                      ? "bg-green-600"
                      : "bg-yellow-600"
                  }`}
                >
                  {inv.status}
                </span>
              </div>

              <p className="text-gray-300 mt-2">
                Total: ₹ {inv.totalAmount}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}