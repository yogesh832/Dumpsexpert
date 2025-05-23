import React, { useState } from "react";
import { ImCross } from "react-icons/im";

const Input = ({ className = "", wrapperClass = "", ...props }) => {
  const [value, setValue] = useState("");

  return (
    <div className={`relative ${wrapperClass}`}>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={`w-full px-3 py-2 border border-[#ced4da] rounded outline-none focus:ring-1 focus:ring-[var(--color-primary-hover)] pr-10 ${className}`}
        {...props}
      />
      {value && (
        <ImCross
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-primary-hover)] cursor-pointer text-lg sm:text-base"
          onClick={() => setValue("")}
        />
      )}
    </div>
  );
};

export default Input;
