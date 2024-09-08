"use client";
import { useState, useEffect } from "react";
import Tile from "@/components/Tile";
import Modal from "@/components/Modal";

export default function MarketDashboard() {
	const [marketData, setMarketData] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentMetric, setCurrentMetric] = useState(["", ""]);
	const [guideline, setGuideline] = useState("");
	const [gptMessage, setGptMessage] = useState("");

	useEffect(() => {
		async function fetchData() {
			try {
				const response = await fetch('/api/market-metrics');
				const marketMetrics = await response.json();
				setMarketData(marketMetrics);
			} catch (error) {
				console.error("Failed to fetch market metrics", error);
			}
		}

		fetchData();
	}, []);

	const openModal = (metricName, metricValue) => {
		setCurrentMetric([metricName, metricValue]);
		setGuideline(
			"You are a financial advisor explaining market metrics. Your tone should be professional yet accessible. " +
			"Answer in HTML format. Use <br> tags between paragraphs. " +
			"Use <b> tags for important points. " +
			"Be confident in your explanation, as if you're a seasoned financial expert. " +
			"Your response should be concise and easy to understand for someone with little financial knowledge."
		);
		setGptMessage(
			`Explain the market metric "${metricName}". Its current value is ${metricValue}. ` +
			"What does this metric represent, and what does the current value indicate about market conditions? " +
			"How might this affect individual investors or the broader economy?"
		);
		setIsModalOpen(true);
	};

	if (!marketData) {
		return <div>Loading...</div>;
	}

	return (
		<main className="flex-1 pb-24">
			<section className="max-w-xl space-y-8">
				<h1 className="text-l md:text-xl font-bold text-left">
					General Stock Market Data
				</h1>

				{marketData.interestRate && marketData.interestRate.value !== null && (
					<div onClick={() => openModal("Interest Rates (Federal Funds Rate)", `${marketData.interestRate.value}%`)}>
						<Tile title="Interest Rates (Federal Funds Rate)" content={`${marketData.interestRate.value}%`} />
					</div>
				)}

				{marketData.marketSentiment && marketData.marketSentiment.value && (
					<div onClick={() => openModal("Market Sentiment", marketData.marketSentiment.value)}>
						<Tile title="Market Sentiment" content={marketData.marketSentiment.value} />
					</div>
				)}

				{marketData.VIX && marketData.VIX.value !== null && (
					<div onClick={() => openModal("Volatility Index (VIX)", typeof marketData.VIX.value === 'number' ? marketData.VIX.value.toFixed(2) : marketData.VIX.value)}>
						<Tile 
							title="Volatility Index (VIX)" 
							content={typeof marketData.VIX.value === 'number' ? marketData.VIX.value.toFixed(2) : marketData.VIX.value} 
						/>
					</div>
				)}

				{marketData.SP500Growth && marketData.SP500Growth.value !== null && (
					<div onClick={() => openModal("S&P 500 Growth (1 Year)", `${marketData.SP500Growth.value}%`)}>
						<Tile title="S&P 500 Growth (1 Year)" content={`${marketData.SP500Growth.value}%`} />
					</div>
				)}
			</section>

			{isModalOpen && (
				<Modal
					isModalOpen={isModalOpen}
					setIsModalOpen={setIsModalOpen}
					metric={currentMetric}
					guideline={guideline}
					gptMessage={gptMessage}
				/>
			)}
		</main>
	);
}
