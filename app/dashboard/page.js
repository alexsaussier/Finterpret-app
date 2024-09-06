import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import { processStockData } from "@/utils/processStockData";
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
import Link from 'next/link';

export default async function Dashboard() {
  await connectMongo();
  const session = await getServerSession(authOptions);
  const user = await User.findById(session.user.id);

  const stocks = await processStockData(user);

  const userId = user.id;
  const userSecret = user.snaptrade_user_secret;
  const accountId = user.portfolioAccountId;
  let portfolioCurrency = "$";
  let portfolioValue = null;
  let options = [];
  let holdings = null;
  let SharpeRatio = 0.8;
  let connectedBrokers = "";
  let manualHoldings = [];
  let averagePeRatio = "N/A";
  let averageEps = "N/A";
  let averageDivYield = "N/A";

  // Retrieve connected broker accounts
  if (userSecret) {
    try {
      const listAccountsResponse = await listAccounts(userId, userSecret);
      connectedBrokers = listAccountsResponse.response.map(
        (account) => account.institution_name
      );
    } catch (error) {
      console.error("Failed to fetch connected broker accounts:", error);
    }
  }

  console.log(stocks);

  try {
    portfolioValue = getPortfolioData.calculateTotalPortfolioValue(stocks);
  } catch (e) {
    console.error("Failed to fetch portfolio value: ", e);
  }

  // Calculate portfolio average PE ratio
  try {
    averagePeRatio = getPortfolioData.calculateAverage(
      "peRatio",
      stocks,
      portfolioValue
    );
  } catch (e) {
    console.log("Failed to calculate average PE ratio: " + e);
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
          <div></div>
        )}

        <div className="relative">
          <div
            className={`dashboardPortfolio flex flex-row flex-nowrap gap-4  ${
              !stocks ? "blur-sm" : ""
            }`}
          >
            <div className="bg-white rounded-lg p-5 shadow-md w-full flex-col p-1">
              <div className="flex justify-between items-center mb-1">
                <h1 className="text-lg md:text-xl font-bold">
                  Your holdings
                </h1>

                <div className="flex justify-between items-center">
                  <div>{/* empty div to push to the  */}</div> 
                  <div className="badge badge-neutral badge-outline">Click on a stock to discover more</div>
                </div>
                
                
              </div>
              
              <div className="mb-4">
                <Link href="/dashboard/analysis" passHref>
                  <button className="btn btn-xs btn-primary">
                    View individual stock analysis
                  </button>
                </Link>
              </div>
              
             

              {stocks.length > 0 ? (
                stocks.map((stock, index) => (
                  <DashboardCollapseStock
                    key={stock.ticker}
                    title={stock.ticker}
                    units={stock.units}
                  />
                ))
              ) : (
                <div className="flex justify-center align-top" style={{ minHeight: "500px" }}>
                  Your stocks will be displayed here. 
                </div>
              )}
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
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg md:text-xl font-bold">Portfolio Report</h1>
                <div className="badge badge-neutral badge-outline">Click on a metric to get insights</div>
              </div>

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
