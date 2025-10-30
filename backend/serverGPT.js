import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Routes
import uploadCodeRoutes from "./routes/uploadCodeRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import issueRoutes from "./routes/issueRoutes.js";


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;


app.use("/api/issues", issueRoutes);
app.use("/api/code", uploadCodeRoutes);
app.use("/api/review", reviewRoutes);



mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log(err));

app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));

