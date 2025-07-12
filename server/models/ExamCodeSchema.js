const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    eachQuestionMark: { type: Number },
    duration: { type: Number, required: true },
    sampleDuration: { type: Number },
    passingScore: { type: Number },
    code: { type: String, unique: true },
    numberOfQuestions: { type: Number, required: true },
    priceUSD: { type: Number },
    priceINR: { type: Number },
    status: {
      type: String,
      enum: ["unpublished", "published"],
      required: true,
    },
    mainInstructions: { type: String },
    sampleInstructions: { type: String },
    lastUpdatedBy: { type: String, required: true },

    // ✅ ADD THIS FIELD:
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exam", examSchema);
