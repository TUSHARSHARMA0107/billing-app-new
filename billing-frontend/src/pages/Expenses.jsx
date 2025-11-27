import { useEffect, useState } from "react";
import { request } from "../services/apiHelper";
import Modal from "../components/Modal";
import Skeleton from "../components/Skeleton";
import toast from "react-hot-toast";

export default function Expenses() {
  const [expenses, setExpenses] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  const loadData = async () => {
    let data = await request("get", "/expenses");
    setExpenses(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAdd = () => {
    setEditData(null);
    setTitle("");
    setAmount("");
    setModalOpen(true);
  };

  const openEdit = (e) => {
    setEditData(e);
    setTitle(e.title);
    setAmount(e.amount);
    setModalOpen(true);
  };

  const saveExpense = async () => {
    let body = { title, amount: parseFloat(amount) };

    if (editData) {
      await request("put",` /expenses/${editData.id}`, body);
      toast.success("Expense updated");
    } else {
      await request("post", "/expenses", body);
      toast.success("Expense added");
    }

    setModalOpen(false);
    loadData();
  };

  const deleteExpense = async (id) => {
    if (!confirm("Delete expense?")) return;
    await request("delete", `/expenses/${id}`);
    toast.success("Expense deleted");
    loadData();
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Expenses</h2>
        <button
          onClick={openAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Expense
        </button>
      </div>

      {!expenses ? (
        <Skeleton rows={6} />
      ) : (
        <div className="bg-white dark:bg-gray-800 p-4 shadow rounded">
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="p-2 text-left">Title</th>
                <th className="p-2 text-right">Amount</th>
                <th className="p-2 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {expenses.map((e) => (
                <tr key={e.id} className="border-b hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-700">
                  <td className="p-2">{e.title}</td>
                  <td className="p-2 text-right">₹{e.amount}</td>
                  <td className="p-2 text-right space-x-3">
                    <button onClick={() => openEdit(e)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded">
                      Edit
                    </button>

                    <button onClick={() => deleteExpense(e.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-xl font-semibold mb-4">
          {editData ? "Edit Expense" : "Add Expense"}
        </h2>

        <input className="w-full border p-2 rounded mb-2 dark:bg-gray-700"
          placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />

        <input className="w-full border p-2 rounded mb-2 dark:bg-gray-700"
          placeholder="Amount" type="number" value={amount}
          onChange={(e) => setAmount(e.target.value)} />

        <button className="bg-blue-600 text-white py-2 rounded w-full"
          onClick={saveExpense}>
          {editData ? "Save Changes" : "Add Expense"}
        </button>
      </Modal>
    </div>
  );
}