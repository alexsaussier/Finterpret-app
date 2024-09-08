import getStats from "./getStats";
import getPrice from "./getPrice";


// This function takes an object containing stock stats as input (must have a ticker value) 
// and appends stock metrics to the stock object

async function appendYahooMetrics(stock) {
  
  // Format ticker before API requests
  let formattedTicker = stock.ticker;
  if (formattedTicker.match(/\.[A-Z]{3}$/)) {
    formattedTicker = formattedTicker.slice(0, -1);
  }
  if (formattedTicker === "CGG.PA") {
    formattedTicker = "VIRI.PA";
  }

  console.log("appending yahoo metrics for: " + stock.ticker);


  const statsAPI = await getStats(formattedTicker);
  const priceAPI = await getPrice(formattedTicker);

  console.log("price API response: " + JSON.stringify(statsAPI));


  try{
    stock.currentPrice = statsAPI.response.regularMarketPrice.raw;
    stock.percentChange = statsAPI.response.regularMarketChangePercent.raw;
    //stock.currency = priceAPI.data.currency;       
  } catch (error) {
    console.log(stock.ticker + " Error: price or % change is not correctly loaded. " + error);
  }

  try{
    stock.totalValue = stock.currentPrice * stock.units;
  }catch(e){
    console.log("Could not determine total value for stock " + stock.ticker)
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

  try {
    stock.sharesOutstanding = statsAPI.response.sharesOutstanding.raw;
  } catch (error) {
    console.log(stock.ticker + " Error: PE Ratio is not correctly loaded.");
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

  try{
    stock.bookValue = statsAPI.response.bookValue.raw;
  }catch(error){
    console.log(stock.ticker + " Error: Book Value is not correctly loaded.");
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