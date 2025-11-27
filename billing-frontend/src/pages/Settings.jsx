import { useEffect, useState } from "react";
import { request } from "../services/apiHelper";
import toast from "react-hot-toast";

export default function Settings() {
  const [loading, setLoading] = useState(true);

  const [businessName, setBusinessName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [gst, setGst] = useState("");
  const [gstPercent, setGstPercent] = useState("");

  const [terms, setTerms] = useState("");
  const [logo, setLogo] = useState("");
  const [signature, setSignature] = useState("");

  // Load settings
  useEffect(() => {
    request("get", "/settings")
      .then((data) => {
        if (data) {
          setBusinessName(data.businessName || "");
          setAddress(data.address || "");
          setPhone(data.phone || "");
          setEmail(data.email || "");
          setGst(data.gst || "");
          setGstPercent(data.gstPercent || "");
          setTerms(data.terms || "");
          setLogo(data.logo || "");
          setSignature(data.signature || "");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const saveSettings = async () => {
    await request("post", "/settings", {
      businessName,
      address,
      phone,
      email,
      gst,
      gstPercent: parseFloat(gstPercent || 0),
      terms,
      logo,
      signature,
    });

    toast.success("Settings saved!");
  };

  if (loading) return <div>Loading…</div>;

  return (
    <div className="max-w-xl bg-white dark:bg-gray-800 shadow p-6 rounded">

      <h1 className="text-2xl font-bold mb-6">Business Settings</h1>

      <label className="font-semibold">Business Name</label>
      <input className="w-full border p-2 rounded mb-3 dark:bg-gray-700"
        value={businessName} onChange={(e) => setBusinessName(e.target.value)} />

      <label className="font-semibold">Address</label>
      <textarea className="w-full border p-2 rounded mb-3 dark:bg-gray-700"
        value={address} onChange={(e) => setAddress(e.target.value)} />

      <label className="font-semibold">Phone</label>
      <input className="w-full border p-2 rounded mb-3 dark:bg-gray-700"
        value={phone} onChange={(e) => setPhone(e.target.value)} />

      <label className="font-semibold">Email</label>
      <input className="w-full border p-2 rounded mb-3 dark:bg-gray-700"
        value={email} onChange={(e) => setEmail(e.target.value)} />

      <label className="font-semibold">GST Number</label>
      <input className="w-full border p-2 rounded mb-3 dark:bg-gray-700"
        value={gst} onChange={(e) => setGst(e.target.value)} />

      <label className="font-semibold">GST %</label>
      <input className="w-full border p-2 rounded mb-3 dark:bg-gray-700"
        type="number" value={gstPercent}
        onChange={(e) => setGstPercent(e.target.value)} />

      <label className="font-semibold">Logo URL</label>
      <input className="w-full border p-2 rounded mb-3 dark:bg-gray-700"
        value={logo} onChange={(e) => setLogo(e.target.value)} />

      <label className="font-semibold">Signature URL</label>
      <input className="w-full border p-2 rounded mb-3 dark:bg-gray-700"
        value={signature} onChange={(e) => setSignature(e.target.value)} />

      <label className="font-semibold">Terms & Conditions</label>
      <textarea className="w-full border p-2 rounded mb-4 dark:bg-gray-700"
        value={terms} onChange={(e) => setTerms(e.target.value)} />

      <button
        onClick={saveSettings}
        className="bg-blue-600 text-white w-full py-2 rounded"
      >
        Save Settings
      </button>
    </div>
  );
}