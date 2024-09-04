import axios from 'axios';

export default async function getMarketMetrics() {

    let interestRate = null; //done
    let marketSentiment = null; //AAII market sentiment
    let VIX = null; //VIX index
    let SP500Growth = null; //S&P 500 index

	const FRED_API_KEY = process.env.FRED_API_KEY  ; // Replace with your actual API key
	const SERIES_ID = 'FEDFUNDS'; // Federal Funds Rate


    // Interest Rate
	try {
		const response = await axios.get(`https://api.stlouisfed.org/fred/series/observations?series_id=${SERIES_ID}&api_key=${FRED_API_KEY}&sort_order=desc&limit=1&file_type=json`);
		interestRate = parseFloat(response.data.observations[0].value);
		
		
	} catch (error) {
		console.error('Error fetching interest rate:', error);
		return { interestRate: null };
	}       

    // Market Sentiment
    try {
        const response = await axios.get('https://www.alphavantage.co/query', {
            params: {
                function: 'MARKET_SENTIMENT',
                apikey: process.env.ALPHA_VANTAGE_API_KEY
            }
        });

        if (response.data && response.data.sentiment) {            
            marketSentiment = response.data.sentiment;
        } else {
            console.error('Unexpected response structure for market sentiment:');
            console.log(response.data);
        }
    } catch (error) {
        console.error('Error fetching market sentiment:', error);
    }

    // VIX Index
    try {
        const response = await axios.get('https://www.alphavantage.co/query', {
            params: {
                function: 'GLOBAL_QUOTE',
                symbol: 'VIX',
                apikey: process.env.ALPHA_VANTAGE_API_KEY
            }
        });

        if (response.data && response.data['Global Quote'] && response.data['Global Quote']['05. price']) {
            VIX = parseFloat(response.data['Global Quote']['05. price']);
        } else {
            console.error('Unexpected response structure for VIX index');
            console.log(response.data);

        }
    } catch (error) {
        console.error('Error fetching VIX index:', error);
    }

    // S&P 500 Index growth over last year
    try {
        const response = await axios.get('https://www.alphavantage.co/query', {
            params: {
                function: 'TIME_SERIES_MONTHLY',
                symbol: 'SPY',  // SPY ETF tracks S&P 500
                apikey: process.env.ALPHA_VANTAGE_API_KEY
            }
        });

        if (response.data && response.data['Monthly Time Series']) {
            const monthlyData = response.data['Monthly Time Series'];
            const dates = Object.keys(monthlyData).sort().reverse();
            
            if (dates.length >= 13) {
                const currentPrice = parseFloat(monthlyData[dates[0]]['4. close']);
                const lastYearPrice = parseFloat(monthlyData[dates[12]]['4. close']);
                
                SP500Growth = ((currentPrice - lastYearPrice) / lastYearPrice) * 100;
                SP500Growth = SP500Growth.toFixed(2);  // Round to 2 decimal places
            } else {
                console.error('Not enough historical data for S&P 500 growth calculation');
            }
        } else {
            console.error('Unexpected response structure for S&P 500 data');
        }
    } catch (error) {
        console.error('Error fetching S&P 500 data:', error);
    }



    return { interestRate, marketSentiment, VIX, SP500Growth };
}
