import React from "react";
import InfoCard from "../ui/InfoCard";
import affordable from "../../assets/landingassets/affordable.webp";
import downloadable from "../../assets/landingassets/downloadable.jpg";
import moneyBack from "../../assets/landingassets/moneyBack.webp";
import support from "../../assets/landingassets/support.jpg";
import freesample from "../../assets/landingassets/freesample.webp";
import validDumps from "../../assets/landingassets/validDumps.webp";
import specialdiscount from "../../assets/landingassets/specialdiscount.webp";
import freeupdates from "../../assets/landingassets/freeupdate.webp";

const UnlockGoals = () => {
  const cardData = [
    {
      icon: downloadable,
      title: "Downloadable PDF with Questions & Answers",
      description:
        "The Dumpsxpert provides 100% original and verified updated IT Certification Dumps for all exams.",
    },
    {
      icon: affordable,
      title: "Affordable & Reasonable Price",
      description:
        "You will never have to pay much for these real exam questions. Our prices are very reasonable and affordable.",
    },
    {
      icon: moneyBack,
      title: "100% Money Back Guarantee",
      description:
        "We provide exact IT exam questions & answers at no risk to you. If our resources do not live up to expectations, you can claim a refund.",
    },
    {
      icon: support,
      title: "24/7 Customer Support",
      description:
        "We offer live customer support to make your learning process smooth and effortless. Reach out for any assistance.",
    },
    {
      icon: freeupdates,
      title: "Free Updates up to 90 Days",
      description:
        "We provide free 90 days of updates on all IT certification exam preparation materials.",
    },
    {
      icon: validDumps,
      title: "100% Valid IT Exam Dumps",
      description:
        "Dumpsxpert provides 100% valid IT exam questions and answers for certification success.",
    },
    {
      icon: freesample,
      title: "Free Sample",
      description:
        "Dumpsxpert provides 100% valid IT exam questions and answers for certification success.",
    },
    {
      icon: specialdiscount,
      title: "Special Discount Offer",
      description:
        "Dumpsxpert provides 100% valid IT exam questions and answers for certification success.",
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <header className="text-center mb-10 py-16">
        <h1 className="text-4xl font-bold text-gray-800">
          Unlock your IT certification goals with Dumps Xpert
        </h1>
        <p className="text-gray-600 text-lg mt-4">
          Benefits of IT Certification Dumps, Practice Exams and Study Materials
          With dumpsxpert
        </p>
      </header>

      <main className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cardData.map((card, index) => (
            <InfoCard
              key={index}
              icon={
                <img src={card.icon} alt={card.title} className="w-12 h-12" />
              }
              title={card.title}
              description={card.description}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default UnlockGoals;
