import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import StockCard from "@/components/StockCard";
import getStats from "@/utils/getStats";
import { getHoldings } from "@/utils/getHoldings";
import ButtonSnaptrade from "@/components/ButtonSnaptrade";

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
      const ticker = position.symbol.symbol.symbol;
      const stockName = position.symbol.symbol.description;
      const units = position.units;

      stocks.push({ stockName, ticker, units });
    }

    for (const option_position of holdings.response.option_positions) {
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
    }
  }

  return (
    <main className="flex-1 pb-24">
      <section className="max-w-xl space-y-8">
        <h1 className="text-l md:text-xl font-bold text-left">
          Analysis of your porfolio components
        </h1>

        {holdings ? (
          <>
            {stocks.map((stock, index) => (
              <button onClick={getStats(stock.ticker)} key={stock.stockName}>
                <StockCard title={stock.stockName} units={stock.units} />
              </button>
            ))}
          </>
        ) : (
          <>
            <p>Uh-oh! Please complete the importing of your portfolio. </p>
            {!accountId && (
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
