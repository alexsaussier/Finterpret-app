"use client";
import React, { useState } from "react";

export const StockTickerSearch = ({ ticker, units, setTicker, setUnits }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${searchTerm}&apikey=${process.env.STOCK_TICKER_API_KEY}`
      );
      const data = await response.json();

      if (data.Note) {
        setError("API call frequency is too high. Please try again later.");
      } else if (data.bestMatches) {
        setResults(data.bestMatches);
      } else {
        setError("No results found.");
      }
    } catch (error) {
      setError("An error occurred while fetching the data.");
    }

    setLoading(false);
  };

  return (
    <div>
      {ticker ? (
        <div>
          <p>{ticker}</p>
          <input
            placeholder="Enter stock units"
            value={units}
            onChange={(e) => setUnits(e.target.value)}
          />
        </div>
      ) : (
        <>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter stock ticker"
          />
          <button onClick={handleSearch} className="btn btn-neutral">
            Search
          </button>
          {loading && <p>Loading...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          <ul>
            {results.map((result, index) => (
              <li key={index} onClick={() => setTicker(result["1. symbol"])}>
                <strong>{result["1. symbol"]}</strong>: {result["2. name"]}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};
