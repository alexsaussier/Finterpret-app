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
        const response = await getPrice(stock.ticker); // Fetch stock stats
        console.log("response: ", response);

        const { regularMarketPrice, regularMarketChangePercent } = response.data;

        return { 
          ticker: stock.ticker,
          price: regularMarketPrice.fmt, // Formatted price string
          changePercent: regularMarketChangePercent.fmt // Formatted change percent string};
        };
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
      className="flex" style={{minHeight: "500px"}}>
      <div className="w-1/2">
        {stocks.map((stock) => (
          <div className={`mt-4`} key={stock.stockName}>
            <button onClick={() => setSelectedStock(stock.ticker)}>
              <ListedStock
                selected ={stock.ticker === selectedStock} 
                percentage={stockStats[stock.ticker]?.changePercent} 
                price={stockStats[stock.ticker]?.price} 
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
