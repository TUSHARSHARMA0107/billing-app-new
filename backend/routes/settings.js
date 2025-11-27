import express from "express";
import { PrismaClient } from "@prisma/client";
import auth from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// GET SETTINGS
router.get("/", auth, async (req, res) => {
  try {
    const info = await prisma.businessInfo.findFirst({
      where: { userId: req.user.id }
    });

    res.json(info || {});
  } catch (err) {
    res.status(500).json({ message: "Failed to load settings" });
  }
});

// SAVE SETTINGS (Upsert)
router.post("/", auth, async (req, res) => {
  try {
    const data = req.body;

    const info = await prisma.businessInfo.upsert({
      where: { userId: req.user.id },
      update: data,
      create: { ...data, userId: req.user.id }
    });

    res.json(info);
  } catch (err) {
    res.status(500).json({ message: "Failed to save settings" });
  }
});

export default router;