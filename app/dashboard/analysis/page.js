import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import { getSnaptradeHoldings } from "@/utils/getSnaptradeHoldings";
import ButtonSnaptrade from "@/components/ButtonSnaptrade";
import StockAnalyticsCard from "@/components/StockAnalyticsCard";
import StockAnalyticsDash from "@/components/StockAnalyticsDash";
import { pick } from 'lodash';
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
      console.error("Snaptrade fetching Failure: User has a userSecret for Snaptrade but failed to fetch either accounts or holdings");
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
  if (user.portfolio.length > 0){
    // Retrieve all tickers
    try{
      manualHoldings = user.portfolio.map(item => ({
      ticker: item.ticker,
      units: item.units
    }));
    } catch {
      console.error("Failed to retrieve manually entered stocks");
    }

    // If there are manually entered stocks, get the current price for each stock
    if (manualHoldings){
      for(const position of manualHoldings){
        let ticker = position.ticker;
        const units = position.units;
        
        // TO DO: getStockName for each ticker here
        const stockName = ticker; //to change
  
        if (ticker === "CGG.PA") {
          ticker = "VIRI.PA";
          //because company just changed name and brokers can use the previous name
        }

        stocks.push({ ticker: ticker, stockName: stockName, units: units});

      }
    }
  } 
  else {
    console.log("User has no manually entered holdings.");
  }

// ----------------- GET STOCK METRICS -----------------
  // -----------------------------------------------------
  if (stocks.length > 0) {
    
    // For all items in stocks array, fetch their metrics from the db or from yahoo

    for (var stock of stocks) {
    
      // Check if stock is in db and if current datetime and last datetime is more than 30 minutes, update the stock metrics in db
      let stockInDb = null;
      try{
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

          try{
            await stockInDb.updateOne(stock);
          } catch {
            console.log("operation failed, please go to  main dashboard and try again");
          }

          console.log(stock.ticker + `: Data was too old, datetime updated in the database.`);

        } else{
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

        }
      } else{
        // Store stock in mongodb using Stock mongoose model
        await appendYahooMetrics(stock);

        const newStock = new Stock(stock);
        await newStock.save();

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
            <StockAnalyticsDash stocks={stocks} 
            />
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
