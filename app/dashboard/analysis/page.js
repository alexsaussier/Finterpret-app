import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import StockCard from "@/components/StockCard";
import getStats from "@/utils/getStats";
import { getSnaptradeHoldings } from "@/utils/getSnaptradeHoldings";
import ButtonSnaptrade from "@/components/ButtonSnaptrade";
import StockAnalyticsCard from "@/components/StockAnalyticsCard";
import StockAnalyticsDash from "@/components/StockAnalyticsDash";
import { mockPositions } from "@/utils/mockData";
import { pick } from 'lodash';



export default async function AnalyticsDashboard(req, res) {


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


  let selectedStock = null; //This will be used to retrieve the right analytics for the selected stock


  const snaptradeHoldings = await getSnaptradeHoldings();
  
 


  if (snaptradeHoldings) {
    //balances = snaptradeHoldings.balances;
    //stocks = snaptradeHoldings.response.positions;
    //options = snaptradeHoldings.response.option_positions;
    //orders = snaptradeHoldings.response.orders;
    const portfolioValue = snaptradeHoldings.response.total_value.value;
    const portfolioCurrency = snaptradeHoldings.response.total_value.currency;

    totalValue = { portfolioValue, portfolioCurrency };

    //Get the ticker (the 3-letter symbol of the stock) of each stock in my portfolio + the quantity
    for (const position of snaptradeHoldings.response.positions) {
      var ticker = position.symbol.symbol.symbol;
      const stockName = position.symbol.symbol.description;
      const units = position.units;
      const price = position.price;
      const delta = position.open_pnl;
      const currency = position.symbol.symbol.currency.code;

      if (ticker === "CGG.PA") {
        ticker = "VIRI.PA";
        //because company just changed name and brokers can use the previous name
      }
      stocks.push({ stockName, ticker, units, price, delta, currency });
    }
  }

  if (user.portfolio){
    console.log("User has manually entered stocks")
    // Retrieve all tickers
    manualHoldings = user.portfolio.map(item => ({
      ticker: item.ticker,
      units: item.units
    }));

    for(const position of manualHoldings){
      let ticker = position.ticker;
      const units = position.units;

      const stockName = ticker; //to change

    if (ticker === "CGG.PA") {
      ticker = "VIRI.PA";
      //because company just changed name and brokers can use the previous name
    }

    stocks.push({ ticker, units });
    }

  }

  console.log("stocks in analytics dashboard: ", stocks);



// OPTIONS
/*
    for (const option_position of snaptradeHoldings.response.option_positions) {
      const ticker = option_position.symbol.symbol.symbol;
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
    }*/


  return (
    <main className="flex-1 pb-24">
      <section className="max-w-xl space-y-8">
        <h1 className="text-l md:text-xl font-bold text-left">
          Analysis of your porfolio components
        </h1>

        {stocks ? (
          <>
            {/* I had to create another custom component, because we need a CLIENT component for setting stock ticker on click */}
            <StockAnalyticsDash stocks={stocks} //userId={userId} userSecret={userSecret} accountId={accountId} user={userProps} 
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
