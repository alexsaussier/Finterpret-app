"use client";

import { useState } from "react";
import "./ListedStock.css";
import Modal from "./Modal";

const ListedStock = ({
  selected = false,
  changePercent,
  price,
  name,
  units,
  currency,
  ticker
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const isNegative = (changePercent ?? "").toString().startsWith("-")
    ? true
    : false;

  changePercent = isNaN(changePercent) ? null : changePercent.toFixed(2) + "%";
  price = parseFloat(price).toFixed(2);

  if (!currency) {
    currency = "USD";
  }

  return (
    <div
      className={`listedStock min-w-56 hover:bg-teal-300/50 ${
        selected ? "bg-teal-300/50 " : ""
      }`}
    >
      <p className="stockName">{ticker}</p>
      <p className="stockAmount">{units} units</p>
      <div className="priceMetrics space-x-4">
        <p className="stockPrice">
          {price} {currency}{" "}
        </p>
        <p style={{ color: isNegative ? "red" : "green" }}>
          {changePercent && (
            <>
              {isNegative ? "" : "+"}
              {changePercent}
            </>
          )}
        </p>
      </div>
      {/*<Modal isModalOpen={isOpen} setIsModalOpen={setIsOpen}/> */}
    </div>
  );
};

export default ListedStock;
