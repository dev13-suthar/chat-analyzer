import React from "react";

interface CardProps {
    children: React.ReactNode;
    title:string
}

const Card = ({ children ,title}: CardProps) => {
  return (
    <div className="min-w-[250px] max-w-[700px] h-[max] min-h-[170px] flex flex-col p-2 rounded-md bg-secondary">
        <p className="text-2xl">{title}:</p>
        {children}
    </div>
  );
};

export default Card;
