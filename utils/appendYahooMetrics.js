import getStats from "./getStats";
import getPrice from "./getPrice";


// This function takes an object containing stock statsAPI as input (must have a ticker value) 
// and appends stock metrics to the stock object

async function appendYahooMetrics(stock) {
    const statsAPI = await getStats(stock.ticker);
    const priceAPI = await getPrice(stock.ticker);

    try{
      stock.currentPrice = priceAPI.data.regularMarketPrice.raw;
      stock.delta = priceAPI.data.regularMarketChangePercent.raw;       
    } catch (error) {
      console.log(stock.ticker + " Error: price of %change is not correctly loaded.");
    }

    // Get PE ratio and append to stock in array
    try {
      stock.peRatio = statsAPI.response.trailingPE.raw;
    } catch (error) {
      try {
        stock.peRatio = statsAPI.response.forwardPE.raw;
      } catch (error) {
        console.log(stock.ticker + " Error: PE Ratio is not correctly loaded.");
      }
    }
  
    // Get EPS and append to stock in array
    try {
      stock.eps = statsAPI.response.epsCurrentYear.raw;
    } catch (error) {
      try {
        stock.eps = statsAPI.response.epsTrailingTwelveMonths.raw;
      } catch (error) {
        console.log(stock.ticker + " Error: EPS is not correctly loaded.");
      }
    }
  
    // Get Price/EPS and append to stock in array
    try {
      stock.priceEPS = statsAPI.response.priceEpsCurrentYear.raw;
    } catch (error) {
      console.log(stock.ticker + " Error: P/EPS is not correctly loaded.");
    }
  
    // Get Price to Book Value and append to stock in array
    try {
      stock.priceToBook = statsAPI.response.priceToBook.raw;
    } catch (error) {
      console.log(stock.ticker + " Error: Price to Book Value is not correctly loaded.");
    }
  
    // Get Dividend Yield and append to stock in array
    try {
      stock.divYield = statsAPI.response.dividendYield.raw;
    } catch (error) {
      try {
        stock.divYield = statsAPI.response.trailingAnnualDividendYield.raw;
      } catch (error) {
        console.log(stock.ticker + " Error: Dividend Yield is not correctly loaded.");
      }
    }

    // Append current datetime to stock in array
    stock.dateTime = new Date();

    // append total value of stock to stock in array
    stock.totalValue = stock.currentPrice * stock.units;

    // We can add:
    // statsAPI.quickRatio,
    // statsAPI.debtToEquity,
    // statsAPI.grossProfits,
    // statsAPI.grossMargins
  }

  export default appendYahooMetrics;