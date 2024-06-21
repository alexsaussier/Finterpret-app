"use client";

import { useEffect, useState } from "react";
import StockCard from "./StockCard";
import ListedStock from "./ListedStock";
import StockAnalyticsCard from "./StockAnalyticsCard";
//import { getHoldings } from "@/utils/getHoldings";


const StockAnalyticsDash = ({ stocks }) => {
  
  let refreshedStocks = []

  //const [holdings, setholdings] = useState(null);

  
  //This might not work on first try, because I was still using mock data
  //basically, selectedStock ticker initially should be set to the first of stocks.ticker
  const [selectedStock, setSelectedStock] = useState(stocks[0].ticker);

  //For testing and debugging, this will console log the selected stock on every click
  useEffect(() => {
    console.log("selected stock: " + selectedStock);
  }, [selectedStock]);


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
            key={stock.stockName}
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
