
import auth from "../middleware/auth.js";;
import express from "express";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";

const router = express.Router();

// Excel export of invoices (date range optional)
router.get("/invoices/excel", auth, async (req, res) => {
  const prisma = req.prisma;
  const userId = req.user.userId;
  const { from, to } = req.query;

  const where = { userId };
  if (from || to) {
    where.issueDate = {};
    if (from) where.issueDate.gte = new Date(from);
    if (to) where.issueDate.lte = new Date(to);
  }

  try {
    const invoices = await prisma.invoice.findMany({
      where,
      include: { customer: true },
      orderBy: { issueDate: "desc" },
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Invoices");

    sheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Title", key: "title", width: 30 },
      { header: "Customer", key: "customer", width: 25 },
      { header: "Status", key: "status", width: 10 },
      { header: "Issue Date", key: "issueDate", width: 20 },
      { header: "Total", key: "totalAmount", width: 15 },
    ];

    invoices.forEach((inv) => {
      sheet.addRow({
        id: inv.id,
        title: inv.title,
        customer: inv.customer?.name || "",
        status: inv.status,
        issueDate: inv.issueDate.toISOString().split("T")[0],
        totalAmount: inv.totalAmount,
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=invoices.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PDF invoice with QR (QR just for invoice URL/text)
router.get("/invoice/:id/pdf", auth, async (req, res) => {
  const prisma = req.prisma;
  const userId = req.user.userId;
  const id = Number(req.params.id);

  try {
    const invoice = await prisma.invoice.findFirst({
      where: { id, userId },
      include: {
        items: { include: { product: true } },
        customer: true,
      },
    });

    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${invoice.id}.pdf`
    );
    doc.pipe(res);

    doc.fontSize(20).text("Invoice", { align: "center" });
    doc.moveDown();

    doc
      .fontSize(12)
      .text(`Invoice ID: ${invoice.id}`)
      .text(`Title: ${invoice.title}`)
      .text(`Customer: ${invoice.customer?.name || "N/A"}`)
      .text(`Status: ${invoice.status}`)
      .text(`Issue Date: ${invoice.issueDate.toISOString().split("T")[0]}`);
    doc.moveDown();

    doc.text("Items:");
    invoice.items.forEach((it) => {
      doc.text(
        `- ${it.description} (x${it.quantity}) @ ${it.price} = ${
          it.quantity * it.price
        }`
      );
    });
    doc.moveDown();
    doc.text(`Total: ${invoice.totalAmount}, { align: "right" }`);

    // QR code (for example, encode invoice id)
    const qrText = `INVOICE-${invoice.id}`;
    const qrDataUrl = await QRCode.toDataURL(qrText);
    const qrBuffer = Buffer.from(
      qrDataUrl.replace(/^data:image\/png;base64,/, ""),
      "base64"
    );
    doc.image(qrBuffer, { fit: [100, 100], align: "left" });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;