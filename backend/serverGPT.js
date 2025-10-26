import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import codeRoutes from "./routes/codeRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use("/api/code", codeRoutes);
app.use("/api/review", reviewRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log(err));

app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));