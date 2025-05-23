import React from "react";

const Button = ({children,className="",variant="default", ...props}) =>{
const baseStyles = "px-4 py-2 rounded font-medium transition-all";
const variants = {
    default: "",
    outline: "",
    danger: "",
};

return(
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
        {children}
    </button>
);
};
export default Button;