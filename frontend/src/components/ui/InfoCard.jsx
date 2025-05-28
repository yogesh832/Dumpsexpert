import React from "react";

const InfoCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white shadow-md h-72 rounded-2xl p-6 px-16 text-center flex flex-col items-center">
      <div className="text-green-500 text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

export default InfoCard;
