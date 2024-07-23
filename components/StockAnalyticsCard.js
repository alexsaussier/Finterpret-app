"use client";
import { useEffect, useState } from "react";
import getStats from "@/utils/getStats";
import Modal from "@/components/Modal";

// TO DO:
//    - Ensure data is cached so we do not make multiple calls to the API if we click on the stock cards multiple times

const StockAnalyticsCard = ({ stock }) => {
  const [stats, setStats] = useState(null);
  const importantMetrics = [];
  let importantMetricsStock = [];

  const [isOpen, setIsOpen] = useState(false);
  const [currentMetric, setCurrentMetric] = useState(["", ""]);

  const openModal = (metric) => {
    setCurrentMetric(metric);
    setIsOpen(true);
  };

  //-------------LOAD IMPORTANT METRICS -------------
  try {
    importantMetrics.push(
      ["PE Ratio", parseFloat(stock.peRatio).toFixed(2)],
      ["Shares Outstanding", stock.sharesOutstanding],
      ["Earnings Per Share", parseFloat(stock.eps).toFixed(2)],
      ["Price/EPS", parseFloat(stock.priceEPS).toFixed(2)],
      ["Book Value", parseFloat(stock.bookValue).toFixed(2)],
      ["Price to Book", parseFloat(stock.priceToBook).toFixed(2)],
      ["Dividend Yield", stock.divYield ? stock.divYield + "%" : null]
    );
  } catch (error) {
    console.log("Error: Stock metrics are not correctly loaded." + error);
  }

  if (!importantMetrics) {
    return (
      <div className="flex items-center space-x-3">
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Loading...
      </div>
    );
  }

  // We can add:
  // stats.quickRatio,
  // stats.debtToEquity,
  // stats.grossProfits,
  // stats.grossMargins
  // average analyst rating
  const allMetricsEmpty = importantMetrics.every(
    (metric) => metric[1] === null || metric[1] === undefined
  );
  return (
    <>
      {/* 
    For each statistic, display using a stat component
    Below or next to each statistic, we will do an LLM API call 
    */}
      {importantMetrics.length === 0 ? (
        <div className="flex items-center space-x-3">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading...
        </div>
      ) : (
        <div>
          
          <div className="flex-row">
          {importantMetrics.map((stockItem, index) => (
            <button onClick={() => openModal(stockItem)} key={index}>
              <div className="stats shadow mt-4">
                <div className="stat">
                  <div className="stat-title">{stockItem[0]}</div>
                  <div className="stat-value">{stockItem[1]}</div>
                  {/* Add more details as needed */}
                </div>
              </div>
            </button>
          ))}
        </div>
          
          {isOpen && (
            <Modal
              isModalOpen={isOpen}
              setIsModalOpen={setIsOpen}
              metric={currentMetric}
            />
          )}
        </div>
      )}
    </>
  );
};

export default StockAnalyticsCard;
