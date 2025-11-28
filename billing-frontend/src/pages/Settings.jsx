import { useEffect, useState } from "react";
import { request } from "../services/apiHelper";
import toast from "react-hot-toast";

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState({
    businessName: "",
    address: "",
    phone: "",
    gst: "",
    logoUrl: "",
  });

  // Load settings
  const loadSettings = async () => {
    try {
      const res = await request("get", "/settings");
      if (res) setInfo(res);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const saveSettings = async () => {
    try {
      setLoading(true);
      await request("post", "/settings", info);
      toast.success("Settings saved!");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-semibold tracking-wide mb-8">Business Settings</h1>

      {/* CARD */}
      <div className="max-w-2xl p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 
        backdrop-blur-xl border border-white/10 shadow-xl hover:border-purple-400/40 transition-all">

        <h2 className="text-xl font-semibold mb-6">Business Information</h2>

        <div className="space-y-5">

          {/* Business Name */}
          <div>
            <label className="text-sm text-gray-300">Business Name</label>
            <input
              type="text"
              placeholder="Your business name"
              className="w-full px-4 py-3 mt-1 rounded-lg bg-white/10 placeholder-gray-300 
              focus:ring-2 focus:ring-purple-500 outline-none"
              value={info.businessName}
              onChange={(e) => setInfo({ ...info, businessName: e.target.value })}
            />
          </div>

          {/* Address */}
          <div>
            <label className="text-sm text-gray-300">Address</label>
            <textarea
              placeholder="Business address"
              className="w-full px-4 py-3 mt-1 rounded-lg bg-white/10 placeholder-gray-300 
              focus:ring-2 focus:ring-purple-500 outline-none h-24"
              value={info.address}
              onChange={(e) => setInfo({ ...info, address: e.target.value })}
            ></textarea>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Phone */}
            <div>
              <label className="text-sm text-gray-300">Phone</label>
              <input
                type="text"
                placeholder="Business phone"
                className="w-full px-4 py-3 mt-1 rounded-lg bg-white/10 placeholder-gray-300 
                focus:ring-2 focus:ring-purple-500 outline-none"
                value={info.phone}
                onChange={(e) => setInfo({ ...info, phone: e.target.value })}
              />
            </div>

            {/* GST */}
            <div>
              <label className="text-sm text-gray-300">GST No.</label>
              <input
                type="text"
                placeholder="GST Number"
                className="w-full px-4 py-3 mt-1 rounded-lg bg-white/10 placeholder-gray-300 
                focus:ring-2 focus:ring-purple-500 outline-none"
                value={info.gst}
                onChange={(e) => setInfo({ ...info, gst: e.target.value })}
              />
            </div>
          </div>

          {/* Logo URL */}
          <div>
            <label className="text-sm text-gray-300">Business Logo URL</label>
            <input
              type="text"
              placeholder="https://yourlogo.png"
              className="w-full px-4 py-3 mt-1 rounded-lg bg-white/10 placeholder-gray-300 
              focus:ring-2 focus:ring-purple-500 outline-none"
              value={info.logoUrl}
              onChange={(e) => setInfo({ ...info, logoUrl: e.target.value })}
            />
          </div>

          {info.logoUrl && (
            <div className="mt-3">
              <img
                src={info.logoUrl}
                alt="Business Logo"
                className="h-20 rounded-lg object-contain border border-white/20 p-2"
              />
            </div>
          )}

          {/* Save */}
          <button
            onClick={saveSettings}
            disabled={loading}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium 
              shadow-lg hover:shadow-purple-500/40 transition-all mt-6"
          >
            {loading ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}