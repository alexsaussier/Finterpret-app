"use client";

import { useEffect, useState, useRef } from "react";
import ListedStock from "./ListedStock";
import StockAnalyticsCard from "./StockAnalyticsCard";

const StockAnalyticsDash = ({ stocks }) => {
  const [selectedStock, setSelectedStock] = useState(stocks[0]);
  const carouselRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  if (!stocks || stocks.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        Go to Portfolio Analysis and add stocks to your portfolio.
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[500px]">
      <div 
        className="w-full lg:w-1/2 overflow-x-auto lg:overflow-x-visible cursor-grab active:cursor-grabbing"
        ref={carouselRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <div className="flex lg:flex-col">
          {stocks.map((stock) => (
            <div className="flex-shrink-0 lg:flex-shrink mr-2 lg:mr-0 lg:mt-4" key={stock.stockName}>
              <button onClick={() => setSelectedStock(stock)}>
                <ListedStock
                  selected={stock.ticker === selectedStock.ticker}
                  changePercent={stock.percentChange}
                  price={stock.currentPrice}
                  name={stock.stockName || stock.ticker}
                  units={stock.units}
                  currency={stock.currency}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full lg:w-1/2 mt-4 lg:mt-0">
        <p className="mb-2">Click on a metric to get some insights 👇</p>
        <StockAnalyticsCard ticker={selectedStock.ticker} stock={selectedStock} />
      </div>
    </div>
  );
};

export default StockAnalyticsDash;
