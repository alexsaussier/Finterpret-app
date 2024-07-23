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
      ["PE Ratio", stock.peRatio],
      ["Shares Outstanding", stock.sharesOutstanding],
      ["Earnings Per Share", stock.eps],
      ["Price/EPS", stock.priceEPS],
      ["Book Value", stock.bookValue],
      ["Price to Book", stock.priceToBook],
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
            {importantMetrics.map((stockItem, index) =>
              stockItem[1] !== null && stockItem[1] !== undefined ? (
                <button onClick={() => openModal(stockItem)} key={index}>
                  <div className="stats shadow mt-4">
                    <div className="stat">
                      <div className="stat-title">{stockItem[0]}</div>
                      <div className="stat-value">{stockItem[1]}</div>
                    </div>
                  </div>
                </button>
              ) : null
            )}
          </div>
          {allMetricsEmpty && (
            <div role="alert" className="alert shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-info h-6 w-6 shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <div>
                <h3 className="font-bold">
                  Seems like there are no metrics data for this stock.
                </h3>
              </div>
            </div>
          )}

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
