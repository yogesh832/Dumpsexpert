import React from "react";

const ClientCarouselCard = ({ name, designation, description }) => {
  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-lg p-6 shadow-sm max-w-sm w-full">
      <div className="flex justify-between items-center gap-4 mb-4">
        <img
          src={`https://i.pravatar.cc/100?u=${name}`} // dummy image API with unique seed
          alt={`${name}`}
          className="h-20 w-20 rounded-full object-cover"
        />
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
          <p className="text-sm text-gray-500">{designation}</p>
        </div>
      </div>
       <p className="text-base text-[#666] font-normal">
        “{description}”
      </p>
    </div>
  );
};

export default ClientCarouselCard;
