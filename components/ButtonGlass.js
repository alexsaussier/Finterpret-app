"use client";

const ButtonGlass = ({ title = "Import your portfolio", onClick = () => {} }) => {
  return (
    <button className="btn btn-glass animate-shimmer" onClick={onClick}>
      {title}
    </button>
  );
};

export default ButtonGlass;