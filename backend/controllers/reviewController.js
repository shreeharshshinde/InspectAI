const axios = require("axios");
const Review = require("../models/Review");
const Code = require("../models/Code");
require("dotenv").config() ;

const generateAIReview = async (req, res) => {
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
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const feedback = response.data.choices[0].message.content;

    console.log("AI Review Feedback:", feedback);

    const review = await Review.create({
      codeId,
      reviewerId: "AI",
      feedback,
      rating: 8,
      reviewType: "AI",
    });

    console.log("AI Review Created:", review);

    res.json(review);
  } catch (err) {
    res.status(500).json({
      message: err.message,
      details: err.response?.data || "No extra details",
    });
    console.error("Error generating AI review:", err);
  }
};

const getReviews = async (req, res) => {
  try {
    const { codeId } = req.params;
    const reviews = await Review.find({ codeId });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const generateGeminiReview = async (req, res) => {
  try {
    const { codeId } = req.body;
    const code = await Code.findById(codeId);
    if (!code) return res.status(404).json({ message: "Code not found" });

    console.log("api key", process.env.GEMINI_API_KEY);

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Review this ${code.language} code and suggest improvements:\n${code.content}`,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(" Response:", response);

    const feedback = response.data.candidates[0].content.parts[0].text;

    console.log(" Feedback:", feedback);

    const review = await Review.create({
      codeId,
      reviewerId: "AI",
      feedback,
      rating: 8,
      reviewType: "AI",
    });

    console.log(" Review:", review);

    res.json(review);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: err.message, details: err.response?.data });
  }
};

module.exports = {
  generateAIReview,
  getReviews,
  generateGeminiReview,
};
