import express from "express";
import env from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import homeRoutes from "./routes/index.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

import cors from  'cors';

env.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use("/", homeRoutes);
app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});