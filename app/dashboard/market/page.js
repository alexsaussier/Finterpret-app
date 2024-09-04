import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Tile from "@/components/Tile";
import getMarketMetrics from "@/utils/getMarketMetrics";

export default async function MarketDashboard() {
	await connectMongo();
	const session = await getServerSession(authOptions);

	let interestRate = null;
	let marketSentiment = null;
	let volatilityIndex = null;
	let sp500Growth = null;

	// To do: call if from a utils file and store in db
    // only call the endpoint if the data is older than 1 day in the db
	try {
		const marketMetrics = await getMarketMetrics();
		
		interestRate = marketMetrics.interestRate;
		marketSentiment = marketMetrics.marketSentiment;
		volatilityIndex = marketMetrics.VIX;
		sp500Growth = marketMetrics.SP500Growth;

	} catch (error) {
		console.error("Failed to fetch market metrics", error);
	}

	return (
		<main className="flex-1 pb-24">
			<section className="max-w-xl space-y-8">
				<h1 className="text-l md:text-xl font-bold text-left">
					General Stock Market Data
				</h1>

				{interestRate !== null && (
					<Tile title="Interest Rates (Federal Funds Rate)" content={`${interestRate}%`} />
				)}

				{marketSentiment && (
					<Tile title="Market Sentiment" content={marketSentiment} />
				)}

				{volatilityIndex !== null && (
					<Tile title="Volatility Index (VIX)" content={volatilityIndex.toFixed(2)} />
				)}

				{sp500Growth !== null && (
					<Tile title="S&P 500 Growth (1 Year)" content={`${sp500Growth}%`} />
				)}
			</section>
		</main>
	);
}
