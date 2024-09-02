import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Tile from "@/components/Tile";

export default async function MarketDashboard() {
	await connectMongo();
	const session = await getServerSession(authOptions);

	let marketMetrics = null;
    // Make a call to the API to get the market metrics
    // To do: call if from a utils file and store in db
    // only call the endpoint if the data is older than 1 day in the db

	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/market-metrics`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		marketMetrics = await response.json();
	} catch (error) {
		console.error("Failed to fetch market metrics", error);
	}

	return (
		<main className="flex-1 pb-24">
			<section className="max-w-xl space-y-8">
				<h1 className="text-l md:text-xl font-bold text-left">
					General Stock Market Data
				</h1>

                <div role="alert" className="alert shadow-lg">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="stroke-info h-6 w-6 shrink-0">
                        <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div>
                        <h3 className="font-bold">Coming soon in a future release!</h3>
                        <div className="text-xs">We aim to display here metrics like interest rates, market sentiment, volatility index and macro economic indicators. </div>
                        <div className="text-xs">This will give you more context when making investment decisions. </div>

                    </div>
                    </div>

				{marketMetrics?.interestRates && (
					<Tile title="Interest Rates" content={JSON.stringify(marketMetrics.interestRates)} />
				)}

				{marketMetrics?.marketSentiment && (
					<Tile title="Market Sentiment" content={JSON.stringify(marketMetrics.marketSentiment)} />
				)}

				{marketMetrics?.volatilityIndex && (
					<Tile title="Volatility Index" content={JSON.stringify(marketMetrics.volatilityIndex)} />
				)}

				{marketMetrics?.macroEconomic && (
					<Tile title="Macro Economic" content={JSON.stringify(marketMetrics.macroEconomic)} />
				)}
			</section>
		</main>
	);
}
