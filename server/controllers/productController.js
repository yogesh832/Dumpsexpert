const Product = require("../models/productListSchema");
const { cloudinary } = require("../utils/cloudinary");

// GET: All products
exports.getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, status } = req.query;
    const query = {};
    if (category) query.category = category;
    if (status) query.status = status;

    const totalDocs = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate("lastUpdatedBy", "name email")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    res.status(200).json({
      message: "Products retrieved successfully",
      data: products,
      totalDocs,
      totalPages: Math.ceil(totalDocs / limit),
      currentPage: parseInt(page),
      hasNextPage: parseInt(page) < Math.ceil(totalDocs / limit),
      hasPrevPage: parseInt(page) > 1,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET: Product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "lastUpdatedBy",
      "name email"
    );
    if (!product) return res.status(404).json({ message: "Product not found" });

    res
      .status(200)
      .json({ message: "Product retrieved successfully", data: product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// GET: Product by Slug
exports.getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug }).populate(
      "lastUpdatedBy",
      "name email"
    );

    if (!product)
      return res
        .status(404)
        .json({ message: "Product not found with this slug" });

    res.status(200).json({
      message: "Product retrieved successfully by slug",
      data: product,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST: Create Product
exports.createProduct = async (req, res) => {
  try {
   

    const {
      sapExamCode,
      title,
      price,
      category,
      status,
      action,
      onlinePriceInr,
      onlinePriceUsd,
      onlineMrpInr,
      onlineMrpUsd,
      comboPriceInr,
      comboPriceUsd,
      comboMrpInr,
      comboMrpUsd,
      dumpsPriceInr,
      dumpsPriceUsd,
      dumpsMrpInr,
      dumpsMrpUsd,
      sku,
      longDescription,
      Description,
      slug,
      metaTitle,
      metaKeywords,
      metaDescription,
      schema,
    } = req.body;

    let imageUrl = "";
    if (req.files?.image?.[0]) {
      const result = await cloudinary.uploader.upload(req.files.image[0].path, {
        folder: "products",
      });
      imageUrl = result.secure_url;
    } else {
      return res.status(400).json({ message: "Product image is required" });
    }

    let samplePdfUrl = "";
    if (req.files?.samplePdf?.[0]) {
      const result = await cloudinary.uploader.upload(
        req.files.samplePdf[0].path,
        {
          resource_type: "raw",
          folder: "product_pdfs",
        }
      );
      samplePdfUrl = result.secure_url;
    }

    let mainPdfUrl = "";
    if (req.files?.mainPdf?.[0]) {
      const result = await cloudinary.uploader.upload(
        req.files.mainPdf[0].path,
        {
          resource_type: "raw",
          folder: "product_pdfs",
        }
      );
      mainPdfUrl = result.secure_url;
    }

    const newProduct = new Product({
      sapExamCode,
      imageUrl,
      title,
      price,
      category,
      status,
      action,
      samplePdfUrl,
      mainPdfUrl,
      onlinePriceInr,
      onlinePriceUsd,
      onlineMrpInr,
      onlineMrpUsd,
      comboPriceInr,
      comboPriceUsd,
      comboMrpInr,
      comboMrpUsd,
      dumpsPriceInr,
      dumpsPriceUsd,
      dumpsMrpInr,
      dumpsMrpUsd,
      sku,
      longDescription,
      Description,
      slug,
      metaTitle,
      metaKeywords,
      metaDescription,
      schema,
lastUpdatedBy: req.user?.id || null,
    });

    await newProduct.save();

    res.status(201).json({
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error during product creation",
      error: error.message,
    });
  }
};


// PUT: Update Product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      sapExamCode,
      title,
      price,
      category,
      status,
      action,
      onlinePriceInr,
      onlinePriceUsd,
      onlineMrpInr,
      onlineMrpUsd,
      comboPriceInr,
      comboPriceUsd,
      comboMrpInr,
      comboMrpUsd,
      dumpsPriceInr,
      dumpsPriceUsd,
      dumpsMrpInr,
      dumpsMrpUsd,
      sku,
      longDescription,
      Description,
      slug,
      metaTitle,
      metaKeywords,
      metaDescription,
      schema,
    } = req.body;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const updates = {
      sapExamCode,
      title,
      price,
      category,
      status,
      action,
      onlinePriceInr,
      onlinePriceUsd,
      onlineMrpInr,
      onlineMrpUsd,
      comboPriceInr,
      comboPriceUsd,
      comboMrpInr,
      comboMrpUsd,
      dumpsPriceInr,
      dumpsPriceUsd,
      dumpsMrpInr,
      dumpsMrpUsd,
      sku,
      longDescription,
      Description,
      slug,
      metaTitle,
      metaKeywords,
      metaDescription,
      schema,
    };

    if (req.files?.image?.[0]) {
      const result = await cloudinary.uploader.upload(req.files.image[0].path, {
        folder: "products",
      });
      updates.imageUrl = result.secure_url;
    }

    if (req.files?.samplePdf?.[0]) {
      const result = await cloudinary.uploader.upload(
        req.files.samplePdf[0].path,
        {
          resource_type: "raw",
          folder: "product_pdfs",
        }
      );
      updates.samplePdfUrl = result.secure_url;
    }

    if (req.files?.mainPdf?.[0]) {
      const result = await cloudinary.uploader.upload(
        req.files.mainPdf[0].path,
        {
          resource_type: "raw",
          folder: "product_pdfs",
        }
      );
      updates.mainPdfUrl = result.secure_url;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate("lastUpdatedBy", "name email");

    res
      .status(200)
      .json({ message: "Product updated successfully", data: updatedProduct });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error during update", error: error.message });
  }
};

// DELETE: Product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await Product.findByIdAndDelete(id);

    res
      .status(200)
      .json({ message: "Product deleted successfully", deletedId: id });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error during deletion", error: error.message });
  }
};

// 🔹 Get FAQs for a product
exports.getProductFaqs = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ faqs: product.faqs || [] });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch FAQs", error: err.message });
  }
};

// 🔹 Add FAQ to a product
exports.addProductFaq = async (req, res) => {
  const { question, answer } = req.body;

  if (!question || !answer) {
    return res
      .status(400)
      .json({ message: "Question and answer are required" });
  }

  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const newFaq = { question, answer };
    product.faqs.push(newFaq);
    await product.save();

    res.status(201).json({ message: "FAQ added successfully", faq: newFaq });
  } catch (err) {
    res.status(500).json({ message: "Failed to add FAQ", error: err.message });
  }
};
