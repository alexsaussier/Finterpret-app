import { getServerSession, getSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import AssetLayout from "@/components/AssetLayout";
import DashboardCollapse from "@/components/DashboardCollapse";
import DashboardCollapseValue from "@/components/DashboardCollapseValue";
import ButtonSnaptrade from "@/components/ButtonSnaptrade";
import Card from "@/components/Card";
import FetchHoldings from "@/components/FetchHoldings";

async function getHoldings(userId, snaptrade_user_secret) {
  const url = `http://localhost:3000/api/snaptrade/pull-holdings`;
  const data = { userId, snaptrade_user_secret };
  const response = await fetch(url, {
    method: "POST",
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json();
}

export default async function Dashboard() {
  await connectMongo();
  const session = await getServerSession(authOptions);
  const user = await User.findById(session.user.id);
  const userId = user.id;
  const userSecret = user.snaptrade_user_secret;
  const data = await getHoldings(userId, userSecret);

  //Check if we can extract stocks for this user:
  //Store all account IDs in an array
  //For each account ID, fetch all stocks
  //if there is no account ID --> show button to import wallet (ButtonSnaptrade)
  //if there is at least 1 account ID --> hide button

  //------

  //@max this is the useffect hook that you explained to me. I think next.js treats it differently, because it does not compile. See trello
  {
    /*
  useEffect(() => {
    const fetchData = async () => {
      // Fetch the user's brokerage connections
      const response = await apiClient.get("/brokerage-connections");
      const connections = response.data;

      // Check if the user has at least 1 connection
      if (connections.length > 0) {
        // User has at least 1 connection, hide the import button
        // TODO: Implement the logic to hide the import button
      } else {
        // User has no connections, show the import button
        // TODO: Implement the logic to show the import button
      }
    }; 

    fetchData();
  }, []);*/
  }

  return (
    <main className="flex-1 pb-24">
      <FetchHoldings userId={userId} snaptrade_user_secret={userSecret} />
      <section className="space-y-4">
        <h1 className="text-lg md:text-xl font-bold text-left">Dashboard</h1>
        <p>
          Welcome {user.name}
          {user.email} 👋
        </p>

        <ButtonSnaptrade
          title="Import a Portfolio"
          snaptrade_user_secret={userSecret}
        />

        <Card title="Brokerage Authorization" user={user} />

        <div className="flex flex-row flex-nowrap gap-4">
          <div className="w-full flex-col p-1">
            <h1 className="text-lg md:text-xl font-bold text-center mb-2">
              Your holdings
            </h1>

            <DashboardCollapse title="Stocks">
              <AssetLayout title="AAPL" quantity="100" />
              <AssetLayout title="TSLA" quantity="100" />
            </DashboardCollapse>

            <DashboardCollapse title="Options">
              <p>Calls</p>
              <AssetLayout title="AAPL" quantity="100" />
              <p>Puts</p>
              <AssetLayout title="TSLA" quantity="100" />
            </DashboardCollapse>

            <DashboardCollapse title="Crypto">
              <AssetLayout title="BTC" quantity="100" />
              <AssetLayout title="ETH" quantity="100" />
              <AssetLayout title="DOGE" quantity="100" />
            </DashboardCollapse>
          </div>

          <div className="w-full flex-col p-1">
            <h1 className="text-lg md:text-xl font-bold text-center mb-2">
              Portfolio Report
            </h1>

            <DashboardCollapse title="General Analysis">
              <AssetLayout
                title="Total Portfolio Value"
                quantity={"$ " + "100"}
              />
              <p>AI-generated explanation</p>
            </DashboardCollapse>

            <DashboardCollapseValue title="Sharpe Ratio" quantity="20">
              <p>
                Think of the Sharpe ratio like a rating that tells you how good
                of a deal you are getting for the risk you are taking with an
                investment.
              </p>
              <p>
                Imagine you can choose between two jobs. One is a bit risky but
                pays more, and the other is very safe but pays less. The Sharpe
                ratio is like a score that tells you which job pays more extra
                money for the extra risk. A higher score means you are getting a
                better deal for the risk you are taking. So, if you are
                comparing investments, you generally want the one with the
                higher Sharpe ratio because it means you are getting more return
                for each bit of risk you take on.
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
