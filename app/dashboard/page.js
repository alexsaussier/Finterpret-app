import { getServerSession, getSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import AssetLayout from "@/components/AssetLayout";
import DashboardCollapse from "@/components/DashboardCollapse";
import DashboardCollapseValue from "@/components/DashboardCollapseValue";
import ButtonSnaptrade from "@/components/ButtonSnaptrade";
import { getSnaptradeHoldings } from "@/utils/getSnaptradeHoldings";
import { listAccounts } from "@/utils/listAccounts";
import getStats from "@/utils/getStats";
import { separateCallsAndPuts } from "@/utils/separateCallsPuts";
import "./dashboard.css";
import getPortfolioData from "@/utils/getPortfolioData";
import getPrice from "@/utils/getPrice";
import { AddToPortfolioSampleComponent } from "@/components/AddToPortfolioSampleComponent";
import Stock from "@/models/Stock";
import appendYahooMetrics from "@/utils/appendYahooMetrics";
import { PortfolioAnalysis } from "@/components/PortfolioAnalysis";
import ButtonSnaptradeDelete from "@/components/ButtonSnaptradeDelete";
import DashboardCollapseStock from "@/components/DashboardCollapseStock";

export default async function Dashboard() {
  await connectMongo();
  const session = await getServerSession(authOptions);
  const user = await User.findById(session.user.id);
  const userId = user.id;
  const userSecret = user.snaptrade_user_secret;
  const accountId = user.portfolioAccountId;
  let portfolioCurrency = "$";
  let portfolioValue = null;
  let stocks = [];
  let options = [];
  let holdings = null;
  let SharpeRatio = 0.8;
  let connectedBrokers = "";
  let manualHoldings = [];
  let averagePeRatio = "N/A";
  let averageEps = "N/A";
  let averageDivYield = "N/A";

  // First, retrieve stock data from snaptrade
  if (userSecret) {
    try {
      // Retrieve connected broker accounts
      const listAccountsResponse = await listAccounts(userId, userSecret);

      connectedBrokers = listAccountsResponse.response.map(
        (account) => account.institution_name
      );

      // Then, fetch all stocks for this account ID
      holdings = await getSnaptradeHoldings();
    } catch {
      console.error(
        "Snaptrade fetching Failure: User has a userSecret for Snaptrade but failed to fetch either accounts or holdings"
      );
    }

    // retrieve stocks through snaptrade
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
    if (manualHoldings){
      for(const position of manualHoldings){
        let ticker = position.ticker;

        if (ticker.endsWith(".PAR")) {
          ticker = ticker.slice(0, -1);
        }
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
      // Check if stock is in db  and if current datetime and last datetime is more than 30 minutes, update the stock metrics in db
      let stockInDb = null;

      try {
        stockInDb = await Stock.findOne({ ticker: stock.ticker });
      } catch {
        console.log("Failed to fetch stock from database: " + stock.ticker);
      }

      if (stockInDb) {
        const lastDateTime = stockInDb.dateTime;
        const currentDateTime = new Date();
        const diff = Math.abs(currentDateTime - lastDateTime) / 60000; // difference in minutes

        if (diff > 30 || !lastDateTime) {
          // Data is too old, fetch from yahoo
          await appendYahooMetrics(stock);

          console.log("Refetching stock data" + stock.ticker);

          await stockInDb.updateOne(stock);
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
        }
      } else {
        // Store stock in mongodb using Stock mongoose model

        await appendYahooMetrics(stock);

        const newStock = new Stock(stock);
        await newStock.save();
      }
    }
  }

  // OPTIONS

  /*for (const option_position of holdings.response.option_positions) {
      const ticker = option_position.symbol.symbol.raw_symbol;
      const stockName = option_position.symbol.symbol.description;
      const quantity = option_position.units;

      const strikePrice = option_position.symbol.option_symbol.strike_price;
      const expirationDate =
        option_position.symbol.option_symbol.expiration_date;
      const optionType = option_position.symbol.option_symbol.option_type;

      options.push({
        stockName,
        ticker,
        quantity,
        strikePrice,
        expirationDate,
        optionType,
      });
    }  */

  //retrieve manually entered stocks
  //let { calls, puts } = separateCallsAndPuts(options);

  console.log(stocks)

  try {
    portfolioValue = getPortfolioData.calculateTotalPortfolioValue(stocks);
  } catch (e) {
    console.error("Failed to fetch portfolio value: ", e);
  }

  // Calculate portfolio average PE ratio
  try{
    averagePeRatio = getPortfolioData.calculateAverage(
    "peRatio",
    stocks,
    portfolioValue
  );
  } catch(e){
    console.log("Failed to calculate average PE ratio: " + e)
  }
  
  averageEps = getPortfolioData.calculateAverage("eps", stocks, portfolioValue);
  averageDivYield = getPortfolioData.calculateAverage(
    "divYield",
    stocks,
    portfolioValue
  );

  // Calculate percentage of profitable companies
  const percentageProfitable = getPortfolioData.countPositives(
    "peRatio",
    stocks
  );
  const percentageDividend = getPortfolioData.countPositives(
    "divYield",
    stocks
  );

  const portfolioGeneralData = {
    totalValue: portfolioValue,
    peRatio: averagePeRatio,
    eps: averageEps,
    divYield: averageDivYield,
    profitable: percentageProfitable,
    dividendPaying: percentageDividend,
  };
  
  console.log(portfolioGeneralData);

  //------

  return (
    <main className="dashboardWrapper">
      {
        //<FetchHoldings userId={userId} snaptrade_user_secret={userSecret} accountId={accountId}/>
      }

      <section className="space-y-4">
        <div className="bg-white rounded-lg p-5 shadow-md">
          <h1 className="text-lg md:text-xl font-bold text-left mb-2">
            Dashboard
          </h1>

          <div className="flex flex-row gap-2">
            <p className="mb-2">
              Welcome {user.name} {user.email} 👋
            </p>

            <div className="flex flex-col gap-2">
              {connectedBrokers && (
                <p>Connected account(s): {connectedBrokers}</p>
              )}
              {userSecret && (
                <div className="mb-4">
                  <ButtonSnaptradeDelete />
                </div>
              )}
            </div>
          </div>

          {!userSecret && (
            <div className="mb-4">
              <div className="flex flex-row gap-1">
                <p className="mb-2 font-semibold">
                  Coming soon for premium users:{" "}
                </p>
                <p>Update your portfolio automatically in real time using </p>
                <a
                  href="https://snaptrade.com/brokerage-integrations"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 hover:text-blue-700 underline"
                >
                  <p className="font-semibold">Snaptrade integrations</p>
                </a>
              </div>

              <ButtonSnaptrade
                title="Import a Portfolio"
                snaptrade_user_secret={userSecret}
              />
            </div>
          )}
        </div>

        <AddToPortfolioSampleComponent />

        {portfolioGeneralData && stocks.length > 0 ? (
          <PortfolioAnalysis portfolioGeneralData={portfolioGeneralData} />
        ) : (
          <div>
            Add holdings to your portfolio, so we can generate some insights.
          </div>
        )}

        <div className="relative">
          <div
            className={`dashboardPortfolio flex flex-row flex-nowrap gap-4  ${
              !stocks ? "blur-sm" : ""
            }`}
          >
            <div className="bg-white rounded-lg p-5 shadow-md w-full flex-col p-1">
              <h1 className="text-lg md:text-xl font-bold text-center mb-2">
                Your holdings
              </h1>

              {stocks.map((stocks, index) => (
                <DashboardCollapseStock
                  key={stocks.ticker}
                  title={stocks.ticker}
                  units={stocks.units}
                />
              ))}
            </div>

            {/* HIDING OPTIONS AND CRYPTO AS WE WILL NOT IMPLEMENT THIS IN MVP
    WE HAVE TO THINK ABOUT CRYPTO AND OPTIONS LATER, BECAUSE THE IMPORTANT METRICS FOR THESE ASSETS ARE DIFFERENT
            <DashboardCollapse title="Options">
              <p>
                <strong>Calls</strong>
              </p>
              {calls.map((call, index) => (
                <AssetLayout
                  key={call.symbol.id}
                  title={call.symbol.description}
                  units={call.units}
                />
              ))}
              <p>
                <strong>Puts</strong>
              </p>
              {puts.map((put, index) => (
                <AssetLayout
                  key={put.symbol.id}
                  title={put.symbol.description}
                  units={put.units}
                />
              ))}
            </DashboardCollapse>

            <DashboardCollapse title="Crypto">
              <AssetLayout title="BTC" units="100" />
              <AssetLayout title="ETH" units="100" />
              <AssetLayout title="DOGE" units="100" />
            </DashboardCollapse>
*/}

            <div className="bg-white rounded-lg p-5 shadow-md w-full flex-col p-1">
              <h1 className="text-lg md:text-xl font-bold text-center mb-2">
                Portfolio Report
              </h1>

              <DashboardCollapseValue
                title="Portfolio Value"
                units={portfolioValue + " " + portfolioCurrency}
              />
              <DashboardCollapseValue
                title="Average P/E Ratio (of profitable companies)"
                units={averagePeRatio}
              />
              <DashboardCollapseValue
                title="Average Earnings per Share (EPS - of profitable companies)"
                units={averageEps}
              />
              <DashboardCollapseValue
                title="Percentage of your portfolio companies that are profitable"
                units={percentageProfitable + "%"}
              />
              <DashboardCollapseValue
                title="Average dividend yield"
                units={averageDivYield}
              />
              <DashboardCollapseValue
                title="Percentage of your companies that pay dividend"
                units={percentageDividend + "%"}
              />

              {/* 
              <DashboardCollapseValue title="Sharpe Ratio"  units={SharpeRatio} />

              <DashboardCollapseValue title="Portfolio Beta" units="1.4" />

              <DashboardCollapseValue title="YoY Return" units={12} />
              */}
            </div>
          </div>
          {!stocks && (
            <div className="click-blocker absolute inset-0 z-10"></div>
          )}
        </div>
      </section>
    </main>
  );
}
