import React from "react";
import banner from "../../assets/landingassets/banner.webp"; // Adjust the path as necessary
const AboutUs = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-8 px-6 py-12 bg-white">
      {/* Left Content */}
     <div className="lg:w-1/2">
        <img
          src={banner}
          alt="Professional"
          className="w-full max-w-md mx-20 rounded-xl "
        />
      </div>

      {/* Right Image */}
   

          <div className="lg:w-1/2 space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">About Us</h2>
        <p className="text-gray-600">
          Welcome to DumpsXpert.com – your ultimate destination for reliable, accurate, and verified IT certification exam resources.
        </p>
        <p className="text-gray-600">
          We specialize in providing top-quality SAP exam dumps and an extensive collection of IT exam dumps to help professionals achieve their career goals with confidence.
        </p>

        <h3 className="text-2xl font-semibold text-gray-800 mt-6">Why Choose DumpsXpert?</h3>
        <ul className="list-disc pl-5 text-gray-600 space-y-2">
          <li>
            SAP Examdumps – Our Specialty! When it comes to SAP exam dumps, DumpsXpert leads the way.
          </li>
          <li>
            We provide expertly crafted and regularly updated SAP certification exam files that cover a wide range of certifications.
          </li>
          <li>
            Each SAP exam dump is meticulously compiled by certified professionals based on trends, topics, and past exams.
          </li>
          <li>
            Our mission: help you pass your SAP exam on the first attempt.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AboutUs;
