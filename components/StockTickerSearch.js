"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/utils/svgIcons";
import { toast } from 'react-hot-toast';


export const StockTickerSearch = ({
  ticker,
  units,
  setTicker,
  setUnits,
  searchTerm,
  setSearchTerm,
  results,
  setResults,
  stockName,
  setStockName,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/yahoo-finance/search-stock?ticker=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'An error occurred while fetching the data.');
      }

      if (data.quotes && data.quotes.length > 0) {
        const newStockName = data.quotes[0].longname || data.quotes[0].shortname;
        setStockName(newStockName);
        console.log("Stock name set:", newStockName); // Add this log
        setResults(data.quotes.map(quote => ({
          "1. symbol": quote.symbol,
          "2. name": quote.longname || quote.shortname
        })));
      } else {
        setError("No results found.");
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || "An error occurred while fetching the data.");
    } finally {
      setLoading(false);
    }
  };

  const saveToPortfolio = async () => {
    try {
      setLoading(true);
      console.log("Saving to portfolio:", { ticker, stockName, units }); // Add this log
      const response = await fetch("/api/user/add-stocks-to-portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticker,
          stockName, // Make sure this is included
          units,
        }),
      });

      if (response.ok) {
        // Handle success
        toast.success(ticker + ' added to your portfolio successfully!', {
          duration: 3000,
          position: 'top-center',
        });
        console.log("Data saved to portfolio:", { ticker, stockName, units });
        setTicker();
        setStockName();
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
          <p className="text-lg font-bold mb-2">{ticker}</p>
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
