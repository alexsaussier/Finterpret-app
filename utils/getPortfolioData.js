// Function to calculate the total portfolio value
function calculateTotalPortfolioValue(stocks) {
  let totalValue = stocks.reduce((total, { currentPrice, units }) => {
      // Only add to total if currentPrice is available
      if (currentPrice !== undefined && typeof units === 'number') {
        return total + (currentPrice * units);
      }
      return total;
    }, 0);
  
    return parseFloat(totalValue.toFixed(2));
}





function calculateAveragePeRatio(stocks, portfolioValue) {
  //Loop through all stocks and calculate the average PE ratio, weighted according to the stock's value in the portfolio
  let weightedAverage = 0;

  for (const stock of stocks) {
    const stockValue = stock.totalValue;
    const peRatio = stock.peRatio; // replace 'peRatio' with the actual property name that represents the stock's PE ratio

    console.log("Stock value: ", stockValue); 

    const stockWeight = stockValue / portfolioValue;
    

    // Only consider positive PE ratios
    if (peRatio > 0 && stockWeight !== undefined) {
      weightedAverage += stockWeight * peRatio;
      console.log(stock.ticker + ": Weighted PE ratio: ", weightedAverage);
    }
  }

  console.log("Average PE ratio: ", weightedAverage);

  return weightedAverage.toFixed(2);
}






// Export the functions to make them accessible from other files
module.exports = {
    calculateTotalPortfolioValue,
    calculateAveragePeRatio
};