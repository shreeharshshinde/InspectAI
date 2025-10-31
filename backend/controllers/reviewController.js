import axios from "axios";
import Review from "../models/Review.js";
import Code from "../models/Code.js";



export const getReviews = async (req, res) => {
  try {
    const { codeId } = req.params;
    const reviews = await Review.find({ codeId });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const generateReview = async (req, res) => {
  try {
    const { codeId } = req.body;
    const code = await Code.findById(codeId);
    if (!code) return res.status(404).json({ message: "Code not found" });
    console.log("api key" , process.env.API_KEY) ;
    const response = await axios.post(
      `${process.env.KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Review this ${code.language} code and suggest improvements:\n${code.content}. Keep it short and look like it get reviewed by human not AI.`,
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

