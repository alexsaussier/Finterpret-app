"use client";

const ButtonGradient = ({ title = "Import your portfolio", onClick = () => {} }) => {
  return (
    <button className="btn btn-gradient animate-shimmer" onClick={onClick}>
      {title}
    </button>
  );
};

export default ButtonGradient;
