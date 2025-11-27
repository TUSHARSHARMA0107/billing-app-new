import express from "express";
import auth from "../middleware/auth.js";
const router = express.Router();

router.get("/profit-loss", auth, async (req, res) => {
  const prisma = req.prisma;
  const userId = req.user.userId;

  try {
    const invoices = await prisma.invoice.findMany({ where: { userId } });
    const expenses = await prisma.expense.findMany({ where: { userId } });

    const totalIncome = invoices.reduce((sum, i) => sum + i.totalAmount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    res.json({
      totalIncome,
      totalExpenses,
      profitLoss: totalIncome - totalExpenses,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Monthly summary
router.get("/monthly-summary", auth, async (req, res) => {
  const prisma = req.prisma;
  const userId = req.user.userId;

  try {
    const invoices = await prisma.$queryRawUnsafe(`
      SELECT strftime('%Y-%m', issueDate) AS month, SUM(totalAmount) AS income
      FROM Invoice
      WHERE userId = ${userId}
      GROUP BY strftime('%Y-%m', issueDate)
      ORDER BY month DESC
    `);

    const expenses = await prisma.$queryRawUnsafe(`
      SELECT strftime('%Y-%m', createdAt) AS month, SUM(amount) AS expenses
      FROM Expense
      WHERE userId = ${userId}
      GROUP BY strftime('%Y-%m', createdAt)
      ORDER BY month DESC
    `);

    res.json({ invoices, expenses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
export default router;