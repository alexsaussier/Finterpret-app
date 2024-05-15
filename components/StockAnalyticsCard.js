"use client";
import { useEffect } from "react";

//Add all data needed as props
const StockAnalyticsCard = ({ stockName, ticker, units }) => {
  const [stats, setStats] = useState();

  //We should fetch data here on initial render of the component and store it as state
  useEffect(() => {
    const getStats = async () => {
      const url = "http://localhost:3000/api/yahoo-finance/key-statistics";
      await fetch(url, {
        method: "POST",
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(ticker), // body data type must match "Content-Type" header
      }).then((data) => {
        setStats(data);
      });
    };
  }, []);
  return (
    <>
      {/*
  We can then display data here and pass it to other components (like the ones where GPT will take metrics and return response) */}
    </>
  );
};

export default StockAnalyticsCard;
