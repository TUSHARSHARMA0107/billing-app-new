import { useEffect, useState } from "react";
import { request } from "../services/apiHelper";
import toast from "react-hot-toast";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", stock: "" });
  const [loading, setLoading] = useState(false);

  // Fetch all products
  const loadProducts = async () => {
    try {
      const data = await request("get", "/products");
      setProducts(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Add product
  const addProduct = async () => {
    if (!form.name || form.price === "")
      return toast.error("Name & price required");

    try {
      setLoading(true);
      await request("post", "/products", {
        name: form.name,
        price: Number(form.price),
        stock: form.stock ? Number(form.stock) : 0,
      });

      toast.success("Product added!");
      setForm({ name: "", price: "", stock: "" });
      loadProducts();
    } catch {
      toast.error("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;

    try {
      await request("delete", `/products/${id}`);
      toast.success("Product deleted");
      loadProducts();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-semibold mb-6">Products</h1>

      {/* Add Product */}
      <div className="bg-white/10 backdrop-blur-xl p-6 rounded-xl shadow-lg w-full max-w-lg">
        <h2 className="text-xl mb-4 font-medium">Add Product</h2>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Product Name"
            className="w-full px-4 py-2 bg-white/20 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="number"
            placeholder="Price"
            className="w-full px-4 py-2 bg-white/20 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <input
            type="number"
            placeholder="Stock"
            className="w-full px-4 py-2 bg-white/20 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />

          <button
            onClick={addProduct}
            disabled={loading}
            className="w-full bg-purple-600 py-2 rounded-lg hover:bg-purple-700 transition shadow-md"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </div>

      {/* Product List */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-3">Product List</h2>

        <div className="space-y-3">
          {products.length === 0 && (
            <p className="text-gray-300">No products found.</p>
          )}

          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white/10 backdrop-blur-xl p-4 rounded-lg flex items-center justify-between border border-white/10"
            >
              <div>
                <h3 className="text-lg font-medium">{p.name}</h3>
                <p className="text-gray-300">₹ {p.price}</p>
                <p className="text-gray-300">Stock: {p.stock}</p>
              </div>

              <div className="flex gap-3">
                {/* DELETE BUTTON */}
                <button
                  onClick={() => deleteProduct(p.id)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}