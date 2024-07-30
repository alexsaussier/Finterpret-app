"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/utils/svgIcons";

export const StockTickerSearch = ({
  ticker,
  units,
  setTicker,
  setUnits,
  searchTerm,
  setSearchTerm,
  results,
  setResults,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

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

  const saveToPortfolio = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/user/add-stocks-to-portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticker,
          units,
        }),
      });

      if (response.ok) {
        // Handle success
        console.log("Data saved to portfolio");
        setTicker();
        setUnits();
        setSearchTerm("");
        setResults([]);
        router.refresh();
      } else {
        // Handle error
        console.error("Failed to save data to portfolio");
      }
    } catch (error) {
      console.error("An error occurred while saving data to portfolio:", error);
    } finally {
      setLoading(false);
    } 
  };

  return (
    <div>
      
      {ticker ? (
        <>
          <p>{ticker}</p>
          <div>
            <input
              placeholder="Enter stock units"
              value={units}
              onChange={(e) => setUnits(Number(e.target.value))}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  saveToPortfolio();
                }
              }}
              className="input input-bordered input-primary max-w-xs mr-2 mb-2"
            />
            <button
              className="btn btn-neutral ml-2"
              onClick={() => saveToPortfolio()}
            >
              Save to portfolio
            </button>
            {loading && <LoadingSpinner />}

          </div>
        </>
      ) : (
        <>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            placeholder="Search stock ticker"
            className="input input-bordered input-primary max-w-xs mr-2 mb-2"
          />

          <button
            onClick={handleSearch}
            className="btn btn-outline btn-primary"
          >
            Search
          </button>

          {loading && <p>Loading...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          <ul>
            {results.map((result, index) => (
              <li
                key={index}
                onClick={() => setTicker(result["1. symbol"])}
                className="cursor-pointer hover:bg-green-200 rounded-md"
              >
                <strong>{result["1. symbol"]}</strong>: {result["2. name"]}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};
