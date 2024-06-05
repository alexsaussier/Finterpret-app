"use client";
import { useEffect, useState } from "react";
import getStats from "@/utils/getStats";

// TO DO: 
//    - Ensure data is fetched from yahoo and displayed correctly
//    - Ensure data is cached so we do not make multiple calls to the API if we click on the stock cards multiple times


const StockAnalyticsCard = ({ ticker }) => {
  const [stats, setStats] = useState(null);
  const statistics = [];
  const importantMetrics = [];
  const mockImportantMetrics = [];

  //We should fetch data here on initial render of the component and store it as state

  useEffect(() => {
    const fetchData = async () => {
      const data = await getStats(ticker);
      setStats(data);
    };

    fetchData();
  }, [ticker]);

  console.log("Stats: " + JSON.stringify(stats, null, 2));

  if (!stats) {
    return <div>Loading...</div>; // or some loading spinner
  }

  //We should then parse the data and store it in an array

  try {
    importantMetrics.push(
    ["PE Ratio", stats.response.trailingPE.raw], 
    ["Shares Outstanding", stats.response.sharesOutstanding.raw], 
    ["Earnings Per Share", stats.response.epsCurrentYear.raw],
    ["Price/earnings ratio", stats.response.priceEpsCurrentYear.raw],
    ["Book Value", stats.response.bookValue.raw], 
    ["Price to Book Value", stats.response.priceToBook.raw], 
    ["Dividend Yield", stats.response.dividendYield.raw + "%"],
    // stats.quickRatio, 
    // stats.debtToEquity, 
    // stats.grossProfits, 
    // stats.grossMargins)
  );
  } catch (error) {
    console.error(error);
  }
  

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


    return (
      <>
        {/*
    We can then display data here and pass it to other components (like the ones where GPT will take metrics and return response) 
      
    */}

        {/* 
    For each statistic, display using a stat component
    Below or next to each statistic, we will do an LLM API call 
    */}

      <p>With mock data:</p>  
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

        <p>With real data:</p>

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
