import { getServerSession, getSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import apiClient from "@/libs/api";
import User from "@/models/User";
import AssetLayout from "@/components/AssetLayout";
import DashboardCollapse from "@/components/DashboardCollapse";
import DashboardCollapseValue from "@/components/DashboardCollapseValue";
import ButtonSnaptrade from "@/components/ButtonSnaptrade";
import { getHoldings } from "@/utils/getHoldings";
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
import { sendOpenAi } from "@/libs/gpt";
//

export default async function Dashboard() {
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

  let SharpeRatio = 0;

  //retrieve the name of the broker to which we are connected
  const listAccountsResponse = await listAccounts(userId, userSecret);
  const connectedBrokers = listAccountsResponse.response.map(account => account.institution_name);

  //save this portfolio account ID to the user

  // Then, fetch all stocks for this account ID
  const holdings = await getHoldings(userId, userSecret, accountId, user);

  if (holdings) {
    balances = holdings.balances;
    //stocks = holdings.response.positions;
    //options = holdings.response.option_positions;
    //orders = holdings.response.orders;
    const portfolioValue = holdings.response.total_value.value;
    const portfolioCurrency = holdings.response.total_value.currency;

    totalValue = { portfolioValue, portfolioCurrency };

    //Get the ticker (the 3-letter symbol of the stock) of each stock in my portfolio + the quantity
    for (const position of holdings.response.positions) {
      const ticker = position.symbol.symbol.raw_symbol;
      const stockName = position.symbol.symbol.description;
      const units = position.units;

      stocks.push({ stockName, ticker, units });
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

  }

  
  let { calls, puts } = separateCallsAndPuts(options);
 

  console.log("stocks: ", stocks);
  console.log(totalValue);

  //------

  return (
    <main className="dashboardWrapper">
      {
        //<FetchHoldings userId={userId} snaptrade_user_secret={userSecret} accountId={accountId}/>
      }

      <section className="space-y-4">
        <div className="dashboardCard">
          <h1 className="text-lg md:text-xl font-bold text-left">Dashboard</h1>
          <p>
            Welcome {user.name}
            {user.email} 👋
          </p>
          <p>Connected account(s): {connectedBrokers}</p>
          {/* <p>Positions in your portfolio: {stocks}</p> */}
          {
            //If there is no account ID, show the button to import a portfolio
          }
          {!accountId && (
            <ButtonSnaptrade
              title="Import a Portfolio"
              snaptrade_user_secret={userSecret}
            />
          )}
        </div>
        <div className="dashboardPortfolio flex flex-row flex-nowrap gap-4">
          <div className="dashboardCard w-full flex-col p-1">
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
          </div>


          <div className="dashboardCard w-full flex-col p-1">
            <h1 className="text-lg md:text-xl font-bold text-center mb-2">
              Portfolio Report
            </h1>

            <DashboardCollapseValue title="Portfolio Value" units={totalValue.portfolioValue + " " + totalValue.portfolioCurrency}/>

            <DashboardCollapseValue title="Sharpe Ratio" units={SharpeRatio}/>

            <DashboardCollapseValue title="Portfolio Beta" units="1.4"/>

            <DashboardCollapseValue title="YoY Return" units={12}/>
          </div>
        </div>
      </section>
    </main>
  );
}
