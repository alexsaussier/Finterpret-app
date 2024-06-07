"use client";

import { useState } from "react";
import "./ListedStock.css";
import Modal from "./Modal";

const ListedStock = ({ percentage, price, name, stockNumber }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isNegative = percentage < 0 ? true : false;
  return (
    <div className="listedStock" onClick={() => setIsOpen(true)}>
      <p className="stockName">{name}</p>
      <p className="stockAmmount">{stockNumber} stocks</p>
      <div className="priceMetrics">
        <p className="stockPrice">{price}</p>
        <p style={{ color: isNegative ? "red" : "green" }}>
          {isNegative ? "-" : "+"}
          {percentage} %
        </p>
      </div>
      <Modal isModalOpen={isOpen} setIsModalOpen={setIsOpen} />
    </div>
  );
};

export default ListedStock;
