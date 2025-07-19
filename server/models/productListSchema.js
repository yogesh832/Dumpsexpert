const mongoose = require("mongoose");

// Register User schema globally
require("./userSchema");

const productListSchema = new mongoose.Schema(
  {
    sapExamCode: String,
    imageUrl: String,
    title: String,
    price: String,
    category: String,
    status: String,
    action: String,

    samplePdfUrl: {
      type: String,
      default: '',
    },
    mainPdfUrl: {
      type: String,
      default: '',
    },

    dumpsPriceInr: String,
    dumpsPriceUsd: String,
    dumpsMrpInr: String,
    dumpsMrpUsd: String,

    onlinePriceInr: String,
    onlinePriceUsd: String,
    onlineMrpInr: String,
    onlineMrpUsd: String,

    comboPriceInr: String,
    comboPriceUsd: String,
    comboMrpInr: String,
    comboMrpUsd: String,

    sku: String,
    longDescription: String,
    Description: String,

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    taTitle: String,
    metaKeywords: String,
    metaDescription: String,
    schema: String,

    faqs: [
      {
        question: {
          type: String,
          required: true,
        },
        answer: {
          type: String,
          required: true,
        },
      },
    ],

    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,             // ✅ Correctly placed options
    discriminatorKey: "kind",     // ✅ Only include this if you use discriminators
  }
);

// Export the model
module.exports = mongoose.model("Product", productListSchema);
