import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ManageFaq = () => {
  const { id } = useParams(); // product ID from URL
  const [faqs, setFaqs] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");

  // 🔹 Fetch FAQs on mount
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/products/${id}/faqs`);
        setFaqs(res.data.faqs || []);
      } catch (err) {
        console.error("Failed to fetch FAQs:", err);
        setError("Failed to load FAQs");
      }
    };

    fetchFaqs();
  }, [id]);

  // 🔹 Add new FAQ
  const handleAddFaq = async () => {
    if (!question || !answer) {
      setError("Both question and answer are required");
      return;
    }

    try {
      const res = await axios.post(`http://localhost:8000/api/products/${id}/faqs`, {
        question,
        answer,
      });

      setFaqs((prev) => [...prev, res.data.faq]);
      setQuestion("");
      setAnswer("");
      setError("");
    } catch (err) {
      console.error("Failed to add FAQ:", err);
      setError("Failed to add FAQ");
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <h2 className="text-xl font-semibold mb-4">Manage FAQs</h2>

      {error && <p className="text-red-500">{error}</p>}

      {/* Form */}
      <div className="mb-4 space-y-2">
        <input
          type="text"
          placeholder="Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
        <textarea
          placeholder="Answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        ></textarea>
        <button
          onClick={handleAddFaq}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add FAQ
        </button>
      </div>

      {/* FAQ List */}
      <div>
        <h3 className="text-lg font-medium mb-2">Existing FAQs</h3>
        {faqs.length === 0 ? (
          <p className="text-gray-500">No FAQs yet for this product.</p>
        ) : (
          <ul className="space-y-3">
            {faqs.map((faq, index) => (
              <li key={index} className="border p-3 rounded">
                <p className="font-semibold">Q: {faq.question}</p>
                <p className="text-gray-700">A: {faq.answer}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ManageFaq;
