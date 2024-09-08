import Stock from "@/models/Stock";
import appendYahooMetrics from "@/utils/appendYahooMetrics";
import { getSnaptradeHoldings } from "@/utils/getSnaptradeHoldings";
import { pick } from 'lodash';

export async function processStockData(user) {
  let stocks = [];
  let holdings = null;

  // Retrieve stock data from Snaptrade
  if (user.snaptrade_user_secret) {
    try {
      holdings = await getSnaptradeHoldings();
      if (holdings) {
        for (const position of holdings.response.positions) {
          let ticker = position.symbol.symbol.symbol;
          const stockName = position.symbol.symbol.description;
          const units = position.units;

          if (ticker === "CGG.PA") {
            ticker = "VIRI.PA";
          }

          stocks.push({ ticker, stockName, units });
        }
      }
    } catch (error) {
      console.error("Snaptrade fetching Failure:", error);
    }
  }

  // Retrieve manually entered stocks
  if (user.portfolio.length > 0) {
    try {
      const manualHoldings = user.portfolio.map((item) => ({
        ticker: item.ticker,
        units: item.units,
      }));

      for (const position of manualHoldings) {
        let ticker = position.ticker;
       
        const units = position.units;
        const stockName = ticker; // TODO: getStockName for each ticker

        if (ticker === "CGG.PA") {
          ticker = "VIRI.PA";
        }

        stocks.push({ ticker, stockName, units });
      }
    } catch (error) {
      console.error("Failed to retrieve manually entered stocks:", error);
    }
  }

  // Process stock metrics
  if (stocks.length > 0) {
    for (let stock of stocks) {
      await processStockMetrics(stock);
    }
  }

  return stocks;
}

async function processStockMetrics(stock) {
  let stockInDb = null;
  try {
    stockInDb = await Stock.findOne({ ticker: stock.ticker });
  } catch (error) {
    console.log("Failed to fetch stock from database:", error);
  }

  if (stockInDb) {
    await updateExistingStock(stock, stockInDb);
  } else {
    await createNewStock(stock);
  }
}

async function updateExistingStock(stock, stockInDb) {
  const lastDateTime = stockInDb.dateTime;
  const currentDateTime = new Date();
  const diff = Math.abs(currentDateTime - lastDateTime) / 60000;

  if (diff > 30 || !lastDateTime) {
    await appendYahooMetrics(stock);
    const updatedStock = sanitizeStockData(stock);

    try {
      await stockInDb.updateOne(updatedStock);
      console.log(`${stock.ticker}: Data was too old, datetime updated in the database.`);
    } catch (error) {
      console.log("Update operation failed:", error);
    }
  } else {
    Object.assign(stock, pick(stockInDb, [
      'currentPrice', 'percentChange', 'divYield', 'eps', 'peRatio',
      'priceEPS', 'priceToBook', 'dateTime', 'currency', 'totalValue',
      'sharesOutstanding', 'bookValue'
    ]));
  }
}

async function createNewStock(stock) {
  await appendYahooMetrics(stock);
  const newStockData = sanitizeStockData(stock);

  const newStock = new Stock(newStockData);
  try {
    await newStock.save();
  } catch (error) {
    console.log("Failed to save new stock to database:", error);
  }
}

function sanitizeStockData(stock) {
  const fields = [
    'totalValue', 'currentPrice', 'percentChange', 'divYield', 'eps',
    'peRatio', 'priceEPS', 'priceToBook', 'sharesOutstanding', 'bookValue'
  ];

  return fields.reduce((acc, field) => {
    acc[field] = isNaN(stock[field]) ? 0 : stock[field];
    return acc;
  }, { ...stock });
}
