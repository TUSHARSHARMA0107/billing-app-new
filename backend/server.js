import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const prisma = new PrismaClient();

app.get("/", (req, res) => {
  res.send("Billing App Node Backend Running");
});

// Routes import (all ESM)
import authRoutes from "./routes/auth.js";
import invoiceRoutes from "./routes/invoices.js";
import dashboardRoutes from "./routes/dashboard.js";
import productsRoutes from "./routes/products.js";
import customersRoutes from "./routes/customer.js";
import reportsRoutes from "./routes/report.js";

app.use("/api/auth", authRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/reports", reportsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));