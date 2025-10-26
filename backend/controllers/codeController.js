import Code from "../models/Code.js";

export const uploadCode = async (req, res) => {
  try {
    const { title, language, content } = req.body;
    const code = await Code.create({ title, language, content });
    res.json(code);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};