import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import userRouter from "./routes/user.routes.js";
import categoryRouter from "./routes/category.routes.js";
import supplierRouter from "./routes/supplier.routes.js";
import productRouter from "./routes/product.routes.js";
import inventoryRouter from "./routes/inventory.routes.js";
import saleRouter from "./routes/sale.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import reportRouter from "./routes/report.routes.js";

const app = express();

/* ==========================
   Middlewares
========================== */

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

// Serve Uploaded Images
app.use("/uploads", express.static(path.resolve("uploads")));

/* ==========================
   Routes
========================== */

app.use("/api/v1/users", userRouter);

app.use("/api/v1/categories", categoryRouter);

app.use("/api/v1/suppliers", supplierRouter);

app.use("/api/v1/products", productRouter);
 
app.use("/api/v1/inventory", inventoryRouter);

app.use("/api/v1/sales", saleRouter);

app.use("/api/v1/dashboard", dashboardRouter);

app.use("/api/v1/reports", reportRouter);

/* ==========================
   Root Route
========================== */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Stationery Management API Running",
  });
});

export { app };