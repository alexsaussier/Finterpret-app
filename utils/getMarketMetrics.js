import axios from 'axios';
import MarketMetric from '@/models/MarketMetric'; // You'll need to create this model

const METRICS = [
  { title: "Interest Rate (Federal Funds Rate)", key: "interestRate" },
  { title: "Market Sentiment", key: "marketSentiment" },
  { title: "Volatility Index (VIX)", key: "VIX" },
  { title: "S&P 500 Growth (1 Year)", key: "SP500Growth" }
];

export default async function getMarketMetrics() {
	let marketMetrics = {};

	for (const metric of METRICS) {
		marketMetrics[metric.key] = await getOrUpdateMetric(metric);
	}

	// Ensure VIX is a number
	if (marketMetrics.VIX && marketMetrics.VIX.value !== null) {
		marketMetrics.VIX.value = parseFloat(marketMetrics.VIX.value);
	}

	return marketMetrics;
}

async function getOrUpdateMetric(metric) {
	try {
		let dbMetric = await MarketMetric.findOne({ title: metric.title }).sort({ lastUpdated: -1 });

        //fetch value from db if recent
		if (dbMetric && isMetricRecent(dbMetric.lastUpdated)) {
			console.log(`Using db data for ${metric.title}`);
			return { title: dbMetric.title, value: dbMetric.value, lastUpdated: dbMetric.lastUpdated };
		}

        //if not recent or not in db, fetch from api
		const newValue = await fetchMetricValue(metric.key);
		const now = new Date();

		if (newValue !== null) {
			if (dbMetric) {
                console.log(`Updating db data for ${metric.title} because it was too old`);
				dbMetric.value = newValue;
				dbMetric.lastUpdated = now;
				await dbMetric.save();
			} else {
                console.log(`Creating new db entry for ${metric.title} because it is new`);
				dbMetric = new MarketMetric({
					title: metric.title,
					value: newValue,
					lastUpdated: now
				});
				await dbMetric.save();
			}
			return { title: metric.title, value: newValue, lastUpdated: now };
		} else if (dbMetric) {
            console.log(`Could not fetch new value for ${metric.title}, using db.`);
			return { title: dbMetric.title, value: dbMetric.value, lastUpdated: dbMetric.lastUpdated };
		} else {
            console.log(`Could not fetch new value for ${metric.title}, and no db entry found.`);
			return { title: metric.title, value: null, lastUpdated: null };
		}
	} catch (error) {
		console.error(`Error in getOrUpdateMetric for ${metric.title}:`, error);
		return { title: metric.title, value: null, lastUpdated: null };
	}
}

function isMetricRecent(lastUpdated) {
	const now = new Date();
	const hoursSinceLastUpdate = (now - new Date(lastUpdated)) / (1000 * 60 * 60);
	return hoursSinceLastUpdate < 24;
}

async function fetchMetricValue(metricKey) {
	try {
		switch (metricKey) {
			case 'interestRate':
				return await fetchInterestRate();
			case 'marketSentiment':
				return await fetchMarketSentiment();
			case 'VIX':
				return await fetchVIX();
			case 'SP500Growth':
				return await fetchSP500Growth();
			default:
				throw new Error(`Unknown metric key: ${metricKey}`);
		}
	} catch (error) {
		console.error(`Error fetching ${metricKey}:`, error);
		return null;
	}
}

async function fetchInterestRate() {
	const FRED_API_KEY = process.env.FRED_API_KEY;
	const SERIES_ID = 'FEDFUNDS';
	const response = await axios.get(`https://api.stlouisfed.org/fred/series/observations?series_id=${SERIES_ID}&api_key=${FRED_API_KEY}&sort_order=desc&limit=1&file_type=json`);
	return response.data.observations && response.data.observations[0] ? parseFloat(response.data.observations[0].value) : null;
}

async function fetchMarketSentiment() {
	const response = await axios.get('https://www.alphavantage.co/query', {
		params: {
			function: 'MARKET_SENTIMENT',
			apikey: process.env.ALPHA_VANTAGE_API_KEY
		}
	});
	return response.data && response.data.sentiment ? response.data.sentiment : null;
}

async function fetchVIX() {
	const response = await axios.get('https://www.alphavantage.co/query', {
		params: {
			function: 'GLOBAL_QUOTE',
			symbol: 'VIX',
			apikey: process.env.ALPHA_VANTAGE_API_KEY
		}
	});
	return response.data && response.data['Global Quote'] && response.data['Global Quote']['05. price'] 
		? parseFloat(response.data['Global Quote']['05. price']) 
		: null;
}

async function fetchSP500Growth() {
	const response = await axios.get('https://www.alphavantage.co/query', {
		params: {
			function: 'TIME_SERIES_MONTHLY',
			symbol: 'SPY',
			apikey: process.env.ALPHA_VANTAGE_API_KEY
		}
	});
	if (response.data && response.data['Monthly Time Series']) {
		const monthlyData = response.data['Monthly Time Series'];
		const dates = Object.keys(monthlyData).sort().reverse();
		if (dates.length >= 13) {
			const currentPrice = parseFloat(monthlyData[dates[0]]['4. close']);
			const lastYearPrice = parseFloat(monthlyData[dates[12]]['4. close']);
			return ((currentPrice - lastYearPrice) / lastYearPrice * 100).toFixed(2);
		}
	}
	return null;
}
