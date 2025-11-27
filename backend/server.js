import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prismaMiddleware from "./middleware/prisma.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());




// attach prisma to req
app.use(prismaMiddleware);

// routes
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import customerRoutes from "./routes/customer.js";
import invoiceRoutes from "./routes/invoices.js";
import expenseRoutes from "./routes/expenses.js";
import reportRoutes from "./routes/report.js";
import dashboardRoutes from "./routes/dashboard.js";
import settingsRoutes from "./routes/settings.js";

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/settings", settingsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));