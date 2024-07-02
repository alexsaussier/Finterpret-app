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
import {
  mockBalances,
  mockOption_positions,
  mockOrders,
  mockPositions,
  mockTotalValue,
} from "@/utils/mockData";
import { separateCallsAndPuts } from "@/utils/separateCallsPuts";
import "./dashboard.css";
import getPortfolioData from "@/utils/getPortfolioData";
import getPrice from "@/utils/getPrice";
import { AddToPortfolioSampleComponent } from "@/components/AddToPortfolioSampleComponent";

export default async function Dashboard() {
  await connectMongo();
  const session = await getServerSession(authOptions);
  const user = await User.findById(session.user.id);
  const userId = user.id;
  const userSecret = user.snaptrade_user_secret;
  const accountId = user.portfolioAccountId;
  let portfolioCurrency = "$";
  let portfolioValue = null;
  let balances = [];
  let stocks = [];
  let options = [];
  let orders = [];
  let holdings = null;
  let SharpeRatio = 0.8;
  let connectedBrokers = "";
  let manualHoldings = []


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
      console.error("Snaptrade fetching Failure: User has a userSecret for Snaptrade but failed to fetch either accounts or holdings");
    } 

    // retrieve stocks through snaptrade
    if (holdings) {
      //stocks = holdings.response.positions;
      //options = holdings.response.option_positions;
      //orders = holdings.response.orders;

      portfolioCurrency = holdings.response.total_value.currency;

      //Get the ticker (the 3-letter symbol of the stock) of each stock in my portfolio + the quantity
      for (const position of holdings.response.positions) {
        let ticker = position.symbol.symbol.symbol;
        const stockName = position.symbol.symbol.description;
        const units = position.units;

        if (ticker === "CGG.PA") {
          ticker = "VIRI.PA";
          //because company just changed name and brokers can use the previous name
        }

        // Get the current price for each stock and store in stocks array
        const response = await getPrice(ticker); 

        if (response && response.data) {
          const currentPrice = response.data.regularMarketPrice.raw;
          stocks.push({ stockName, ticker, units, currentPrice });

        } else {
          console.error(`Failed to fetch price for ticker: ${ticker}`);
          stocks.push({ stockName, ticker, units, currentPrice: 0 });
        }
      }
    }

  } else {
    console.error("User is not connected to Snaptrade - no userSecret");
  }



  // Retrieve manually entered stocks
  if (user.portfolio){
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
    
  
        const response = await getPrice(ticker); // Fetch stock stats
      
        if (response && response.data) {
        const currentPrice = response.data.regularMarketPrice.raw;
        stocks.push({ stockName, ticker, units, currentPrice });

        } else {
          console.error(`Failed to fetch price for ticker: ${ticker}`);
          stocks.push({ stockName, ticker, units, currentPrice: 0 });
        }
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


  try {
    portfolioValue = getPortfolioData.calculateTotalPortfolioValue(stocks);
  } catch (e) {
    console.error("Failed to fetch portfolio value: ", e);
  }

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
          <p className="mb-2">
            Welcome {user.name} {user.email} 👋
          </p>
          {connectedBrokers && <p>Connected account(s): {connectedBrokers}</p>}
          {
            //If there is no account ID, show the button to import a portfolio
          }

          {!accountId && (
            <div className="mb-4">
              <p className="mb-2">Start by importing your portfolio👇</p>

              <ButtonSnaptrade
                title="Import a Portfolio"
                snaptrade_user_secret={userSecret}
              />
            </div>
          )}
        </div>

        <AddToPortfolioSampleComponent />


        <div className="bg-white rounded-lg p-5 shadow-md relative">
          <h1 className="text-lg md:text-xl font-bold text-left">
            General Portfolio Analysis and Advice
          </h1>

          <div className="relative">
            <div className="blur-sm flex flex-col">
              <p>Your blurred content goes here</p>
              <p>Your blurred content goes here</p>
              <p>Your blurred content goes here</p>
              <p>Your blurred content goes here</p>
            </div>
            <div className="absolute flex flex-col top-0 left-0 right-0 bottom-0 bg-white bg-opacity-70 flex justify-center items-center text-black font-bold">
              Get gold to see your portfolio report and access tailored advice
              <a
                href="http://localhost:3000/#pricing"
                className="btn btn-primary"
              >
                Get Gold
              </a>
            </div>
          </div>
        </div>

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

              <DashboardCollapse title="Stocks">
                {stocks.map((stocks, index) => (
                  <AssetLayout
                    key={stocks.stockName}
                    title={stocks.stockName}
                    units={stocks.units}
                  />
                ))}
              </DashboardCollapse>
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
                title="Sharpe Ratio"
                units={SharpeRatio}
              />

              <DashboardCollapseValue title="Portfolio Beta" units="1.4" />

              <DashboardCollapseValue title="YoY Return" units={12} />
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
