"use client";

const ButtonGradient = ({ title, onClick = () => {} }) => {
  return (
    <button className="btn btn-gradient animate-shimmer" onClick={onClick}>
      {title}
    </button>
  );
};

export default ButtonGradient;
