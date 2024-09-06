import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import { getSnaptradeHoldings } from "@/utils/getSnaptradeHoldings";
import ButtonSnaptrade from "@/components/ButtonSnaptrade";
import StockAnalyticsCard from "@/components/StockAnalyticsCard";
import StockAnalyticsDash from "@/components/StockAnalyticsDash";
import { pick } from "lodash";
import getPrice from "@/utils/getPrice";
import Stock from "@/models/Stock";
import appendYahooMetrics from "@/utils/appendYahooMetrics";

export default async function AnalyticsDashboard() {
  await connectMongo();
  const session = await getServerSession(authOptions);
  const user = await User.findById(session.user.id);
  const userId = user.id;
  const userSecret = user.snaptrade_user_secret;
  const accountId = user.portfolioAccountId;
  let balances = [];
  let stocks = [];
  let options = [];
  let orders = [];
  let totalValue = [];
  let manualHoldings = [];
  let holdings = null;
  let portfolioCurrency = null;

  // First, retrieve stock data from snaptrade
  if (userSecret) {
    try {
      // Then, fetch all stocks for this account ID
      holdings = await getSnaptradeHoldings();
    } catch {
      console.error(
        "Snaptrade fetching Failure: User has a userSecret for Snaptrade but failed to fetch either accounts or holdings"
      );
    }

    // retrieve stocks through snaptrade
    if (holdings) {
      //Get the ticker (the 3-letter symbol of the stock) of each stock in my portfolio + the quantity
      for (const position of holdings.response.positions) {
        let ticker = position.symbol.symbol.symbol;
        const stockName = position.symbol.symbol.description;
        const units = position.units;

        if (ticker === "CGG.PA") {
          ticker = "VIRI.PA";
          //because company just changed name and brokers can use the previous name
        }

        stocks.push({ ticker: ticker, stockName: stockName, units: units });
      }
    }
  } else {
    console.log("User is not connected to Snaptrade - no userSecret");
  }

  // Retrieve manually entered stocks
  if (user.portfolio.length > 0) {
    // Retrieve all tickers
    try {
      manualHoldings = user.portfolio.map((item) => ({
        ticker: item.ticker,
        units: item.units,
      }));
    } catch {
      console.error("Failed to retrieve manually entered stocks");
    }

    // If there are manually entered stocks, get the current price for each stock
    if (manualHoldings) {
      for (const position of manualHoldings) {
        let ticker = position.ticker;

        //if the ticker ends with ".XXX", strip out the last char so it fits the yahoo finance api that only takes 2 letters after the .
        if (ticker.match(/\.[A-Z]{3}$/)) {
          ticker = ticker.slice(0, -1);
        }

        const units = position.units;

        // TO DO: getStockName for each ticker here
        const stockName = ticker; //to change

        if (ticker === "CGG.PA") {
          ticker = "VIRI.PA";
          //because company just changed name and brokers can use the previous name
        }

        stocks.push({ ticker: ticker, stockName: stockName, units: units });
      }
    }
  } else {
    console.log("User has no manually entered holdings.");
  }

  // ----------------- GET STOCK METRICS -----------------
  // -----------------------------------------------------
  if (stocks.length > 0) {
    // For all items in stocks array, fetch their metrics from the db or from yahoo

    for (var stock of stocks) {
      // Check if stock is in db and if current datetime and last datetime is more than 30 minutes, update the stock metrics in db
      let stockInDb = null;
      try {
        stockInDb = await Stock.findOne({ ticker: stock.ticker });
      } catch {
        console.log("Failed to fetch stock from database");
      }

      if (stockInDb) {
        const lastDateTime = stockInDb.dateTime;
        const currentDateTime = new Date();
        const diff = Math.abs(currentDateTime - lastDateTime) / 60000; // difference in minutes

        if (diff > 30 || !lastDateTime) {
          // Data is too old, fetch from yahoo
          await appendYahooMetrics(stock);

          // Handle NaN values
          const updatedStock = {
            ...stock,
            totalValue: isNaN(stock.totalValue) ? 0 : stock.totalValue,
            currentPrice: isNaN(stock.currentPrice) ? 0 : stock.currentPrice,
            percentChange: isNaN(stock.percentChange) ? 0 : stock.percentChange,
            divYield: isNaN(stock.divYield) ? 0 : stock.divYield,
            eps: isNaN(stock.eps) ? 0 : stock.eps,
            peRatio: isNaN(stock.peRatio) ? 0 : stock.peRatio,
            priceEPS: isNaN(stock.priceEPS) ? 0 : stock.priceEPS,
            priceToBook: isNaN(stock.priceToBook) ? 0 : stock.priceToBook,
            sharesOutstanding: isNaN(stock.sharesOutstanding) ? 0 : stock.sharesOutstanding,
            bookValue: isNaN(stock.bookValue) ? 0 : stock.bookValue,
          };

          try {
            await stockInDb.updateOne(updatedStock);
          } catch (error) {
            console.log(
              "Update operation failed, please go to main dashboard and try again",
              error
            );
          }

          console.log(
            stock.ticker +
              `: Data was too old, datetime updated in the database.`
          );
        } else {
          // We have recent data in db, no need to fetch from yahoo
          stock.currentPrice = stockInDb.currentPrice;
          stock.percentChange = stockInDb.percentChange;
          stock.divYield = stockInDb.divYield;
          stock.eps = stockInDb.eps;
          stock.peRatio = stockInDb.peRatio;
          stock.priceEPS = stockInDb.priceEPS;
          stock.priceToBook = stockInDb.priceToBook;
          stock.dateTime = stockInDb.dateTime;
          stock.currency = stockInDb.currency;
          stock.totalValue = stockInDb.totalValue;
          stock.sharesOutstanding = stockInDb.sharesOutstanding; 
          stock.bookValue = stockInDb.bookValue;


        }
      } else {
        // Store stock in mongodb using Stock mongoose model
        await appendYahooMetrics(stock);

        // Handle NaN values before saving
        const newStockData = {
          ...stock,
          totalValue: isNaN(stock.totalValue) ? 0 : stock.totalValue,
          currentPrice: isNaN(stock.currentPrice) ? 0 : stock.currentPrice,
          percentChange: isNaN(stock.percentChange) ? 0 : stock.percentChange,
          divYield: isNaN(stock.divYield) ? 0 : stock.divYield,
          eps: isNaN(stock.eps) ? 0 : stock.eps,
          peRatio: isNaN(stock.peRatio) ? 0 : stock.peRatio,
          priceEPS: isNaN(stock.priceEPS) ? 0 : stock.priceEPS,
          priceToBook: isNaN(stock.priceToBook) ? 0 : stock.priceToBook,
          sharesOutstanding: isNaN(stock.sharesOutstanding) ? 0 : stock.sharesOutstanding,
          bookValue: isNaN(stock.bookValue) ? 0 : stock.bookValue,
        };

        const newStock = new Stock(newStockData);
        try {
          await newStock.save();
        } catch (error) {
          console.log("Failed to save new stock to database", error);
        }
      }
    }
    console.log("Stocks array: ", stocks);
  }

  return (
    <main className="flex-1 pb-24">
      <section className="max-w-xl space-y-8">
        <h1 className="text-l md:text-xl font-bold text-left">
          Analysis of your porfolio components
        </h1>

        {stocks ? (
          <>
            <StockAnalyticsDash stocks={stocks} />
          </>
        ) : (
          <>
            <p>Uh-oh! Please complete the importing of your portfolio. </p>
            {!stocks && (
              <ButtonSnaptrade
                title="Import a Portfolio"
                snaptrade_user_secret={userSecret}
              />
            )}
          </>
        )}
      </section>
    </main>
  );
}
