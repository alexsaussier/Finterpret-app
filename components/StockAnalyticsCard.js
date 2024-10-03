"use client";
import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import Tile from "@/components/Tile";

const StockAnalyticsCard = ({ stock }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMetric, setCurrentMetric] = useState(["", ""]);
  const [guideline, setGuideline] = useState("");
  const [gptMessage, setGptMessage] = useState("");

  const importantMetrics = [
    ["PE Ratio", parseFloat(stock.peRatio).toFixed(2)],
    ["Shares Outstanding", stock.sharesOutstanding],
    ["Earnings Per Share", parseFloat(stock.eps).toFixed(2)],
    ["Price/EPS", parseFloat(stock.priceEPS).toFixed(2)],
    ["Book Value", parseFloat(stock.bookValue).toFixed(2)],
    ["Price to Book", parseFloat(stock.priceToBook).toFixed(2)],
    ["Dividend Yield", stock.divYield ? stock.divYield + "%" : null]
  ].filter(metric => metric[1] !== null && metric[1] !== undefined);

  const openModal = (metric) => {
    setCurrentMetric(metric);
    setGuideline(
      "You are a financial advisor. You are helping a client understand all sorts of financial metrics. Your tone should be serious but friendly. " +
      "Answer in HTML format. Space the text with <br> tags. " +
      "Use <b> tags to put the important statements in bold. " + 
      "You should sound very confident in your answer, as if you are a financial advisor. " 
    );
    setGptMessage(
      `Tell me more about ${metric[0]}? Its value for ${stock.ticker} is ${metric[1]}, what does it mean? ` +
      "Focus more on what the metric value means for me." +
      "Make the response very concise (250 tokens maximums) and easy to understand for the common folk. The person reading that does not know anything about finance." +
      "The first paragraph should be a summary of the definition of the metric and its interpretation."
    );
    setIsOpen(true);
  };

  if (importantMetrics.length === 0) {
    return <div>No metrics available</div>;
  }

  return (
    <div>
      <div className="flex flex-col">
        {importantMetrics.map((stockItem, index) => (
          <button onClick={() => openModal(stockItem)} key={index} className="w-full">
            <Tile title={stockItem[0]} content={stockItem[1]} />
          </button>
        ))}
      </div>
      
      {isOpen && (
        <Modal
          isModalOpen={isOpen}
          setIsModalOpen={setIsOpen}
          metric={currentMetric}
          guideline={guideline}
          gptMessage={gptMessage}
        />
      )}
    </div>
  );
};

export default StockAnalyticsCard;
