import express from "express";
import auth from "../middleware/auth.js";
const router = express.Router();

// Create product
router.post("/", auth, async (req, res) => {
  const prisma = req.prisma;
  const userId = req.user.userId;
  const { name, price, stock } = req.body;

  if (!name || price == null) {
    return res.status(400).json({ message: "Name & price required" });
  }

  try {
    const product = await prisma.product.create({
      data: {
        name,
        price: Number(price),
        stock: stock != null ? Number(stock) : 0,
        userId,
      },
    });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// List products
router.get("/", auth, async (req, res) => {
  const prisma = req.prisma;
  const userId = req.user.userId;

  try {
    const products = await prisma.product.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update product
router.put("/:id", auth, async (req, res) => {
  const prisma = req.prisma;
  const userId = req.user.userId;
  const id = Number(req.params.id);
  const { name, price, stock } = req.body;

  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        price: price != null ? Number(price) : undefined,
        stock: stock != null ? Number(stock) : undefined,
      },
    });

    // (Optional) You could check ownership by userId if needed

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete product
router.delete("/:id", auth, async (req, res) => {
  const prisma = req.prisma;
  const id = Number(req.params.id);
  try {
    await prisma.product.delete({ where: { id } });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;