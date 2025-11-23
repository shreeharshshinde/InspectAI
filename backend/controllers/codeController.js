const Code=require("../models/Code");

exports.uploadCode = async (req, res) => {
    console.log("Requested");
  try {
    console.log("Request reached");
    const { title, language, content } = req.body;
    const code = await Code.create({ title, language, content });
    console.log("Code:",code);
    res.json(code);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};