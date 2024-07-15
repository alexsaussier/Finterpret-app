"use client";

import { useState } from "react";
import "./ListedStock.css";
import Modal from "./Modal";

const ListedStock = ({ selected= false, changePercent, price, name, units, currency }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isNegative = (changePercent ?? "").toString().startsWith("-") ? true : false;

  return (
    <div className={`listedStock min-w-56 hover:bg-teal-300/50 ${selected ? "bg-teal-300/50 " : ""}`} >
      <p className="stockName">{name}</p>
      <p className="stockAmount">{units} units</p>
      <div className="priceMetrics space-x-4">
        <p className="stockPrice">{price} {currency} </p>
        <p style={{ color: isNegative ? "red" : "green" }}>
          {isNegative ? "" : "+"}
          {changePercent}
        </p>
      </div>
      {/*<Modal isModalOpen={isOpen} setIsModalOpen={setIsOpen}/> */}
    </div>
  );
};

export default ListedStock;
