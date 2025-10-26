import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  codeId: { type: mongoose.Schema.Types.ObjectId, ref: "Code" },
  reviewerId: String, // "AI" or user ID
  feedback: String,
  rating: Number,
  reviewType: { type: String, enum: ["AI", "Manual"], default: "AI" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Review", reviewSchema);

