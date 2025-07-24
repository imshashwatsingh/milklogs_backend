import express from "express";
import env from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import homeRoutes from "./routes/index.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

env.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", homeRoutes);
// base for auth routes
app.use("/auth", authRoutes);
// base for dashboard routes
app.use("/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
