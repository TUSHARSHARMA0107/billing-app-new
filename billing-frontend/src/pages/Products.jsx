import { useEffect, useState } from "react";
import { request } from "../services/apiHelper";
import Modal from "../components/Modal";
import toast from "react-hot-toast";
import Skeleton from "../components/Skeleton";

export default function Products() {
  const [products, setProducts] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const loadProducts = async () => {
    let data = await request("get", "/products");
    setProducts(data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // 🔹 Reset modal fields
  const resetForm = () => {
    setName("");
    setPrice("");
    setStock("");
    setEditData(null);
  };

  // 🔹 Open Add Modal
  const openAdd = () => {
    resetForm();
    setModalOpen(true);
  };

  // 🔹 Open Edit Modal
  const openEdit = (p) => {
    setEditData(p);
    setName(p.name);
    setPrice(p.price);
    setStock(p.stock);
    setModalOpen(true);
  };

  // 🔹 Save Product (Add or Edit)
  const saveProduct = async () => {
    let body = { name, price: parseFloat(price), stock: parseInt(stock) };

    if (editData) {
      await request("put",` /products/${editData.id}`, body);
      toast.success("Product updated");
    } else {
      await request("post", "/products", body);
      toast.success("Product added");
    }

    setModalOpen(false);
    loadProducts();
  };

  // 🔹 Delete
  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;

    await request("delete",` /products/${id}`);
    toast.success("Product deleted");

    loadProducts();
  };

  // ------------------------- UI -------------------------
  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Products</h2>
        <button
          onClick={openAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Product
        </button>
      </div>

      {!products ? (
        <Skeleton rows={6} />
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow rounded p-4">
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left p-2">Name</th>
                <th className="text-right p-2">Price</th>
                <th className="text-right p-2">Stock</th>
                <th className="text-right p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr 
                  key={p.id} 
                  className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <td className="p-2">{p.name}</td>
                  <td className="p-2 text-right">₹{p.price}</td>
                  <td className="p-2 text-right">{p.stock}</td>

                  <td className="p-2 text-right space-x-2">
                    <button
                      onClick={() => openEdit(p)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded"
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

      {/* MODAL */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-xl font-semibold mb-4">
          {editData ? "Edit Product" : "Add Product"}
        </h2>

        <input
          className="w-full border p-2 rounded mb-3 dark:bg-gray-700"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full border p-2 rounded mb-3 dark:bg-gray-700"
          placeholder="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          className="w-full border p-2 rounded mb-3 dark:bg-gray-700"
          placeholder="Stock"
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />

        <button
          onClick={saveProduct}
          className="bg-blue-600 text-white w-full py-2 rounded mt-2"
        >
          {editData ? "Save Changes" : "Add Product"}
        </button>
      </Modal>
    </div>
  );
}