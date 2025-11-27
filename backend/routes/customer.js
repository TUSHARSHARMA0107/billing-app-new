import express from "express";
import auth from "../middleware/auth.js";
const router = express.Router();

// Create customer
router.post("/", auth, async (req, res) => {
  const prisma = req.prisma;
  const userId = req.user.userId;
  const { name, email, phone } = req.body;

  if (!name) return res.status(400).json({ message: "Name required" });

  try {
    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        userId,
      },
    });

    res.json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// List customers
router.get("/", auth, async (req, res) => {
  const prisma = req.prisma;
  const userId = req.user.userId;

  try {
    const customers = await prisma.customer.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.json(customers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update customer
router.put("/:id", auth, async (req, res) => {
  const prisma = req.prisma;
  const id = Number(req.params.id);
  const { name, email, phone } = req.body;

  try {
    const customer = await prisma.customer.update({
      where: { id },
      data: { name, email, phone },
    });
    res.json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete customer
router.delete("/:id", auth, async (req, res) => {
  const prisma = req.prisma;
  const id = Number(req.params.id);

  try {
    await prisma.customer.delete({ where: { id } });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;