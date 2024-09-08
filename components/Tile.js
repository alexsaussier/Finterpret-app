import React from 'react';

const Tile = ({ title, content }) => {
  return (
    <div className="stats shadow mt-4 w-full transition duration-300 ease-in-out transform hover:scale-105 hover:bg-base-200 cursor-pointer">
      <div className="stat">
        <div className="stat-title">{title}</div>
        <div className="stat-value">{content}</div>
      </div>
    </div>
  );
};

export default Tile;