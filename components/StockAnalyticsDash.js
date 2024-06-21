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


  // get the price and delta for the stock cards once the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const statsPromises = stocks.map(async (stock) => {
        const stats = await getPrice(stock.ticker); // Assuming getStats is an async function that fetches the stock's stats
        return { ticker: stock.ticker, ...stats };
      });

      const statsResults = await Promise.all(statsPromises);
      const statsMap = statsResults.reduce((acc, current) => {
        acc[current.ticker] = current;
        return acc;
      }, {});

      setStockStats(statsMap);
    };

    fetchData();
  }, [stocks]);

  
  
  console.log("stockStats: ", stockStats);
  

  //HERE : FETCH THE MAIN STOCK VALUES WITH GETHOLDINGS HERE
  /*useEffect(() => {
    const fetchData = async () => {
      const holdings = await getHoldings(userId, userSecret, accountId, user);
      setholdings(holdings);
    };

    fetchData();
  }, []);

  if (holdings) {

    for (const position of holdings.response.positions) {
      var ticker = position.symbol.symbol.symbol;
      const stockName = position.symbol.symbol.description;
      const units = position.units;
      const price = position.price;
      const delta = position.open_pnl;
      const currency = position.symbol.symbol.currency.code;

      if (ticker === "CGG.PA") {
        ticker = "VIRI.PA";
        //because company just changed name and brokers can use the previous name
      }
      refreshedStocks.push({ stockName, ticker, units, price, delta, currency });
    }
  }*/


  return (
    <div
      className="flex"
      style={{
        minHeight: "500px",
      }}
    >
      <div className="w-1/2">
        {stocks.map((stock, index) => (
          <div
            className={`mt-4`}
            key={stock.ticker}
          >
            <button onClick={() => setSelectedStock(stock.ticker)}>
              
              {/*<StockCard title={stock.stockName} units={stock.units} />*/}
              <ListedStock
                selected ={stock.ticker === selectedStock} 
                percentage={stock.delta} price={stock.price} 
                name={stock.stockName} 
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
