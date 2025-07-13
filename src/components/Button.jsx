import React from 'react';

const Button = ({
  children,
  type = "submit",
  bgColor = "bg-teal-500",
  textColor = "text-white",
  className = "",
  ...props
}) => {
  return (
    <button
      type={type}
      className={`
        ${bgColor} 
        ${textColor} 
        px-5 py-2.5 
        rounded-lg 
        text-sm sm:text-base 
        font-medium 
        shadow-md 
        hover:brightness-105 
        hover:shadow-lg 
        transition-all 
        duration-200 
        focus:outline-none 
        focus:ring-2 
        focus:ring-offset-2 
        focus:ring-teal-400
        disabled:opacity-50 
        disabled:cursor-not-allowed 
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
