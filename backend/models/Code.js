const mongoose = require("mongoose");

const codeSchema = new mongoose.Schema({
  title: String,
  language: String,
  content: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Code", codeSchema);
