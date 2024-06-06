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

  //-------------LOAD IMPORTANT METRICS -------------

  //PE ratio:
  try {
    importantMetrics.push(["PE Ratio", stats.response.trailingPE.raw]);
  } catch (error) {
    console.log();
    try{
      importantMetrics.push(["PE Ratio", stats.response.forwardPE.raw]);
    }catch (error) {
      console.log('Error: PE Ratio is not correctly loaded.');
    }
  } 
  

  //Shares Outstanding:
  try {
    importantMetrics.push(["Shares Outstanding", stats.response.sharesOutstanding.raw]);
  } catch (error) {
    console.log('Error: Shares Outstanding is not correctly loaded.');
  }

  //EPS:
  try {
    importantMetrics.push(["Earnings Per Share", stats.response.epsCurrentYear.raw]);
  } catch (error) {
    console.log(); 
    try{
      importantMetrics.push(["Earnings Per Share", stats.response.epsTrailingTwelveMonths.raw]);
    }catch (error) {
      console.log('Error: EPS is not correctly loaded.');
    }
  } 

  //P/E ratio
  try {
    importantMetrics.push(["Price/earnings ratio", stats.response.priceEpsCurrentYear.raw]);
  } catch (error) {
    console.log('Error: P/E ratio is not correctly loaded.');
  }

  //Book Value
  try {
    importantMetrics.push(["Book Value", stats.response.bookValue.raw]);
  } catch (error) {
    console.log('Error: Book Value is not correctly loaded.');
  }

  //Price to Book Value
  try {
    importantMetrics.push(["Price to Book Value", stats.response.priceToBook.raw]);
  } catch (error) {
    console.log('Error: Price to Book Value is not correctly loaded.');
  }

  //Dividend Yield:
  try {
    importantMetrics.push(["Dividend Yield", stats.response.dividendYield.raw + "%"]);
  } catch (error) {
    console.log(); 
    try{
      importantMetrics.push(["Dividend Yield", stats.response.trailingAnnualDividendYield.raw + "%"]);
    }catch (error) {
      console.log('Error: Dividend Yield is not correctly loaded.');
    }
  } 
 
// We can add:
// stats.quickRatio, 
// stats.debtToEquity, 
// stats.grossProfits, 
// stats.grossMargins

console.log("Important metrics: " + JSON.stringify(importantMetrics, null, 2));

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
        {/* Render your actual data here */}
        <p>Real data:</p>

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
      </div>
    )}
      
      
      </>

      
    );
  
  };

export default StockAnalyticsCard;
