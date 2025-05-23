import React from "react";

const CarouselCard = ({ title, description, buttonText = "Learn More", onClick }) =>{
    return(
         <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm max-w-sm w-full text-center">
      <h2 className="text-lg font-semibold mb-2 text-center">{title}</h2>
      <p className="text-sm text-gray-600 mb-4 text-center">{description}</p>
      <button
        onClick={onClick}
        className="px-4 py-2 rounded text-white items-center hover:text-black font-bold border-orange-800 border-1"
        style={{
          backgroundColor: "var(--color-secondary)",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "var(--color-secondary-hover)")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "var(--color-secondary)")}
      >
        {buttonText}
      </button>
    </div>
    )
}
export default CarouselCard;