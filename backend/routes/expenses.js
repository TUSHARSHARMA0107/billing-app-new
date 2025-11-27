import express from "express";
import { PrismaClient } from "@prisma/client";
import auth from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// GET ALL EXPENSES (User based)
router.get("/", auth, async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany({
      where: { userId: req.user.id },
      orderBy: { id: "desc" }
    });

    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
});

// ADD EXPENSE
router.post("/", auth, async (req, res) => {
  try {
    const { title, amount } = req.body;

    const expense = await prisma.expense.create({
      data: {
        title,
        amount: Number(amount),
        userId: req.user.id
      }
    });

    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: "Failed to add expense" });
  }
});

// UPDATE
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, amount } = req.body;

    const expense = await prisma.expense.update({
      where: { id: Number(req.params.id) },
      data: { title, amount: Number(amount) }
    });

    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: "Failed to update expense" });
  }
});

// DELETE
router.delete("/:id", auth, async (req, res) => {
  try {
    await prisma.expense.delete({
      where: { id: Number(req.params.id) }
    });

    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete expense" });
  }
});

export default router;