import React from "react";
import { useParams, Link } from "react-router-dom";

// Importing images
import sapImg from "../assets/blogassets/sap.webp";
import awsImg from "../assets/blogassets/aws.webp";
import azureImg from "../assets/blogassets/azure.webp";
import gcpImg from "../assets/blogassets/gcp.webp";
import oracleImg from "../assets/blogassets/oracle.webp";
import isacaImg from "../assets/blogassets/isaca.webp";

const CategoryBlogProducts = () => {
  const { categoryName } = useParams();

  const backgroundImages = {
    sap: sapImg,
    aws: awsImg,
    azure: gcpImg,
    gcp: azureImg,
    salesforce: gcpImg,
    oracle: oracleImg,
    isaca: gcpImg,
    scrumalliance: gcpImg,
    axelos: gcpImg,
    isc2: gcpImg,
    microsoft: gcpImg,
    pmi: gcpImg,
    cisco: gcpImg,
    comptia: gcpImg,
    alltech: gcpImg,
  };

  const selectedImage =
    backgroundImages[categoryName?.toLowerCase()] || isacaImg;

  const formattedHeading = categoryName
    ?.replace(/([A-Z])/g, " $1")
    .replace(/-/g, " ")
    .toUpperCase();

  const categories = [
    "SAP",
    "AWS",
    "AZURE",
    "GCP",
    "SALESFORCE",
    "ORACLE",
    "ISACA",
    "Scrum Alliance",
    "AXELOS",
    "ISC2",
    "Microsoft",
    "PMI",
    "CISCO",
    "COMPTIA",
    "All Technologies",
  ];

  return (
    <div className="relative min-h-screen w-full pb-10 pt-24">
      {/* Banner */}
      <div
        className="h-[450px] w-full bg-cover bg-center bg-fixed relative px-4"
        style={{
          backgroundImage: `url(${selectedImage})`,
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0"></div>

        {/* Title on Top */}
        <div className="relative z-10 pt-6">
          <h1 className="text-white text-4xl font-bold text-center uppercase tracking-wide">
            {formattedHeading}
          </h1>
        </div>

        {/* Category Buttons (Centered in Banner) */}
        <div className="relative z-10 flex flex-wrap justify-center gap-2 mt-12">
          {categories.map((cat) => (
            <Link
              key={cat}
              to={`/blogs/category/${cat.toLowerCase().replace(/\s+/g, "")}`}
              className={`border px-4 py-2 text-white text-sm sm:text-base rounded-sm hover:bg-white hover:text-black transition ${
                cat.toLowerCase().replace(/\s+/g, "") === categoryName
                  ? "bg-white/80 text-black font-semibold"
                  : ""
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Below Content */}
      <div className="mt-10 px-4 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Latest Posts in {formattedHeading}
        </h2>
        {/* Add blog post cards/content here */}
      </div>
    </div>
  );
};

export default CategoryBlogProducts;
