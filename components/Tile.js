import React from 'react';

export default function Tile({ title, content }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <div className="text-gray-700">{content}</div>
    </div>
  );
}