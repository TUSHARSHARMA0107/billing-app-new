import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import auth from "../middleware/auth.js";
const router = express.Router();

// Create invoice with items + optional customer
router.post("/", auth, async (req, res) => {
  const prisma = req.prisma;
  const userId = req.user.userId;

  const { title, customerId, status, issueDate, dueDate, items } = req.body;
  // items: [{ description, quantity, price, productId? }]

  if (!title || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Title and at least 1 item required" });
  }

  try {
    const totalAmount = items.reduce(
      (sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.price) || 0),
      0
    );

    const invoice = await prisma.invoice.create({
      data: {
        title,
        totalAmount,
        userId,
        customerId: customerId || null,
        status: status || "PAID",
        issueDate: issueDate ? new Date(issueDate) : new Date(),
        dueDate: dueDate ? new Date(dueDate) : null,
        items: {
          create: items.map((it) => ({
            description: it.description,
            quantity: it.quantity,
            price: it.price,
            productId: it.productId || null,
          })),
        },
      },
      include: {
        items: { include: { product: true } },
        customer: true,
      },
    });

    res.json(invoice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get invoices (search + date range + status filter)
router.get("/", auth, async (req, res) => {
  const prisma = req.prisma;
  const userId = req.user.userId;

  const { search, from, to, status } = req.query;

  const where = {
    userId,
  };

  if (status) where.status = status;

  if (from || to) {
    where.issueDate = {};
    if (from) where.issueDate.gte = new Date(from);
    if (to) where.issueDate.lte = new Date(to);
  }

  // Search by title or customer name
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      {
        customer: {
          name: { contains: search, mode: "insensitive" },
        },
      },
    ];
  }

  try {
    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        items: { include: { product: true } },
        customer: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(invoices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;