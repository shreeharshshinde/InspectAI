import axios from "axios";
import Review from "../models/Review.js";
import Code from "../models/Code.js";

export const generateAIReview = async (req, res) => {
  try {
    const { codeId } = req.body;
    const code = await Code.findById(codeId);
    if (!code) return res.status(404).json({ message: "Code not found" });

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `Review this ${code.language} code and suggest improvements:\n${code.content}`,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Correct header syntax
        },
      }
    );

    const feedback = response.data.choices[0].message.content;

    const review = await Review.create({
      codeId,
      reviewerId: "AI",
      feedback,
      rating: 8,
      reviewType: "AI",
    });

    res.json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getReviews = async (req, res) => {
  try {
    const { codeId } = req.params;
    const reviews = await Review.find({ codeId });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


