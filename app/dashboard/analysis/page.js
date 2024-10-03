import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import { processStockData } from "@/utils/processStockData"; // Add this import
import ButtonSnaptrade from "@/components/ButtonSnaptrade";
import StockAnalyticsDash from "@/components/StockAnalyticsDash";
// Remove unused imports

export default async function AnalyticsDashboard() {
  await connectMongo();
  const session = await getServerSession(authOptions);
  const user = await User.findById(session.user.id);
  
  // Replace all the stock processing logic with this single line
  const stocks = await processStockData(user);

  // The rest of the component remains largely the same
  return (
    <main className="flex-1 pb-24">
      <section className="max-w-xl space-y-8">
        <h1 className="text-l md:text-xl font-bold text-left">
          Analysis of your portfolio components
        </h1>

        {stocks.length > 0 ? (
          <StockAnalyticsDash stocks={stocks} />
        ) : (
          <>
            <p>Uh-oh! Please complete the importing of your portfolio in the main dashboard. </p>
            <ButtonSnaptrade
              title="Import a Portfolio"
              snaptrade_user_secret={user.snaptrade_user_secret}
            />
          </>
        )}
      </section>
    </main>
  );
}
