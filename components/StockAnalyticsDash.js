"use client";

import { useEffect, useState } from "react";
import StockCard from "./StockCard";
import ListedStock from "./ListedStock";
import StockAnalyticsCard from "./StockAnalyticsCard";
import getStats from "@/utils/getStats";
import getPrice from "@/utils/getPrice";

//import { getHoldings } from "@/utils/getHoldings";


const StockAnalyticsDash = ({ stocks }) => {
  
  const [selectedStock, setSelectedStock] = useState(stocks[0]);
  console.log("Selected Stock: " + JSON.stringify(selectedStock, null, 2));
  // Initialize state to hold stock stats
  

  return (
    <div
      className="flex" style={{minHeight: "500px"}}>
      <div className="w-1/2">
        {stocks.map((stock) => (
          <div className={`mt-4`} key={stock.stockName}>
            <button onClick={() => setSelectedStock(stock)}>
              <ListedStock
                selected ={stock.ticker === selectedStock.ticker} 
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

      <div className="w-1/2">
        <StockAnalyticsCard ticker={selectedStock.ticker} stock={selectedStock}/> { /* TODO: PASS THE STOCK ARRAY, SO NO NEED TO FETCH DATA AFTER */ }
      </div>
    </div>
  );
};

export default StockAnalyticsDash;
