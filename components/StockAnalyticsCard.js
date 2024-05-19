"use client";
import { useEffect, useState } from "react";
import getStats from "@/utils/getStats";


//Add all data needed as props
const StockAnalyticsCard = ({ticker}) => {
  const [stats, setStats] = useState(null);
  const statistics = [];
  const importantMetrics = []

  //We should fetch data here on initial render of the component and store it as state
  
  useEffect(() => {
    const fetchData = async () => {
      const data = await getStats(ticker);
      setStats(data);
      
    };

    fetchData();
  }, [ticker]);

  /*if (!stats) {
    return <div>Loading...</div>; // or some loading spinner
  }*/

  //We should then parse the data and store it in an array
  
  /*
  importantMetrics.push(
    ["PE Ratio", stats.trailingPE.raw], 
    ["Shares Outstanding", stats.sharesOutstanding.raw], 
    ["Earnings Per Share" + stats.epsCurrentYear.raw],
    ["Price/earnings ratio", stats.priceEpsCurrentYear.raw],
    ["Book Value", stats.bookValue.raw], 
    ["Price to Book Value", stats.priceToBook.raw], 
    ["Dividend Yield", stats.dividendYield.raw + "%"],
    // stats.quickRatio, 
    // stats.debtToEquity, 
    // stats.grossProfits, 
    // stats.grossMargins)
  );
*/
  //with mock data
  importantMetrics.push(
    ["PE Ratio", 32.62331], 
    ["Shares Outstanding", 15728700416], 
    ["Earnings Per Share", 5.98],
    ["Price/EPS ratio", 32.295986],
    ["Book Value", 3.953], 
    ["Price to Book Value", 48.856564], 
    ["Dividend Yield", 0.5],
  );

  return (
    <>
      {/*
  We can then display data here and pass it to other components (like the ones where GPT will take metrics and return response) 
    
  */}

  {/* 
  For each statistic, display using a stat component
  Below or next to each statistic, we will do an LLM API call 
  */ }
  
  <div className="flex-row">
    {importantMetrics.map((metric, index) => (
      <div className="stats shadow mt-4" key={metric[0]}>
        <div className="stat">
          <div className="stat-title">{metric[0]}</div>
          <div className="stat-value">{metric[1]}</div>
        </div>
      </div>
    ))}
  </div>
  
    </>
  );
};

export default StockAnalyticsCard;
