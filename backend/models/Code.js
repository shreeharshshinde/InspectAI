import mongoose from "mongoose";

const codeSchema = new mongoose.Schema({
  title: String,
  language: String,
  content: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Code", codeSchema);