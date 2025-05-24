import React from "react";

const Button = ({children,className="",variant="default", ...props}) =>{
const baseStyles = "px-4 py-2 rounded font-medium transition-all";
const variants = {
  default: "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] cursor-pointer",
  outline: "border border-gray-400 text-gray-700 hover:bg-gray-100 cursor-pointer",
  danger: "bg-red-600 text-white hover:bg-red-700 cursor-pointer",
  blue: "bg-white border border-blue-500 text-blue-600 hover:bg-blue-50 cursor-pointer",
};

return(
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
        {children}
    </button>
);
};
export default Button;