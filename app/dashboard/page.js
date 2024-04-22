import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import AssetLayout from "@/components/AssetLayout";
import DashboardCollapse from "@/components/DashboardCollapse";
import DashboardCollapseValue from "@/components/DashboardCollapseValue";
import ButtonGradient from '@/components/ButtonGradient';
import ButtonSnaptrade from "@/components/ButtonSnaptrade";


export default async function Dashboard() {
  await connectMongo();
  const session = await getServerSession(authOptions);
  const user = await User.findById(session.user.id);

  
  

  return (
    <main className="flex-1 pb-24">
      <section className="space-y-4">
        <h1 className="text-lg md:text-xl font-bold text-left">
          Dashboard
        </h1>
        <p>Welcome {user.name}{user.email} 👋</p>
        <ButtonSnaptrade title="Import a Portfolio" />

        <div className="flex flex-row flex-nowrap gap-4">
          <div className="w-full flex-col p-1">
            <h1 className="text-lg md:text-xl font-bold text-center mb-2">
              Your holdings
            </h1>
            
            <DashboardCollapse title="Stocks">
              <AssetLayout title="AAPL" quantity="100" /> 
              <AssetLayout title="TSLA" quantity="100"/>
            </DashboardCollapse>
            

            <DashboardCollapse title="Options">
              <p>Calls</p>
              <AssetLayout title="AAPL" quantity="100" />
              <p>Puts</p> 
              <AssetLayout title="TSLA" quantity="100"/>
            </DashboardCollapse>
            
            
            <DashboardCollapse title="Crypto">
              <AssetLayout title="BTC" quantity="100"/>
              <AssetLayout title="ETH" quantity="100"/>
              <AssetLayout title="DOGE" quantity="100"/>
            </DashboardCollapse>
          </div>

              


          <div className="w-full flex-col p-1">
            <h1 className="text-lg md:text-xl font-bold text-center mb-2">
              Portfolio Report
            </h1>
            
            <DashboardCollapse title="General Analysis">
              <AssetLayout title="Total Portfolio Value" quantity={"$ " + "100"}/>
              <p>AI-generated explanation</p>
            </DashboardCollapse>
           
            <DashboardCollapseValue title="Sharpe Ratio" quantity="20">
              <p>
                Think of the Sharpe ratio like a rating that tells you how good of a deal you are getting 
                for the risk you are taking with an investment.
              </p>
              <p>
                Imagine you can choose between two jobs. One is a bit risky but pays more, and the other is very safe but pays less. 
                The Sharpe ratio is like a score that tells you which job pays more extra money for the extra risk. 
                A higher score means you are getting a better deal for the risk you are taking. 
                So, if you are comparing investments, you generally want the one with the higher Sharpe ratio 
                because it means you are getting more return for each bit of risk you take on.
              </p>
            </DashboardCollapseValue>

            
            <DashboardCollapseValue title="Portfolio Beta" quantity="1.4">
              <p>AI-generated explanation</p>
            </DashboardCollapseValue>

            <DashboardCollapseValue title="YoY Return" quantity={12}>
              <p>AI-generated explanation</p>
            </DashboardCollapseValue>
          </div>

        </div>

      </section>
    </main>
  );
}

