"use client";
import { useEffect, useState } from "react";
import getStats from "@/utils/getStats";
import Modal from "@/components/Modal";

// TO DO:
//    - Ensure data is cached so we do not make multiple calls to the API if we click on the stock cards multiple times

const StockAnalyticsCard = ({ ticker }) => {
  const [stats, setStats] = useState(null);
  const importantMetrics = [];
  const mockImportantMetrics = [];

  const [isOpen, setIsOpen] = useState(false);
  const [currentMetric, setCurrentMetric] = useState(["", ""]);

  const openModal = (metric) => {
    setCurrentMetric(metric);
    setIsOpen(true);
  };

  //We should fetch data here on initial render of the component and store it as state

  useEffect(() => {
    const fetchData = async () => {
      const data = await getStats(ticker);
      setStats(data);
    };

    fetchData();
  }, [ticker]);

  //console.log("Stats: " + JSON.stringify(stats, null, 2));

  if (!stats) {
    return (
      <div className="flex items-center space-x-3">
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading...
      </div>
    );
  }

  //-------------LOAD IMPORTANT METRICS -------------

  //PE ratio:
  try {
    importantMetrics.push(["PE Ratio", stats.response.trailingPE.raw]);
  } catch (error) {
    try {
      importantMetrics.push(["PE Ratio", stats.response.forwardPE.raw]);
    } catch (error) {
      console.log("Error: PE Ratio is not correctly loaded.");
    }
  }

  //Shares Outstanding:
  try {
    importantMetrics.push([
      "Shares Outstanding",
      stats.response.sharesOutstanding.raw,
    ]);
  } catch (error) {
    console.log("Error: Shares Outstanding is not correctly loaded.");
  }

  //EPS:
  try {
    importantMetrics.push([
      "Earnings Per Share",
      stats.response.epsCurrentYear.raw,
    ]);
  } catch (error) {
    try {
      importantMetrics.push([
        "Earnings Per Share",
        stats.response.epsTrailingTwelveMonths.raw,
      ]);
    } catch (error) {
      console.log("Error: EPS is not correctly loaded.");
    }
  }

  //P/E ratio
  try {
    importantMetrics.push([
      "Price/EPS ratio",
      stats.response.priceEpsCurrentYear.raw,
    ]);
  } catch (error) {
    console.log("Error: P/E ratio is not correctly loaded.");
  }

  //Book Value
  try {
    importantMetrics.push(["Book Value", stats.response.bookValue.raw]);
  } catch (error) {
    console.log("Error: Book Value is not correctly loaded.");
  }

  //Price to Book Value
  try {
    importantMetrics.push([
      "Price to Book Value",
      stats.response.priceToBook.raw,
    ]);
  } catch (error) {
    console.log("Error: Price to Book Value is not correctly loaded.");
  }

  //Dividend Yield:
  try {
    importantMetrics.push([
      "Dividend Yield",
      stats.response.dividendYield.raw + "%",
    ]);
  } catch (error) {
    try {
      importantMetrics.push([
        "Dividend Yield",
        stats.response.trailingAnnualDividendYield.raw + "%",
      ]);
    } catch (error) {
      console.log("Error: Dividend Yield is not correctly loaded.");
    }
  }

  // We can add:
  // stats.quickRatio,
  // stats.debtToEquity,
  // stats.grossProfits,
  // stats.grossMargins

  console.log(
    "Important metrics: " + JSON.stringify(importantMetrics, null, 2)
  );

  if (importantMetrics.length === 0) {
    //with mock data
    mockImportantMetrics.push(
      ["PE Ratio", 32.62331],
      ["Shares Outstanding", 15728700416],
      ["Earnings Per Share", 5.98],
      ["Price/EPS ratio", 32.295986],
      ["Book Value", 3.953],
      ["Price to Book Value", 48.856564],
      ["Dividend Yield", 0.5]
    );
  }

  return (
    <>
      {/* 
    For each statistic, display using a stat component
    Below or next to each statistic, we will do an LLM API call 
    */}
      {importantMetrics.length === 0 ? (
        <div>
          <p>This is mock data, there was an issue retrieving the real data:</p>
          <div className="flex-row">
            {mockImportantMetrics.map((metric, index) => (
              <div className="stats shadow mt-4" key={metric[0]}>
                <div className="stat">
                  <div className="stat-title">{metric[0]}</div>
                  <div className="stat-value">{metric[1]}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex-row">
            {importantMetrics.map((metric, index) => (
              <button onClick={() => openModal(metric)} key={metric[0]}>
                <div className="stats shadow mt-4">
                  <div className="stat">
                    <div className="stat-title">{metric[0]}</div>
                    <div className="stat-value">{metric[1]}</div>
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
