import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";
import QRCode from "qrcode";

export default function InvoiceView() {
  const { id } = useParams();

  const [invoice, setInvoice] = useState(null);
  const [business, setBusiness] = useState(null);
  const [qrCode, setQrCode] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    // Invoice data
    api.get(`/invoices/${id}`, { headers: { Authorization: token } })
      .then((res) => {
        setInvoice(res.data);
        QRCode.toDataURL(`Invoice ID: ${res.data.id}`, (err, url) => {
          setQrCode(url);
        });
      });

    // Business settings
    api.get("/settings", {
      headers: { Authorization: token },
    }).then((res) => setBusiness(res.data));
  }, []);

  if (!invoice || !business) return <div>Loading...</div>;

  // CALCULATE TAX
  const gstPercent = parseFloat(business.gstPercent || 0);
  const taxAmount = (invoice.totalAmount * gstPercent) / 100;
  const grandTotal = invoice.totalAmount + taxAmount;

  return (
    <div className="p-10 bg-white shadow-lg max-w-3xl mx-auto print:p-0">

      {/* LOGO */}
      {business.logo && (
        <img src={business.logo} alt="Logo" className="h-20 mb-3" />
      )}

      {/* BUSINESS INFO */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold">{business.businessName}</h1>
        <p>{business.address}</p>
        <p>{business.phone}</p>
        <p>{business.email}</p>
        {business.gst && <p>GSTIN: {business.gst}</p>}
      </div>

      <hr className="my-6" />

      {/* INVOICE DETAILS */}
      <div className="flex justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-2">Invoice #{invoice.id}</h2>
          <p>Date: {invoice.issueDate.split("T")[0]}</p>
          <p>Status: {invoice.status}</p>
        </div>

        {/* QR CODE */}
        {qrCode && <img src={qrCode} className="h-28" alt="QR" />}
      </div>

      <hr className="my-6" />

      {/* CUSTOMER DETAILS */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Bill To:</h2>
        <p>{invoice.customer?.name}</p>
        {invoice.customer?.email && <p>{invoice.customer.email}</p>}
        {invoice.customer?.phone && <p>{invoice.customer.phone}</p>}
      </div>

      {/* ITEMS */}
      <table className="w-full mb-6">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Item</th>
            <th className="p-2 text-right">Qty</th>
            <th className="p-2 text-right">Price</th>
            <th className="p-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="p-2">{item.description}</td>
              <td className="p-2 text-right">{item.quantity}</td>
              <td className="p-2 text-right">₹{item.price}</td>
              <td className="p-2 text-right">₹{item.price * item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* TOTALS */}
      <div className="text-right mb-6">
        <p className="text-lg">
          Sub Total: <strong>₹{invoice.totalAmount}</strong>
        </p>
        <p className="text-lg">
          GST ({gstPercent}%): <strong>₹{taxAmount.toFixed(2)}</strong>
        </p>
        <p className="text-2xl font-bold mt-2">
          Grand Total: ₹{grandTotal.toFixed(2)}
        </p>
      </div>

      {/* SIGNATURE */}
      {business.signature && (
        <div className="text-right mb-4">
          <img src={business.signature} className="h-20" alt="Signature" />
          <p className="font-semibold">Authorized Signatory</p>
        </div>
      )}

      {/* TERMS */}
      {business.terms && (
        <div className="mt-6 text-sm text-gray-600">
          <h3 className="font-bold">Terms & Conditions</h3>
          <p>{business.terms}</p>
        </div>
      )}

      <button
        onClick={() => window.print()}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Print / Download PDF
      </button>

    </div>
  );
}