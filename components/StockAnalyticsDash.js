"use client";

import { useEffect, useState } from "react";
import StockCard from "./StockCard";
import ListedStock from "./ListedStock";
import StockAnalyticsCard from "./StockAnalyticsCard";
import getStats from "@/utils/getStats";
import getPrice from "@/utils/getPrice";

//import { getHoldings } from "@/utils/getHoldings";


const StockAnalyticsDash = ({ stocks }) => {
  
  const [selectedStock, setSelectedStock] = useState(stocks[0].ticker);
  // Initialize state to hold stock stats
  const [stockStats, setStockStats] = useState({});

  let regularMarketPrice = 0;
  let regularMarketChangePercent = 0;

  // get the price and delta for the stock cards once the component mounts
  useEffect(() => {
    const fetchData = async () => {
      
    };

    fetchData();
  }, [stocks]);


  
  console.log("stockStats: ", stockStats);
  


  return (
    <div
      className="flex" style={{minHeight: "500px"}}>
      <div className="w-1/2">
        {stocks.map((stock) => (
          <div className={`mt-4`} key={stock.stockName}>
            <button onClick={() => setSelectedStock(stock.ticker)}>
              <ListedStock
                selected ={stock.ticker === selectedStock} 
                changePercent={stock.changePercent} 
                price={stock.currentPrice} 
                name={stock.stockName || stock.ticker} 
                units={stock.units} 
                currency={stock.currency}
              />

            </button>
          </div>
        ))}
      </div>

      <div className="w-1/2">
        <StockAnalyticsCard ticker={selectedStock} />
      </div>
    </div>
  );
};

export default StockAnalyticsDash;
