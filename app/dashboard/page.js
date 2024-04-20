import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";

export default async function Dashboard() {
  await connectMongo();
  const session = await getServerSession(authOptions);
  const user = await User.findById(session.user.id);

  return (
    <main className="flex-1 pb-24">
      <section className="space-y-4">
        <h1 className="text-l md:text-xl font-bold text-left">
          Dashboard
        </h1>
        <p>Welcome {user.name}{user.email} 👋</p>

        <div className="flex flex-row flex-nowrap gap-4">
          <div className="w-full border rounded border-neutral border-solid flex-col p-1">
            <h1 className="">
              Your holdings
            </h1>
            <div className="collapse bg-base-200 hover:bg-secondary mb-1">
              <input type="checkbox" /> 
              <div className="collapse-title font-small">
                Stocks
              </div>
              <div className="collapse-content"> 
                <p>Tesla</p>
              </div>
            </div>
            
            <div className="collapse bg-base-200 mb-1">
              <input type="checkbox" /> 
              <div className="collapse-title font-small">
                Options
              </div>
              <div className="collapse-content"> 
                <p>Calls</p>
                <p>Puts</p>
              </div>
            </div>
            
            <div className="collapse bg-base-200 mb-1">
              <input type="checkbox" /> 
              <div className="collapse-title font-small">
                Crypto
              </div>
              <div className="collapse-content"> 
                <p>BTC</p>
              </div>
            </div>
          </div>


          <div className="w-full border rounded border-neutral border-solid flex-col p-1">
            <h1 className="">
              Portfolio Report
            </h1>
            
            <div className="collapse bg-base-200 mb-1">
              <input type="checkbox" /> 
              <div className="collapse-title font-small">
                Sharpe Ratio
              </div>
              <div className="collapse-content"> 
                <p>AI-generated explanation</p>
              </div>
            </div>

            <div className="collapse bg-base-200 mb-1">
              <input type="checkbox" /> 
              <div className="collapse-title font-small">
                Portfolio Beta
              </div>
              <div className="collapse-content"> 
                <p>AI-generated explanation</p>
              </div>
            </div>

            <div className="collapse bg-base-200 mb-1">
              <input type="checkbox" /> 
              <div className="collapse-title font-small">
                YoY Return
              </div>
              <div className="collapse-content"> 
                <p>AI-generated explanation</p>
              </div>
            </div>
          </div>
        </div>

      </section>
    </main>
  );
}

