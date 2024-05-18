"use client";
import { useEffect, useState } from "react";
import getStats from "@/utils/getStats";


//Add all data needed as props
const StockAnalyticsCard = ({ticker}) => {
  const [stats, setStats] = useState();
  const importantMetrics = []

  //We should fetch data here on initial render of the component and store it as state
  
/*
  useEffect(() => {
    const getStats = async (ticker) => {
      const url = "http://localhost:3000/api/yahoo-finance/key-statistics";
      await fetch(url, {
        method: "POST",
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          'X-RapidAPI-Key': '9bd7bf1ab5msh9844a86da9ae0aap142550jsnbd39264e4217',
          'X-RapidAPI-Host': 'yahoo-finance127.p.rapidapi.com'
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(ticker), // body data type must match "Content-Type" header
      }).then((data) => {
        setStats(data);
      });
    };
  }, []);
  */

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
  );*/

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
  
    CALL GETSTATS
    PARSE RESPONSE TO RETRIEVE STATISTICS:
      Trailing P/E
      Shares outstanding
      Earnings per share (EPS)
      Price to Earnings (P/E) ratio
      Book value and Price to book value (price to book)
      Dividend Yield
      Quick ratio
      Debt to Equity
      Gross profits and gross margins
  
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
