import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import ButtonGradient from "@/components/ButtonGradient";
import StockCard from "@/components/StockCard"

async function getStats(ticker) {
    // API CALL to retrieve stock metrics
    // BETA, EPS, P/E, 
}

export default async function AnalysisDashboard() {
  await connectMongo();
  const session = await getServerSession(authOptions);
  const user = await User.findById(session.user.id);

  const stocks = ''; // import user porfolio data that is fetched in main dashboard

  

  return (
    <main className="flex-1 pb-24">
      <section className="max-w-xl space-y-8">
        <h1 className="text-l md:text-xl font-bold text-left">
          Analysis of your porfolio components
        </h1>
        

        {stocks.map((stocks, index) => (
          <button onClick={getStats(stocks.ticker)} key={stocks.stockName}>
                <StockCard
                  title={stocks.stockName}
                  units={stocks.units}
                />
          </button>

              ))}
      </section>
    </main>
  );
}

