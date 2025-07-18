import { useEffect, useState } from "react";
import { FaChevronRight, FaQuestionCircle } from "react-icons/fa";
import axios from "axios";

const GeneralFAQs = () => {
  const [faqs, setFaqs] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const { data } = await axios.get("http://localhost:8000/api/general-faqs");

        // Check if API returns { data: [...] } or just [...]
        const faqList = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : [];

        setFaqs(faqList);
      } catch (err) {
        console.error("Failed to fetch general FAQs", err);
        setFaqs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading FAQs...</div>;
  }

  if (!faqs.length) return null;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 flex items-center justify-center gap-2">
        <FaQuestionCircle className="text-indigo-600" /> Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = activeIndex === index;

          return (
            <div
              key={faq._id || index}
              className="border border-gray-200 rounded-xl shadow-sm transition-all duration-300 bg-white"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex justify-between items-center px-6 py-4 text-left group hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-800 text-base">
                  {faq.question}
                </span>
                <FaChevronRight
                  className={`text-gray-600 transition-transform duration-300 transform ${
                    isOpen ? "rotate-90" : ""
                  }`}
                />
              </button>

              <div
                className={`px-6 overflow-hidden text-gray-600 text-sm transition-all duration-300 ease-in-out ${
                  isOpen ? "max-h-96 py-2" : "max-h-0 py-0"
                }`}
              >
                <p>{faq.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GeneralFAQs;
