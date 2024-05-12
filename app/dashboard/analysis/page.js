import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import StockCard from "@/components/StockCard"
import getStats from "@/utils/getStats"


export default async function AnalyticsDashboard() {
  await connectMongo();
  const session = await getServerSession(authOptions);
  const user = await User.findById(session.user.id);

  // import user porfolio data that is fetched in main dashboard
  const stocks = [
    {ticker: 'TSLA', stockName: 'Tesla', units: 100},
    {ticker: 'AMZN', stockName: 'Amazon', units: 100},

  ]; 

  

  return (
    <main className="flex-1 pb-24">
      <section className="max-w-xl space-y-8">
        <h1 className="text-l md:text-xl font-bold text-left">
          Analysis of your porfolio components
        </h1>
        

        {stocks.map((stock, index) => (
          <button onClick={getStats(stock.ticker)} key={stock.stockName}>
                <StockCard
                  title={stock.stockName}
                  units={stock.units}
                />
          </button>

              ))}
      </section>
    </main>
  );
}

