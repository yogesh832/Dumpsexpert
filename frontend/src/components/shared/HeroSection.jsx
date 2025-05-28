import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import banner from "../../assets/landingassets/banner.webp";

const HeroSection = () => {
  return (
    <div className="w-full bg-white pt-28 px-6 md:px-20 flex flex-col-reverse md:flex-row items-center justify-between">
      {/* Left Content */}
      <div className="md:w-1/2 mt-10 md:mt-0">
        <h1 className="text-3xl md:text-5xl sm:text-3xl font-bold text-gray-800 leading-tight mb-4">
          Dumpsxpert Provides Best Quality Practice Exams & PDF For All IT
          Certification Exams
        </h1>
        <p className="text-gray-600 text-xl mb-6">
          Get your IT certification done in the first attempt with the best
          Study material in the form of PDF and Practice Exam Software (No
          Installation Required)
        </p>
        <ul className="space-y-3 md:text-lg text-gray-700 mb-4">
          {[
            "100% Valid IT Exam Dumps",
            "100% Money Back Guarantee",
            "24/7 Customer Support",
            "Get 3 Months of Free Updates",
            "Practice Exam with a User-friendly Interface",
          ].map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <FaCheckCircle className="text-blue-600 text-xl mt-1" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-lg text-gray-500">
          4.8 Reviewed by 10,000+ customers
        </p>
      </div>

      {/* Right Content */}
      <div className="md:w-1/2 relative flex justify-center items-center">
        <img
          src={banner}
          alt="Banner"
          className="w-full max-w-[600px] h-auto"
        />
      </div>
    </div>
  );
};

export default HeroSection;
